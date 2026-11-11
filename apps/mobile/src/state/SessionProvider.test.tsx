import { act, renderHook } from '@testing-library/react-native';
import React from 'react';

import { SessionProvider, useSession } from '@/state/SessionProvider';
import { sessionFixtures } from '@/testing/testProviders';
import { createSignedOutSession } from '@/data/mocks/fixtures';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider initialSession={sessionFixtures.pendingApproval()}>{children}</SessionProvider>
  );
}

describe('SessionProvider mock boundaries', () => {
  it('setDevScenario is ineffective when __DEV__ is false', async () => {
    const view = await renderHook(() => useSession(), { wrapper });
    expect(view.result.current.session.lifecycle).toBe('PENDING_APPROVAL');
    await act(async () => {
      view.result.current.setDevScenario('ACTIVE');
    });
    expect(view.result.current.session.lifecycle).toBe('PENDING_APPROVAL');
  });

  it('signOut remains available without dev-only escalation', async () => {
    const devWrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider initialSession={sessionFixtures.active()}>{children}</SessionProvider>
    );
    const view = await renderHook(() => useSession(), { wrapper: devWrapper });
    await act(async () => {
      view.result.current.signOut();
    });
    expect(view.result.current.session.lifecycle).toBe('SIGNED_OUT');
    expect(view.result.current.session).toEqual(createSignedOutSession());
  });
});
