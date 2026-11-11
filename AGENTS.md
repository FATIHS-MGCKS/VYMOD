# AGENTS.md — AI Development Contract (VYMOD)

All Cursor and Cloud agents working in this repository **must** follow this contract. This does not constitute legal GDPR compliance, ISO certification, or regulatory approval.

## Authority map

| Topic | Authoritative document |
| --- | --- |
| Architecture entry | `architecture/MASTER_ARCHITECTURE.md` |
| Module authority standard | `architecture/MODULE_AUTHORITY_STANDARD.md` |
| Product scope | `docs/product/VYMOD_PRODUCT_VISION.md` |
| System shape | `architecture/SYSTEM_OVERVIEW.md` |
| Module ownership | `architecture/MODULE_REGISTRY.md` |
| Module authorities | `architecture/modules/<id>/` (when `AUTHORITY_ACTIVE`) |
| Security boundaries | `architecture/SECURITY_INVARIANTS.md` |
| SYNQDRIVE integration | `architecture/integrations/SYNQDRIVE_CORE.md` |
| Privacy engineering | `compliance/GDPR.md`, `compliance/DATA_INVENTORY.md` |
| i18n | `standards/I18N.md`, `i18n/ADAPTER.md` |
| API security | `standards/API_SECURITY.md` |
| Mobile security | `standards/MOBILE_SECURITY.md` |
| Accessibility | `standards/ACCESSIBILITY.md` |
| Testing | `standards/TESTING.md` |

Read the relevant authorities **before** implementation. Do not duplicate long requirements in chat or PRs—cite paths.

## Architecture-first sequence (mandatory)

1. Read `AGENTS.md` and `architecture/MASTER_ARCHITECTURE.md`.
2. Resolve affected modules in `architecture/MODULE_REGISTRY.md` (implementation **Status** + **Registry coverage status**).
3. If coverage is `AUTHORITY_ACTIVE`, read that module’s `README.md` and mandatory entry docs under `architecture/modules/<id>/`.
4. Inspect actual implementation paths before editing.
5. Map applicable controls from `compliance/` and `standards/`.

## Before implementation

1. Inspect repository state, branch, and affected modules.
2. Identify the **module owner** in `architecture/MODULE_REGISTRY.md`.
3. Map applicable controls from `compliance/` and `standards/`.
4. List UI strings and translation keys (`standards/I18N.md`).
5. List tests, validators, and docs that must change.

## During implementation

- Respect module boundaries and versioned integration contracts.
- Use **TypeScript strict** where TypeScript is introduced.
- Validate untrusted input at trust boundaries; **authorize on the server**.
- Never expose provider secrets to mobile clients.
- Minimize personal data; prefer pseudonymization where appropriate.
- All user-visible copy via localization keys (`de-DE`, `en-US` minimum).
- Store canonical timestamps in **UTC**; format for display per locale.
- Do not bypass SYNQDRIVE Core for vehicle authority or analytics.
- Do not implement vehicle security controls without approved architecture.

## Before completion

1. Run `npm run validate` (and targeted tests).
2. Update affected module authorities (`CURRENT_STATE.md`, `FUNCTION_CATALOG.md`, append `research/CHANGE_LEDGER.md`).
3. Sync `MODULE_REGISTRY.md` only when coverage or paths actually change.
4. Report **failed**, **skipped**, and **NOT_IMPLEMENTED** checks explicitly.
5. Update architecture/compliance docs for substantive changes.
4. Include privacy and security impact notes in the completion report.
5. Never claim **IMPLEMENTED** or **VERIFIED** without evidence.

## Prohibited agent behavior

- Silently waiving a security invariant.
- Bypassing a required quality gate.
- Marking an unimplemented control as passed.
- Writing precise location history to logs, analytics, or blockchain by default.
- Assuming DIMO wallet/NFT equals legal vehicle ownership.
- Direct SYNQDRIVE production database access.

Security-sensitive architectural exceptions require **explicit module owner approval** documented in an ADR.

## Completion report (substantive tasks)

```
OPERATION:
BRANCH:
BASE_SHA:
HEAD_SHA:
CHANGED_FILES:
ARCHITECTURE_IMPACT:
MODULE_REGISTRY_STATUS:
PRIVACY_IMPACT:
SECURITY_IMPACT:
I18N_STATUS:
TEST_RESULTS:
CI_STATUS:
OPEN_RISKS:
FINAL_VERDICT:
```

## AI development workflow

1. Repository and authority inspection (`MASTER_ARCHITECTURE` → module README)  
2. Scope and dependency analysis  
3. Risk classification  
4. Implementation  
5. Tests and automated checks  
6. Module authority + registry synchronization  
7. Security and privacy review  
8. Completion report  

High-risk security changes require an independent review before merge (document in ADR).
