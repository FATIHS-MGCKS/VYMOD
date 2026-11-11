import assert from "node:assert/strict";
import test from "node:test";
import { checkModuleAuthority } from "../checks/module-authority.mjs";
import { validateKnowledgeGraph } from "../lib/knowledge-graph.mjs";

test("module authority passes for bootstrapped modules", () => {
  const r = checkModuleAuthority();
  assert.equal(r.status, "pass", r.errors?.join("; "));
});

test("validateKnowledgeGraph fails with wrong prefix", () => {
  const r = validateKnowledgeGraph("architecture/modules/governance", "WRONG-");
  assert.equal(r.ok, false);
  assert.ok(r.errors.length > 0);
});

test("validateKnowledgeGraph rejects wrong id_prefix", () => {
  const r = validateKnowledgeGraph("architecture/modules/i18n", "GOV-");
  assert.equal(r.ok, false);
});
