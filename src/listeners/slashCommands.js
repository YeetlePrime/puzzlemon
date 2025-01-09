import { Events, MessageFlags } from 'discord.js';
import logger from '../logger.js';

export const listener = {
	event: Events.InteractionCreate,
	async callback(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Der Befehl konnte nicht ausgeführt werden!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'Der Befehl konnte nicht ausgeführt werden!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};

