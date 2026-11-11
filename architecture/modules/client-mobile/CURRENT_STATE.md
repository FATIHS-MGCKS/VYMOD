# client-mobile — CURRENT_STATE

| Field | Value |
| --- | --- |
| Phase | P1 mobile foundation (runtime route-root correction on PR #3) |
| Implementation status | `SCAFFOLD` (navigable dev shell; not production-hardened) |
| Registry coverage | `AUDIT_IN_PROGRESS` |
| Production | `NOT_DEPLOYED` |
| Platforms | iOS, Android (Expo SDK 58, single codebase) |
| Expo route root | `apps/mobile/app/` (no `src/app/` collision) |

## Implemented (P1)

- Expo Router screens under `apps/mobile/app/`; policy/providers under `src/navigation/`, `src/providers/`
- Fail-closed client guards, mock session, design system, root-catalog i18n
- Jest: 30 mobile tests (unit + router integration)
- Governance `expo-route-root` gate + CI export log verification

## Not implemented (by design)

- Production authentication, entitlement API, native store release builds, DIMO/SYNQDRIVE

## Evidence

- Tests: `apps/mobile/src/testing/`, `apps/mobile/src/navigation/authorization.test.ts`
- Route root: `tools/governance/checks/expo-route-root.mjs`
- CI: `governance.yml` mobile job
