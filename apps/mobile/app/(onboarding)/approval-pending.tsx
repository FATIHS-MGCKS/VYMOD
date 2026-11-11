import { router } from 'expo-router';
import React from 'react';

import { AppButton } from '@/design-system/components/AppButton';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTranslation } from '@/localization/I18nProvider';
import { useSession } from '@/state/SessionProvider';

export default function ApprovalPendingScreen() {
  const { t } = useTranslation();
  const { setDevScenario, session } = useSession();

  return (
    <AppScreen>
      <AppText variant="title">{t('onboarding.approvalpending.title')}</AppText>
      <AppText>{t('onboarding.approvalpending.body')}</AppText>
      <AppText variant="subtitle">{t('onboarding.approvalpending.next')}</AppText>
      <AppText muted>{t('onboarding.approvalpending.nextstep')}</AppText>
      <AppButton label={t('common.refresh')} variant="secondary" onPress={() => undefined} />
      {__DEV__ && session.account ? (
        <AppButton
          label={t('common.continue')}
          onPress={() => {
            setDevScenario('ACTIVE');
            router.replace('/(app)/(tabs)');
          }}
        />
      ) : null}
    </AppScreen>
  );
}
