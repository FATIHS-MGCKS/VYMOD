import { router } from 'expo-router';
import React, { useState } from 'react';

import { AppButton } from '@/design-system/components/AppButton';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { AppTextField } from '@/design-system/components/AppTextField';
import { useTranslation } from '@/localization/I18nProvider';
import { useSession } from '@/state/SessionProvider';

export default function VehicleRequestScreen() {
  const { t } = useTranslation();
  const { submitVehicleRequest } = useSession();
  const [reference, setReference] = useState('');

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('onboarding.vehiclerequest.title')}</AppText>
      <AppText>{t('onboarding.vehiclerequest.body')}</AppText>
      <AppTextField
        label={t('onboarding.vehiclerequest.vin.label')}
        placeholder={t('onboarding.vehiclerequest.vin.placeholder')}
        value={reference}
        onChangeText={setReference}
      />
      <AppButton
        label={t('onboarding.vehiclerequest.submit')}
        onPress={() => {
          submitVehicleRequest(reference);
          router.replace('/(onboarding)/approval-pending');
        }}
      />
    </AppScreen>
  );
}
