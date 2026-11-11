# Governance — FUNCTION_CATALOG

| ID | Name | Responsibility | Source | Status | Validation |
| --- | --- | --- | --- | --- | --- |
| GOV-FN-001 | `run-all` | Orchestrate governance checks | `tools/governance/run-all.mjs` | ACTIVE | `npm run validate` |
| GOV-FN-002 | `checkModuleRegistry` | Parse `MODULE_REGISTRY.md` | `tools/governance/checks/module-registry.mjs` | ACTIVE | unit tests |
| GOV-FN-003 | `checkI18n` | Locale schema/ICU parity | `tools/governance/checks/i18n.mjs` | ACTIVE | unit tests |
| GOV-FN-004 | `analyzeJsxSource` | Hardcoded UI detection | `tools/governance/lib/jsx-hardcoded.mjs` | ACTIVE | hardcoded-ui tests |
| GOV-FN-005 | `checkModuleAuthority` | Module authority file gates | `tools/governance/checks/module-authority.mjs` | ACTIVE | module-authority tests |
| GOV-FN-006 | `validateKnowledgeGraph` | YAML graph integrity | `tools/governance/lib/knowledge-graph.mjs` | ACTIVE | graph tests |

Personal data: validators process repository content only (no end-user vehicle data).  
Authorization: local/CI execution; no production secrets.
