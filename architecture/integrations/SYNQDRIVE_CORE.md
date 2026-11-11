# SYNQDRIVE Core Integration Contract (P0 — documentation only)

## Authority

SYNQDRIVE Core is authoritative for:

- Vehicle identities and data relationships
- DIMO infrastructure integration
- Telemetry ingestion and processing
- Vehicle analytics (VSI, DS4, DBI, related services)
- Central product entitlement and onboarding authorization

VYMOD **consumes** capabilities through explicitly authorized, **versioned** interfaces. VYMOD does not replicate Core analytics or access Core production databases directly.

## Prohibited (VYMOD)

- Direct production database access
- Independent reimplementation of Core analytics pipelines
- Unrestricted cross-product data export
- Client-driven vehicle enrollment without Core authorization workflow
- Exposure of Core/provider credentials to mobile clients

## Future interface expectations (PLANNED)

| Concern | Direction |
| --- | --- |
| Onboarding | Server-mediated; Core confirms entitlement |
| Telemetry | Read via approved APIs; retention per DATA_RETENTION |
| Analytics | Use Core outputs; no shadow pipelines |
| AuthZ | Core/product entitlement + VYMOD session binding |

## Versioning

Breaking changes require new API version, MODULE_REGISTRY update, and consumer migration plan.

## P0

No implementation. Credentials and endpoints are **NOT_IMPLEMENTED** pending infrastructure decisions.
