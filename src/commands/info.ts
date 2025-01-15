import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { getActivePuzzlesForUser } from '../db/puzzleRepository.js';
import logger from '../logger.js';
import { getAllTranslations, L, LD, setLocale, unsetLocale } from '../i18n/index.js';

const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription(LD('commands.info.description'))
		.setDescriptionLocalizations(getAllTranslations('commands.info.description')),
	async execute(interaction) {
		const guildId = interaction.guildId ?? "";
		const userId = interaction.user.id;
		const locale = interaction.locale;

		setLocale(locale);

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			const puzzleInfos = await getActivePuzzlesForUser(guildId, userId);

			const completedPuzzles = puzzleInfos.filter((puzzle: any) => puzzle.completed_ts !== null);
			const openPuzzles = puzzleInfos.filter((puzzle: any) => puzzle.completed_ts === null);

			const completedPuzzlesEmbed = new EmbedBuilder()
				.setTitle(L('commands.info.solvedTitle'))
				.setFields(
					completedPuzzles.map((puzzle: any) => {
						return {
							name: `${L('riddle')} ${puzzle.index}`,
							value: `${puzzle.question}\n\n${L('answer')}: ${puzzle.answer}`,
							inline: false
						};
					})
				);

			const nextPuzzleEmbed = openPuzzles.length > 0 ?
				new EmbedBuilder()
					.setTitle(L('commands.info.nextTitle'))
					.setFields(
						{
							name: `${L('riddle')} ${openPuzzles[0].index}`,
							value: openPuzzles[0].question,
							inline: false
						}
					)
				:
				new EmbedBuilder()
					.setTitle(L('commands.info.nextTitle'))
					.setDescription(L('commands.info.allSolved'));

			await interaction.editReply({
				embeds: completedPuzzles.length > 0 ? [completedPuzzlesEmbed, nextPuzzleEmbed] : [nextPuzzleEmbed]
			});

			logger.info(`User ${userId} successfully retrieved infos for ${guildId}.`);
		} catch (err) {
			logger.logError(`User ${userId} could not retrieve infos for ${guildId}:`, err);

			await interaction.editReply({
				content: L('commands.info.error')
			});
		} finally {
			unsetLocale();
		}

	}
};

export default command;
