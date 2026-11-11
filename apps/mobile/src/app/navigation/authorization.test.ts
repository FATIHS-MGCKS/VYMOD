import { DEMO_VEHICLE_ID, createPendingVerificationSession } from '@/data/mocks/fixtures';
import {
  applyVehicleAccessRequest,
  canAccessVehicleId,
  canAccessVehicleTelemetryViews,
  canCompleteMockVerification,
  canSubmitVehicleAccessRequest,
  redirectForDeniedVehicleAccess,
} from '@/app/navigation/authorization';
import { sessionFixtures } from '@/testing/testProviders';

describe('vehicle authorization (P1 client guards)', () => {
  it('denies vehicle views for pre-active states', () => {
    expect(canAccessVehicleTelemetryViews(sessionFixtures.signedOut())).toBe(false);
    expect(canAccessVehicleTelemetryViews(sessionFixtures.pendingVerification())).toBe(false);
    expect(canAccessVehicleTelemetryViews(sessionFixtures.pendingApproval())).toBe(false);
    expect(canAccessVehicleTelemetryViews(sessionFixtures.suspended())).toBe(false);
    expect(canAccessVehicleTelemetryViews(sessionFixtures.revoked())).toBe(false);
  });

  it('allows vehicle views only for ACTIVE verified entitlement', () => {
    expect(canAccessVehicleTelemetryViews(sessionFixtures.active())).toBe(true);
  });

  it('scopes vehicle ID to entitled demo vehicle', () => {
    const active = sessionFixtures.active();
    expect(canAccessVehicleId(active, DEMO_VEHICLE_ID)).toBe(true);
    expect(canAccessVehicleId(active, 'other-id')).toBe(false);
  });

  it('maps denied access to safe routes', () => {
    expect(redirectForDeniedVehicleAccess(sessionFixtures.signedOut())).toContain('welcome');
    expect(redirectForDeniedVehicleAccess(sessionFixtures.pendingVerification())).toContain('verify-email');
    expect(redirectForDeniedVehicleAccess(sessionFixtures.suspended())).toContain('profile');
  });

  it('does not verify account via vehicle request from verification state', () => {
    const pending = createPendingVerificationSession('user@example.com');
    expect(applyVehicleAccessRequest(pending, 'VIN123')).toBeNull();
  });

  it('allows vehicle request only after verified approval state', () => {
    const approval = sessionFixtures.pendingApproval();
    expect(canCompleteMockVerification(approval)).toBe(false);
    expect(canSubmitVehicleAccessRequest(approval)).toBe(true);
    const requested = applyVehicleAccessRequest(approval, 'VIN123');
    expect(requested?.account.verification).toBe('VERIFIED');
    expect(requested?.entitlement.status).toBe('REQUESTED');
  });
});
