import { PartialTranslation } from '../types';

const de: PartialTranslation = {
	riddle: 'Rätsel',
	answer: 'Antwort',
	submit: 'Bestätigen',
	cancel: 'Abbrechen',
	commands: {
		answer: {
			description: 'Beantworte ein Rätsel.',
			modalTitle: 'Beantworte Rätsel',
			wrong: 'Die Antwort ist leider falsch.',
			log_pre: ' hat die richtige Antwort auf Rätsel ',
			log_post: ' gegeben.',
			right: 'Das ist die richtige Antwort für folgende Rätsel:',
			error: 'Es konnte nicht überprüft werden, ob die Antwort richtig ist.',
		},
		clear: {
			description: 'Lösche alle Rätsel.',
			sure: 'Bist du dir sicher, dass du alle Rätsel löschen möchtest?',
			success: 'Alle Rätsel wurden erfolgreich gelöscht',
			error: 'Die Rätsel konnten nicht gelöscht werden.',
			timeout: 'You took too long to submit.',
		},
		create: {
			description: 'Lege ein neues Rätsel an.',
			modalTitle: 'Neues Rätsel',
			success: 'Das Rätsel wurde erfolgreich angelegt.',
			error: 'Das Rätsel konnte nicht angelegt werden.',
		},
		get: {
			description: 'Zeige alle Rätsel.',
			empty: 'Es gibt derzeit keine Rätsel.',
			error: 'Die Rätsel konnten nicht geladen werden.',
		},
		info: {
			description: 'Zeige deinen Fortschritt bei den Rätseln.',
			solvedTitle: 'Gelöste Rätsel',
			nextTitle: 'Nächstes Rätsel',
			allSolved: 'Du hast bereits alle Rätsel gelöst',
			error: 'Die Rätsel konnten nicht geladen werden.',
		},
		set_log_channel: {
			description: 'Setze den Kanal, in den die log Nachrichten geschickt werden sollen.',
			channel_description: 'Der Kanal, in den die log Nachrichten geschickt werden sollen.',
			success: 'Der log Kanal wurde erfolgreich gesetzt.',
			error: 'Der log Kanal konnte nicht gesetzt werden.',
		},
	},
};

export default de;
