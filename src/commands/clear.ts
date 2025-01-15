import { ButtonStyle, ActionRowBuilder, SlashCommandBuilder, MessageFlags, ButtonBuilder, PermissionFlagsBits, BaseInteraction, MessageActionRowComponentBuilder } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { finishPuzzles } from '../db/puzzleRepository.js';
import logger from '../logger.js';
import { getAllTranslations, L, LD, setLocale, unsetLocale } from '../i18n/index.js';

const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription(LD('commands.clear.description'))
		.setDescriptionLocalizations(getAllTranslations('commands.clear.description'))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const guildId = interaction.guildId;
		const userId = interaction.user.id;
		const locale = interaction.locale;
		setLocale(locale);

		const confirmButton = new ButtonBuilder()
			.setCustomId('confirmClear')
			.setLabel(L('submit'))
			.setStyle(ButtonStyle.Danger);

		const cancelButton = new ButtonBuilder()
			.setCustomId('cancelClear')
			.setLabel(L('cancel'))
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
			.addComponents(cancelButton, confirmButton);

		const response = await interaction.reply({
			content: L('commands.clear.sure'),
			components: [row],
			flags: MessageFlags.Ephemeral
		})

		const collectorFilter = (i: BaseInteraction) => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'confirmClear') {
				try {
					await finishPuzzles(confirmation.guildId ?? "");
					await confirmation.update({ content: L('commands.clear.success'), components: [] });
					logger.info(`Successfully cleared puzzles for ${guildId}:`);
				} catch (err) {
					logger.logError(`Could not clear puzzles for ${guildId}`, err);

					await confirmation.update({ content: L('commands.clear.error'), components: [] });
				}
			} else if (confirmation.customId === 'cancelClear') {
				await interaction.deleteReply();
			}
		} catch (err) {
			logger.info(`User ${userId} in guild ${guildId} took too long to press the clear button.`);

			await interaction.editReply({ content: L('commands.clear.timeout'), components: [] });
		} finally {
			unsetLocale();
		}
	}
};

export default command;
