import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { canAccessVehicleDashboard } from '@/app/navigation/routePolicy';
import { useTranslation } from '@/localization/I18nProvider';
import { useLifecycle } from '@/state/SessionProvider';

export default function VehicleDetailScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { t } = useTranslation();
  const lifecycle = useLifecycle();

  if (!canAccessVehicleDashboard(lifecycle)) {
    return <Redirect href="/(app)/(tabs)/profile" />;
  }

  return (
    <AppScreen>
      <AppText variant="title">{t('vehicle.detail.title')}</AppText>
      <AppText muted>{vehicleId}</AppText>
      <AppText>{t('dashboard.condition.placeholder')}</AppText>
    </AppScreen>
  );
}
