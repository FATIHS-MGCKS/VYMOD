# client-mobile — FUNCTION_CATALOG

Consumer mobile app — **not** production authorization (client-side P1 guards only).

| ID | Kind | Name | Responsibility | Source | Inputs | Outputs / failure | Side effects | Security / privacy | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MOB-FN-001 | export | `createRuntimeI18nAdapter` | ICU runtime `t()` for UI | `apps/mobile/src/localization/runtimeI18nAdapter.ts` | locale id | `{ t, formatDate, formatNumber }` | reads root catalogs | product copy only | mobile.foundation.test.tsx | ACTIVE |
| MOB-FN-010 | hook | `useSession` | Mock session API (guarded transitions) | `apps/mobile/src/state/SessionProvider.tsx` | React context | session + actions | in-memory only | no network/tokens | SessionProvider.test.tsx | ACTIVE |
| MOB-FN-011 | hook | `useTranslation` | Typed translation API | `apps/mobile/src/localization/I18nProvider.tsx` | message keys | localized string | throws without provider | product copy only | mobile.foundation.test.tsx | ACTIVE |
| MOB-FN-020 | export | `defaultRouteForSession` | Session default route | `apps/mobile/src/app/navigation/authorization.ts` | `SessionSnapshot` | route href | none | client policy only | authorization.test.ts | ACTIVE |
| MOB-FN-021 | export | `canAccessVehicleTelemetryViews` | Telemetry gate | `apps/mobile/src/app/navigation/authorization.ts` | session | boolean | none | fail-closed client guard | authorization.test.ts | ACTIVE |
| MOB-FN-022 | export | `canAccessVehicleId` | Vehicle ID scope | `apps/mobile/src/app/navigation/authorization.ts` | session, vehicleId | boolean | none | entitled ID only | authorization.test.ts | ACTIVE |
| MOB-FN-023 | export | `redirectForDeniedVehicleAccess` | Denied-route redirect | `apps/mobile/src/app/navigation/authorization.ts` | session | route href | none | client policy only | authorization.test.ts | ACTIVE |
| MOB-FN-024 | export | `applyVehicleAccessRequest` | Guarded entitlement request | `apps/mobile/src/app/navigation/authorization.ts` | session, reference | next session or null | no verify bypass | client guard only | authorization.test.ts | ACTIVE |
| MOB-FN-025 | export | `defaultRouteForState` | Lifecycle → route wrapper | `apps/mobile/src/app/navigation/routePolicy.ts` | lifecycle | route href | none | client policy only | authorization.test.ts | ACTIVE |
| MOB-FN-030 | hook | `useVehicleTelemetryGuard` | Redirect off protected tabs | `apps/mobile/src/app/navigation/useVehicleAccessGuard.tsx` | session | navigation redirect | client only | not production authZ | router.integration.test.tsx | ACTIVE |
| MOB-FN-031 | hook | `useRevocationWatcher` | Revocation while viewing tab | `apps/mobile/src/app/navigation/useVehicleAccessGuard.tsx` | session | profile redirect | client only | not production authZ | router.integration.test.tsx | ACTIVE |
| MOB-FN-040 | class | `MockAuthRepository` | Local auth validation | `apps/mobile/src/data/repositories/MockAuthRepository.ts` | credentials | validation result | no HTTP | no secrets stored | mobile.foundation.test.tsx | ACTIVE |
| MOB-FN-050 | export | `RootNavigationLayout` | Root Expo stack shell | `apps/mobile/src/app/navigation/RootNavigationLayout.tsx` | children | layout | none | N/A | router.integration*.test.tsx | ACTIVE |
