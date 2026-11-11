import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  View,
} from 'react-native';

import { spacing } from '@/design-system/tokens/spacing';
import { useTheme } from '@/design-system/themes/ThemeProvider';
import { AppText } from './AppText';

export interface AppButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AppButton({ label, loading, variant = 'primary', disabled, ...rest }: AppButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isPrimary ? colors.primary : colors.surfaceElevated,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
        },
        disabled ? styles.disabled : null,
      ]}
      {...rest}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={isPrimary ? colors.primaryForeground : colors.foreground} /> : null}
        <AppText
          variant="label"
          style={{
            color: isPrimary ? colors.primaryForeground : colors.foreground,
            textAlign: 'center',
          }}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  disabled: { opacity: 0.5 },
});
