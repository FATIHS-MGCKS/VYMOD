# client-mobile — CURRENT_STATE

| Field | Value |
| --- | --- |
| Phase | P1 mobile foundation (+ security/navigation closeout on PR #3) |
| Implementation status | `ACTIVE` (in PR #3) |
| Registry coverage | `AUDIT_IN_PROGRESS` |
| Production | `NOT_DEPLOYED` |
| Platforms | iOS, Android (Expo SDK 58, single codebase) |

## Implemented (P1)

- Expo Router tree: `app/(public)`, `app/(onboarding)`, `app/(app)/(tabs)`, `app/(app)/vehicle/[vehicleId]`
- Fail-closed client guards: `authorization.ts`, `Stack.Protected`, `useVehicleAccessGuard`, revocation watcher
- Mock session lifecycle in `SessionProvider` (no HTTP)
- Design system components + dark/light theme
- Root catalog i18n (`de-DE` default/fallback, user locale switch)
- Jest: unit authorization tests, component tests, Expo Router integration tests (28 scenarios)

## Not implemented (by design)

- Production authentication, entitlement API, maps, telemetry, DIMO, store binaries in CI

## Evidence

- Tests: `apps/mobile/src/testing/`, `apps/mobile/src/app/navigation/authorization.test.ts`
- CI: `governance.yml` mobile job (`test:mobile`, typecheck, lint, expo-doctor, JS exports)
