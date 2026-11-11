# Module authority — `governance`

| Field | Value |
| --- | --- |
| **Implementation status** | `ACTIVE` (P0 foundation) |
| **Registry coverage status** | `AUTHORITY_ACTIVE` |
| **Authority path** | `architecture/modules/governance/` |
| **Owner** | `@vymod-platform` |

## What this module owns

Repository-wide **AI governance**: `AGENTS.md`, compliance/standards docs, Cursor rules, GitHub Actions, and `tools/governance/` validators.

## What it does not own

- SYNQDRIVE Core runtime or DIMO operations
- Consumer application UI/runtime (future `client-*` modules)
- Legal interpretation of GDPR (see `compliance/` — human review required)

## Mandatory entry documents

| Document | Purpose |
| --- | --- |
| [CURRENT_STATE.md](./CURRENT_STATE.md) | P0/P0A implementation snapshot |
| [FUNCTION_CATALOG.md](./FUNCTION_CATALOG.md) | Validator entrypoints |
| [AGENT_CONTRACT.md](./AGENT_CONTRACT.md) | Module agent rules |
| [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md) | Graph index |
| [research/CHANGE_LEDGER.md](./research/CHANGE_LEDGER.md) | Append-only changes |
| [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md) | Graph summary |
| [AGENT_CONTRACT.md](./AGENT_CONTRACT.md) | Module agent rules |

## Validation

```bash
npm run validate
npm test
```

## Neighbors

- **`i18n`** — locale catalogs and i18n validators
- **Future product modules** — consume governance gates
