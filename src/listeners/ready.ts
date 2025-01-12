import { Client, Events } from 'discord.js';
import logger from '../logger.js';
import { type Listener } from 'utils.js';

export const listener: Listener = {
	event: Events.ClientReady,
	once: true,
	async callback(client: Client) {
		const botTag = client.user !== null ? client.user.tag : client.user;
		logger.info(`Ready! Logged in as ${botTag}`);
	},
};

