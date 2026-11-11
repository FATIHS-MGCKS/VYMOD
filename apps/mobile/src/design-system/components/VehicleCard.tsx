import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/localization/I18nProvider';
import { spacing } from '@/design-system/tokens/spacing';
import { useTheme } from '@/design-system/themes/ThemeProvider';
import { AppCard } from './AppCard';
import { AppText } from './AppText';

export function VehicleCard({
  name,
  connectionLabel,
  freshnessLabel,
  conditionLabel,
}: {
  name: string;
  connectionLabel: string;
  freshnessLabel: string;
  conditionLabel: string;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <AppCard>
      <View style={styles.row}>
        <AppText variant="subtitle">{name}</AppText>
        <View style={[styles.badge, { backgroundColor: colors.demo }]}>
          <AppText variant="caption" style={styles.badgeText}>
            {t('app.demo.badge')}
          </AppText>
        </View>
      </View>
      <AppText variant="label" muted>
        {connectionLabel}
      </AppText>
      <AppText muted>{freshnessLabel}</AppText>
      <AppText>{conditionLabel}</AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  badge: { borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  badgeText: { color: '#FFFFFF', fontWeight: '700' },
});
