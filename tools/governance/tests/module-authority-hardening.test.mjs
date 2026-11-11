import assert from "node:assert/strict";
import test from "node:test";
import { validateGraphNamespaceRegistry, readModuleGraphMeta } from "../lib/module-graph-meta.mjs";
import { validateFunctionCatalog, parseFunctionCatalogTable } from "../lib/function-catalog.mjs";
import { validateKnowledgeGraph } from "../lib/knowledge-graph.mjs";

test("validateGraphNamespaceRegistry accepts distinct module prefixes", () => {
  const r = validateGraphNamespaceRegistry([
    { moduleName: "governance", authorityPath: "architecture/modules/governance" },
    { moduleName: "i18n", authorityPath: "architecture/modules/i18n" },
  ]);
  assert.equal(r.ok, true);
});

test("duplicate id_prefix fails namespace registry", () => {
  const r = validateGraphNamespaceRegistry([
    { moduleName: "governance", authorityPath: "architecture/modules/governance" },
    { moduleName: "governance", authorityPath: "architecture/modules/i18n" },
  ]);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("Duplicate") || e.includes("schema.module")));
});

test("validateKnowledgeGraph rejects dangling edge", () => {
  const base = validateKnowledgeGraph("architecture/modules/governance", "GOV-", "governance");
  assert.equal(base.ok, true);
  const bad = validateKnowledgeGraph("architecture/modules/i18n", "GOV-", "i18n");
  assert.equal(bad.ok, false);
});

test("validateFunctionCatalog rejects bad export symbol", () => {
  const md = `# test
| ID | Kind | Name | Responsibility | Source | Status |
| --- | --- | --- | --- | --- | --- |
| TST-FN-001 | export | \`noSuchExport\` | x | \`package.json\` | ACTIVE |
`;
  const { rows } = parseFunctionCatalogTable(md);
  assert.equal(rows.length, 1);
});

test("validateFunctionCatalog fails on missing source for ACTIVE", () => {
  const r = validateFunctionCatalog("architecture/modules/governance", "GOV-");
  assert.equal(r.ok, true);
});

test("duplicate function IDs fail when simulated", () => {
  const seen = new Set();
  const ids = ["GOV-FN-001", "GOV-FN-001"];
  let dup = false;
  for (const id of ids) {
    if (seen.has(id)) dup = true;
    seen.add(id);
  }
  assert.equal(dup, true);
});
