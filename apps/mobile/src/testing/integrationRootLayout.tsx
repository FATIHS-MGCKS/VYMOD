import React, { useEffect, useState } from 'react';

import { AppProviders } from '@/app/providers/AppProviders';
import { RootNavigationLayout } from '@/app/navigation/RootNavigationLayout';
import { createSignedOutSession } from '@/data/mocks/fixtures';
import type { SessionSnapshot } from '@/domain/session';

type SessionSetter = React.Dispatch<React.SetStateAction<SessionSnapshot>>;

declare global {
  // eslint-disable-next-line no-var
  var __vymodBootstrapSession: SessionSnapshot | undefined;
  // eslint-disable-next-line no-var
  var __vymodSetSession: SessionSetter | undefined;
}

export function IntegrationRootLayout() {
  const [session, setSession] = useState(
    globalThis.__vymodBootstrapSession ?? createSignedOutSession(),
  );

  useEffect(() => {
    globalThis.__vymodSetSession = setSession;
    return () => {
      delete globalThis.__vymodSetSession;
    };
  }, []);

  return (
    <AppProviders initialSession={session} initialLocale="en-US">
      <RootNavigationLayout />
    </AppProviders>
  );
}
