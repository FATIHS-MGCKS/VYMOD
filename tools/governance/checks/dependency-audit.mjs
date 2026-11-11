import fs from "node:fs";
import { fromRoot } from "../lib/paths.mjs";

export function checkDependencyAudit() {
  const hasLock =
    fs.existsSync(fromRoot("package-lock.json")) ||
    fs.existsSync(fromRoot("pnpm-lock.yaml")) ||
    fs.existsSync(fromRoot("yarn.lock"));

  if (!hasLock) {
    return {
      id: "dependency-audit",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Add application dependencies and a lockfile; enable npm audit in CI",
      },
    };
  }

  return {
    id: "dependency-audit",
    status: "skip",
    errors: [],
    meta: {
      reason: "NOT_IMPLEMENTED",
      activation: "Run npm audit --audit-level=high when production deps exist",
    },
  };
}
