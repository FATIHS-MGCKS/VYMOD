import { act, cleanup, renderRouter } from 'expo-router/testing-library';

import { integrationRouteMap } from '@/testing/integrationRoutes';
import type { SessionSnapshot } from '@/domain/session';

let activeUnmount: (() => void | Promise<void>) | undefined;

export function installRouterTestLifecycle() {
  afterEach(async () => {
    jest.useRealTimers();
    if (activeUnmount) {
      await activeUnmount();
    }
    cleanup();
    activeUnmount = undefined;
  });
}

export async function renderApp(initialUrl: string, session: SessionSnapshot) {
  jest.useRealTimers();
  if (activeUnmount) {
    await activeUnmount();
    activeUnmount = undefined;
  }
  globalThis.__vymodBootstrapSession = session;
  delete globalThis.__vymodSetSession;
  const result = await renderRouter(integrationRouteMap, { initialUrl });
  activeUnmount = result.unmount;
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
  return result;
}

export async function setSession(next: SessionSnapshot) {
  const setter = globalThis.__vymodSetSession;
  if (!setter) throw new Error('session integration root not mounted');
  await act(async () => {
    setter(next);
  });
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
}
