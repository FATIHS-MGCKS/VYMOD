# client-mobile — AGENT_CONTRACT

1. Application routes and layouts live under `apps/mobile/app/` (Expo Router file-based routing).
2. Never create `apps/mobile/src/app/` (Expo Router precedence). Routes stay in `apps/mobile/app/`; policy lives in `src/navigation/authorization.ts` (**client-side P1 dev controls only**).
3. Do not add live auth tokens, SYNQDRIVE/DIMO calls, vehicle commands, or backend APIs in this module without a new ADR.
4. Copy and strings must come from root `i18n/locales/*` via `apps/mobile/src/localization/` (default/fallback `de-DE` unless user overrides).
5. Substantive navigation, session, or test harness changes require updates to `FUNCTION_CATALOG.md`, `EVIDENCE_INDEX.md`, and `research/CHANGE_LEDGER.md`.
6. Prefer `expo-router/testing-library` integration tests for navigation security; do not globally mock `expo-router` in those suites.
