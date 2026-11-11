import fs from "node:fs";
import { fromRoot } from "../lib/paths.mjs";

export function checkTypecheck() {
  const tsconfig = fromRoot("tsconfig.json");
  if (!fs.existsSync(tsconfig)) {
    return {
      id: "typecheck",
      status: "skip",
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Add tsconfig.json and application TypeScript sources",
      },
      errors: [],
    };
  }
  return {
    id: "typecheck",
    status: "skip",
    meta: { reason: "NOT_IMPLEMENTED", activation: "Add `npm run typecheck` when TS app exists" },
    errors: [],
  };
}
