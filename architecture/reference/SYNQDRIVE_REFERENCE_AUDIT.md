# SYNQDRIVE-alpha Reference Audit (read-only)

**Date:** 2026-11-11  
**Repository:** `FATIHS-MGCKS/SYNQDRIVE-alpha` (public, read-only clone)  
**Epistemic status:** CONFIRMED for file existence; INFERRED for reuse recommendations

## Inspected reference artifacts (CONFIRMED)

| Artifact | Role |
| --- | --- |
| `AGENTS.md` | Architecture-first routing; registry coverage status table; production deploy (SYNQDRIVE-specific) |
| `architecture/SYNQDRIVE_RENTAL_ARCHITECTURE.md` | Central registry + master architecture entry |
| `architecture/MODULE_AUTHORITY_STANDARD.md` | Audit phases, mandatory files, status dimensions |
| `.cursor/rules/Architectur-Updates.mdc` | Mandatory registry sync on architecture changes |
| `architecture/scripts/validate-module-registry.mjs` | Table-based registry validator (Node) |
| `architecture/internationalization/` | Representative authority: graphs, CHANGE_LEDGER, AGENT_CONTRACT |

## Mechanisms adapted for VYMOD

- Separate **implementation status** vs **registry coverage status**
- Module authority directory with graph YAML + append-only CHANGE_LEDGER
- Central `MASTER_ARCHITECTURE.md` routing agents to module authorities
- Executable registry + graph validators integrated with existing `npm run validate`

## SYNQDRIVE-specific (not copied)

- NestJS backend / Vite frontend layout and production VPS deploy runbooks
- Rental/tank-stop/vehicle-domain modules and Production VPS read-only audit gates
- 9-locale product contract and frontend `LanguageContext` implementation details
- `audit-campaign/` historical slices as default authority

## Representative module patterns

| Module path | Takeaway for VYMOD |
| --- | --- |
| `architecture/internationalization/` | README as TOC; graph `schema.yaml` with ID prefixes; validate-graph scripts |
| `architecture/drivingintelligence/` | Deep domain CURRENT_STATE (not replicated — no VYMOD runtime) |
| `architecture/vehicle-onboarding/` | Integration boundary documentation style |
| `architecture/tankstellenerkennung/` | Structural reference cited in MODULE_AUTHORITY_STANDARD |

## Limitations

- Full SYNQDRIVE validator (~1600 lines) not vendored verbatim; VYMOD implements a smaller validator suited to markdown `##` module blocks and YAML graphs.
- No SYNQDRIVE repository modifications performed.
