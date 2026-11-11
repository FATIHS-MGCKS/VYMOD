import { IntegrationRootLayout } from '@/testing/integrationRootLayout';

export const integrationRouteMap = {
  _layout: IntegrationRootLayout,
  index: require('../../app/index').default,
  '(public)/_layout': require('../../app/(public)/_layout').default,
  '(public)/welcome': require('../../app/(public)/welcome').default,
  '(public)/sign-in': require('../../app/(public)/sign-in').default,
  '(public)/sign-up': require('../../app/(public)/sign-up').default,
  '(onboarding)/_layout': require('../../app/(onboarding)/_layout').default,
  '(onboarding)/verify-email': require('../../app/(onboarding)/verify-email').default,
  '(onboarding)/vehicle-request': require('../../app/(onboarding)/vehicle-request').default,
  '(onboarding)/approval-pending': require('../../app/(onboarding)/approval-pending').default,
  '(app)/_layout': require('../../app/(app)/_layout').default,
  '(app)/(tabs)/_layout': require('../../app/(app)/(tabs)/_layout').default,
  '(app)/(tabs)/index': require('../../app/(app)/(tabs)/index').default,
  '(app)/(tabs)/location': require('../../app/(app)/(tabs)/location').default,
  '(app)/(tabs)/intelligence': require('../../app/(app)/(tabs)/intelligence').default,
  '(app)/(tabs)/security': require('../../app/(app)/(tabs)/security').default,
  '(app)/(tabs)/profile': require('../../app/(app)/(tabs)/profile').default,
  '(app)/vehicle/[vehicleId]': require('../../app/(app)/vehicle/[vehicleId]').default,
  '+not-found': require('../../app/+not-found').default,
} as const;
