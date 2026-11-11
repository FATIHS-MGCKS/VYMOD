# Module Registry

Central module inventory. **Implementation** `Status` is separate from **Registry coverage status** (authority documentation). See [`MODULE_AUTHORITY_STANDARD.md`](./MODULE_AUTHORITY_STANDARD.md).

| Implementation `Status` | Meaning |
| --- | --- |
| `PLANNED` \| `SCAFFOLD` \| `ACTIVE` \| `DEPRECATED` | Code/runtime maturity |

| Registry coverage status | Meaning |
| --- | --- |
| `NOT_STARTED` | Inventory only |
| `AUDIT_IN_PROGRESS` | Partial authority |
| `AUTHORITY_ACTIVE` | Usable module authority |
| `SUPERSEDED` | Historical |

## `governance`

- **Path:** `/` (docs, CI, validators)
- **Authority path:** `architecture/modules/governance/`
- **Owner:** `@vymod-platform`
- **Status:** `ACTIVE`
- **Registry coverage status:** `AUTHORITY_ACTIVE`
- **Scope:** AGENTS.md, architecture, compliance, standards, quality gates

## `i18n`

- **Path:** `i18n/`
- **Authority path:** `architecture/modules/i18n/`
- **Owner:** `@vymod-client`
- **Status:** `ACTIVE`
- **Registry coverage status:** `AUTHORITY_ACTIVE`
- **Scope:** Locale catalogs, parity validation, adapter contract

## `client-mobile`

- **Path:** `apps/mobile/` (not created in P0)
- **Authority path:** `—`
- **Owner:** `@vymod-client`
- **Status:** `PLANNED`
- **Registry coverage status:** `NOT_STARTED`
- **Scope:** Consumer mobile app, MASVS-aligned

## `client-web`

- **Path:** `apps/web/` (not created in P0)
- **Authority path:** `—`
- **Owner:** `@vymod-client`
- **Status:** `PLANNED`
- **Registry coverage status:** `NOT_STARTED`
- **Scope:** Marketing/account web surfaces

## `api-gateway`

- **Path:** `services/api/` (not created in P0)
- **Authority path:** `—`
- **Owner:** `@vymod-backend`
- **Status:** `PLANNED`
- **Registry coverage status:** `NOT_STARTED`
- **Scope:** BFF, authZ, rate limits, ASVS L2 target

## `integrations-synqdrive`

- **Path:** `packages/synqdrive-client/` (not created in P0)
- **Authority path:** `—`
- **Owner:** `@vymod-backend`
- **Status:** `PLANNED`
- **Registry coverage status:** `NOT_STARTED`
- **Scope:** Versioned SYNQDRIVE Core client; contract in `architecture/integrations/SYNQDRIVE_CORE.md`

## `integrations-dimo`

- **Path:** `packages/dimo-adapter/` (not created in P0)
- **Authority path:** `—`
- **Owner:** `@vymod-backend`
- **Status:** `PLANNED`
- **Registry coverage status:** `NOT_STARTED`
- **Scope:** DIMO-facing adapter; no live credentials in P0
