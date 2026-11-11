# Module Registry

Maintainers update this file when adding modules. The governance validator checks that every `##` module entry has **Owner**, **Path**, and **Status**.

| Field | Required values |
| --- | --- |
| Status | `PLANNED` \| `SCAFFOLD` \| `ACTIVE` \| `DEPRECATED` |
| Owner | Team or role (e.g. `@vymod-platform`) |

## `governance`

- **Path:** `/` (docs, CI, validators)
- **Owner:** `@vymod-platform`
- **Status:** `ACTIVE`
- **Scope:** AGENTS.md, architecture, compliance, standards, quality gates

## `i18n`

- **Path:** `i18n/`
- **Owner:** `@vymod-client`
- **Status:** `ACTIVE`
- **Scope:** Locale catalogs, parity validation, adapter contract

## `client-mobile`

- **Path:** `apps/mobile/` (not created in P0)
- **Owner:** `@vymod-client`
- **Status:** `PLANNED`
- **Scope:** Consumer mobile app, MASVS-aligned

## `client-web`

- **Path:** `apps/web/` (not created in P0)
- **Owner:** `@vymod-client`
- **Status:** `PLANNED`
- **Scope:** Marketing/account web surfaces

## `api-gateway`

- **Path:** `services/api/` (not created in P0)
- **Owner:** `@vymod-backend`
- **Status:** `PLANNED`
- **Scope:** BFF, authZ, rate limits, ASVS L2 target

## `integrations-synqdrive`

- **Path:** `packages/synqdrive-client/` (not created in P0)
- **Owner:** `@vymod-backend`
- **Status:** `PLANNED`
- **Scope:** Versioned SYNQDRIVE Core client; contract in `architecture/integrations/SYNQDRIVE_CORE.md`

## `integrations-dimo`

- **Path:** `packages/dimo-adapter/` (not created in P0)
- **Owner:** `@vymod-backend`
- **Status:** `PLANNED`
- **Scope:** DIMO-facing adapter; no live credentials in P0
