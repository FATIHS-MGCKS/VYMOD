import { Tabs, Redirect } from 'expo-router';
import React from 'react';

import { canAccessVehicleDashboard } from '@/app/navigation/routePolicy';
import { useTheme } from '@/design-system/themes/ThemeProvider';
import { useTranslation } from '@/localization/I18nProvider';
import { useLifecycle } from '@/state/SessionProvider';

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const lifecycle = useLifecycle();

  if (!canAccessVehicleDashboard(lifecycle) && lifecycle !== 'SUSPENDED' && lifecycle !== 'REVOKED') {
    return <Redirect href="/(onboarding)/approval-pending" />;
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
