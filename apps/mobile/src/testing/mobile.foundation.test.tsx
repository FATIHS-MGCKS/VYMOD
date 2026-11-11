import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import DashboardScreen from '../../app/(app)/(tabs)/index';
import SecurityScreen from '../../app/(app)/(tabs)/security';
import ProfileScreen from '../../app/(app)/(tabs)/profile';
import ApprovalPendingScreen from '../../app/(onboarding)/approval-pending';
import SignUpScreen from '../../app/(public)/sign-up';
import WelcomeScreen from '../../app/(public)/welcome';
import VerifyEmailScreen from '../../app/(onboarding)/verify-email';
import { CATALOGS } from '@/localization/catalogs';
import { createRuntimeI18nAdapter } from '@/localization/runtimeI18nAdapter';
import { TestProviders, sessionFixtures } from '@/testing/testProviders';
import { canAccessVehicleDashboard, defaultRouteForState } from '@/app/navigation/routePolicy';
import { MockAuthRepository } from '@/data/repositories/MockAuthRepository';

describe('VYMOD mobile P1', () => {
  it('renders welcome screen', () => {
    render(
      <TestProviders>
        <WelcomeScreen />
      </TestProviders>,
    );
    expect(screen.getByText('Welcome to VYMOD')).toBeTruthy();
  });

  it('shows sign-in action on welcome', () => {
    render(
      <TestProviders>
        <WelcomeScreen />
      </TestProviders>,
    );
    expect(screen.getByText('Sign in')).toBeTruthy();
  });

  it('shows sign-up action on welcome', () => {
    render(
      <TestProviders>
        <WelcomeScreen />
      </TestProviders>,
    );
    expect(screen.getByText('Create account')).toBeTruthy();
  });

  it('rejects empty sign-up submission', async () => {
    const view = render(
      <TestProviders>
        <SignUpScreen />
      </TestProviders>,
    );
    fireEvent.press(view.getByText('Register'));
    await waitFor(() => {
      expect(view.getByText(/required/i)).toBeTruthy();
    });
  });

  it('rejects missing password confirmation', async () => {
    const view = render(
      <TestProviders>
        <SignUpScreen />
      </TestProviders>,
    );
    fireEvent.changeText(view.getByLabelText('Email'), 'user@example.com');
    fireEvent.changeText(view.getAllByLabelText('Password')[0], 'password123');
    fireEvent.press(view.getByText('Register'));
    await waitFor(() => {
      expect(view.getAllByText(/required|match/i).length).toBeGreaterThan(0);
    });
  });

  it('renders pending verification screen', () => {
    render(
      <TestProviders session={sessionFixtures.pendingVerification()}>
        <VerifyEmailScreen />
      </TestProviders>,
    );
    expect(screen.getByText('Verify your email')).toBeTruthy();
  });

  it('renders pending approval screen', () => {
    render(
      <TestProviders session={sessionFixtures.pendingApproval()}>
        <ApprovalPendingScreen />
      </TestProviders>,
    );
    expect(screen.getByText('Approval pending')).toBeTruthy();
  });

  it('ACTIVE mock state displays demo dashboard', () => {
    render(
      <TestProviders session={sessionFixtures.active()}>
        <DashboardScreen />
      </TestProviders>,
    );
    expect(screen.getByText('DEMO')).toBeTruthy();
  });

  it('SIGNED_OUT route policy blocks app shell', () => {
    expect(defaultRouteForState('SIGNED_OUT')).toBe('/(public)/welcome');
    expect(canAccessVehicleDashboard('SIGNED_OUT')).toBe(false);
  });

  it('PENDING_APPROVAL cannot access vehicle dashboard', () => {
    expect(canAccessVehicleDashboard('PENDING_APPROVAL')).toBe(false);
  });

  it('REVOKED cannot access vehicle dashboard', () => {
    expect(canAccessVehicleDashboard('REVOKED')).toBe(false);
  });

  it('SUSPENDED shows restricted profile copy', () => {
    const view = render(
      <TestProviders session={sessionFixtures.suspended()}>
        <ProfileScreen />
      </TestProviders>,
    );
    expect(view.getByText(/suspended/i)).toBeTruthy();
  });

  it('REVOKED shows revoked profile copy', () => {
    const view = render(
      <TestProviders session={sessionFixtures.revoked()}>
        <ProfileScreen />
      </TestProviders>,
    );
    expect(view.getByText(/revoked/i)).toBeTruthy();
  });

  it('language preference updates visible welcome copy', () => {
    const view = render(
      <TestProviders locale="en-US">
        <WelcomeScreen />
      </TestProviders>,
    );
    expect(view.getByText('Welcome to VYMOD')).toBeTruthy();
    const german = render(
      <TestProviders locale="de-DE">
        <WelcomeScreen />
      </TestProviders>,
    );
    expect(german.getByText('Willkommen bei VYMOD')).toBeTruthy();
  });

  it('ICU placeholders render correctly', () => {
    const { t } = createRuntimeI18nAdapter('en-US');
    expect(t('vehicle.list.count', { count: 1 })).toMatch(/1 vehicle/);
    expect(t('errors.validation.required', { fieldName: 'Email' })).toMatch(/Email/);
  });

  it('locale catalogs remain consistent', () => {
    expect(Object.keys(CATALOGS['en-US']).sort()).toEqual(Object.keys(CATALOGS['de-DE']).sort());
  });

  it('security controls are unavailable', () => {
    const view = render(
      <TestProviders session={sessionFixtures.active()}>
        <SecurityScreen />
      </TestProviders>,
    );
    expect(view.getByText('Controls inactive')).toBeTruthy();
    expect(view.getAllByText('Lock / unlock (planned)').length).toBeGreaterThan(0);
  });

  it('empty vehicle state messaging is present for non-active entitlement', () => {
    const view = render(
      <TestProviders session={sessionFixtures.suspended()}>
        <DashboardScreen />
      </TestProviders>,
    );
    expect(view.getByText('No vehicle access')).toBeTruthy();
  });

  it('runtime adapter throws on missing translation keys', () => {
    const { t } = createRuntimeI18nAdapter('en-US');
    expect(() => t('missing.key' as never)).toThrow(/Missing translation key/);
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
