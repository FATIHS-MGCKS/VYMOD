import { Redirect, Tabs, useSegments } from 'expo-router';
import React from 'react';

import {
  canAccessVehicleTelemetryViews,
  defaultRouteForSession,
  isRestrictedAccountOnly,
} from '@/app/navigation/authorization';
import { useRevocationWatcher } from '@/app/navigation/useVehicleAccessGuard';
import { useTheme } from '@/design-system/themes/ThemeProvider';
import { useTranslation } from '@/localization/I18nProvider';
import { useSession } from '@/state/SessionProvider';

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { session, initializing } = useSession();
  const segments = useSegments();

  useRevocationWatcher();

  if (initializing) {
    return <Redirect href="/" />;
  }

  const leaf = segments[segments.length - 1];
  const vehicleTabKeys = new Set(['index', 'location', 'intelligence', 'security']);

  if (isRestrictedAccountOnly(session) && leaf && vehicleTabKeys.has(leaf)) {
    return <Redirect href="/(app)/(tabs)/profile" />;
  }

  if (!canAccessVehicleTelemetryViews(session) && leaf && vehicleTabKeys.has(leaf)) {
    return <Redirect href={defaultRouteForSession(session, false) as never} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarAccessibilityLabel: t('accessibility.main.navigation'),
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.dashboard') }} />
      <Tabs.Screen name="location" options={{ title: t('tabs.location') }} />
      <Tabs.Screen name="intelligence" options={{ title: t('tabs.intelligence') }} />
      <Tabs.Screen name="security" options={{ title: t('tabs.security') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}
