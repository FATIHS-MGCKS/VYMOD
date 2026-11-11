import React, { useEffect, useState } from 'react';

import { AppProviders } from '@/app/providers/AppProviders';
import { RootNavigationLayout } from '@/app/navigation/RootNavigationLayout';
import { createSignedOutSession } from '@/data/mocks/fixtures';
import type { SessionSnapshot } from '@/domain/session';

type IntegrationSessionSetter = (next: SessionSnapshot) => void;

declare global {
  // eslint-disable-next-line no-var
  var __vymodBootstrapSession: SessionSnapshot | undefined;
  // eslint-disable-next-line no-var
  var __vymodSetSession: IntegrationSessionSetter | undefined;
}

export function IntegrationRootLayout() {
  const [session, setSession] = useState(
    globalThis.__vymodBootstrapSession ?? createSignedOutSession(),
  );
  const [sessionProviderKey, setSessionProviderKey] = useState(0);

  useEffect(() => {
    globalThis.__vymodSetSession = (next: SessionSnapshot) => {
      setSession(next);
      setSessionProviderKey((key) => key + 1);
    };
    return () => {
      delete globalThis.__vymodSetSession;
    };
  }, []);

  return (
    <AppProviders
      initialSession={session}
      initialLocale="en-US"
      sessionProviderKey={sessionProviderKey}
    >
      <RootNavigationLayout />
    </AppProviders>
  );
}
