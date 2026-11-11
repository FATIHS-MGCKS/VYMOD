import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { defaultRouteForState } from '@/app/navigation/routePolicy';
import { useTheme } from '@/design-system/themes/ThemeProvider';
import { useLifecycle } from '@/state/SessionProvider';

export default function StartupIndex() {
  const lifecycle = useLifecycle();
  const { colors } = useTheme();

  if (lifecycle === 'INITIALIZING') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={defaultRouteForState(lifecycle) as never} />;
}
