# Data Inventory (Development RoPA)

Update this file **before** implementing processing of personal data.

## Template (copy per feature)

```markdown
### [FEATURE_ID] Feature name
- **Status:** PLANNED | ACTIVE
- **Categories:** (e.g. account, device, precise location)
- **Purpose:**
- **Legal basis (proposed):** REQUIRES_HUMAN_LEGAL_REVIEW
- **Controller/processor:** REQUIRES_HUMAN_LEGAL_REVIEW
- **Sources:**
- **Recipients:**
- **Retention:** See DATA_RETENTION; period REQUIRES_HUMAN_LEGAL_REVIEW
- **Access restrictions:**
- **Transfers (third country):**
- **Subject rights impact:**
- **DPIA:** screening result from DPIA_SCREENING.md
```

## P0 baseline entries

### GOV-001 Repository telemetry (CI only)

- **Status:** ACTIVE
- **Categories:** Developer usernames in git, CI metadata (no end-user vehicle data in P0)
- **Purpose:** Build and validate governance artifacts
- **Legal basis (proposed):** REQUIRES_HUMAN_LEGAL_REVIEW (likely legitimate interest for security—confirm)
- **Retention:** Per GitHub/org policy
- **DPIA:** Low risk screening — not vehicle location

### VEH-001 Vehicle location display (future)

- **Status:** PLANNED
- **Categories:** Precise GPS, historical routes
- **Purpose:** User-requested vehicle monitoring
- **Safeguards:** No default logging to analytics; user controls; anti-stalking review mandatory
- **DPIA:** Full DPIA likely required before launch — REQUIRES_HUMAN_LEGAL_REVIEW
