import { router } from 'expo-router';
import React from 'react';

import { AppButton } from '@/design-system/components/AppButton';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTranslation } from '@/localization/I18nProvider';
import { useSession } from '@/state/SessionProvider';

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const { completeMockVerification } = useSession();

  return (
    <AppScreen>
      <AppText variant="title">{t('onboarding.verifyemail.title')}</AppText>
      <AppText>{t('onboarding.verifyemail.body')}</AppText>
      <AppText variant="caption" muted>
        {t('onboarding.verifyemail.hint')}
      </AppText>
      <AppButton
        label={t('common.continue')}
        onPress={() => {
          completeMockVerification();
          router.replace('/(onboarding)/vehicle-request');
        }}
      />
    </AppScreen>
  );
}
