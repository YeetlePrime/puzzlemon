import { SlashCommandBuilder } from 'discord.js';

import { Command, DeployType } from '../utils.js';

export const deployType = DeployType.DEV;

export const command: Command = {
	deployType: DeployType.DEV,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Basic ping command.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	}
}


