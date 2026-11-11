import { act, fireEvent, waitFor } from 'expo-router/testing-library';

import { installRouterTestLifecycle, renderApp } from '@/testing/routerTestHarness';
import { sessionFixtures } from '@/testing/testProviders';

installRouterTestLifecycle();

describe('Expo Router welcome → sign-in', () => {
  it('navigates from welcome to sign-in', async () => {
    const view = await renderApp('/welcome', sessionFixtures.signedOut());
    await waitFor(() => expect(view.getByText('Sign in')).toBeTruthy());
    await act(async () => {
      fireEvent.press(view.getByText('Sign in'));
    });
    await waitFor(() => expect(view).toHavePathname('/sign-in'));
  });
});
