import IntlMessageFormat from 'intl-messageformat';

import {
  CATALOGS,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type MessageCatalog,
  type SupportedLocale,
  type TranslationKey,
} from './catalogs';

export type TranslateValues = Record<string, string | number | boolean | undefined>;

export interface RuntimeI18nAdapter {
  readonly locale: SupportedLocale;
  readonly catalog: MessageCatalog;
  t(id: TranslationKey, values?: TranslateValues): string;
  formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string;
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
}

export function resolveDeviceLocale(deviceTag: string | null | undefined): SupportedLocale {
  if (!deviceTag) return DEFAULT_LOCALE;
  const normalized = deviceTag.replace('_', '-');
  const exact = SUPPORTED_LOCALES.find((l) => l === normalized);
  if (exact) return exact;
  const language = normalized.split('-')[0]?.toLowerCase();
  if (language === 'de') return 'de-DE';
  return DEFAULT_LOCALE;
}

function assertCatalogParity(locale: SupportedLocale, catalog: MessageCatalog): void {
  const reference = CATALOGS[DEFAULT_LOCALE];
  const refKeys = Object.keys(reference).sort();
  const keys = Object.keys(catalog).sort();
  if (refKeys.join('\0') !== keys.join('\0')) {
  throw new Error(`Locale catalog parity failure for ${locale}`);
  }
}

export function createRuntimeI18nAdapter(locale: SupportedLocale): RuntimeI18nAdapter {
  const catalog = CATALOGS[locale];
  assertCatalogParity(locale, catalog);

  const formatCache = new Map<string, IntlMessageFormat>();

  const t = (id: TranslationKey, values?: TranslateValues): string => {
    const pattern = catalog[id];
    if (pattern === undefined) {
      throw new Error(`Missing translation key: ${id}`);
    }
    if (!values || Object.keys(values).length === 0) {
      return pattern;
    }
    let formatter = formatCache.get(id);
    if (!formatter) {
      formatter = new IntlMessageFormat(pattern, locale);
      formatCache.set(id, formatter);
    }
    return String(formatter.format(values));
  };

  return {
    locale,
    catalog,
    t,
    formatDate: (value, options) => new Intl.DateTimeFormat(locale, options).format(value),
    formatNumber: (value, options) => new Intl.NumberFormat(locale, options).format(value),
  };
}

/** Authority export: I18N-FN-099 runtime UI adapter factory */
export const runtimeI18nAdapter = createRuntimeI18nAdapter;
