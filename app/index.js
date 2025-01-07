import { Client, GatewayIntentBits } from 'discord.js';

import { token } from './config.js';
import { createTablesIfNotExisting } from './db/index.js';
import { registerCommands } from './commandRegistration.js';
import { registerEvents } from './eventRegistration.js';


(async () => {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	await Promise.all([createTablesIfNotExisting(), registerCommands(client), registerEvents(client)]);

	client.login(token);
})();
