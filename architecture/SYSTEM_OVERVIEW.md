# System Overview

## Purpose

VYMOD is a premium consumer vehicle intelligence and security application. It presents monitoring, diagnostics, and driving intelligence to end users while **SYNQDRIVE Core** remains the authoritative platform for vehicle identities, DIMO infrastructure, telemetry processing, analytics (VSI, DS4, DBI), and central entitlement.

## Logical view (target)

```text
[ Mobile / Web clients ]
         |
         v
[ VYMOD API & BFF ] ----versioned APIs----> [ SYNQDRIVE Core ]
         |                                      (vehicle truth,
         v                                       telemetry, DIMO)
[ VYMOD services ]
  - identity & session (consumer)
  - localization
  - product UX orchestration
  - (future) security features — gated by ADR
```

## Boundaries

- No direct Core production database access.
- No copying or independent reimplementation of Core analytics.
- No unrestricted cross-product data reads.
- No enrollment from client-only vehicle identifiers.
- No provider credentials on clients.
- No assumption that DIMO wallet/NFT proves legal ownership.
- No security-critical vehicle commands without approved architecture.
- No location or personal data on public blockchains.

## Data flows (conceptual)

Personal data may include account data, device metadata, coarse or precise location (when consented), and vehicle–user relationships. Flows must be recorded in `compliance/DATA_INVENTORY.md` before implementation.

## P0 scope

Documentation, governance validators, i18n foundation, and CI gates. Application modules are **PLANNED** in MODULE_REGISTRY.
