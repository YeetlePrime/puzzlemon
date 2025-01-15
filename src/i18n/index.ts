import rosetta from 'rosetta';
import { DEFAULT_LOCALE, LOCALES, PartialTranslation, TranslationKeys as TranslationKey, TranslationObject } from './types';
import { Locale } from 'discord.js';

const i18n = rosetta<PartialTranslation>();

i18n.set('en', LOCALES.en);
i18n.set('de', LOCALES.de);

function getBaseLocale(locale: string) {
	return locale.split('-')[0];
}

function localeHasTranslationForKey(locale: string, key: TranslationKey, options?: any[]): boolean {
	const previousLocale = getLocale();
	setLocale(locale);

	const result = i18n.t(key, options) !== '';

	setLocale(previousLocale);

	return result;
}

/**
 * Validates if a given locale is a valid Discord locale.
 * @param locale - The locale to validate.
 * @returns True if the locale is valid, false otherwise.
 */
function isValidDiscordLocale(locale: string): boolean {
	return Object.values(Locale).includes(locale as Locale);
}

/**
 * Gets the translation for the currently set locale.
 */
export function L(key: TranslationKey, options?: any[]): string {
	// Try to fetch the translation in the current locale
	const translation = i18n.t(key, options);

	// If the translation is missing, fallback to English
	if (translation === key) {
		return i18n.t(key, options, DEFAULT_LOCALE); // Explicitly fetch from 'en'
	}

	return translation;
};

/**
 * Gets the translation for the currently a locale.
 * @param locale - The locale to get the translation from.
 */
export function LL(locale: string, key: TranslationKey, options?: any[]): string {
	const previousLocale = getLocale();
	setLocale(locale);

	const translation = L(key, options);

	setLocale(previousLocale);

	return translation;
};

/**
 * Gets the translation for the default locale.
 */
export function LD(key: TranslationKey, options?: any[]): string {
	return LL(DEFAULT_LOCALE, key, options);
};

export function getAllTranslations(key: TranslationKey, options?: any[]): TranslationObject {
	const result: TranslationObject = {};

	for (const locale in LOCALES) {
		if (localeHasTranslationForKey(locale, key, options) && isValidDiscordLocale(locale)) {
			result[locale as keyof TranslationObject] = LL(locale, key, options);
		}
	}

	return result;
}

export function setLocale(locale: string) {
	const baseLocale = getBaseLocale(locale);
	if (i18n.locale() !== baseLocale) {
		i18n.locale(getBaseLocale(locale));
	}
}

export function getLocale(): string {
	return i18n.locale();
}

export function unsetLocale() {
	if (i18n.locale() !== DEFAULT_LOCALE) {
		i18n.locale(DEFAULT_LOCALE);
	}
}

export default i18n;

