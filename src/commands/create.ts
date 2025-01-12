import { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, MessageFlags, PermissionFlagsBits, MessageActionRowComponentBuilder } from 'discord.js';

import { Command, DeployType, InteractionEventHandler } from '../utils.js';
import { createNewPuzzleForGuild } from '../db/puzzleRepository.js';
import logger from '../logger.js';

const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Erstelle ein neues Rätsel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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

		const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(raetselInput);
		const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(antwortInput);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal);
	},
	handler: {
		async execute(interaction) {
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
				logger.logError(`Could not create new puzzle for ${guildId}:`, err)
				await interaction.editReply({ content: 'Das Rätsel konnte nicht angelegt werden!' });
			}
		}
	}
};

export default command;