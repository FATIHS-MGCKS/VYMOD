# client-mobile — AUDIT_MANIFEST

| Phase | Status | Notes |
| --- | --- | --- |
| Repository audit | CONFIRMED | P1 mobile foundation on PR #3 (`apps/mobile/`) |
| Production VPS audit | PRODUCTION_NOT_APPLICABLE | App not deployed; no live telemetry/auth |
| Authority promotion | AUDIT_IN_PROGRESS | Registry `AUDIT_IN_PROGRESS` until review promotes |
| Graph registry | VALIDATED | `MOB-` prefix from `graph/schema.yaml` |
| Function catalog | VALIDATED | Regex symbol checks against `apps/mobile/src` |

| Evidence | ID | Path |
| --- | --- | --- |
| Mobile Jest suites | MOB-EVID-001 | `apps/mobile/src/testing/*.test.tsx`, `apps/mobile/src/app/navigation/authorization.test.ts` |
| CI mobile job | MOB-EVID-002 | `.github/workflows/governance.yml` (`jobs.mobile`) |
