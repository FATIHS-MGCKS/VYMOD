import { Link } from 'expo-router';
import React from 'react';

import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTranslation } from '@/localization/I18nProvider';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <AppScreen>
      <AppText variant="title">{t('common.error.title')}</AppText>
      <Link href="/">
        <AppText>{t('common.back')}</AppText>
      </Link>
    </AppScreen>
  );
}
