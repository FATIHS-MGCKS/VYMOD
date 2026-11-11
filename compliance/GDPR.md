# GDPR / DSGVO — Engineering Rules

**Status:** PARTIAL (P0 policy text; legal validation REQUIRES_HUMAN_LEGAL_REVIEW)

Applies GDPR principles to development (Articles 5, 6, 12–22, 25, 30, 32, 35) without claiming compliance.

## Principles (Art. 5)

- **Lawfulness, fairness, transparency** — document purpose in DATA_INVENTORY before collection.
- **Purpose limitation** — no secondary use without new basis and review.
- **Data minimization** — collect the minimum for the stated purpose.
- **Accuracy** — user-correctable where appropriate.
- **Storage limitation** — see DATA_RETENTION (legal periods TBD).
- **Integrity and confidentiality** — ASVS/MASVS controls, encryption in transit, access control.

## Legal basis (Art. 6)

Proposed bases are **placeholders** until legal review. Do not ship production processing without signed-off basis per feature.

## Rights (Arts. 12–22)

Engineering must support export, deletion, restriction, and objection flows per DATA_SUBJECT_RIGHTS. Implementation **PLANNED**.

## Privacy by design (Art. 25)

- Default privacy: location off logs/analytics; coarse location where possible.
- DPIA screening per DPIA_SCREENING.md.

## Records (Art. 30)

Update DATA_INVENTORY for each processing activity.

## Security (Art. 32)

Align with `standards/SECURE_CODING.md` and ISO27001 mapping.

## Special categories of vehicle/location data

GPS, history, driver behavior, diagnostics tied to individuals: heightened safeguards, anti-stalking design, no blockchain logging by default.

## Multi-subject scenarios

Drivers, owners, family members may be distinct subjects—do not assume account holder is sole subject.
