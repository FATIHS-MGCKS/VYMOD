import { act, fireEvent, waitFor } from 'expo-router/testing-library';

import { installRouterTestLifecycle, renderApp } from '@/testing/routerTestHarness';
import { sessionFixtures } from '@/testing/testProviders';

installRouterTestLifecycle();

describe('Expo Router welcome → sign-up', () => {
  it('navigates from welcome to sign-up', async () => {
    const view = await renderApp('/welcome', sessionFixtures.signedOut());
    await waitFor(() => expect(view.getByText('Create account')).toBeTruthy());
    await act(async () => {
      fireEvent.press(view.getByText('Create account'));
    });
    await waitFor(() => expect(view).toHavePathname('/sign-up'));
  });
});
