import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { canAccessAppShell } from '@/app/navigation/routePolicy';
import { defaultRouteForState } from '@/app/navigation/routePolicy';
import { useLifecycle } from '@/state/SessionProvider';

export default function AppAreaLayout() {
  const lifecycle = useLifecycle();

  if (!canAccessAppShell(lifecycle)) {
    return <Redirect href={defaultRouteForState(lifecycle) as never} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="vehicle/[vehicleId]" />
    </Stack>
  );
}
