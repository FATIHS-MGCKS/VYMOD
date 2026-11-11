# i18n — CHANGE_LEDGER (append-only)

## CHG-I18N-2026-11-11-HARDEN-001

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | merged via main (P0 governance merge) |
| **Code baseline** | see `main` history — `tools/governance/lib/icu.mjs`, `jsx-hardcoded.mjs` |
| **Affected components** | ICU parser, JSX attribute hardcoded detection |
| **BEFORE** | Regex-only ICU placeholders; file-wide i18n bypass |
| **WHY** | P0 governance hardening review |
| **CHANGE** | ICU MessageFormat validation; per-attribute JSX checks |
| **EXPECTED_EFFECT** | CI rejects mixed hardcoded + translated UI |
| **VALIDATION** | `npm test` (icu-placeholders, hardcoded-ui tests) |
| **OBSERVED_EFFECT** | CONFIRMED in repository tests |
| **NON_EFFECTS** | No UI runtime |
| **TRADEOFFS** | JSX-only; Vue unsupported |
| **REMAINING_GAPS** | Runtime adapter NOT_IMPLEMENTED |
| **Evidence** | I18N-EVID-001 |
| **Validation status** | VALIDATED (repository tests only) |

## CHG-I18N-2026-11-11-P0A-001

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #2 (open) |
| **Code baseline** | `7f4f58430752f41829a02ea60f269b5a343a8c9e` |
| **Affected components** | `architecture/modules/i18n/` authority |
| **BEFORE** | Catalogs without module authority |
| **WHY** | P0A module authority foundation |
| **CHANGE** | Bootstrap authority, graph, FUNCTION_CATALOG |
| **EXPECTED_EFFECT** | Agents read module README before i18n changes |
| **VALIDATION** | `npm run validate:i18n`, `npm test` |
| **OBSERVED_EFFECT** | pending final CI on PR #2 |
| **NON_EFFECTS** | No production UI |
| **TRADEOFFS** | — |
| **REMAINING_GAPS** | I18N-FN-099 runtime adapter NOT_IMPLEMENTED |
| **Evidence** | I18N-EVID-001 |
| **Validation status** | PROPOSED |

## CHG-I18N-2026-11-11-P0A-002

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #2 (open) |
| **Code baseline** | `7fa00a88a789ec7a3761a94ae4e9bceb3673ebe7` |
| **Affected components** | FUNCTION_CATALOG metadata, change ledger completeness |
| **BEFORE** | Thin catalog rows; incomplete ledger fields |
| **WHY** | P0A final authority hardening |
| **CHANGE** | Expanded FUNCTION_CATALOG; ledger field compliance |
| **EXPECTED_EFFECT** | module-authority validator enforces catalog + ledger |
| **VALIDATION** | `npm run validate` |
| **OBSERVED_EFFECT** | pending |
| **NON_EFFECTS** | Does not prove future app authZ |
| **TRADEOFFS** | — |
| **REMAINING_GAPS** | Runtime adapter |
| **Evidence** | I18N-EVID-001 |
| **Validation status** | PROPOSED |
