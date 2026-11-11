import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { AppButton } from '@/design-system/components/AppButton';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import { useTranslation } from '@/localization/I18nProvider';
export default function WelcomeScreen() {
  const { t, locale, setLocale } = useTranslation();

  const toggleLanguage = () => {
    setLocale(locale === 'en-US' ? 'de-DE' : 'en-US');
  };

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('onboarding.welcome.title')}</AppText>
      <AppText variant="subtitle" muted>
        {t('app.tagline')}
      </AppText>
      <AppText>{t('onboarding.welcome.description')}</AppText>
      <View style={{ gap: 12, marginTop: 16 }}>
        <Link href="/(public)/sign-up" asChild>
          <AppButton label={t('onboarding.welcome.action.signup')} />
        </Link>
        <Link href="/(public)/sign-in" asChild>
          <AppButton label={t('onboarding.welcome.action.signin')} variant="secondary" />
        </Link>
      </View>
      <Pressable onPress={toggleLanguage} accessibilityRole="button">
        <AppText variant="label">{t('settings.language.label')}</AppText>
        <AppText muted>
          {locale === 'en-US' ? t('settings.language.en') : t('settings.language.de')}
        </AppText>
      </Pressable>
      <AppText variant="caption" muted>
        {t('common.placeholder.legal')}
      </AppText>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <AppText variant="caption" muted>
          {t('onboarding.welcome.terms')}
        </AppText>
        <AppText variant="caption" muted>
          {t('onboarding.welcome.privacy')}
        </AppText>
      </View>
    </AppScreen>
  );
}
