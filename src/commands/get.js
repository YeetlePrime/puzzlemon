import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';

import { DeployType } from '../utils.js';
import { getActivePuzzlesForUser } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.GLOBAL;
export const command = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Zeige aktive Rätsel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const guildId = interaction.guildId;
		const userId = interaction.member.id;

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const puzzles = await getActivePuzzlesForUser(guildId, userId);

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

			logger.info(`User ${userId} successfully retrieved puzzles for ${guildId}.`);
		} catch (err) {
			logger.error(`User ${userId} could not retrieve puzzles for ${guildId}`, err.stack);
			await interaction.editReply({
				content: 'Rätsel konnten nicht geladen werden.'
			});
		}

	}
};
