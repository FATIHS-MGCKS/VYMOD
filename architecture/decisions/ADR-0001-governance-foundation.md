# ADR-0001: P0 AI Governance and Compliance Foundation

- **Status:** Accepted
- **Date:** 2025-11-11
- **Deciders:** VYMOD Platform (engineering)

## Context

VYMOD needs enforceable rules so AI-assisted development stays aligned with privacy, security, i18n, and architecture boundaries before application code lands.

## Decision

1. Establish `AGENTS.md`, Cursor rules, architecture/compliance/standards docs as authoritative references.
2. Implement local and CI validators (`npm run validate`) with real checks and tests.
3. Use framework-agnostic JSON i18n catalogs with parity validation (`de-DE`, `en-US`).
4. Document SYNQDRIVE and DIMO integration contracts only—no live integration in P0.
5. Control status labels: IMPLEMENTED, VERIFIED, PARTIAL, PLANNED, NOT_APPLICABLE, REQUIRES_HUMAN_LEGAL_REVIEW.

## Consequences

- Early velocity focused on documentation and gates, not features.
- Legal bases and certifications remain **REQUIRES_HUMAN_LEGAL_REVIEW**.
- UI hardcoded-string and app typecheck gates activate when `apps/` / `src/` code exists.

## Compliance

Does not constitute GDPR compliance, ISO certification, or CRA conformity.
