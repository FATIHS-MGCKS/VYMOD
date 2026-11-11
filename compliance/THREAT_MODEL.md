# Threat Model (P0 — STRIDE sketch)

**Status:** PARTIAL — refine per module when code exists.

## Assets

- User accounts and sessions
- Vehicle entitlement bindings
- Location and telemetry (future)
- SYNQDRIVE API credentials (server-only)

## STRIDE (selected)

| Threat | Example | Mitigation direction |
| --- | --- | --- |
| Spoofing | Fake vehicle ID from client | Core-mediated enrollment |
| Tampering | Modified API responses | TLS, signature where provided |
| Repudiation | Denied security action | Audit log (no sensitive payloads) |
| Info disclosure | Location in logs | Invariant #12 |
| DoS | API abuse | Rate limits (PLANNED) |
| Elevation | Stolen session controls vehicle | Step-up auth for sensitive ops |

## Abuse: stalking

Threat: account holder tracks non-consenting driver. Mitigations: consent flows, sharing controls, abuse reporting (PLANNED), rate limits on location polling.

## Out of scope P0

Live attack surface testing, penetration test reports.
