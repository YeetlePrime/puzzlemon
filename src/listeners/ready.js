import { Events } from 'discord.js';
import logger from '../logger.js';

export const listener = {
	event: Events.ClientReady,
	once: true,
	async callback(client) {
		logger.info(`Ready! Logged in as ${client.user.tag}`);
	},
};

