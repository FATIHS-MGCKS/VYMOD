import React from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { spacing } from '@/design-system/tokens/spacing';
import { useTheme } from '@/design-system/themes/ThemeProvider';
import { AppText } from './AppText';

export interface AppTextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function AppTextField({ label, error, style, ...rest }: AppTextFieldProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        placeholderTextColor={colors.muted}
        accessibilityLabel={label}
        style={[
          styles.input,
          {
            color: colors.foreground,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
});
