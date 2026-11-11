# Governance — FUNCTION_CATALOG

Governance validators only — **not** consumer application authorization.

| ID | Kind | Name | Responsibility | Source | Inputs | Outputs / failure | Side effects | Security | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GOV-FN-001 | cli | `npm run validate` | Orchestrate governance checks | `tools/governance/run-all.mjs` | argv, env | exit 0/1 | none | reads repo only; no secrets | `npm test` | ACTIVE |
| GOV-FN-002 | export | `checkModuleRegistry` | Parse `MODULE_REGISTRY.md` | `tools/governance/checks/module-registry.mjs` | repo files | `{status, errors}` fail on invalid registry | none | untrusted markdown only | module-registry.test.mjs | ACTIVE |
| GOV-FN-003 | export | `checkI18n` | Locale schema/ICU parity | `tools/governance/checks/i18n.mjs` | locale JSON | fail on invalid catalogs | none | no PII processing | i18n*.test.mjs | ACTIVE |
| GOV-FN-004 | export | `analyzeJsxSource` | Hardcoded UI detection | `tools/governance/lib/jsx-hardcoded.mjs` | TSX source string | violations list | none | N/A | hardcoded-ui.test.mjs | ACTIVE |
| GOV-FN-005 | export | `checkModuleAuthority` | Module authority gates | `tools/governance/checks/module-authority.mjs` | registry + authorities | fail on authority gaps | none | N/A | module-authority.test.mjs | ACTIVE |
| GOV-FN-006 | export | `validateKnowledgeGraph` | YAML graph integrity | `tools/governance/lib/knowledge-graph.mjs` | authority path | `{ok, errors}` | none | N/A | module-authority.test.mjs | ACTIVE |
| GOV-FN-007 | export | `validateFunctionCatalog` | Function catalog integrity | `tools/governance/lib/function-catalog.mjs` | FUNCTION_CATALOG.md | `{ok, errors}` | none | N/A | module-authority-hardening.test.mjs | ACTIVE |
| GOV-FN-008 | export | `validateGraphNamespaceRegistry` | Unique graph `id_prefix` registry | `tools/governance/lib/module-graph-meta.mjs` | active modules | fail on duplicate prefix | none | N/A | module-authority-hardening.test.mjs | ACTIVE |
