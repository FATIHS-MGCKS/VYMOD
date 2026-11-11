import assert from "node:assert/strict";
import test from "node:test";
import { checkModuleRegistry, parseModuleRegistry } from "../checks/module-registry.mjs";

test("module registry in repo is consistent", () => {
  const result = checkModuleRegistry();
  assert.equal(result.status, "pass", result.errors?.join("; "));
});

test("parseModuleRegistry requires fields", () => {
  const mods = parseModuleRegistry("## `x`\n\n- **Owner:** o\n- **Path:** p\n- **Status:** `PLANNED`\n");
  assert.equal(mods.length, 1);
  assert.equal(mods[0].fields.Status, "PLANNED");
});
