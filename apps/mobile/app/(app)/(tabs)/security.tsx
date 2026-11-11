import React from 'react';

import { useVehicleTelemetryGuard } from '@/navigation/useVehicleAccessGuard';
import { View } from 'react-native';

import { AppButton } from '@/design-system/components/AppButton';
import { AppCard } from '@/design-system/components/AppCard';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTranslation } from '@/localization/I18nProvider';

export default function SecurityScreen() {
  const { t } = useTranslation();
  const guard = useVehicleTelemetryGuard();
  if (guard) return guard;

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('security.title')}</AppText>
      <AppText muted>{t('security.subtitle')}</AppText>
      <AppCard>
        <AppText variant="subtitle">{t('security.status.inactive')}</AppText>
        <AppText muted>{t('security.planned.lock')}</AppText>
        <AppText muted>{t('security.planned.engine')}</AppText>
        <AppText muted>{t('security.planned.relay')}</AppText>
      </AppCard>
      <View style={{ gap: 8 }}>
        <AppButton label={t('security.planned.lock')} disabled onPress={() => undefined} />
        <AppButton label={t('security.planned.engine')} disabled variant="secondary" onPress={() => undefined} />
      </View>
    </AppScreen>
  );
}
