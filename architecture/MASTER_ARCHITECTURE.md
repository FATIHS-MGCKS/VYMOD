# VYMOD Master Architecture

**Mandatory entrypoint** for all architecture work. Read this after [`AGENTS.md`](../AGENTS.md).

| Route to | Document |
| --- | --- |
| Logical system shape | [`SYSTEM_OVERVIEW.md`](./SYSTEM_OVERVIEW.md) |
| Module inventory | [`MODULE_REGISTRY.md`](./MODULE_REGISTRY.md) |
| Authority standard | [`MODULE_AUTHORITY_STANDARD.md`](./MODULE_AUTHORITY_STANDARD.md) |
| Security invariants | [`SECURITY_INVARIANTS.md`](./SECURITY_INVARIANTS.md) |
| SYNQDRIVE contract | [`integrations/SYNQDRIVE_CORE.md`](./integrations/SYNQDRIVE_CORE.md) |
| DIMO contract | [`integrations/DIMO.md`](./integrations/DIMO.md) |

## 1. Product and Core boundaries

VYMOD is the **consumer experience layer**. **SYNQDRIVE Core** remains authoritative for vehicle identity, DIMO infrastructure, telemetry, analytics (VSI, DS4, DBI), and entitlement. VYMOD must not duplicate Core analytics or access Core production databases.

## 2. High-level hierarchy (target)

```text
[ client-mobile | client-web ]
            |
       [ api-gateway ]
            |
    +-------+--------+
    |                |
[ product services ] [ integrations-synqdrive ]
                            |
                     [ SYNQDRIVE Core ]
[ governance + i18n foundations span all layers ]
```

**P0 actual:** `governance` and `i18n` modules ACTIVE in repo; API and integrations **PLANNED** (inventory only).

**P1 actual:** `client-mobile` scaffold under `apps/mobile/` (Expo SDK 58, mock session/entitlement, root-catalog i18n runtime). **Expo Router screens live only in `apps/mobile/app/`** — never `src/app/` (Expo prefers `src/app` when present). Policy/providers live under `src/navigation/` and `src/providers/`. Production vehicle/auth APIs remain **PLANNED**.

## 3. Module ownership

See [`MODULE_REGISTRY.md`](./MODULE_REGISTRY.md). Each entry includes implementation `Status` and **registry coverage status** for module authorities.

## 4. Current vs planned

| Layer | Current (P0/P0A) | Planned |
| --- | --- | --- |
| Governance | Docs, validators, CI | Expand authority sync gates |
| i18n | JSON catalogs + validators | UI adapter when framework chosen |
| Clients / API | Not implemented | MASVS / ASVS implementations |
| Core integration | Documentation only | Versioned client package |

## 5. Integration boundaries

Documented in `architecture/integrations/`. No live DIMO or Core credentials in this repository.

## 6. Data flows (conceptual)

Personal data flows (location, vehicle-user links) must be recorded in `compliance/DATA_INVENTORY.md` before implementation. No location in logs by default ([`SECURITY_INVARIANTS.md`](./SECURITY_INVARIANTS.md)).

## 7. Security and privacy invariants

Summarized in [`SECURITY_INVARIANTS.md`](./SECURITY_INVARIANTS.md); compliance detail in `compliance/`.

## 8. Cross-module dependencies

| Consumer | Depends on |
| --- | --- |
| All product modules (future) | `governance`, `i18n`, Core contracts |
| `integrations-synqdrive` | Core APIs (PLANNED) |
| `integrations-dimo` | Core-mediated DIMO (PLANNED) |

## 9. Authority hierarchy

1. `AGENTS.md` — agent contract  
2. `MASTER_ARCHITECTURE.md` (this file) — routing  
3. `MODULE_REGISTRY.md` — inventory + coverage  
4. `architecture/modules/<id>/` — living module authorities  
5. `architecture/decisions/ADR-*.md` — cross-cutting ADRs  

Do not duplicate module detail here.

## 10. Agent navigation

1. Read `AGENTS.md` and this file.  
2. Resolve modules from `MODULE_REGISTRY.md`.  
3. If **registry coverage** is `AUTHORITY_ACTIVE`, read that module's `README.md` and mandatory entries.  
4. If `NOT_STARTED`, do not assume authority exists — inventory only.  
5. Inspect implementation paths before coding.  

## 11. Registry status model

| Coverage | Meaning |
| --- | --- |
| `NOT_STARTED` | Inventory only |
| `AUDIT_IN_PROGRESS` | Partial authority |
| `AUTHORITY_ACTIVE` | Usable maintained authority |
| `SUPERSEDED` | Historical; follow successor |

Implementation `Status` (`PLANNED`/`ACTIVE`/…) is independent.

## 12. Update protocol

Substantive changes must:

1. Update affected module authority (`CURRENT_STATE`, `FUNCTION_CATALOG`, `CHANGE_LEDGER`).  
2. Update cross-cutting docs only when boundaries change.  
3. Sync `MODULE_REGISTRY.md` metadata when coverage or paths change.  
4. Run `npm run validate` and `npm test`.  
5. Record registry sync outcome (UPDATED / UNCHANGED) in PR/completion report.

Reference pattern: [`reference/SYNQDRIVE_REFERENCE_AUDIT.md`](./reference/SYNQDRIVE_REFERENCE_AUDIT.md).
