import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  validateGraphNamespaceRegistry,
  validateSchemaMetadata,
  readModuleGraphMeta,
} from "../lib/module-graph-meta.mjs";
import {
  validateFunctionCatalogContent,
  validateFunctionIdsGlobally,
  validateFunctionCatalog,
} from "../lib/function-catalog.mjs";
import {
  validateKnowledgeGraph,
  validateKnowledgeGraphDocuments,
} from "../lib/knowledge-graph.mjs";
import { validateChangeLedgerText } from "../lib/change-ledger.mjs";
import { checkModuleAuthority } from "../checks/module-authority.mjs";

function mkFixture(layout) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "vymod-ma-fixture-"));
  for (const [rel, content] of Object.entries(layout)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
  }
  return root;
}

const MIN_SCHEMA = `version: "1.0"
module: fixmod
id_prefix: FIX-
node_types: [domain, evidence, function, pipeline, invariant]
epistemic_status_values: [CONFIRMED]
relation_types: [validates, invokes]
`;

const MIN_NODES = `nodes:
  - id: FIX-DOM-001
    type: domain
    title: t
    epistemic_status: CONFIRMED
    summary: ok
`;

const MIN_INVARIANTS = `invariants: []
`;

test("positive: validateKnowledgeGraphDocuments accepts minimal valid graph", () => {
  const docs = {
    schema: {
      version: "1.0",
      module: "fixmod",
      id_prefix: "FIX-",
      node_types: ["domain", "evidence", "pipeline", "function", "invariant"],
      epistemic_status_values: ["CONFIRMED"],
      relation_types: ["validates", "invokes"],
    },
    nodes: {
      nodes: [
        {
          id: "FIX-DOM-001",
          type: "domain",
          title: "d",
          epistemic_status: "CONFIRMED",
          summary: "s",
        },
      ],
    },
    edges: { edges: [] },
    invariants: { invariants: [] },
  };
  const r = validateKnowledgeGraphDocuments(docs, "fixture", "FIX-", "fixmod", {
    checkSourcePaths: false,
  });
  assert.equal(r.ok, true);
});

test("negative: dangling graph edge referencing nonexistent node", () => {
  const docs = {
    schema: {
      version: "1.0",
      module: "fixmod",
      id_prefix: "FIX-",
      node_types: ["domain"],
      epistemic_status_values: ["CONFIRMED"],
      relation_types: ["validates"],
    },
    nodes: {
      nodes: [
        {
          id: "FIX-DOM-001",
          type: "domain",
          title: "d",
          epistemic_status: "CONFIRMED",
          summary: "s",
        },
      ],
    },
    edges: {
      edges: [{ from: "FIX-DOM-001", relation: "validates", to: "FIX-DOM-999" }],
    },
    invariants: { invariants: [] },
  };
  const r = validateKnowledgeGraphDocuments(docs, "fixture", "FIX-", "fixmod", {
    checkSourcePaths: false,
  });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("dangling edge")));
});

test("negative: duplicate graph namespace prefixes across modules", () => {
  const root = mkFixture({
    "mod-a/graph/schema.yaml": MIN_SCHEMA.replace("fixmod", "mod-a"),
    "mod-b/graph/schema.yaml": MIN_SCHEMA.replace("fixmod", "mod-b"),
  });
  const r = validateGraphNamespaceRegistry(
    [
      { moduleName: "mod-a", authorityPath: "mod-a" },
      { moduleName: "mod-b", authorityPath: "mod-b" },
    ],
    { root },
  );
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("Duplicate graph id_prefix")));
});

test("negative: invalid graph namespace metadata (id_prefix)", () => {
  const r = validateSchemaMetadata({ id_prefix: "not-valid", module: "x" }, "fixture");
  assert.ok(r.errors.some((e) => e.includes("invalid id_prefix")));
});

test("positive: production governance graph still validates", () => {
  const r = validateKnowledgeGraph("architecture/modules/governance", "GOV-", "governance");
  assert.equal(r.ok, true, r.errors?.join("; "));
});

test("negative: ACTIVE export symbol not found in source file", () => {
  const root = mkFixture({
    "src/hollow.mjs": "export function other() {}\n",
  });
  const md = `| ID | Kind | Name | Source | Status |
| --- | --- | --- | --- | --- |
| FIX-FN-001 | export | \`missingExport\` | \`src/hollow.mjs\` | ACTIVE |
`;
  const r = validateFunctionCatalogContent(md, "FIX-", { root, authorityRel: "fixture" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("export symbol")));
});

test("negative: ACTIVE function missing source file", () => {
  const root = mkFixture({});
  const md = `| ID | Kind | Name | Source | Status |
| --- | --- | --- | --- | --- |
| FIX-FN-002 | export | \`fn\` | \`src/does-not-exist.mjs\` | ACTIVE |
`;
  const r = validateFunctionCatalogContent(md, "FIX-", { root, authorityRel: "fixture" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("missing source file")));
});

test("negative: duplicate function IDs within one module catalog", () => {
  const root = mkFixture({
    "src/ok.mjs": "export function dup() {}\n",
  });
  const md = `| ID | Kind | Name | Source | Status |
| --- | --- | --- | --- | --- |
| FIX-FN-003 | export | \`dup\` | \`src/ok.mjs\` | ACTIVE |
| FIX-FN-003 | export | \`dup\` | \`src/ok.mjs\` | ACTIVE |
`;
  const r = validateFunctionCatalogContent(md, "FIX-", { root, authorityRel: "fixture" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("duplicate function ID")));
});

test("negative: duplicate function IDs across modules", () => {
  const root = mkFixture({
    "src/a.mjs": "export function a() {}\n",
  });
  const catA = `| ID | Kind | Name | Source | Status |
| --- | --- | --- | --- | --- |
| FIX-FN-010 | export | \`a\` | \`src/a.mjs\` | ACTIVE |
`;
  const catB = `| ID | Kind | Name | Source | Status |
| --- | --- | --- | --- | --- |
| FIX-FN-010 | export | \`a\` | \`src/a.mjs\` | ACTIVE |
`;
  const r = validateFunctionIdsGlobally(
    [
      { authorityRel: "mod-a", idPrefix: "FIX-", markdown: catA },
      { authorityRel: "mod-b", idPrefix: "FIX-", markdown: catB },
    ],
    { root },
  );
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes("Duplicate function ID")));
});

test("positive: production governance function catalog validates", () => {
  const r = validateFunctionCatalog("architecture/modules/governance", "GOV-");
  assert.equal(r.ok, true, r.errors?.join("; "));
});

test("negative: change ledger missing required field", () => {
  const bad = `## CHG-FIX-001

| Field | Value |
| --- | --- |
| **Date** | 2026-11-11 |
| **PR** | #2 |
| **Code baseline** | abc |
| **Affected components** | x |
| **BEFORE** | a |
| **WHY** | b |
| **CHANGE** | c |
| **EXPECTED_EFFECT** | d |
| **VALIDATION** | e |
| **OBSERVED_EFFECT** | f |
| **TRADEOFFS** | g |
| **REMAINING_GAPS** | h |
| **Evidence** | i |
| **Validation status** | PROPOSED |
`;
  const errs = validateChangeLedgerText(bad, "fixture");
  assert.ok(errs.some((e) => e.includes("NON_EFFECTS")));
});

test("positive: checkModuleAuthority passes on repository", () => {
  const r = checkModuleAuthority();
  assert.equal(r.status, "pass", r.errors?.join("; "));
});
