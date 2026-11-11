import assert from "node:assert/strict";
import test from "node:test";
import { checkModuleRegistry, parseModuleRegistry } from "../checks/module-registry.mjs";

test("module registry in repo is consistent", () => {
  const result = checkModuleRegistry();
  assert.equal(result.status, "pass", result.errors?.join("; "));
});

test("parseModuleRegistry flags malformed headings and duplicates", () => {
  const text = `## bad-heading

- **Owner:** o
- **Path:** p
- **Status:** PLANNED

## \`dup\`

- **Owner:** o
- **Path:** p
- **Status:** PLANNED

## \`dup\`

- **Owner:** o2
- **Path:** p2
- **Status:** PLANNED
`;
  const { modules, errors } = parseModuleRegistry(text);
  assert.ok(errors.some((e) => e.includes("Malformed module heading")));
  assert.ok(errors.some((e) => e.includes("Duplicate module")));
  assert.equal(modules.length, 2);
});

test("parseModuleRegistry strips status backticks", () => {
  const mods = parseModuleRegistry("## `x`\n\n- **Owner:** o\n- **Path:** p\n- **Status:** `PLANNED`\n");
  assert.equal(mods.modules[0].fields.Status, "PLANNED");
});
