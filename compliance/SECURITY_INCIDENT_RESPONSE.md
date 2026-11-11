# Security Incident Response

**Status:** PLANNED

## Phases

1. **Detect** — monitoring alerts (PLANNED), user reports
2. **Triage** — severity, data categories (location = urgent)
3. **Contain** — revoke sessions, rotate secrets
4. **Notify** — legal/regulatory timing REQUIRES_HUMAN_LEGAL_REVIEW
5. **Recover** — restore, verify invariants
6. **Post-incident** — update THREAT_MODEL, ADR if needed

## P0

No on-call rotation or security@ email configured—document dependency.

Precise location breach: treat as high severity; no sample coordinates in tickets.
