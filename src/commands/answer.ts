import { ActionRowBuilder, SlashCommandBuilder, MessageFlags, ModalBuilder, TextInputStyle, EmbedBuilder, TextInputBuilder } from 'discord.js';

import { Command, DeployType } from '../utils.js';
import { answerPuzzle } from '../db/puzzleRepository.js';
import logger from '../logger.js';
import { getAllTranslations, L, LD, setLocale, unsetLocale } from '../i18n/index.js';

const command: Command = {
	deployType: DeployType.GLOBAL,
	data: new SlashCommandBuilder()
		.setName('answer')
		.setDescription(LD('commands.answer.description'))
		.setDescriptionLocalizations(getAllTranslations('commands.answer.description')),
	async execute(interaction) {
		const locale = interaction.locale;
		setLocale(locale);

		const modal = new ModalBuilder()
			.setCustomId('answer')
			.setTitle(L('commands.answer.modalTitle'));

		const antwortInput = new TextInputBuilder()
			.setCustomId('answerInput')
			.setLabel(L('answer'))
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(antwortInput);

		modal.addComponents(firstActionRow)

		await interaction.showModal(modal);
		unsetLocale();
	},
	handler: {
		async execute(interaction) {
			if (!interaction.isModalSubmit()) return;
			if (interaction.customId !== 'answer') return;

			const guildId = interaction.guildId ?? "";
			const userId = interaction.user.id;
			const answer = interaction.fields.getTextInputValue('answerInput');
			const locale = interaction.locale;
			setLocale(locale);

			try {
				await interaction.deferReply({
					flags: MessageFlags.Ephemeral
				});

				const puzzles = await answerPuzzle(guildId, userId, answer);

				if (puzzles.length === 0) {
					await interaction.editReply({
						content: L('commands.answer.wrong')
					});
					logger.info(`User ${userId} gave a wrong answer in guild ${guildId}.`)
				} else {
					const embeds = puzzles
						.map((puzzle: any) => {
							return new EmbedBuilder()
								.setTitle(`${L('riddle')} ${puzzle.index}`)
								.setDescription(puzzle.question);
						})

					await interaction.editReply({
						content: L('commands.answer.right'),
						embeds: embeds
					});
					logger.info(`User ${userId} gave a right answer in guild ${guildId}.`)
				}
			} catch (err) {
				logger.logError(`Could not submit answer ${answer} for ${userId} in ${guildId}`, err);

				await interaction.editReply({
					content: L('commands.answer.error'),
					embeds: []
				});
			} finally {
				unsetLocale();
			}
		}
	}
};

export default command;
