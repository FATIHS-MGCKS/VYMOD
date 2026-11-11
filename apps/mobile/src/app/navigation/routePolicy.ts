import type { AccountLifecycleState } from '@/domain/session';

export function canAccessAppShell(state: AccountLifecycleState): boolean {
  return state === 'ACTIVE' || state === 'SUSPENDED' || state === 'REVOKED';
}

export function canAccessVehicleDashboard(state: AccountLifecycleState): boolean {
  return state === 'ACTIVE';
}

export function defaultRouteForState(state: AccountLifecycleState): string {
  switch (state) {
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
