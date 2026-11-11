# Module authority — `i18n`

| Field | Value |
| --- | --- |
| **Implementation status** | `ACTIVE` |
| **Registry coverage status** | `AUTHORITY_ACTIVE` |
| **Authority path** | `architecture/modules/i18n/` |
| **Owner** | `@vymod-client` |

## Mandatory entry documents

| Document | Purpose |
| --- | --- |
| [CURRENT_STATE.md](./CURRENT_STATE.md) | Catalogs and validators |
| [FUNCTION_CATALOG.md](./FUNCTION_CATALOG.md) | Exported validators / planned adapter |
| [AGENT_CONTRACT.md](./AGENT_CONTRACT.md) | Module rules |
| [research/CHANGE_LEDGER.md](./research/CHANGE_LEDGER.md) | Append-only history |
| [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md) | Graph summary |

## Validation

```bash
npm run validate -- --only i18n
npm test
```

Also: `standards/I18N.md`, `i18n/ADAPTER.md`.
