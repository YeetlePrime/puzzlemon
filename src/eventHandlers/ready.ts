import { Client, Events } from 'discord.js';
import logger from '../logger.js';
import { type ClientEventHandler } from 'utils.js';

const handler: ClientEventHandler<Events.ClientReady> = {
	event: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		const botTag = client.user !== null ? client.user.tag : client.user;
		logger.info(`Ready! Logged in as ${botTag}`);
	},
};

export default handler;


