import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { spacing } from '@/design-system/tokens/spacing';
import { useTheme } from '@/design-system/themes/ThemeProvider';

export function AppCard({ children, style, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    gap: spacing.sm,
  },
});
