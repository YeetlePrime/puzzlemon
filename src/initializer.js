const __dirname = import.meta.dirname;
import path from 'node:path';
import { Routes, Collection, REST } from 'discord.js';

import { token, applicationId, guildId } from './config.js';
import { DeployType, getAllJSFilesFromDirectory } from './utils.js';
import logger from './logger.js';

export async function registerCommands(client) {
	const rest = new REST().setToken(token);

	const { commands, globalCommands, devCommands } = await loadCommands();
	client.commands = commands;

	try {
		const data = await rest.put(
			Routes.applicationGuildCommands(applicationId, guildId),
			{ body: devCommands },
		);


		logger.info(`Successfully registered ${data.length} dev commands.`);
	} catch (error) {
		logger.error(error)
	}

	try {
		const data = await rest.put(
			Routes.applicationCommands(applicationId),
			{ body: globalCommands },
		);

		logger.info(`Successfully registered ${data.length} lobal commands.`);
	} catch (error) {
		logger.error(error);
	}
}

export async function registerListeners(client) {
	for (const file of getAllJSFilesFromDirectory(path.join(__dirname, 'listeners'))) {
		const { listener } = await import(file);
		if (listener.once) {
			client.once(listener.event, (...args) => listener.callback(...args));
		} else {
			client.on(listener.event, (...args) => listener.callback(...args));
		}
	}

	for (const handler of await loadCommandHandlers()) {
		if (handler.once) {
			client.once(handler.event, (...args) => handler.callback(...args));
		} else {
			client.on(handler.event, (...args) => handler.callback(...args));
		}
	}

	logger.info('Successfully registered all listeners.');
}

async function loadCommandHandlers() {
	const handlers = [];

	for (const file of getAllJSFilesFromDirectory(path.join(__dirname, 'commands'))) {
		const { handler } = await import(file);
		if (handler && handler.event !== null && handler.callback !== null) {
			handlers.push(handler);
		}
	}

	return handlers;
}

async function loadCommands() {
	const commands = new Collection();
	const globalCommands = [];
	const devCommands = [];

	for (const file of getAllJSFilesFromDirectory(path.join(__dirname, 'commands'))) {
		const { command, deployType } = await import(file);

		// early return for invalid commands
		if (!('execute' in command) || !('data' in command)) {
			logger.warn(`The command at ${file} is missing a required "data" or "execute" property.`);
			continue;
		} else if (!('name' in command.data)) {
			logger.warn(`The command at ${file} is missing a required "data.name" property.`);
			continue;
		} else if (commands.has(command.data.name)) {
			logger.warn(`The command at ${file} could not be registered. A command with that name already exists.`);
			continue;
		}

		switch (deployType) {
			case DeployType.INACTIVE: break;
			case DeployType.GLOBAL:
				commands.set(command.data.name, command);
				globalCommands.push(command.data.toJSON());
				break;
			case DeployType.DEV:
				commands.set(command.data.name, command);
				devCommands.push(command.data.toJSON());
				break;
		}
	}

	return {
		commands: commands,
		globalCommands: globalCommands,
		devCommands: devCommands
	};
}


