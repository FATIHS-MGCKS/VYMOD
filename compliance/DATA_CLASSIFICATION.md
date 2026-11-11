# Data Classification

| Level | Examples | Handling |
| --- | --- | --- |
| **PUBLIC** | Marketing copy, public docs | No restrictions |
| **INTERNAL** | Architecture drafts, non-sensitive configs | Staff access |
| **CONFIDENTIAL** | Account PII, vehicle–user links | Encrypt in transit/at rest; RBAC |
| **RESTRICTED** | Precise live location, security tokens, provider keys | Minimal access; no client secrets; no default logging |

Vehicle diagnostics attributable to individuals: **CONFIDENTIAL** or **RESTRICTED** depending on content.

Classification drives retention (DATA_RETENTION) and logging rules (SECURITY_INVARIANTS).
