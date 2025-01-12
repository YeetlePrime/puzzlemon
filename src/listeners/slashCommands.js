import { Events, MessageFlags } from 'discord.js';
import logger from '../logger.js';

export const listener = {
	event: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			logger.error('Unexpected error:', err.stack);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Ein unerwarteter Fehler ist aufgetreten!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'Ein unerwarteter Fehler ist aufgetreten!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};

