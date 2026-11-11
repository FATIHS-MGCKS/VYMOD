# client-mobile — EVIDENCE_INDEX

| ID | Summary | Source type | Path |
| --- | --- | --- | --- |
| MOB-EVID-001 | Mobile Jest (authorization, session boundary, components, router integration) | CURRENT_TEST | `apps/mobile/src/navigation/authorization.test.ts`, `apps/mobile/src/state/SessionProvider.test.tsx`, `apps/mobile/src/testing/*.test.tsx` |
| MOB-EVID-002 | CI mobile job (typecheck, lint, tests, expo-doctor, exports, route-root gate) | CURRENT_CODE | `.github/workflows/governance.yml` (`jobs.mobile`) |
| MOB-EVID-003 | P1 client guard implementation | CURRENT_CODE | `apps/mobile/src/navigation/authorization.ts`, `apps/mobile/src/navigation/useVehicleAccessGuard.tsx` |
| MOB-EVID-004 | Expo route root integrity validator | CURRENT_TEST | `tools/governance/checks/expo-route-root.mjs`, `tools/governance/tests/expo-route-root.test.mjs` |
| MOB-EVID-005 | Verified Expo export route root (`app/`, not `src/app/`) | CURRENT_CODE | CI export logs (`governance.yml` mobile job) |
