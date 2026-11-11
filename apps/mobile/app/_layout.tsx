import React from 'react';

export { ErrorBoundary } from 'expo-router';

import { AppProviders } from '@/app/providers/AppProviders';
import { RootNavigationLayout } from '@/app/navigation/RootNavigationLayout';

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigationLayout />
    </AppProviders>
  );
}
