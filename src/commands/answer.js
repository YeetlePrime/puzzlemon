import { ActionRowBuilder, SlashCommandBuilder, MessageFlags, Events, ModalBuilder, TextInputStyle, EmbedBuilder, TextInputBuilder } from 'discord.js';

import { DeployType } from '../utils.js';
import { answerPuzzle } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.DEV;
export const command = {
	data: new SlashCommandBuilder()
		.setName('answer')
		.setDescription('Gibt eine Antwort auf die Rätsel.'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('answer')
			.setTitle('Beantworte Rätsel');

		const antwortInput = new TextInputBuilder()
			.setCustomId('antwortInput')
			.setLabel("Antwort")
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder().addComponents(antwortInput);

		modal.addComponents(firstActionRow);

		await interaction.showModal(modal);
	}
};

export const handler = {
	event: Events.InteractionCreate,
	async callback(interaction) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId !== 'answer') return;

		const guildId = interaction.guildId;
		const userId = interaction.member.id;
		const answer = interaction.fields.getTextInputValue('antwortInput');

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const puzzles = await answerPuzzle(guildId, userId, answer);

			if (puzzles.length === 0) {
				logger.info(`User ${userId} gave a wrong answer in guild ${guildId}.`, err.stack)
				await interaction.editReply({
					content: 'Die Antwort ist leider falsch'
				});
			} else {
				logger.info(`User ${userId} gave a right answer in guild ${guildId}.`, err.stack)
				const embeds = puzzles
					.map(puzzle => {
						return new EmbedBuilder()
							.setTitle(`Rätsel ${puzzle.index}`)
							.setDescription(puzzle.question);
					})

				await interaction.editReply({
					content: 'Das ist die richtige Antwort auf',
					embeds: embeds
				});
			}
		} catch (err) {
			logger.error(`Could not submit answer ${answer} for ${userId} in ${guildId}`, err.stack)

			throw new Error(err.message, { cause: err });
		}
	}
}
