# client-mobile — CURRENT_STATE

| Field | Value |
| --- | --- |
| Phase | P1 mobile foundation |
| Implementation status | `SCAFFOLD` → `ACTIVE` (in PR) |
| Registry coverage | `AUDIT_IN_PROGRESS` |
| Production | `NOT_DEPLOYED` |
| Platforms | iOS, Android (single codebase) |

## Implemented (P1)

- Expo Router navigation: public auth, onboarding, tabbed app shell, vehicle detail route
- Design tokens + core components (`AppScreen`, `AppText`, `AppButton`, …)
- Session lifecycle model with mock repositories (no HTTP / SYNQDRIVE / DIMO)
- Root catalog i18n runtime adapter (`apps/mobile/src/localization/`)
- Preferences: locale, theme (AsyncStorage, non-sensitive only)
- Jest + React Native Testing Library (20 scenarios)

## Not implemented (by design)

- Production authentication, email delivery, vehicle approval API, telemetry, map, vehicle commands

## Evidence

- Mobile tests: `apps/mobile/src/testing/mobile.foundation.test.tsx`
- Expo JS exports (CI/local): `expo export --platform ios|android`
