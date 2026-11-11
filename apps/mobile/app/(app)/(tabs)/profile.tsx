import React from 'react';
import { Pressable, View } from 'react-native';

import { AppButton } from '@/design-system/components/AppButton';
import { AppScreen } from '@/design-system/components/AppScreen';
import { AppText } from '@/design-system/components/AppText';
import type { SupportedLocale } from '@/localization/catalogs';
import { useTranslation } from '@/localization/I18nProvider';
import type { AccountLifecycleState } from '@/domain/session';
import { useTheme, type ThemePreference } from '@/design-system/themes/ThemeProvider';
import { useSession, useLifecycle } from '@/state/SessionProvider';

function SettingsRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" disabled={!onPress}>
      <View style={{ paddingVertical: 8 }}>
        <AppText variant="label">{label}</AppText>
        <AppText muted>{value}</AppText>
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { t, locale, setLocale } = useTranslation();
  const { preference, setPreference } = useTheme();
  const { signOut, setDevScenario, session } = useSession();
  const lifecycle = useLifecycle();

  const cycleLocale = () => {
    const next: SupportedLocale = locale === 'en-US' ? 'de-DE' : 'en-US';
    setLocale(next);
  };

  const cycleTheme = () => {
    const order: ThemePreference[] = ['system', 'dark', 'light'];
    const idx = order.indexOf(preference);
    setPreference(order[(idx + 1) % order.length] ?? 'system');
  };

  const themeLabel =
    preference === 'system'
      ? t('settings.theme.system')
      : preference === 'dark'
        ? t('settings.theme.dark')
        : t('settings.theme.light');

  const restricted =
    lifecycle === 'SUSPENDED'
      ? t('profile.restricted.suspended')
      : lifecycle === 'REVOKED'
        ? t('profile.restricted.revoked')
        : null;

  const devStates: AccountLifecycleState[] = [
    'PENDING_APPROVAL',
    'ACTIVE',
    'SUSPENDED',
    'REVOKED',
    'SIGNED_OUT',
  ];

  return (
    <AppScreen scroll>
      <AppText variant="title">{t('profile.title')}</AppText>
      {restricted ? <AppText style={{ color: '#F25F5C' }}>{restricted}</AppText> : null}
      <AppText variant="subtitle">{t('profile.account.title')}</AppText>
      <AppText>{session.account?.email ?? t('profile.account.mockemail')}</AppText>
      <SettingsRow
        label={t('settings.language.label')}
        value={locale === 'en-US' ? t('settings.language.en') : t('settings.language.de')}
        onPress={cycleLocale}
      />
      <SettingsRow label={t('settings.theme.label')} value={themeLabel} onPress={cycleTheme} />
      <SettingsRow label={t('settings.units.label')} value={t('settings.units.metric')} />
      <SettingsRow label={t('settings.notifications.label')} value={t('settings.notifications.placeholder')} />
      <SettingsRow label={t('settings.privacy.entry')} value={t('common.placeholder.legal')} />
      <AppButton label={t('profile.signout')} variant="secondary" onPress={signOut} />
      {__DEV__ ? (
        <View>
          <AppText variant="subtitle">{t('profile.devscenarios.title')}</AppText>
          <AppText variant="caption" muted>
            {t('profile.devscenarios.hint')}
          </AppText>
          {devStates.map((state) => (
            <AppButton
              key={state}
              label={state}
              variant="secondary"
              onPress={() => setDevScenario(state)}
            />
          ))}
        </View>
      ) : null}
    </AppScreen>
  );
}
