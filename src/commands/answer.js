import { ActionRowBuilder, SlashCommandBuilder, MessageFlags, Events, ModalBuilder, TextInputStyle, EmbedBuilder, TextInputBuilder } from 'discord.js';

import { DeployType } from '../utils.js';
import { answerPuzzle } from '../db/puzzleRepository.js';

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
		const answer = interaction.fields.getTextInputValue('antwortInput');

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const questions = await answerPuzzle(guildId, answer);

			if (questions.length === 0) {
				await interaction.editReply({
					content: 'Die Antwort ist leider falsch'
				});
			} else {
				const embeds = questions
					.map(question => {
						return new EmbedBuilder()
							.setTitle(`Rätsel ${question.question_number}`)
							.setDescription(question.question);
					})

				await interaction.editReply({
					content: 'Das ist die richtige Antwort auf',
					embeds: embeds
				});
			}
		} catch (error) {
			await interaction.editReply({
				content: 'Die Antwort konnte nicht überprüft werden.'
			});
		}
	}
}
