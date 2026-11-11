import { Redirect, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

import {
  canAccessVehicleId,
  canAccessVehicleTelemetryViews,
  redirectForDeniedVehicleAccess,
} from '@/app/navigation/authorization';
import { useSession } from '@/state/SessionProvider';

/**
 * Client-side P1 guard — not production authorization.
 */
export function useVehicleTelemetryGuard(): React.ReactElement | null {
  const { session } = useSession();
  if (canAccessVehicleTelemetryViews(session)) return null;
  return <Redirect href={redirectForDeniedVehicleAccess(session) as never} />;
}

export function useVehicleIdGuard(vehicleId: string | undefined): React.ReactElement | null {
  const { session } = useSession();
  if (!vehicleId) {
    return <Redirect href={redirectForDeniedVehicleAccess(session) as never} />;
  }
  if (!canAccessVehicleId(session, vehicleId)) {
    return <Redirect href={redirectForDeniedVehicleAccess(session) as never} />;
  }
  return null;
}

export function useRevocationWatcher(): void {
  const { session } = useSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inVehicleSurface = segments.some(
      (s) =>
        s === 'location' ||
        s === 'intelligence' ||
        s === 'security' ||
        s === 'index' ||
        s === '[vehicleId]' ||
        s === 'vehicle',
    );
    if (!inVehicleSurface) return;
    if (canAccessVehicleTelemetryViews(session)) return;
    router.replace(redirectForDeniedVehicleAccess(session) as never);
  }, [session, segments, router]);
}
