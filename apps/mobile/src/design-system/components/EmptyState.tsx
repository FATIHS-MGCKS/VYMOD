import React from 'react';
import { View } from 'react-native';

import { AppText } from './AppText';

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View accessibilityRole="summary">
      <AppText variant="subtitle">{title}</AppText>
      <AppText muted>{body}</AppText>
    </View>
  );
}
