# ADR-P1-002: npm workspace and mobile boundaries

## Context

P0 governance lives at repo root; mobile must not become a nested git repository.

## Decision

Use root `package.json` **workspaces** (`apps/*`) with `@vymod/mobile` under `apps/mobile/`.

## Alternatives

- Standalone mobile repo (rejected: breaks governance gates)
- Yarn/pnpm (rejected: npm lockfile policy from P0)

## Consequences

Single root `package-lock.json`; Metro `watchFolders` includes repository root.

## Security / privacy

No secrets in workspace packages; no `EXPO_PUBLIC_*` credentials.

## Validation

Root `npm ci`, `npm run typecheck`, governance validators.

## Unresolved

Shared packages (`packages/*`) when web/BFF land.
