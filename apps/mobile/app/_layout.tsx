import React from 'react';

export { ErrorBoundary } from 'expo-router';

import { AppProviders } from '@/providers/AppProviders';
import { RootNavigationLayout } from '@/navigation/RootNavigationLayout';

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigationLayout />
    </AppProviders>
  );
}
