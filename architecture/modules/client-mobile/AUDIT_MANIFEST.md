# Governance — AUDIT_MANIFEST

| Phase | Status | Notes |
| --- | --- | --- |
| Repository audit | CONFIRMED | P0 merged to main (`7f4f584…`); P0A on PR #2 |
| Production VPS audit | PRODUCTION_NOT_APPLICABLE | Not deployed |
| Authority promotion | CONFIRMED | `AUTHORITY_ACTIVE` with mandatory file gate |
| Graph registry | VALIDATED | `id_prefix` from `graph/schema.yaml` |
| Function catalog | VALIDATED | Export/cli symbol checks (regex-based) |

| Evidence | ID | Path |
| --- | --- | --- |
| Unit tests | MOB-EVID-001 | `tools/client-mobile/tests/` |
| CI workflow | MOB-EVID-002 | `.github/workflows/client-mobile.yml` |
