import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  applyVehicleAccessRequest,
  canCompleteMockVerification,
  lifecycleFromSession,
} from '@/app/navigation/authorization';
import type { AccountLifecycleState, SessionSnapshot } from '@/domain/session';
import {
  createActiveSession,
  createPendingApprovalSession,
  createPendingVerificationSession,
  createRevokedSession,
  createSignedOutSession,
  createSuspendedSession,
} from '@/data/mocks/fixtures';
import { MockAuthRepository } from '@/data/repositories/MockAuthRepository';

export interface SessionContextValue {
  session: SessionSnapshot;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, passwordConfirm: string) => Promise<{ ok: true } | { ok: false; field: string }>;
  signOut: () => void;
  completeMockVerification: () => void;
  submitVehicleRequest: (reference: string) => void;
  setDevScenario: (state: AccountLifecycleState) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const authRepo = new MockAuthRepository();

export function SessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession?: SessionSnapshot;
}) {
  const [session, setSession] = useState<SessionSnapshot>(
    () => initialSession ?? createSignedOutSession(),
  );
  const [initializing, setInitializing] = useState(initialSession === undefined);

  useEffect(() => {
    if (!initializing) return;
    const timer = setTimeout(() => setInitializing(false), 0);
    return () => clearTimeout(timer);
  }, [initializing]);

  const signIn = useCallback(async (email: string, password: string) => {
    await authRepo.signIn(email, password);
    setSession(createPendingVerificationSession(email));
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, passwordConfirm: string) => {
      const result = await authRepo.signUp(email, password, passwordConfirm);
      if (!result.ok) return result;
      setSession(createPendingVerificationSession(email));
      return { ok: true as const };
    },
    [],
  );

  const signOut = useCallback(() => {
    setSession(createSignedOutSession());
  }, []);

  const completeMockVerification = useCallback(() => {
    if (!canCompleteMockVerification(session) || !session.account) return;
    setSession(createPendingApprovalSession(session.account.email));
  }, [session]);

  const submitVehicleRequest = useCallback(
    (reference: string) => {
      const next = applyVehicleAccessRequest(session, reference);
      if (next) setSession(next);
    },
    [session],
  );

  const setDevScenario = useCallback(
    (state: AccountLifecycleState) => {
      if (!__DEV__) return;
      const email = session.account?.email ?? 'dev@vymod.demo';
      switch (state) {
        case 'SIGNED_OUT':
          setSession(createSignedOutSession());
          break;
        case 'PENDING_VERIFICATION':
          setSession(createPendingVerificationSession(email));
          break;
        case 'PENDING_APPROVAL':
          setSession(createPendingApprovalSession(email));
          break;
        case 'ACTIVE':
          setSession(createActiveSession(email));
          break;
        case 'SUSPENDED':
          setSession(createSuspendedSession(email));
          break;
        case 'REVOKED':
          setSession(createRevokedSession(email));
          break;
        default:
          break;
      }
    },
    [session.account?.email],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      initializing,
      signIn,
      signUp,
      signOut,
      completeMockVerification,
      submitVehicleRequest,
      setDevScenario,
    }),
    [
      session,
      initializing,
      signIn,
      signUp,
      signOut,
      completeMockVerification,
      submitVehicleRequest,
      setDevScenario,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession requires SessionProvider');
  }
  return ctx;
}

export function useLifecycle(): AccountLifecycleState {
  const { session, initializing } = useSession();
  return lifecycleFromSession(session, initializing);
}
