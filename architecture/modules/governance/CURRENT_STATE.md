# Governance — CURRENT_STATE

**Last verified repository SHA:** pending P0A PR merge (see CHANGE_LEDGER)  
**Production baseline:** `PRODUCTION_NOT_APPLICABLE` (no VYMOD consumer deployment)

## Implemented (CONFIRMED)

| Area | Evidence |
| --- | --- |
| Agent contract | `AGENTS.md` |
| Master routing | `architecture/MASTER_ARCHITECTURE.md` |
| Validators | `tools/governance/run-all.mjs`, `checks/*.mjs` |
| CI | `.github/workflows/governance.yml` (gitleaks + validate + test) |
| Compliance docs | `compliance/`, `standards/` |
| Cursor rules | `.cursor/rules/*.mdc` |

## Validator gates (CONFIRMED)

- required-files, cursor-rules, doc-links, module-registry, i18n parity/ICU
- hardcoded-ui (jsx/tsx when app tree exists — currently SKIP)
- secrets (regex + gitleaks in CI), dependency-audit (npm audit with lockfile)
- typecheck SKIP until app TypeScript exists
- module-authority + knowledge graph (P0A)

## Not implemented

- Application runtime, SYNQDRIVE live client, DIMO adapter, production deploy

## Drift risks

- Registry coverage vs partial authorities for PLANNED modules (intentional `NOT_STARTED`)
