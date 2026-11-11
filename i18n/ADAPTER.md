# i18n Adapter Contract

Catalog format is **framework-independent JSON** until a UI stack is chosen.

## File layout

```
i18n/
  catalog.schema.json   # optional JSON Schema for editors
  locales/
    de-DE.json
    en-US.json
```

## Key rules

- Keys use dot notation: `app.name`, `errors.network.timeout`
- Values are strings; ICU plural forms allowed: `{count, plural, one {# Fahrzeug} other {# Fahrzeuge}}`
- Placeholders use `{name}` style; **same placeholder set** in every locale for a key

## Runtime adapter (PLANNED)

Implementations must:

1. Load locale by BCP 47 tag (`de-DE`, `en-US`)
2. Fail build/CI if required locale missing a key
3. Format dates/numbers via `Intl` or equivalent
4. Persist user language and unit preferences independently

## Legal strings

Optional metadata file (future): `i18n/legal-status.json` mapping keys to `PENDING_LEGAL_REVIEW` | `APPROVED`.
