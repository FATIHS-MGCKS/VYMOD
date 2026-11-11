export type AccountLifecycleState =
  | 'INITIALIZING'
  | 'SIGNED_OUT'
  | 'PENDING_VERIFICATION'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REVOKED'
  | 'ERROR';

export interface ConsumerAccount {
  email: string;
  verification: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
}

export interface VehicleEntitlement {
  status: 'NONE' | 'REQUESTED' | 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  vehicleId: string | null;
}

export interface SessionSnapshot {
  lifecycle: AccountLifecycleState;
  account: ConsumerAccount | null;
  entitlement: VehicleEntitlement;
}
