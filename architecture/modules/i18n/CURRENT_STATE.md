# i18n — CURRENT_STATE

**Production:** `PRODUCTION_NOT_APPLICABLE`

## CONFIRMED

- Locales: `de-DE` (initial product language), `en-US`
- Files: `i18n/locales/*.json`, `i18n/catalog.schema.json`
- Validator: `tools/governance/checks/i18n.mjs` + `lib/icu.mjs`
- Hardcoded UI gate (when app exists): `lib/jsx-hardcoded.mjs`

## PLANNED

- Runtime adapter binding catalogs to UI framework
- Legal string review metadata file

## Personal data

Catalog strings are product copy only; no user PII in P0 catalogs.
