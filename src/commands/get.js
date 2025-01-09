import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';

import { DeployType } from '../utils.js';
import { getActivePuzzles } from '../db/puzzleRepository.js';

export const deployType = DeployType.DEV;
export const command = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Zeige aktive Rätsel.'),
	async execute(interaction) {
		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});
			const questions = await getActivePuzzles(interaction.guildId);

			if (questions.length === 0) {
				await interaction.editReply({
					content: 'Es gibt keine Rätsel.'
				});
			} else {
				const embeds = questions
					.sort((question1, question2) => question2.quesion_number - question1.question_number)
					.map(question => {
						return new EmbedBuilder()
							.setTitle(`Rätsel ${question.question_number}`)
							.setDescription(question.question)
							.setFields([{
								name: 'Antwort',
								value: question.answer,
								inline: false
							}]);
					});

				await interaction.editReply({
					embeds: embeds
				});
			}

		} catch (error) {
			await interaction.editReply({
				content: 'Rätsel konnten nicht geladen werden.'
			});
		}

	}
};
