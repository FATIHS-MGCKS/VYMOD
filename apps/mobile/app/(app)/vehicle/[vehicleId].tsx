import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { useVehicleIdGuard } from '@/navigation/useVehicleAccessGuard';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTranslation } from '@/localization/I18nProvider';

export default function VehicleDetailScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { t } = useTranslation();
  const guard = useVehicleIdGuard(vehicleId);

  if (guard) return guard;

  return (
    <AppScreen>
      <AppText variant="title">{t('vehicle.detail.title')}</AppText>
      <AppText muted>{vehicleId}</AppText>
      <AppText>{t('dashboard.condition.placeholder')}</AppText>
    </AppScreen>
  );
}
