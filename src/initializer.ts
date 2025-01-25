import { Routes, REST, Client, Events } from 'discord.js';

import { token, applicationId, guildId } from './config.js';
import { DeployType } from './utils.js';
import logger from './logger.js';
import { commands } from './commands/index.js';
import { clientEventHandlers, interactionEventHandlers } from './eventHandlers/index.js';

export async function registerCommands() {
	const rest = new REST().setToken(token);

	const devCommandsData = commands.filter(command => command.deployType === DeployType.DEV)
		.map(command => command.data);

	try {
		const data = await rest.put(
			Routes.applicationGuildCommands(applicationId, guildId),
			{ body: devCommandsData },
		);

		if (typeof data === 'object' && data !== null && 'length' in data) {
			logger.info(`Successfully registered ${data.length} dev commands.`);
		}
	} catch (err) {
		logger.logError(`Could not register ${DeployType.DEV} commands`, err);
	}

	const globalCommandsData = commands.filter(command => command.deployType === DeployType.GLOBAL)
		.map(command => command.data);

	try {
		const data = await rest.put(
			Routes.applicationCommands(applicationId),
			{ body: globalCommandsData },
		);

		if (typeof data === 'object' && data !== null && 'length' in data) {
			logger.info(`Successfully registered ${data.length} global commands.`);
		}
	} catch (err) {
		logger.logError(`Could not register ${DeployType.GLOBAL} commands`, err);
	}
}

export async function registerListeners(client: Client) {
	for (const handler of interactionEventHandlers) {
		client.on(Events.InteractionCreate, (interaction) => handler.execute(interaction));
	}

	for (const handler of clientEventHandlers) {
		if (handler.once) {
			client.once(handler.event, (...args) => handler.execute(...args))
		} else {
			client.on(handler.event, (...args) => handler.execute(...args))
		}
	}

	for (const command of commands) {
		if (command.handler !== undefined) {
			const handler = command.handler;
			client.on(Events.InteractionCreate, (interaction) => handler.execute(interaction));
		}
	}

	logger.info('Successfully registered all listeners.');
}

