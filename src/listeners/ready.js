import { Events } from 'discord.js';

export const listener = {
	event: Events.ClientReady,
	once: true,
	async callback(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

