# Governance — AUDIT_MANIFEST

| Phase | Status | Notes |
| --- | --- | --- |
| Repository audit | CONFIRMED | P0 merged to `main` |
| Production VPS audit | PRODUCTION_NOT_APPLICABLE | Not deployed |
| Authority bootstrap | CONFIRMED | P0A creates `architecture/modules/governance/` |
| Graph validator | VALIDATED | CI via `npm test` |

| Surface | Audited | Evidence |
| --- | --- | --- |
| Validators | Yes | `tools/governance/` |
| Workflows | Yes | `.github/workflows/governance.yml` |
| Module registry | Yes | `architecture/MODULE_REGISTRY.md` |
