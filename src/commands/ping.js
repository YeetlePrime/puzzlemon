import { SlashCommandBuilder } from 'discord.js';

import { DeployType } from '../utils.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Basic ping command.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	}
};

export const deployType = DeployType.Dev;
