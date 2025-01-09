import { Client, GatewayIntentBits } from 'discord.js';

import { token } from './config.js';
import { createTablesIfNotExisting } from './db/index.js';
import { registerCommands, registerListeners } from './initializer.js';


(async () => {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	await Promise.all([createTablesIfNotExisting(), registerCommands(client), registerListeners(client)]);

	client.login(token);
})();
