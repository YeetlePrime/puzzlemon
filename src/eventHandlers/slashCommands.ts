import { Events, MessageFlags } from 'discord.js';

import { commands } from '../commands/index.js';
import logger from '../logger.js';
import { InteractionEventHandler } from 'utils.js';

const handler: InteractionEventHandler = {
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = commands.find(command => command.data.name === interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			logger.logError('Unexpected error', err);

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Ein unerwarteter Fehler ist aufgetreten!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'Ein unerwarteter Fehler ist aufgetreten!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};

export default handler;
