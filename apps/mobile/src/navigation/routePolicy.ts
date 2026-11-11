import type { AccountLifecycleState, SessionSnapshot } from '@/domain/session';

import {
  canAccessRestrictedAccountShell,
  canAccessVehicleId,
  canAccessVehicleTelemetryViews,
  defaultRouteForSession,
} from './authorization';

/** @deprecated use session-aware authorization helpers */
export function canAccessAppShell(state: AccountLifecycleState): boolean {
  if (state === 'ACTIVE' || state === 'SUSPENDED' || state === 'REVOKED') return true;
  return false;
}

/** @deprecated use canAccessVehicleTelemetryViews(session) */
export function canAccessVehicleDashboard(state: AccountLifecycleState): boolean {
  return state === 'ACTIVE';
}

export function defaultRouteForState(state: AccountLifecycleState): string {
  const stub: SessionSnapshot = {
    lifecycle: state,
    account: state === 'SIGNED_OUT' ? null : { email: 'stub@vymod.demo', verification: state === 'PENDING_VERIFICATION' ? 'PENDING' : 'VERIFIED' },
    entitlement: { status: state === 'ACTIVE' ? 'ACTIVE' : 'NONE', vehicleId: state === 'ACTIVE' ? 'demo-vehicle-001' : null },
  };
  return defaultRouteForSession(stub, state === 'INITIALIZING');
}

export {
  canAccessRestrictedAccountShell,
  canAccessVehicleId,
  canAccessVehicleTelemetryViews,
  defaultRouteForSession,
};
