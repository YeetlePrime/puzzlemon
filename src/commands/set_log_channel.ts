import { SlashCommandBuilder, MessageFlags, PermissionFlagsBits, ChannelType } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { setLogChannelForGuild } from '../db/puzzleRepository.js';
import logger from '../logger.js';
import { getAllTranslations, L, LD, setLocale, unsetLocale } from '../i18n/index.js';

export const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('set_log_channel')
		.setDescription(LD('commands.set_log_channel.description'))
		.setDescriptionLocalizations(getAllTranslations('commands.set_log_channel.description'))
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription(LD('commands.set_log_channel.channel_description'))
				.setDescriptionLocalizations(getAllTranslations('commands.set_log_channel.channel_description'))
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const guildId = interaction.guildId ?? '';
		const channelId = interaction.options.getChannel('channel', true).id;
		const userId = interaction.user.id;
		const locale = interaction.locale;

		setLocale(locale);

		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral
			});

			await setLogChannelForGuild(guildId, channelId);

			await interaction.editReply(L('commands.set_log_channel.success'));

			logger.info(`User ${userId} successfully set the log channel for ${guildId} to ${channelId}.`);
		} catch (err) {
			logger.logError(`User ${userId} could not set the log channel for ${guildId} to ${channelId}.`, err);
			await interaction.editReply({
				content: L('commands.set_log_channel.error')
			});
		} finally {
			unsetLocale();
		}
	}
};

export default command;
