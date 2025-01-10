import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';

import { DeployType } from '../utils.js';
import { getActivePuzzles } from '../db/puzzleRepository.js';
import logger from '../logger.js';

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
			const puzzles = await getActivePuzzles(interaction.guildId);

			if (puzzles.length === 0) {
				await interaction.editReply({
					content: 'Es gibt keine Rätsel.'
				});
			} else {
				const embeds = puzzles
					.map(puzzle => {
						return new EmbedBuilder()
							.setTitle(`Rätsel ${puzzle.index}`)
							.setDescription(puzzle.question)
							.setFields([{
								name: 'Antwort',
								value: puzzle.answer,
								inline: false
							}]);
					});

				await interaction.editReply({
					embeds: embeds
				});
			}

			logger.info(`Successfully retrieved puzzles for ${interaction.guildId}.`);
		} catch (err) {
			logger.error(`Could not retrieve puzzles for ${interaction.guildId}`, err.stack);
			await interaction.editReply({
				content: 'Rätsel konnten nicht geladen werden.'
			});
		}

	}
};
