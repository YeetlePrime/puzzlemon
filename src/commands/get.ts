import { SlashCommandBuilder, MessageFlags, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { getActivePuzzlesForUser } from '../db/puzzleRepository.js';
import logger from '../logger.js';
import { getAllTranslations, L, LD, setLocale, unsetLocale } from '../i18n/index.js';

export const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription(LD('commands.get.description'))
		.setDescriptionLocalizations(getAllTranslations('commands.get.description'))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const guildId = interaction.guildId ?? "";
		const userId = interaction.user.id;
		const locale = interaction.locale;

		setLocale(locale);

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const puzzles = await getActivePuzzlesForUser(guildId, userId);

			if (puzzles.length === 0) {
				await interaction.editReply({
					content: L('commands.get.empty')
				});
			} else {
				const embeds = puzzles
					.map((puzzle: any) => {
						return new EmbedBuilder()
							.setTitle(`${L('riddle')} ${puzzle.index}`)
							.setDescription(puzzle.question)
							.setFields([{
								name: L('answer'),
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
				content: L('commands.get.error')
			});
		} finally {
			unsetLocale();
		}
	}
};

export default command;
