import { Client, GatewayIntentBits } from 'discord.js';

import { token } from './config.js';
import { registerCommands, registerListeners } from './initializer.js';
import { initTables } from './db/init.js';
import logger from './logger.js';


(async () => {
	const o = [{ name: 'test', value: 1 }, {}];
	logger.error(o);
	console.log(o);
	console.error(o);
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	await Promise.all([initTables(), registerCommands(client), registerListeners(client)]);

	client.login(token);
})();
