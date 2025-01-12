import { BaseInteraction, ClientEvents, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

export function getAllJSFilesFromDirectory(directory: string) {
	return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
		.filter(file => file.isFile() && file.name.endsWith('.js'))
		.map(file => path.join(file.parentPath, file.name));
}

export enum DeployType {
	GLOBAL = "GLOBAL",
	DEV = "DEV",
	INACTIVE = "INACTIVE"
};

export type ClientEventHandler<K extends keyof ClientEvents> = {
	event: K,
	once: boolean,
	execute: (...args: ClientEvents[K]) => Promise<void>
}

export type InteractionEventHandler = {
	execute: (interaction: BaseInteraction) => Promise<void>
}

export type Command = {
	deployType: DeployType,
	data: SlashCommandBuilder,
	execute: (interaction: CommandInteraction) => Promise<void>,
	handler?: InteractionEventHandler
}
