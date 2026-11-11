# i18n — FUNCTION_CATALOG

| ID | Kind | Name | Responsibility | Source | Inputs | Outputs / failure | Side effects | Security / privacy | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I18N-FN-001 | export | `validateI18nCatalogs` | Schema, ICU, parity | `tools/governance/checks/i18n.mjs` | locale maps | `{ok, errors}` | none | product copy only; no user PII | i18n-negative.test.mjs | ACTIVE |
| I18N-FN-002 | export | `parseIcuMessage` | ICU placeholder extraction | `tools/governance/lib/icu.mjs` | message string | placeholders or parse error | none | N/A | icu-placeholders.test.mjs | ACTIVE |
| I18N-FN-003 | export | `analyzeJsxSource` | Hardcoded UI strings (shared lib) | `tools/governance/lib/jsx-hardcoded.mjs` | TSX string | violations | none | N/A | hardcoded-ui.test.mjs | ACTIVE |
| I18N-FN-004 | export | `checkI18n` | CI gate wrapper | `tools/governance/checks/i18n.mjs` | disk locales | validator result | none | N/A | i18n.test.mjs | ACTIVE |
| I18N-FN-099 | export | `runtimeI18nAdapter` | UI runtime adapter | `apps/mobile/src/localization/runtimeI18nAdapter.ts` | locale id | `{ t, formatDate, formatNumber }` | reads root catalogs | product copy only | mobile.foundation.test.tsx | ACTIVE |
