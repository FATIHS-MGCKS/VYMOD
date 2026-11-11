# client-mobile — CHANGE_LEDGER (append-only)

> **Note:** P0 governance validator history is recorded under `architecture/modules/governance/research/CHANGE_LEDGER.md`. Earlier copies mistakenly duplicated those entries here; they are superseded by the records below.

## CHG-MOB-2026-11-11-P1-001

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #3 |
| **Code baseline** | `9180b01979411ee72be2d92cddd6248939c80e12` (pre-closeout head) |
| **Affected components** | `apps/mobile/*`, client-mobile authority, CI mobile job |
| **BEFORE** | No mobile app; registry `NOT_STARTED` |
| **WHY** | VYMOD P1 executable mobile foundation |
| **CHANGE** | Expo SDK 58 app, screens, design system, mock session, component tests, JS export CI |
| **EXPECTED_EFFECT** | Runnable dev app; governance + mobile CI green |
| **VALIDATION** | `npm run validate`, `npm run test:all`, `expo export` |
| **OBSERVED_EFFECT** | CONFIRMED on PR #3 CI (4/4 checks) pre-architect closeout |
| **NON_EFFECTS** | No production deploy; no Core/SYNQDRIVE/DIMO |
| **TRADEOFFS** | Client-only route guards |
| **REMAINING_GAPS** | `AUDIT_IN_PROGRESS`; server authZ; native store builds |
| **Evidence** | MOB-EVID-001, MOB-EVID-002 |
| **Validation status** | CONFIRMED |

## CHG-MOB-2026-11-11-P1-002

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #3 |
| **Code baseline** | TBD (post closeout commit on `cursor/vymod-p1-mobile-foundation-1e89`) |
| **Affected components** | `authorization.ts`, router layouts/guards, client-mobile authority, Jest router project |
| **BEFORE** | Weaker route policy; mocked-router-only tests; copied governance authority text |
| **WHY** | P1 security/navigation architect closeout (H1–H4) |
| **CHANGE** | Fail-closed vehicle/session policy; Expo Router integration tests; factual module authority; de-DE default, AGENTS.md, EAS placeholder removed |
| **EXPECTED_EFFECT** | Negative tests prove deep links and revocation; authority graph validates |
| **VALIDATION** | `npm ci`, `npm run validate`, `npm test`, `npm run test:mobile`, typecheck, lint, expo-doctor, iOS/Android export |
| **OBSERVED_EFFECT** | pending CI on final commit |
| **NON_EFFECTS** | No merge/deploy; no live auth |
| **TRADEOFFS** | Router integration isolated per test file due to global navigation ref |
| **REMAINING_GAPS** | Production entitlement API; Link back navigation not covered in router harness |
| **Evidence** | MOB-EVID-001, MOB-EVID-002, MOB-EVID-003 |
| **Validation status** | PROPOSED |

## CHG-MOB-2026-11-11-P1-003

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #3 |
| **Code baseline** | `6733e6cfa506a260396617feef9156e1ae4b1ae1` (pre-hygiene head) |
| **Affected components** | Jest harness, SessionProvider, client-mobile FUNCTION_CATALOG |
| **BEFORE** | Router test act warnings; public `replaceSession`; non-standard catalog table |
| **WHY** | P1 final test hygiene and mock boundary closeout |
| **CHANGE** | IS_REACT_ACT_ENVIRONMENT; integration +not-found route; session remount bridge; remove replaceSession; catalog P0A columns; setDevScenario regression test |
| **EXPECTED_EFFECT** | Cleaner CI logs; no unguarded mock session API in app context |
| **VALIDATION** | `npm ci`, `npm run validate`, `npm run test:mobile` |
| **OBSERVED_EFFECT** | pending CI on final commit |
| **NON_EFFECTS** | No product features; no merge |
| **TRADEOFFS** | Router revocation uses provider remount key |
| **REMAINING_GAPS** | Optional Expo Router Link back-path coverage |
| **Evidence** | MOB-EVID-001, MOB-EVID-002 |
| **Validation status** | PROPOSED |
