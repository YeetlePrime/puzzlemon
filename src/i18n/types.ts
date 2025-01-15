import en from './locales/en.js'
import de from './locales/de.js'

export const DEFAULT_LOCALE = 'en';
export const LOCALES = {
	en: en,
	de: de,
};

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type NestedKeyOf<T> = {
	[K in keyof T & (string | number)]: T[K] extends object
	? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
	: `${K}`;
}[keyof T & (string | number)];

export type Translation = typeof en;
export type PartialTranslation = DeepPartial<Translation>;
export type TranslationKeys = NestedKeyOf<Translation>;

export type TranslationObject = Partial<{
	[K in keyof typeof LOCALES]: string;
}>;
