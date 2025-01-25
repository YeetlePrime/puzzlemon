import { BaseInteraction, Channel, ChatInputCommandInteraction, Client, ClientEvents, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, Snowflake, TextChannel } from 'discord.js';
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
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
	handler?: InteractionEventHandler
}

export async function getChannelById(client: Client, channelId: Snowflake) {
	// Try fetching from cache first
	let channel: Channel | null | undefined = client.channels.cache.get(channelId);

	if (!channel) {
		try {
			// Fetch from API if not cached
			channel = await client.channels.fetch(channelId);
		} catch (error) {
			console.error(`Failed to fetch channel with ID ${channelId}:`, error);
			return null;
		}
	}

	// Validate channel type
	if (!channel?.isTextBased()) {
		console.error(`Channel with ID ${channelId} is not a text channel.`);
		return null;
	}

	return channel as TextChannel;
}
