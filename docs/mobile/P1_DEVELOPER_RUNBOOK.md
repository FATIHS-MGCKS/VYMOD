# VYMOD mobile — P1 developer runbook

## Prerequisites

- Node.js 20+ (CI uses 22)
- npm (root install)

## Install

```bash
npm ci
```

## Start the app

```bash
npm run mobile:start
```

Press `i` / `a` for simulators when available, or scan QR with Expo Go / dev client.

## Quality commands

```bash
npm run validate      # governance gates
npm test              # governance unit tests
npm run test:mobile   # mobile Jest suite
npm run test:all
npm run typecheck
npm run lint
```

## Mobile workspace

```bash
npm run start --workspace @vymod/mobile
npm run export:ios --workspace @vymod/mobile
npm run export:android --workspace @vymod/mobile
```

## P1 limitations

- Mock sign-in/up only; no SYNQDRIVE or DIMO HTTP
- ACTIVE entitlement via dev-only continue on approval screen (`__DEV__`)
- No vehicle commands or live maps

## Native builds

Store-signed iOS/Android binaries are **not** produced in P1 CI. Use EAS locally when credentials exist.
