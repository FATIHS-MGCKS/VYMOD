import React from 'react';

import { useVehicleTelemetryGuard } from '@/app/navigation/useVehicleAccessGuard';
import { View } from 'react-native';

import { AppCard } from '@/design-system/components/AppCard';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTranslation } from '@/localization/I18nProvider';

const SECTIONS = [
  'intelligence.health',
  'intelligence.diagnostics',
  'intelligence.driving',
  'intelligence.ds4',
  'intelligence.battery',
  'intelligence.signal',
] as const;

export default function IntelligenceScreen() {
  const { t } = useTranslation();
  const guard = useVehicleTelemetryGuard();
  if (guard) return guard;

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('intelligence.title')}</AppText>
      <View style={{ gap: 12 }}>
        {SECTIONS.map((key) => (
          <AppCard key={key}>
            <AppText variant="subtitle">{t(key)}</AppText>
            <AppText muted>{t('intelligence.unavailable.section')}</AppText>
          </AppCard>
        ))}
      </View>
    </AppScreen>
  );
}
