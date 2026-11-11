# Cyber Resilience Act — Readiness (Engineering)

**Status:** PARTIAL — applicability **REQUIRES_HUMAN_LEGAL_REVIEW** (connected vehicle software).

| Topic | Status | Notes |
| --- | --- | --- |
| Applicability assessment | REQUIRES_HUMAN_LEGAL_REVIEW | Product class TBD |
| Security by design | PARTIAL | SECURITY_INVARIANTS, secure SDLC docs |
| Vulnerability handling | PLANNED | Coordinated disclosure policy below |
| SBOM | PLANNED | When shippable binaries exist |
| Security updates | PLANNED | Policy draft in this doc |
| Incident reporting | PLANNED | Link SECURITY_INCIDENT_RESPONSE |
| Technical documentation | PARTIAL | architecture + compliance tree |

## Vulnerability handling (draft)

1. Report to security contact (TBD) — not configured in P0.
2. Triage severity; patch per SLA (TBD).
3. User notification for actively exploited issues when required by law.

## SBOM

Generate from build pipeline when `apps/` produce artifacts (**NOT_IMPLEMENTED** until build exists).
