import React from 'react';

import {
  createActiveSession,
  createPendingApprovalSession,
  createPendingVerificationSession,
  createRevokedSession,
  createSignedOutSession,
  createSuspendedSession,
} from '@/data/mocks/fixtures';
import type { SessionSnapshot } from '@/domain/session';
import { SessionProvider } from '@/state/SessionProvider';
import { I18nProvider } from '@/localization/I18nProvider';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

export function TestProviders({
  session = createSignedOutSession(),
  locale,
  children,
}: {
  session?: SessionSnapshot;
  locale?: 'en-US' | 'de-DE';
  children: React.ReactNode;
}) {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <I18nProvider initialLocale={locale}>
        <ThemeProvider>
          <SessionProvider initialSession={session}>{children}</SessionProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

export const sessionFixtures = {
  signedOut: createSignedOutSession,
  pendingVerification: () => createPendingVerificationSession('test@example.com'),
  pendingApproval: () => createPendingApprovalSession('test@example.com'),
  active: () => createActiveSession('test@example.com'),
  suspended: () => createSuspendedSession('test@example.com'),
  revoked: () => createRevokedSession('test@example.com'),
};
