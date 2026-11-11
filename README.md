# VYMOD

**your car. your rules.**

Premium consumer vehicle security and intelligence, powered by **SYNQDRIVE Core**.

VYMOD is a separate product with explicit integration boundaries. SYNQDRIVE remains authoritative for vehicle identity, DIMO infrastructure, telemetry, analytics, and entitlement. See `architecture/integrations/SYNQDRIVE_CORE.md`.

## Status

**Phase 0 — AI governance and compliance foundation** (documentation, validators, CI). No application runtime or live vehicle integration in this phase.

Creating docs or passing validators does **not** mean GDPR compliance, ISO certification, or regulatory approval.

## Quick start (developers and agents)

1. Read `AGENTS.md` (mandatory contract for AI-assisted work).
2. Read `architecture/README.md` and `compliance/README.md`.
3. Run local validation:

```bash
npm run validate
npm test
```

## Documentation map

| Area | Path |
| --- | --- |
| Agent contract | `AGENTS.md` |
| Architecture | `architecture/` |
| Compliance engineering | `compliance/` |
| Engineering standards | `standards/` |
| Product vision | `docs/product/VYMOD_PRODUCT_VISION.md` |
| i18n catalogs | `i18n/locales/` (`de-DE`, `en-US`) |
| Cursor rules | `.cursor/rules/` |

## Security invariants (summary)

Full list: `architecture/SECURITY_INVARIANTS.md`.

- Fail closed on auth and entitlement errors.
- No direct SYNQDRIVE production database access.
- No provider credentials on mobile clients.
- No precise location history in logs, analytics, or blockchain by default.
- No security-critical vehicle controls without approved architecture.

## Governance CI

GitHub Actions workflow `.github/workflows/governance.yml` runs `npm run validate` and validator tests on push/PR.

## Language

German (`de-DE`) is the initial product language; all UI must use translation keys with `en-US` parity enforced in CI (`standards/I18N.md`).
