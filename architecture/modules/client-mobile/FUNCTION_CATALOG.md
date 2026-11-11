# client-mobile — FUNCTION_CATALOG

| ID | Kind | Symbol | Summary | Status | Path |
| --- | --- | --- | --- | --- | --- |
| MOB-FN-001 | export | `createRuntimeI18nAdapter` | ICU runtime `t()` adapter | IMPLEMENTED | `apps/mobile/src/localization/runtimeI18nAdapter.ts` |
| MOB-FN-010 | hook | `useSession` | Mock session + guarded transitions | IMPLEMENTED | `apps/mobile/src/state/SessionProvider.tsx` |
| MOB-FN-011 | hook | `useTranslation` | Typed translation API (throws without provider) | IMPLEMENTED | `apps/mobile/src/localization/I18nProvider.tsx` |
| MOB-FN-020 | fn | `defaultRouteForSession` | Session-aware default route | IMPLEMENTED | `apps/mobile/src/app/navigation/authorization.ts` |
| MOB-FN-021 | fn | `canAccessVehicleTelemetryViews` | ACTIVE + verified + entitlement gate | IMPLEMENTED | `apps/mobile/src/app/navigation/authorization.ts` |
| MOB-FN-022 | fn | `canAccessVehicleId` | Entitled vehicle ID match | IMPLEMENTED | `apps/mobile/src/app/navigation/authorization.ts` |
| MOB-FN-023 | fn | `redirectForDeniedVehicleAccess` | Fail-closed redirect target | IMPLEMENTED | `apps/mobile/src/app/navigation/authorization.ts` |
| MOB-FN-024 | fn | `applyVehicleAccessRequest` | Guarded entitlement request (no verify bypass) | IMPLEMENTED | `apps/mobile/src/app/navigation/authorization.ts` |
| MOB-FN-025 | wrapper | `defaultRouteForState` | Lifecycle → route (re-exports policy) | IMPLEMENTED | `apps/mobile/src/app/navigation/routePolicy.ts` |
| MOB-FN-030 | hook | `useVehicleTelemetryGuard` | Client redirect off protected tabs | IMPLEMENTED | `apps/mobile/src/app/navigation/useVehicleAccessGuard.tsx` |
| MOB-FN-031 | hook | `useRevocationWatcher` | Session downgrade while on protected screen | IMPLEMENTED | `apps/mobile/src/app/navigation/useVehicleAccessGuard.tsx` |
| MOB-FN-040 | class | `MockAuthRepository` | Dev-only auth validation (no network) | IMPLEMENTED | `apps/mobile/src/data/repositories/MockAuthRepository.ts` |
| MOB-FN-050 | component | `RootNavigationLayout` | Root stack shell | IMPLEMENTED | `apps/mobile/src/app/navigation/RootNavigationLayout.tsx` |
