import React from 'react';
import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/design-system/tokens/spacing';
import { useTheme } from '@/design-system/themes/ThemeProvider';

export interface AppScreenProps extends ViewProps {
  scroll?: boolean;
  children: React.ReactNode;
}

export function AppScreen({ scroll, children, style, ...rest }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const content = (
    <View style={[styles.inner, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>{children}</View>
  );
  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]} {...rest}>
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: { flex: 1, paddingHorizontal: spacing.lg, gap: spacing.md },
});
