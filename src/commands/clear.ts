import { ButtonStyle, ActionRowBuilder, SlashCommandBuilder, MessageFlags, ButtonBuilder, PermissionFlagsBits, Snowflake, BaseInteraction, MessageActionRowComponentBuilder } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { finishPuzzles } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.GLOBAL;
export const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Lösche alle aktiven Rätsel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const guildId = interaction.guildId;
		const userId = interaction.user.id;

		const confirmButton = new ButtonBuilder()
			.setCustomId('confirmClear')
			.setLabel('Bestätigen')
			.setStyle(ButtonStyle.Danger);

		const cancelButton = new ButtonBuilder()
			.setCustomId('cancelClear')
			.setLabel('Abbrechen')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
			.addComponents(cancelButton, confirmButton);

		const response = await interaction.reply({
			content: 'Bist du dir sicher, dass du alle Rätsel löschen möchtest?',
			components: [row],
			flags: MessageFlags.Ephemeral
		})

		const collectorFilter = (i: BaseInteraction) => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'confirmClear') {
				try {
					await finishPuzzles(confirmation.guildId);
					await confirmation.update({ content: `Alle Rätsel wurden erfolgreich gelöscht.`, components: [] });
					logger.info(`Successfully cleared puzzles for ${guildId}:`);
				} catch (err) {
					if (err instanceof Error) {
						logger.error(`Could not clear puzzles for ${guildId}:`, err.stack);
					} else {
						logger.error(new Error(`Could not clear puzzles for ${guildId}:`).stack);
					}
					await confirmation.update({ content: `Rätsel konnten nicht gelöscht werden.`, components: [] });
				}
			} else if (confirmation.customId === 'cancelClear') {
				await interaction.deleteReply();
			}
		} catch (err) {
			if (err instanceof Error) {
				logger.warn(`User ${userId} in guild ${guildId} took too long to press the clear button.`, err.stack);
				await interaction.editReply({ content: 'Du hast zu lange zum Bestätigen gebraucht.', components: [] });
			}
		}
	}
}
