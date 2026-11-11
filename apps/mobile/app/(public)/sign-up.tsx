import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { AppButton } from '@/design-system/components/AppButton';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { AppTextField } from '@/design-system/components/AppTextField';
import { useTranslation } from '@/localization/I18nProvider';
import { useSession } from '@/state/SessionProvider';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { signUp } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();

  const onSubmit = async () => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmError(undefined);
    const result = await signUp(email, password, passwordConfirm);
    if (!result.ok) {
      if (result.field === 'email') {
        setEmailError(
          email.trim() ? t('errors.validation.email') : t('errors.validation.required', { fieldName: t('auth.signup.email.label') }),
        );
      } else if (result.field === 'password') {
        setPasswordError(t('errors.validation.passwordmin', { min: 8 }));
      } else {
        setConfirmError(
          passwordConfirm
            ? t('errors.validation.passwordmismatch')
            : t('errors.validation.required', { fieldName: t('auth.signup.passwordconfirm.label') }),
        );
      }
      return;
    }
    setLoading(true);
    try {
      await Promise.resolve();
      router.replace('/(onboarding)/verify-email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('auth.signup.title')}</AppText>
      <AppText muted>{t('auth.signup.subtitle')}</AppText>
      <AppTextField
        label={t('auth.signup.email.label')}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />
      <AppTextField
        label={t('auth.signup.password.label')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={passwordError}
      />
      <AppTextField
        label={t('auth.signup.passwordconfirm.label')}
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        error={confirmError}
      />
      <AppText variant="caption" muted>
        {t('auth.signup.privacylink')}
      </AppText>
      <View style={{ gap: 12 }}>
        <AppButton label={t('auth.signup.submit')} onPress={onSubmit} loading={loading} />
        <Link href="/(public)/welcome" asChild>
          <AppButton label={t('common.back')} variant="secondary" />
        </Link>
      </View>
    </AppScreen>
  );
}
