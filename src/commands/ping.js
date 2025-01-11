import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { DeployType } from '../utils.js';

export const deployType = DeployType.DEV;
export const command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Basic ping command.')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
	async execute(interaction) {
		await interaction.reply('Pong!');
	}
};


