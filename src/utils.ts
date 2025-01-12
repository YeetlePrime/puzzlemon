import { BaseInteraction, Client, Events } from 'discord.js';
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

export type ClientEventHandler = {
	event: Events,
	once?: boolean,
	execute: (client: Client) => Promise<void>
}

export type InteractionEventHandler = {
	event: Events,
	execute: (interaction: BaseInteraction) => Promise<void>
}

export type EventHandler = ClientEventHandler | InteractionEventHandler;
