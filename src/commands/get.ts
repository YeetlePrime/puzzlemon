import { SlashCommandBuilder, MessageFlags, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { getActivePuzzlesForUser } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Zeige aktive Rätsel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const guildId = interaction.guildId ?? "";
		const userId = interaction.user.id;

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
					.map((puzzle: any) => {
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
			logger.logError(`User ${userId} could not retrieve puzzles for ${guildId}`, err);
			await interaction.editReply({
				content: 'Rätsel konnten nicht geladen werden.'
			});
		}
	}
};

export default command;
