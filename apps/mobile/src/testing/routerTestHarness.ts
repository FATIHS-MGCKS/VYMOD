import { act, renderRouter } from 'expo-router/testing-library';

import { integrationRouteMap } from '@/testing/integrationRoutes';
import type { SessionSnapshot } from '@/domain/session';

let activeUnmount: (() => void) | undefined;

export function installRouterTestLifecycle() {
  afterEach(() => {
    activeUnmount?.();
    activeUnmount = undefined;
    jest.useRealTimers();
  });
}

export async function renderApp(initialUrl: string, session: SessionSnapshot) {
  activeUnmount?.();
  jest.useRealTimers();
  globalThis.__vymodBootstrapSession = session;
  delete globalThis.__vymodSetSession;
  const result = await renderRouter(integrationRouteMap, { initialUrl });
  activeUnmount = result.unmount;
  return result;
}

export async function setSession(next: SessionSnapshot) {
  const setter = globalThis.__vymodSetSession;
  if (!setter) throw new Error('session integration root not mounted');
  await act(async () => {
    setter(next);
  });
}
