import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import DashboardScreen from '../../app/(app)/(tabs)/index';
import SecurityScreen from '../../app/(app)/(tabs)/security';
import ProfileScreen from '../../app/(app)/(tabs)/profile';
import SignUpScreen from '../../app/(public)/sign-up';
import WelcomeScreen from '../../app/(public)/welcome';
import {
  canAccessVehicleId,
  canAccessVehicleTelemetryViews,
  defaultRouteForSession,
} from '@/app/navigation/authorization';
import { DEMO_VEHICLE_ID } from '@/data/mocks/fixtures';
import { CATALOGS } from '@/localization/catalogs';
import { createRuntimeI18nAdapter } from '@/localization/runtimeI18nAdapter';
import { TestProviders, sessionFixtures } from '@/testing/testProviders';
import { MockAuthRepository } from '@/data/repositories/MockAuthRepository';

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    Link: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
      asChild ? children : children,
    router: { replace: jest.fn(), push: jest.fn() },
    Redirect: () => null,
    useLocalSearchParams: () => ({}),
    useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
    useSegments: () => [],
  };
});

describe('VYMOD mobile P1 components', () => {
  it('renders welcome screen', () => {
    render(
      <TestProviders locale="en-US">
        <WelcomeScreen />
      </TestProviders>,
    );
    expect(screen.getByText('Welcome to VYMOD')).toBeTruthy();
  });

  it('switches language from the welcome screen control', async () => {
    const view = render(
      <TestProviders locale="en-US">
        <WelcomeScreen />
      </TestProviders>,
    );
    expect(view.getByText('Welcome to VYMOD')).toBeTruthy();
    const languageRow = view.getByText('Language');
    fireEvent.press(languageRow);
    await waitFor(() => {
      expect(view.getByText('Deutsch (Deutschland)')).toBeTruthy();
    });
    fireEvent.press(languageRow);
    await waitFor(() => {
      expect(view.getByText('English (US)')).toBeTruthy();
    });
  });

  it('rejects empty sign-up submission', async () => {
    const view = render(
      <TestProviders locale="en-US">
        <SignUpScreen />
      </TestProviders>,
    );
    fireEvent.press(view.getByText('Register'));
    await waitFor(() => {
      expect(view.getByText(/required/i)).toBeTruthy();
    });
  });

  it('ACTIVE mock state displays demo dashboard', () => {
    render(
      <TestProviders session={sessionFixtures.active()} locale="en-US">
        <DashboardScreen />
      </TestProviders>,
    );
    expect(screen.getByText('DEMO')).toBeTruthy();
  });

  it('SUSPENDED shows restricted profile copy', () => {
    const view = render(
      <TestProviders session={sessionFixtures.suspended()} locale="en-US">
        <ProfileScreen />
      </TestProviders>,
    );
    expect(view.getByText(/suspended/i)).toBeTruthy();
  });

  it('session routes deny vehicle surfaces when not ACTIVE', () => {
    expect(canAccessVehicleTelemetryViews(sessionFixtures.pendingApproval())).toBe(false);
    expect(defaultRouteForSession(sessionFixtures.signedOut(), false)).toBe('/(public)/welcome');
  });

  it('vehicle ID scope rejects foreign IDs', () => {
    expect(canAccessVehicleId(sessionFixtures.active(), DEMO_VEHICLE_ID)).toBe(true);
    expect(canAccessVehicleId(sessionFixtures.active(), 'foreign')).toBe(false);
  });

  it('ICU placeholders render correctly', () => {
    const { t } = createRuntimeI18nAdapter('en-US');
    expect(t('vehicle.list.count', { count: 1 })).toMatch(/1 vehicle/);
  });

  it('locale catalogs remain consistent', () => {
    expect(Object.keys(CATALOGS['en-US']).sort()).toEqual(Object.keys(CATALOGS['de-DE']).sort());
  });

  it('security controls are unavailable', () => {
    const view = render(
      <TestProviders session={sessionFixtures.active()} locale="en-US">
        <SecurityScreen />
      </TestProviders>,
    );
    expect(view.getAllByText('Lock / unlock (planned)').length).toBeGreaterThan(0);
  });

  it('mock auth repository performs no HTTP calls', async () => {
    const repo = new MockAuthRepository();
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('unexpected')));
    await repo.signIn('a@b.co', 'password123');
    await repo.signUp('a@b.co', 'password123', 'password123');
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
