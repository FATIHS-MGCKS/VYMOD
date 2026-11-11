import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { AppButton } from '@/design-system/components/AppButton';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { AppTextField } from '@/design-system/components/AppTextField';
import { useTranslation } from '@/localization/I18nProvider';
import { useSession } from '@/state/SessionProvider';

export default function SignInScreen() {
  const { t } = useTranslation();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const onSubmit = async () => {
    setFormError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    if (!email.trim()) {
      setEmailError(t('errors.validation.required', { fieldName: t('auth.signin.email.label') }));
      return;
    }
    if (password.length < 8) {
      setPasswordError(t('errors.validation.passwordmin', { min: 8 }));
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(onboarding)/verify-email');
    } catch {
      setFormError(t('errors.session.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AppText variant="title">{t('auth.signin.title')}</AppText>
        <AppText muted>{t('auth.signin.subtitle')}</AppText>
        <AppTextField
          label={t('auth.signin.email.label')}
          placeholder={t('auth.signin.email.placeholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
        <AppTextField
          label={t('auth.signin.password.label')}
          placeholder={t('auth.signin.password.placeholder')}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          error={passwordError}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={showPassword ? t('accessibility.hidepassword') : t('accessibility.showpassword')}
          onPress={() => setShowPassword((v) => !v)}
        >
          <AppText variant="caption">{showPassword ? t('auth.signin.hidepassword') : t('auth.signin.showpassword')}</AppText>
        </Pressable>
        {formError ? (
          <AppText variant="caption" style={{ color: '#F25F5C' }}>
            {formError}
          </AppText>
        ) : null}
        <AppButton label={t('auth.signin.submit')} onPress={onSubmit} loading={loading} />
        <Link href="/(public)/welcome" asChild>
          <AppButton label={t('common.back')} variant="secondary" />
        </Link>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
