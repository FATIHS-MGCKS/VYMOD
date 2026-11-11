import React from 'react';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { I18nProvider } from '@/localization/I18nProvider';
import { SessionProvider } from '@/state/SessionProvider';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <I18nProvider>
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
