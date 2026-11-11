# Module authority — `i18n`

| Field | Value |
| --- | --- |
| **Implementation status** | `ACTIVE` (catalogs + validators) |
| **Registry coverage status** | `AUTHORITY_ACTIVE` |
| **Authority path** | `architecture/modules/i18n/` |
| **Owner** | `@vymod-client` |

## What this module owns

Framework-agnostic locale catalogs (`i18n/locales/`), adapter contract (`i18n/ADAPTER.md`), and validation via `checkI18n` / ICU parity.

## What it does not own

- UI framework selection (PLANNED)
- Backend API localization (future `api-gateway`)
- Legal authoritative text (requires separate legal-review metadata when introduced)

## Mandatory entry documents

| Document | Purpose |
| --- | --- |
| [CURRENT_STATE.md](./CURRENT_STATE.md) | Catalogs and validators |
| [FUNCTION_CATALOG.md](./FUNCTION_CATALOG.md) | Validator functions |
| [research/CHANGE_LEDGER.md](./research/CHANGE_LEDGER.md) | Changes |

## Validation

```bash
npm run validate:i18n
npm test
```

Standards: `standards/I18N.md`, `i18n/ADAPTER.md`.
