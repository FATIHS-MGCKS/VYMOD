# Mobile Security (OWASP MASVS oriented)

**Status:** PLANNED

## MASVS-aligned targets

- **Storage:** Hardware-backed keystore for tokens; no plaintext secrets
- **Crypto:** Platform APIs; no custom crypto
- **Auth:** OAuth/OIDC patterns; step-up for sensitive actions
- **Network:** TLS; pinning policy TBD in ADR
- **Platform:** Jailbreak/root detection only if proportionate and disclosed
- **Code:** Obfuscation not a substitute for server authZ
- **Privacy:** Minimize device identifiers; localized privacy UI

**MASVS-L2** target for security features when implemented.

DIMO or wallet SDK keys remain server-mediated; clients never hold provider admin credentials.
