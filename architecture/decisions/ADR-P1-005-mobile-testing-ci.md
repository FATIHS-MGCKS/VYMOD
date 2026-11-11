# ADR-P1-005: Mobile testing and CI validation

## Context

P1 activates hardcoded-ui and typecheck gates for TSX.

## Decision

Jest 30 + `jest-expo` + Testing Library; CI runs governance + mobile tests + `expo export`.

## Alternatives

- Snapshot-only tests (rejected)
- Detox in P1 (deferred)

## Consequences

Safe area mocked in Jest; device tests documented separately.

## Security / privacy

Tests use synthetic emails only.

## Validation

`npm run test:all`, workflow `mobile` job.

## Unresolved

Native simulator CI, visual regression.
