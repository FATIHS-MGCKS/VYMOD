import { waitFor } from 'expo-router/testing-library';

import { DEMO_VEHICLE_ID, createPendingVerificationSession } from '@/data/mocks/fixtures';
import {
  applyVehicleAccessRequest,
  canCompleteMockVerification,
  canSubmitVehicleAccessRequest,
} from '@/navigation/authorization';
import { installRouterTestLifecycle, renderApp, setSession } from '@/testing/routerTestHarness';
import { sessionFixtures } from '@/testing/testProviders';

installRouterTestLifecycle();

describe('Expo Router integration (P1 client guards)', () => {
  it('redirects SIGNED_OUT deep link away from protected tabs', async () => {
    const view = await renderApp('/(app)/(tabs)', sessionFixtures.signedOut());
    await waitFor(() => expect(view).toHavePathname('/welcome'));
  });

  it('redirects PENDING_APPROVAL deep link to approval-pending', async () => {
    const view = await renderApp('/(app)/(tabs)', sessionFixtures.pendingApproval());
    await waitFor(() => expect(view).toHavePathname('/approval-pending'));
  });

  it('blocks SUSPENDED from location', async () => {
    const view = await renderApp('/location', sessionFixtures.suspended());
    await waitFor(() => expect(view).toHavePathname('/profile'));
  });

  it('blocks REVOKED from intelligence', async () => {
    const view = await renderApp('/intelligence', sessionFixtures.revoked());
    await waitFor(() => expect(view).toHavePathname('/profile'));
  });

  it('allows ACTIVE on entitled demo vehicle', async () => {
    const view = await renderApp(`/vehicle/${DEMO_VEHICLE_ID}`, sessionFixtures.active());
    await waitFor(() => expect(view).toHavePathname(`/vehicle/${DEMO_VEHICLE_ID}`));
    expect(view.getByText(DEMO_VEHICLE_ID)).toBeTruthy();
  });

  it('denies ACTIVE for a different vehicle id', async () => {
    const view = await renderApp('/vehicle/other-vehicle-999', sessionFixtures.active());
    await waitFor(() => expect(view).not.toHavePathname('/vehicle/other-vehicle-999'));
  });

  it('redirects when access is revoked on a protected tab', async () => {
    const view = await renderApp('/location', sessionFixtures.active());
    await waitFor(() => expect(view).toHavePathname('/location'));
    await setSession(sessionFixtures.suspended());
    await waitFor(() => expect(view).toHavePathname('/profile'));
  });

  it('hides developer-only ACTIVE activation when approval is pending', async () => {
    const view = await renderApp('/approval-pending', sessionFixtures.pendingApproval());
    await waitFor(() => expect(view.getByText('Approval pending')).toBeTruthy());
    expect(view.queryByText('Continue')).toBeNull();
  });

  it('rejects invalid verification and entitlement transitions', () => {
    const pending = createPendingVerificationSession('a@b.co');
    expect(canCompleteMockVerification(pending)).toBe(true);
    expect(canSubmitVehicleAccessRequest(pending)).toBe(false);
    expect(applyVehicleAccessRequest(pending, 'VIN')).toBeNull();

    const unverifiedApproval = {
      ...sessionFixtures.pendingApproval(),
      account: { email: 'a@b.co', verification: 'PENDING' as const },
    };
    expect(canSubmitVehicleAccessRequest(unverifiedApproval)).toBe(false);
  });
});
