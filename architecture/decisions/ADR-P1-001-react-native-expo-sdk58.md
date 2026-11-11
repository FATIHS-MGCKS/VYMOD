# ADR-P1-001: React Native + Expo SDK 58

## Context

VYMOD needs one iOS/Android codebase with governance-aligned TypeScript and CI exports.

## Decision

Adopt **React Native 0.88** with **Expo SDK 58** and **Expo Router** for file-based navigation.

## Alternatives

- Bare React Native CLI (rejected: slower cross-platform toolchain alignment)
- Flutter (rejected: team TypeScript/React alignment)

## Consequences

- Metro monorepo watch for root `i18n/locales`
- JS bundle export used as CI signal; native store builds out of scope for P1

## Security / privacy

No native permissions for background location or vehicle control in P1.

## Validation

`expo-doctor`, `expo export` iOS/Android, mobile Jest suite.

## Unresolved

EAS profiles, attestation, and production signing (P2+).
