import { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, MessageFlags } from 'discord.js';

import { DeployType } from '../utils.js';
import { createNewPuzzleForGuild } from '../db/puzzleRepository.js';
import logger from '../logger.js';

export const deployType = DeployType.DEV;
export const command = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Erstelle ein neues Rätsel.'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('createModal')
			.setTitle('Neues Rätsel');

		const raetselInput = new TextInputBuilder()
			.setCustomId('raetselInput')
			.setLabel("Rätsel")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Paragraph);

		const antwortInput = new TextInputBuilder()
			.setCustomId('antwortInput')
			.setLabel("Antwort")
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder().addComponents(raetselInput);
		const secondActionRow = new ActionRowBuilder().addComponents(antwortInput);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal);
	}
};

export const handler = {
	event: Events.InteractionCreate,
	async callback(interaction) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId !== 'createModal') return;

		const guildId = interaction.guildId;
		const question = interaction.fields.getTextInputValue('raetselInput');
		const answer = interaction.fields.getTextInputValue('antwortInput');

		try {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			await createNewPuzzleForGuild(guildId, question, answer);
			logger.info(`Successfully created new puzzle for ${guildId}.`)
			await interaction.editReply({ content: 'Das Rätsel wurde erfolgreich angelegt!' });
		} catch (err) {
			logger.error(`Could not create new puzzle for ${guildId}:`, err.stack)
			await interaction.editReply({ content: 'Das Rätsel konnte nicht angelegt werden!' });
		}
	}

}


