import deDE from '../../../../i18n/locales/de-DE.json';
import enUS from '../../../../i18n/locales/en-US.json';

export type SupportedLocale = 'en-US' | 'de-DE';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en-US', 'de-DE'];

export const DEFAULT_LOCALE: SupportedLocale = 'de-DE';

export type MessageCatalog = Record<string, string>;

export const CATALOGS: Record<SupportedLocale, MessageCatalog> = {
  'en-US': enUS,
  'de-DE': deDE,
};

export type TranslationKey = keyof typeof enUS;
