import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import {
  createRuntimeI18nAdapter,
  resolveDeviceLocale,
  type RuntimeI18nAdapter,
  type TranslateValues,
} from './runtimeI18nAdapter';
import { DEFAULT_LOCALE, type SupportedLocale, type TranslationKey } from './catalogs';

export interface I18nContextValue extends RuntimeI18nAdapter {
  setLocale: (locale: SupportedLocale) => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  initialLocale?: SupportedLocale;
  children: React.ReactNode;
}

const LOCALE_STORAGE_KEY = '@vymod/preferences/locale';

export function I18nProvider({ initialLocale, children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    initialLocale ?? resolveDeviceLocale(Localization.getLocales()[0]?.languageTag),
  );

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE_KEY).then((stored) => {
      if (stored === 'en-US' || stored === 'de-DE') {
        setLocaleState(stored);
      }
    });
  }, []);

  const adapter = useMemo(() => createRuntimeI18nAdapter(locale), [locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
    void AsyncStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      ...adapter,
      setLocale,
    }),
    [adapter, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n requires I18nProvider');
  }
  return ctx;
}

export function useTranslation() {
  const { t, locale, setLocale, formatDate, formatNumber } = useI18n();
  const bound = useCallback(
    (id: TranslationKey, values?: TranslateValues) => t(id, values),
    [t],
  );
  return { t: bound, locale, setLocale, formatDate, formatNumber };
}
