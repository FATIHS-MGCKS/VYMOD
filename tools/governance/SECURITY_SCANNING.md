# Security scanning (P0 validators)

## Secrets

- **CI:** `gitleaks` is installed in `.github/workflows/governance.yml` before `npm run validate`.
- **Local:** `checkSecrets` runs baseline regex patterns always. `gitleaks detect` runs when the binary is on `PATH`.
- **P1:** Standardize local `gitleaks` installation for developers (optional brew/winget install); CI remains authoritative.

## Dependencies

When `package-lock.json` exists and `package.json` lists dependencies, `dependency-audit` runs `npm audit --audit-level=high`. Execution errors and reported vulnerabilities **fail** the gate.

## TypeScript

When `tsconfig.json` exists and application `.ts`/`.tsx` files exist under `apps/`, `src/`, or `packages/`, `typecheck` runs `tsc --noEmit` (or `npm run typecheck` if defined).
