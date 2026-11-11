# Governance — CHANGE_LEDGER (append-only)

## CHG-GOV-2026-11-11-P0A-001

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #2 (open) |
| **Code baseline** | `7f4f58430752f41829a02ea60f269b5a343a8c9e` (main at bootstrap) |
| **Affected components** | MASTER_ARCHITECTURE, module authorities, module-authority validator |
| **BEFORE** | P0 flat `architecture/` without per-module authorities |
| **WHY** | SYNQDRIVE-style persistent module memory for agents |
| **CHANGE** | Add governance authority, graph, FUNCTION_CATALOG, module-authority validator |
| **EXPECTED_EFFECT** | Agents route through MASTER_ARCHITECTURE and module READMEs |
| **VALIDATION** | `npm run validate`, `npm test` |
| **OBSERVED_EFFECT** | CI pass on PR #2 (34/34 tests pre-hardening) |
| **NON_EFFECTS** | No application runtime; no Core integration; no production deploy |
| **TRADEOFFS** | Shorter graph validator vs SYNQDRIVE full semantic checks |
| **REMAINING_GAPS** | Planned modules remain `NOT_STARTED` authorities |
| **Evidence** | GOV-EVID-001, GOV-EVID-002 |
| **Validation status** | PROPOSED |

## CHG-GOV-2026-11-11-P0A-002

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #2 (open) |
| **Code baseline** | `7fa00a88a789ec7a3761a94ae4e9bceb3673ebe7` (pre-hardening PR head) |
| **Affected components** | module-graph-meta, knowledge-graph, function-catalog validators |
| **BEFORE** | Hardcoded GOV-/I18N- graph prefix map |
| **WHY** | Independent architecture review — dynamic module registration |
| **CHANGE** | Derive `id_prefix` from `graph/schema.yaml`; strengthen graph and FUNCTION_CATALOG validation |
| **EXPECTED_EFFECT** | New AUTHORITY_ACTIVE modules register via schema only |
| **VALIDATION** | `npm run validate`, `npm test`, negative regression tests |
| **OBSERVED_EFFECT** | pending CI on final commit |
| **NON_EFFECTS** | No merge; no production validation |
| **TRADEOFFS** | Export symbol check is regex-based, not full typechecker |
| **REMAINING_GAPS** | Diff-to-module auto-sync remains REVIEW_REQUIRED |
| **Evidence** | GOV-EVID-001 |
| **Validation status** | PROPOSED |

## CHG-GOV-2026-11-11-P0A-003

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #2 (open) |
| **Code baseline** | `13ced3c912fda9c591232ab74f757b0afef6b1d5` |
| **Affected components** | `module-authority-hardening.test.mjs`, change-ledger validator, validator DI options |
| **BEFORE** | Misleading negative tests; incomplete change-ledger field gate |
| **WHY** | P0A negative evidence closeout |
| **CHANGE** | Real fixture-based negative tests; `validateChangeLedgerText` required fields |
| **EXPECTED_EFFECT** | CI proves validators reject malformed authority data |
| **VALIDATION** | `npm test`, `npm run validate` |
| **OBSERVED_EFFECT** | pending CI on final commit |
| **NON_EFFECTS** | No architecture redesign; no product code |
| **TRADEOFFS** | Temp-dir fixtures only in tests |
| **REMAINING_GAPS** | Full TS export verification still REVIEW_REQUIRED |
| **Evidence** | GOV-EVID-001 |
| **Validation status** | PROPOSED |

## CHG-GOV-2026-11-11-P1-001

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | TBD (P1 mobile foundation) |
| **Code baseline** | `d2d0ec0aae4e05d6f67d46d854552e65e46732c0` |
| **Affected components** | root `package.json` workspaces, `tsconfig.json`, `.github/workflows/governance.yml` |
| **BEFORE** | typecheck/hardcoded-ui active but no app TS |
| **WHY** | P1 introduces apps/mobile TSX |
| **CHANGE** | Workspace scripts, mobile CI job, root typecheck |
| **EXPECTED_EFFECT** | Gates execute on mobile sources |
| **VALIDATION** | `npm run validate`, CI |
| **OBSERVED_EFFECT** | CONFIRMED locally |
| **NON_EFFECTS** | Validator logic unchanged |
| **TRADEOFFS** | — |
| **REMAINING_GAPS** | — |
| **Evidence** | GOV-EVID-001 |
| **Validation status** | PROPOSED |
