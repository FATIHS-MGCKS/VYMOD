import type { SessionSnapshot } from '@/domain/session';

export const DEMO_VEHICLE_ID = 'demo-vehicle-001';

export function createSignedOutSession(): SessionSnapshot {
  return {
    lifecycle: 'SIGNED_OUT',
    account: null,
    entitlement: { status: 'NONE', vehicleId: null },
  };
}

export function createPendingVerificationSession(email: string): SessionSnapshot {
  return {
    lifecycle: 'PENDING_VERIFICATION',
    account: { email, verification: 'PENDING' },
    entitlement: { status: 'NONE', vehicleId: null },
  };
}

export function createPendingApprovalSession(email: string): SessionSnapshot {
  return {
    lifecycle: 'PENDING_APPROVAL',
    account: { email, verification: 'VERIFIED' },
    entitlement: { status: 'PENDING', vehicleId: null },
  };
}

export function createActiveSession(email: string): SessionSnapshot {
  return {
    lifecycle: 'ACTIVE',
    account: { email, verification: 'VERIFIED' },
    entitlement: { status: 'ACTIVE', vehicleId: DEMO_VEHICLE_ID },
  };
}

export function createSuspendedSession(email: string): SessionSnapshot {
  return {
    lifecycle: 'SUSPENDED',
    account: { email, verification: 'VERIFIED' },
    entitlement: { status: 'SUSPENDED', vehicleId: DEMO_VEHICLE_ID },
  };
}

export function createRevokedSession(email: string): SessionSnapshot {
  return {
    lifecycle: 'REVOKED',
    account: { email, verification: 'VERIFIED' },
    entitlement: { status: 'REVOKED', vehicleId: null },
  };
}
