import { act, cleanup, renderRouter } from 'expo-router/testing-library';

import { integrationRouteMap } from '@/testing/integrationRoutes';
import type { SessionSnapshot } from '@/domain/session';

let activeUnmount: (() => void | Promise<void>) | undefined;

export function installRouterTestLifecycle() {
  afterEach(async () => {
    if (activeUnmount) {
      await act(async () => {
        await activeUnmount?.();
      });
    }
    await act(async () => {
      await Promise.resolve();
    });
    cleanup();
    activeUnmount = undefined;
    jest.useRealTimers();
  });
}

export async function renderApp(initialUrl: string, session: SessionSnapshot) {
  if (activeUnmount) {
    await act(async () => {
      await activeUnmount?.();
    });
    activeUnmount = undefined;
  }
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
    await Promise.resolve();
  });
}
