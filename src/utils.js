import fs from 'node:fs';
import path from 'node:path';

export function getAllJSFilesFromDirectory(directory) {
	return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
		.filter(file => file.isFile() && file.name.endsWith('.js'))
		.map(file => path.join(file.parentPath, file.name));
}

export const DeployType = {
	Global: "Global",
	Dev: "Dev",
	Inactive: "Inactive"
};

