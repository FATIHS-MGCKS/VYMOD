# Data Retention (Engineering)

**Status:** PLANNED — actual periods **REQUIRES_HUMAN_LEGAL_REVIEW**

## Defaults (engineering intent)

| Data type | Default engineering rule |
| --- | --- |
| Session tokens | Short-lived; revoke on logout |
| Precise location history | User-visible retention only in app store; **not** in server logs by default |
| Audit/security logs | Minimum necessary; no GPS payloads |
| Backups | Document deletion propagation lag in runbooks (PLANNED) |
| Deleted account | Hard delete job + backup expiry (PLANNED) |

## Export / deletion

See DATA_SUBJECT_RIGHTS. Backups may retain data until rotation—document SLA when infrastructure is chosen.
