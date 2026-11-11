# Security Invariants

Violations require explicit owner approval and an ADR. Agents must not silently waive these.

## Platform

1. **Fail closed** on authentication, entitlement, and authorization errors.
2. **Server-side authorization** for every operation accessing vehicle or personal data.
3. **No secrets** in mobile binaries, public repos, or client-accessible config.
4. **No direct SYNQDRIVE production DB** or ad-hoc cross-product queries.
5. **Versioned interfaces only** for Core and third-party APIs.

## Vehicle and identity

6. **No enrollment** using only client-supplied VIN/token/wallet without server-verified Core workflow.
7. **No assumption** that DIMO wallet or NFT equals legal vehicle ownership.
8. **Vehicle-scoped access control** — users see only entitled vehicles.
9. **Security-critical vehicle operations** (lock, immobilize, etc.) are **out of scope** until separate security architecture is approved.

## Authentication

10. Password, synced passkey, or DIMO login **does not** automatically authorize security-critical vehicle operations.
11. Future **single-device authorization** uses hardware-backed keys where supported and server-side device registration.

## Privacy-sensitive data

12. **Precise location and location history** must not appear in application logs, analytics, crash reporters, or public blockchain **by default**.
13. **Anti-stalking:** design against unauthorized tracking; report abuse paths in threat model.
14. Minimize collection; separate purposes in DATA_INVENTORY.

## Development

15. **Dependency and secret scanning** in CI when applicable.
16. **Untrusted input validation** at all trust boundaries.
17. **Audit events** without sensitive payloads (no GPS in audit rows by default).

See `compliance/THREAT_MODEL.md` for STRIDE-oriented view.
