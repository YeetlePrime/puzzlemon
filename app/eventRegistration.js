const __dirname = import.meta.dirname;
import path from 'node:path';
import { getAllJSFilesFromDirectory } from './utils.js';

export async function registerEvents(client) {
	for (const file of getAllJSFilesFromDirectory(path.join(__dirname, 'events'))) {
		const { event } = await import(file);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
	console.log('Successfully registered all events.');
}
