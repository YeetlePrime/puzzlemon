import { Client, GatewayIntentBits } from 'discord.js';

import { token } from './config.js';
import { registerCommands, registerListeners } from './initializer.js';
import { initTables } from './db/init.js';


(async () => {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	await Promise.all([initTables(), registerCommands(), registerListeners(client)]);

	client.login(token);
})();
