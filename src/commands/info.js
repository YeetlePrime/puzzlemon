import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';

import { DeployType } from '../utils.js';
import { getActivePuzzlesForUser } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.GLOBAL;
export const command = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Zeigt deinen Status für die aktiven Rätsel.'),
	async execute(interaction) {
		const guildId = interaction.guildId;
		const userId = interaction.member.id;

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const puzzleInfos = await getActivePuzzlesForUser(guildId, userId);

			const completedPuzzles = puzzleInfos.filter(puzzle => puzzle.completed_ts !== null);
			const openPuzzles = puzzleInfos.filter(puzzle => puzzle.completed_ts === null);

			const completedPuzzlesEmbed = new EmbedBuilder()
				.setTitle('Gelöste Rätsel')
				.setDescription('Deine bisher gelösten Rätsel.')
				.setFields(
					completedPuzzles.map(puzzle => {
						return {
							name: `Rätsel ${puzzle.index}`,
							value: `${puzzle.answer}\n\nAntwort: ${puzzle.answer}`,
							inline: false
						};
					})
				);

			const nextPuzzleEmbed = openPuzzles.length > 0 ?
				new EmbedBuilder()
					.setTitle('Nächstes Rätsel')
					.setFields(
						{
							name: `Rätsel ${openPuzzles[0].index}`,
							value: openPuzzles[0].question,
							inline: false
						}
					)
				:
				new EmbedBuilder()
					.setTitle('Nächstes Rätsel')
					.setDescription('Du hast alle derzeitig aktiven Rätsel gelöst');

			await interaction.editReply({
				embeds: completedPuzzles.length > 0 ? [completedPuzzlesEmbed, nextPuzzleEmbed] : [nextPuzzleEmbed]
			});

			logger.info(`User ${userId} successfully retrieved infos for ${guildId}.`);
		} catch (err) {
			logger.error(`User ${userId} could not retrieve infos for ${guildId}:`, err.stack);

			await interaction.editReply({
				content: 'Rätsel konnten nicht geladen werden.'
			});
		}

	}
};
