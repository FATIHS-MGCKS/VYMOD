# client-mobile — DEPENDENCY_RISK_INVENTORY

Snapshot: `npm audit` on P1 PR #3 closeout (no `npm audit fix --force` applied).

| Severity | Count |
| --- | --- |
| critical | 0 |
| high | 0 |
| moderate | 29 |
| low | 1 |
| **total** | **30** |

## Assessment

- **Runtime exposure:** Moderate advisories are predominantly in **dev/build** tooling (Jest, ESLint, Metro transitive); mobile production bundle is produced via Expo export with no HIGH findings at audit gate (`npm audit --audit-level=high` passes in CI).
- **Direct vs transitive:** Mix; most are transitive via `eslint`, `jest`, `expo` CLI toolchain — not imported by on-device app logic paths.
- **Remediation:** No blanket Expo/React Native upgrades in P1; track per-advisory with SDK 58 compatibility before any bump.
- **Reachability:** Treat unscoped moderate CLI advisories as **documented follow-up** unless a reachable import path into shipped JS is demonstrated.

Epistemic status: **CONFIRMED** counts from local `npm audit`; **INFERRED** reachability without binary pen-test.
