import fs from 'node:fs';
import path from 'node:path';

export function getAllJSFilesFromDirectory(directory: string) {
	return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
		.filter(file => file.isFile() && file.name.endsWith('.js'))
		.map(file => path.join(file.parentPath, file.name));
}

export const DeployType = {
	GLOBAL: "GLOBAL",
	DEV: "DEV",
	INACTIVE: "INACTIVE"
};

