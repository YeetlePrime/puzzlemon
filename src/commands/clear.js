import { ButtonStyle, ActionRowBuilder, SlashCommandBuilder, MessageFlags, ButtonBuilder, PermissionFlagsBits } from 'discord.js';

import { DeployType } from '../utils.js';
import { finishPuzzles } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.GLOBAL;
export const command = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Lösche alle aktiven Rätsel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	,
	async execute(interaction) {
		const confirmButton = new ButtonBuilder()
			.setCustomId('confirmClear')
			.setLabel('Bestätigen')
			.setStyle(ButtonStyle.Danger);

		const cancelButton = new ButtonBuilder()
			.setCustomId('cancelClear')
			.setLabel('Abbrechen')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancelButton, confirmButton);

		const response = await interaction.reply({
			content: 'Bist du dir sicher, dass du alle Rätsel löschen möchtest?',
			components: [row],
			flags: MessageFlags.Ephemeral
		})

		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'confirmClear') {
				try {
					await finishPuzzles(confirmation.guildId);
					await confirmation.update({ content: `Alle Rätsel wurden erfolgreich gelöscht.`, components: [] });
					logger.info(`Successfully cleared puzzles for ${interaction.guildId}:`);
				} catch (err) {
					logger.error(`Could not clear puzzles for ${interaction.guildId}:`, err.stack);
					await confirmation.update({ content: `Rätsel konnten nicht gelöscht werden.`, components: [] });
				}
			} else if (confirmation.customId === 'cancelClear') {
				await interaction.deleteReply();
			}
		} catch (err) {
			logger.error(`User ${interaction.member.id} in guild ${interaction.guildId} took too long to press the clear button.`, err.stack);
			await interaction.editReply({ content: 'Du hast zu lange zum Bestätigen gebraucht.', components: [] });
		}

	}
};
