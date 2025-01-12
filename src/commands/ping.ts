import { SlashCommandBuilder } from 'discord.js';

import { Command, DeployType } from '../utils.js';

const command: Command = {
	deployType: DeployType.DEV,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Basic ping command.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	}
};

export default command;
