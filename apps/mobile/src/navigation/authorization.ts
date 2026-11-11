import type { AccountLifecycleState, SessionSnapshot } from '@/domain/session';

/**
 * P1 client-side development guards only — not production authorization.
 * Real authZ will be enforced server-side in P2+.
 */

export function isAccountVerified(session: SessionSnapshot): boolean {
  return session.account?.verification === 'VERIFIED';
}

export function hasSessionAccount(session: SessionSnapshot): boolean {
  return session.account !== null;
}

export function isEntitlementActive(session: SessionSnapshot): boolean {
  return session.entitlement.status === 'ACTIVE' && session.entitlement.vehicleId !== null;
}

export function canAccessRestrictedAccountShell(session: SessionSnapshot): boolean {
  const { lifecycle } = session;
  return lifecycle === 'ACTIVE' || lifecycle === 'SUSPENDED' || lifecycle === 'REVOKED';
}

export function canAccessVehicleTelemetryViews(session: SessionSnapshot): boolean {
  return (
    session.lifecycle === 'ACTIVE' &&
    isAccountVerified(session) &&
    isEntitlementActive(session)
  );
}

export function canAccessVehicleId(session: SessionSnapshot, vehicleId: string): boolean {
  return canAccessVehicleTelemetryViews(session) && session.entitlement.vehicleId === vehicleId;
}

export function lifecycleFromSession(
  session: SessionSnapshot,
  initializing: boolean,
): AccountLifecycleState {
  if (initializing) return 'INITIALIZING';
  return session.lifecycle;
}

export function defaultRouteForSession(session: SessionSnapshot, initializing: boolean): string {
  const lifecycle = lifecycleFromSession(session, initializing);
  switch (lifecycle) {
    case 'INITIALIZING':
      return '/';
    case 'SIGNED_OUT':
      return '/(public)/welcome';
    case 'PENDING_VERIFICATION':
      return '/(onboarding)/verify-email';
    case 'PENDING_APPROVAL':
      return '/(onboarding)/approval-pending';
    case 'ACTIVE':
      return '/(app)/(tabs)';
    case 'SUSPENDED':
    case 'REVOKED':
      return '/(app)/(tabs)/profile';
    case 'ERROR':
    default:
      return '/(public)/welcome';
  }
}

export function redirectForDeniedVehicleAccess(session: SessionSnapshot): string {
  if (!hasSessionAccount(session) || session.lifecycle === 'SIGNED_OUT') {
    return '/(public)/welcome';
  }
  if (!isAccountVerified(session) || session.lifecycle === 'PENDING_VERIFICATION') {
    return '/(onboarding)/verify-email';
  }
  if (session.lifecycle === 'PENDING_APPROVAL') {
    return '/(onboarding)/approval-pending';
  }
  if (session.lifecycle === 'SUSPENDED' || session.lifecycle === 'REVOKED') {
    return '/(app)/(tabs)/profile';
  }
  if (session.lifecycle === 'ACTIVE' && !isEntitlementActive(session)) {
    return '/(onboarding)/approval-pending';
  }
  return defaultRouteForSession(session, false);
}

export function canCompleteMockVerification(session: SessionSnapshot): boolean {
  return (
    session.lifecycle === 'PENDING_VERIFICATION' &&
    hasSessionAccount(session) &&
    session.account!.verification === 'PENDING'
  );
}

export function canSubmitVehicleAccessRequest(session: SessionSnapshot): boolean {
  return (
    session.lifecycle === 'PENDING_APPROVAL' &&
    isAccountVerified(session) &&
    (session.entitlement.status === 'PENDING' ||
      session.entitlement.status === 'NONE' ||
      session.entitlement.status === 'REQUESTED')
  );
}

export function applyVehicleAccessRequest(
  session: SessionSnapshot,
  _reference: string,
): SessionSnapshot | null {
  if (!canSubmitVehicleAccessRequest(session) || !session.account) return null;
  return {
    ...session,
    lifecycle: 'PENDING_APPROVAL',
    account: { ...session.account, verification: 'VERIFIED' },
    entitlement: { status: 'REQUESTED', vehicleId: null },
  };
}

export function isRestrictedAccountOnly(session: SessionSnapshot): boolean {
  return session.lifecycle === 'SUSPENDED' || session.lifecycle === 'REVOKED';
}
