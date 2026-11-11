# ADR-P1-004: Mobile i18n runtime integration

## Context

Authoritative catalogs remain at `i18n/locales/` per P0.

## Decision

`createRuntimeI18nAdapter` loads root JSON, uses `intl-messageformat`, throws on missing keys, persists user locale preference.

## Alternatives

- Duplicate mobile-only JSON (rejected)
- Non-ICU library (rejected: breaks plural/rules in catalogs)

## Consequences

Catalog keys normalized to lowercase segment pattern for schema gate.

## Security / privacy

No PII in catalogs; legal copy placeholders only.

## Validation

Parity gate, ICU tests, language switch UI test.

## Unresolved

RTL translations, localized store metadata approval.
