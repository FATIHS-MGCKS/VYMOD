import React from 'react';
import { View } from 'react-native';

import { AppCard } from '@/design-system/components/AppCard';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTheme } from '@/design-system/themes/ThemeProvider';
import { useTranslation } from '@/localization/I18nProvider';

export default function LocationScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('location.title')}</AppText>
      <AppCard>
        <AppText variant="subtitle">{t('location.unavailable.title')}</AppText>
        <AppText muted>{t('location.unavailable.body')}</AppText>
        <AppText variant="label" muted>
          {t('location.status.label')}
        </AppText>
        <AppText>{t('common.unavailable')}</AppText>
        <AppText variant="caption" muted>
          {t('location.lastupdated')}: {t('common.notassessable')}
        </AppText>
      </AppCard>
      <View
        accessibilityLabel={t('location.map.placeholder')}
        style={{
          height: 180,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceElevated,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText muted>{t('location.map.placeholder')}</AppText>
      </View>
      <AppText variant="caption" muted>
        {t('privacy.location.notice')}
      </AppText>
    </AppScreen>
  );
}
