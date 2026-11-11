# DIMO Integration (P0 — documentation only)

## Role

DIMO-related vehicle identity and connectivity are integrated **through SYNQDRIVE Core** for authority. VYMOD does not hold DIMO provider credentials on mobile clients.

## Invariants

- Wallet or NFT presence **does not** prove legal vehicle ownership.
- No location or personal data written to public blockchain.
- No production DIMO connections in P0 (`integrations-dimo` module PLANNED).

## Future work (PLANNED)

- Server-side adapter in `packages/dimo-adapter/`
- Contract tests against Core-sanctioned flows
- Privacy assessment in DATA_INVENTORY before telemetry display

## Dependencies

- Core entitlement APIs
- Legal review for data categories involving on-chain identifiers
