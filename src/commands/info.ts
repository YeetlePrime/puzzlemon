import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { getActivePuzzlesForUser } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.GLOBAL;
export const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Zeigt deinen Status für die aktiven Rätsel.'),
	async execute(interaction) {
		const guildId = interaction.guildId;
		const userId = interaction.user.id;

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const puzzleInfos = await getActivePuzzlesForUser(guildId, userId);

			const completedPuzzles = puzzleInfos.filter((puzzle: any) => puzzle.completed_ts !== null);
			const openPuzzles = puzzleInfos.filter((puzzle: any) => puzzle.completed_ts === null);

			const completedPuzzlesEmbed = new EmbedBuilder()
				.setTitle('Gelöste Rätsel')
				.setDescription('Deine bisher gelösten Rätsel.')
				.setFields(
					completedPuzzles.map((puzzle: any) => {
						return {
							name: `Rätsel ${puzzle.index}`,
							value: `${puzzle.question}\n\nAntwort: ${puzzle.answer}`,
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
			logger.logError(`User ${userId} could not retrieve infos for ${guildId}:`, err);

			await interaction.editReply({
				content: 'Rätsel konnten nicht geladen werden.'
			});
		}

	}
};
