# client-mobile — DECISION_REGISTER

## MOB-DEC-001 — Expo Router + mock session for P1

| Field | Value |
| --- | --- |
| **Status** | VALIDATED |
| **Date** | 2026-11-11 |
| **Decision** | Ship navigable mobile shell with mock repositories; no backend coupling in P1 |
| **Evidence** | MOB-EVID-001, MOB-EVID-002 |

## MOB-DEC-002 — Client-side fail-closed vehicle routing (P1 only)

| Field | Value |
| --- | --- |
| **Status** | VALIDATED |
| **Date** | 2026-11-11 |
| **Decision** | Separate session, verification, entitlement, and vehicle ID checks in `authorization.ts`; document as non-production authZ |
| **Evidence** | MOB-EVID-001, MOB-EVID-003 |

## MOB-DEC-003 — de-DE default locale with explicit user override

| Field | Value |
| --- | --- |
| **Status** | VALIDATED |
| **Date** | 2026-11-11 |
| **Decision** | Default/fallback `de-DE`; device locale when supported; persisted user choice wins |
| **Evidence** | MOB-EVID-001 (`mobile.foundation.test.tsx` language toggle) |
