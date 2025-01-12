import { ActionRowBuilder, SlashCommandBuilder, MessageFlags, Events, ModalBuilder, TextInputStyle, EmbedBuilder, TextInputBuilder } from 'discord.js';

import { Command, DeployType, InteractionEventHandler } from '../utils.js';
import { answerPuzzle } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.GLOBAL;
export const command: Command = {
	deployType: DeployType.GLOBAL,
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

		const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(antwortInput);

		modal.addComponents(firstActionRow)

		await interaction.showModal(modal);
	},
	handler: {
		event: Events.InteractionCreate,
		async execute(interaction) {
			if (!interaction.isModalSubmit()) return;
			if (interaction.customId !== 'answer') return;

			const guildId = interaction.guildId;
			const userId = interaction.user.id;
			const answer = interaction.fields.getTextInputValue('antwortInput');

			try {
				await interaction.deferReply({
					flags: MessageFlags.Ephemeral
				});

				const puzzles = await answerPuzzle(guildId, userId, answer);

				if (puzzles.length === 0) {
					await interaction.editReply({
						content: 'Die Antwort ist leider falsch'
					});
					logger.info(`User ${userId} gave a wrong answer in guild ${guildId}.`)
				} else {
					const embeds = puzzles
						.map((puzzle: any) => {
							return new EmbedBuilder()
								.setTitle(`Rätsel ${puzzle.index}`)
								.setDescription(puzzle.question);
						})

					await interaction.editReply({
						content: 'Das ist die richtige Antwort auf',
						embeds: embeds
					});
					logger.info(`User ${userId} gave a right answer in guild ${guildId}.`)
				}
			} catch (err) {
				logger.logError(`Could not submit answer ${answer} for ${userId} in ${guildId}`, err);

				await interaction.editReply({
					content: 'Die Antwort konnte nicht überprüft werden.',
					embeds: []
				});
			}
		}
	}
};

export const handler: InteractionEventHandler = {
	event: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId !== 'answer') return;

		const guildId = interaction.guildId;
		const userId = interaction.user.id;
		const answer = interaction.fields.getTextInputValue('antwortInput');

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const puzzles = await answerPuzzle(guildId, userId, answer);

			if (puzzles.length === 0) {
				await interaction.editReply({
					content: 'Die Antwort ist leider falsch'
				});
				logger.info(`User ${userId} gave a wrong answer in guild ${guildId}.`)
			} else {
				const embeds = puzzles
					.map((puzzle: any) => {
						return new EmbedBuilder()
							.setTitle(`Rätsel ${puzzle.index}`)
							.setDescription(puzzle.question);
					})

				await interaction.editReply({
					content: 'Das ist die richtige Antwort auf',
					embeds: embeds
				});
				logger.info(`User ${userId} gave a right answer in guild ${guildId}.`)
			}
		} catch (err) {
			logger.logError(`Could not submit answer ${answer} for ${userId} in ${guildId}`, err);

			await interaction.editReply({
				content: 'Die Antwort konnte nicht überprüft werden.',
				embeds: []
			});
		}
	}
}
