import { Redirect, Stack } from 'expo-router';
import React from 'react';

import {
  canAccessRestrictedAccountShell,
  defaultRouteForSession,
} from '@/app/navigation/authorization';
import { useSession } from '@/state/SessionProvider';

/** P1 client-side shell guard — not production authorization. */
export default function AppAreaLayout() {
  const { session, initializing } = useSession();

  if (initializing) {
    return <Redirect href="/" />;
  }

  const shellAllowed = canAccessRestrictedAccountShell(session);
  const fallback = defaultRouteForSession(session, false);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={shellAllowed} redirectTo={fallback}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="vehicle/[vehicleId]" />
      </Stack.Protected>
    </Stack>
  );
}
