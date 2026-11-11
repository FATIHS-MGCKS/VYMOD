# VYMOD
your car. your rules.

VYMOD

Premium Vehicle Security & Intelligence

VYMOD is a consumer vehicle application powered by SYNQDRIVE Core.

The platform combines vehicle monitoring, telemetry, driving intelligence, diagnostics, and future vehicle security capabilities in a unified consumer experience.

Architecture Principles

* SYNQDRIVE Core remains the authoritative vehicle data platform.
* VYMOD operates as a separate product with explicitly defined integration contracts.
* Vehicle onboarding requires appropriate authorization and user consent.
* Vehicle telemetry and analytics must be consumed through approved SYNQDRIVE interfaces.
* All security-sensitive operations must fail closed.
* Safety-critical vehicle control is excluded until separately approved and validated.

Project Status

Phase 0 — Repository Foundation

Initial scope:

* Consumer application foundation
* Architecture governance
* Authentication and device identity design
* SYNQDRIVE Core integration contract
* Product onboarding and entitlement model

Documentation

* AGENTS.md — AI development rules
* architecture/README.md — Architecture entrypoint
* architecture/MODULE_REGISTRY.md — Module ownership
* architecture/SECURITY_INVARIANTS.md — Security boundaries
* docs/product/VYMOD_PRODUCT_VISION.md — Product scope

Development Rules

Architecture must be documented before significant implementation.

Changes affecting authentication, vehicle ownership, telemetry authorization, or vehicle control require explicit architectural review.

No production deployment, external system mutation, or vehicle control activation is permitted without explicit authorization.
