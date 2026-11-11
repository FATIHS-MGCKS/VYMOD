# VYMOD Module Authority Standard

| Field | Value |
| --- | --- |
| **Standard version** | 1.0 |
| **Validation status** | PROPOSED (elevates with AUTHORITY_ACTIVE modules) |
| **Scope** | VYMOD module authorities under `architecture/modules/<id>/` |

Companion documents: [`MASTER_ARCHITECTURE.md`](./MASTER_ARCHITECTURE.md), [`MODULE_REGISTRY.md`](./MODULE_REGISTRY.md), root [`AGENTS.md`](../AGENTS.md).

## 1. Status dimensions (do not conflate)

### IMPLEMENTATION_STATUS (registry field `Status`)

`PLANNED` | `SCAFFOLD` | `ACTIVE` | `DEPRECATED` — describes **code/runtime** maturity.

### REGISTRY_COVERAGE_STATUS

`NOT_STARTED` | `AUDIT_IN_PROGRESS` | `AUTHORITY_ACTIVE` | `SUPERSEDED` — describes **documentation authority** readiness.

### EPISTEMIC_STATUS (claims in authority docs / graph nodes)

`CONFIRMED` | `INFERRED` | `HISTORICAL` | `UNKNOWN` | `CONTRADICTED`

### VALIDATION_STATUS (claims about tests, validators, production checks)

`PROPOSED` | `EXPERIMENTAL` | `VALIDATED` | `PRODUCTION_VALIDATED` | `REJECTED` | `SUPERSEDED`

**Promotion rule:** existence of files or green CI does **not** auto-promote to `AUTHORITY_ACTIVE`.

## 2. Mandatory authority files (`AUTHORITY_ACTIVE`)

| Path | Purpose |
| --- | --- |
| `README.md` | TOC and boundaries |
| `AUDIT_MANIFEST.md` | Audit scope matrix |
| `CURRENT_STATE.md` | Implementation snapshot |
| `AGENT_CONTRACT.md` | Module-specific agent rules |
| `KNOWLEDGE_GRAPH.md` | Human graph summary |
| `FUNCTION_CATALOG.md` | Stable interfaces / validators |
| `graph/schema.yaml` | Graph schema |
| `graph/nodes.yaml` | Nodes |
| `graph/edges.yaml` | Edges |
| `graph/invariants.yaml` | Invariants |
| `decisions/DECISION_REGISTER.md` | Decisions |
| `evidence/EVIDENCE_INDEX.md` | Evidence index |
| `evidence/PRODUCTION_BASELINE.md` | Production baseline |
| `contradictions/KNOWLEDGE_GAPS.md` | Gaps |
| `contradictions/OPEN_CONTRADICTIONS.md` | Contradictions |
| `research/CHANGE_LEDGER.md` | Append-only changes |
| `research/FAILED_APPROACHES.md` | Rejected approaches |
| `research/OPEN_HYPOTHESES.md` | Hypotheses |
| `research/OPEN_QUESTIONS.md` | Questions |

`AUDIT_IN_PROGRESS` minimum: `README.md`, `AUDIT_MANIFEST.md`, `research/CHANGE_LEDGER.md`.

`NOT_STARTED`: inventory in `MODULE_REGISTRY.md` only (`Authority path: —`).

## 3. Production baseline (VYMOD P0)

Consumer product **not deployed**. For non-runtime modules use `PRODUCTION_NOT_APPLICABLE` in `PRODUCTION_BASELINE.md`. Do not invent production telemetry.

## 4. FUNCTION_CATALOG.md

Catalog **architecturally important** exports only (validators, public APIs, CLI entrypoints). Mark `NOT_IMPLEMENTED` without fabricated paths.

## 5. CHANGE_LEDGER.md (append-only)

Each substantive change adds an entry with (validated on latest entry when `AUTHORITY_ACTIVE`):

| Field | Required |
| --- | --- |
| **Date** | yes |
| **PR** | yes |
| **Code baseline** | yes (known commit or explicit pending — never fabricated merge SHA) |
| **Affected components** | yes |
| **BEFORE** / **WHY** / **CHANGE** | yes |
| **EXPECTED_EFFECT** / **VALIDATION** / **OBSERVED_EFFECT** | yes |
| **NON_EFFECTS** / **TRADEOFFS** / **REMAINING_GAPS** | yes |
| **Evidence** | yes |
| **Validation status** | yes (do not claim `PRODUCTION_VALIDATED` without evidence) |

## 6. Knowledge graph rules

- Module-prefixed stable IDs (`GOV-*`, `I18N-*`)
- Node/edge referential integrity; `source_paths` must exist when marked CONFIRMED
- Graph reflects **documented** architecture, not invented runtime

Validation: `node tools/governance/checks/module-authority.mjs` (included in `npm run validate`).

## 7. Promotion gates to `AUTHORITY_ACTIVE`

1. All mandatory files present and internally consistent
2. `CURRENT_STATE.md` matches inspectable repository evidence
3. Graph validator passes
4. `FUNCTION_CATALOG.md` lists verified symbols or explicit NOT_IMPLEMENTED
5. Registry updated in same PR with justified coverage transition
