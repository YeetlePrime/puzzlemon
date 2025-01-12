import { Client, Events } from 'discord.js';
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

export type Listener = {
	event: Events,
	once?: boolean,
	callback: (client: Client) => Promise<void>
}
