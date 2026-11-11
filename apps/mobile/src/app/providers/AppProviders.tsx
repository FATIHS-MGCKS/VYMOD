import React from 'react';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import type { SessionSnapshot } from '@/domain/session';
import type { SupportedLocale } from '@/localization/catalogs';
import { I18nProvider } from '@/localization/I18nProvider';
import { SessionProvider } from '@/state/SessionProvider';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

export function AppProviders({
  children,
  initialSession,
  initialLocale,
}: {
  children: React.ReactNode;
  initialSession?: SessionSnapshot;
  initialLocale?: SupportedLocale;
}) {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <I18nProvider initialLocale={initialLocale}>
        <ThemeProvider>
          <SessionProvider initialSession={initialSession}>{children}</SessionProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
