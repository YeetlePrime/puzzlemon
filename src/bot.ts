import { Client, GatewayIntentBits } from 'discord.js';

import { token } from './config.js';
import { registerCommands, registerListeners } from './initializer.js';


(async () => {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	await Promise.all([registerCommands(), registerListeners(client)]);

	client.login(token);
})();
