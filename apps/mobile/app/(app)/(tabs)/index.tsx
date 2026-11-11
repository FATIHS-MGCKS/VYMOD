import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { EmptyState } from '@/design-system/components/EmptyState';
import { VehicleCard } from '@/design-system/components/VehicleCard';
import { canAccessVehicleDashboard } from '@/app/navigation/routePolicy';
import { DEMO_VEHICLE_ID } from '@/data/mocks/fixtures';
import { useTranslation } from '@/localization/I18nProvider';
import { useLifecycle } from '@/state/SessionProvider';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const lifecycle = useLifecycle();

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('dashboard.title')}</AppText>
      {!canAccessVehicleDashboard(lifecycle) ? (
        <EmptyState title={t('dashboard.empty.title')} body={t('dashboard.empty.body')} />
      ) : (
        <View style={{ gap: 16 }}>
          <AppText variant="subtitle">{t('dashboard.vehicle.summary')}</AppText>
          <VehicleCard
            name={t('dashboard.vehicle.name')}
            connectionLabel={`${t('dashboard.vehicle.connection')}: ${t('common.unavailable')}`}
            freshnessLabel={`${t('dashboard.vehicle.freshness')}: ${t('common.stale')}`}
            conditionLabel={`${t('dashboard.vehicle.condition')}: ${t('dashboard.condition.placeholder')}`}
          />
          <AppText variant="label">{t('dashboard.quicklinks')}</AppText>
          <Link href={`/(app)/vehicle/${DEMO_VEHICLE_ID}`}>
            <AppText style={{ color: '#4CC9F0' }}>{t('vehicle.detail.title')}</AppText>
          </Link>
        </View>
      )}
    </AppScreen>
  );
}
