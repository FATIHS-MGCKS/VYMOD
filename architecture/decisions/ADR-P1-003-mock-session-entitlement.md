# ADR-P1-003: Identity, entitlement, and developer mock separation

## Context

P1 must model account verification and vehicle entitlement without implying production auth.

## Decision

Separate **lifecycle states** (`SessionSnapshot`) from navigation; mock repositories only; `__DEV__` scenario switcher never compiled into release entitlement bypass.

## Alternatives

- Single `isLoggedIn` flag (rejected)
- Persistent mock JWT (rejected)

## Consequences

Expo Router guards are **client-only**; real authorization deferred to P2/P3 BFF.

## Security / privacy

AsyncStorage holds locale/theme only.

## Validation

Navigation policy tests; negative tests for non-ACTIVE dashboard access.

## Unresolved

Auth provider, token storage, Core entitlement API.
