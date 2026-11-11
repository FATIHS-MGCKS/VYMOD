import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/design-system/themes/ThemeProvider';

type Variant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

const variantStyle: Record<Variant, TextStyle> = {
  title: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  subtitle: { fontSize: 17, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, lineHeight: 22 },
  caption: { fontSize: 13, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
};

export interface AppTextProps extends TextProps {
  variant?: Variant;
  muted?: boolean;
}

export function AppText({ variant = 'body', muted, style, children, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      maxFontSizeMultiplier={2}
      style={[
        variantStyle[variant],
        { color: muted ? colors.muted : colors.foreground },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
