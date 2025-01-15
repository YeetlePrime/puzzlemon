import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, MessageFlags, PermissionFlagsBits } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { createNewPuzzleForGuild } from '../db/puzzleRepository.js';
import logger from '../logger.js';
import { getAllTranslations, L, LD, setLocale, unsetLocale } from '../i18n/index.js';

const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription(LD('commands.create.description'))
		.setDescriptionLocalizations(getAllTranslations('commands.create.description'))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const locale = interaction.locale;
		setLocale(locale);
		const modal = new ModalBuilder()
			.setCustomId('createModal')
			.setTitle(L('commands.create.modalTitle'));

		const raetselInput = new TextInputBuilder()
			.setCustomId('raetselInput')
			.setLabel(L('riddle'))
			// Short means only a single line of text
			.setStyle(TextInputStyle.Paragraph);

		const antwortInput = new TextInputBuilder()
			.setCustomId('antwortInput')
			.setLabel(L('answer'))
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(raetselInput);
		const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(antwortInput);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal);
		unsetLocale();
	},
	handler: {
		async execute(interaction) {
			if (!interaction.isModalSubmit()) return;
			if (interaction.customId !== 'createModal') return;

			const guildId = interaction.guildId ?? "";
			const question = interaction.fields.getTextInputValue('raetselInput');
			const answer = interaction.fields.getTextInputValue('antwortInput');
			const locale = interaction.locale;

			setLocale(locale);

			try {
				await interaction.deferReply({ flags: MessageFlags.Ephemeral });
				await createNewPuzzleForGuild(guildId, question, answer);
				logger.info(`Successfully created new puzzle for ${guildId}.`)
				await interaction.editReply({ content: L('commands.create.success') });
			} catch (err) {
				logger.logError(`Could not create new puzzle for ${guildId}:`, err)
				await interaction.editReply({ content: L('commands.create.error') });
			} finally {
				unsetLocale();
			}
		}
	}
};

export default command;
