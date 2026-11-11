import fs from "node:fs";
import path from "node:path";
import { fromRoot } from "../lib/paths.mjs";
import { parseModuleRegistry } from "./module-registry.mjs";
import { readText } from "../lib/read.mjs";
import { validateKnowledgeGraph } from "../lib/knowledge-graph.mjs";
import { validateGraphNamespaceRegistry, readModuleGraphMeta } from "../lib/module-graph-meta.mjs";
import { validateFunctionCatalog } from "../lib/function-catalog.mjs";

const COVERAGE_ACTIVE = "AUTHORITY_ACTIVE";
const COVERAGE_AUDIT = "AUDIT_IN_PROGRESS";
const COVERAGE_NOT_STARTED = "NOT_STARTED";

const AUTHORITY_ACTIVE_FILES = [
  "README.md",
  "AUDIT_MANIFEST.md",
  "CURRENT_STATE.md",
  "AGENT_CONTRACT.md",
  "KNOWLEDGE_GRAPH.md",
  "FUNCTION_CATALOG.md",
  "graph/schema.yaml",
  "graph/nodes.yaml",
  "graph/edges.yaml",
  "graph/invariants.yaml",
  "decisions/DECISION_REGISTER.md",
  "evidence/EVIDENCE_INDEX.md",
  "evidence/PRODUCTION_BASELINE.md",
  "contradictions/KNOWLEDGE_GAPS.md",
  "contradictions/OPEN_CONTRADICTIONS.md",
  "research/CHANGE_LEDGER.md",
  "research/FAILED_APPROACHES.md",
  "research/OPEN_HYPOTHESES.md",
  "research/OPEN_QUESTIONS.md",
];

const AUDIT_MINIMUM_FILES = ["README.md", "AUDIT_MANIFEST.md", "research/CHANGE_LEDGER.md"];

const CHANGE_LEDGER_REQUIRED_FIELDS = [
  "Date",
  "PR",
  "Code baseline",
  "BEFORE",
  "WHY",
  "CHANGE",
  "EXPECTED_EFFECT",
  "VALIDATION",
  "OBSERVED_EFFECT",
  "Evidence",
  "Validation status",
];

function authorityExists(rel) {
  return rel && rel !== "—" && fs.existsSync(fromRoot(rel));
}

function checkAuthorityFiles(rel, files) {
  const errors = [];
  for (const f of files) {
    const abs = fromRoot(path.join(rel, f));
    if (!fs.existsSync(abs)) errors.push(`Missing authority file: ${rel}/${f}`);
  }
  return errors;
}

function validateChangeLedger(rel) {
  const errors = [];
  const ledger = fromRoot(path.join(rel, "research/CHANGE_LEDGER.md"));
  if (!fs.existsSync(ledger)) return errors;
  const text = readText(ledger);
  const sections = text.split(/^## CHG-/gm).slice(1);
  if (sections.length === 0) {
    errors.push(`${rel}: CHANGE_LEDGER has no CHG-* entries`);
    return errors;
  }
  const latest = sections[sections.length - 1];
  for (const field of CHANGE_LEDGER_REQUIRED_FIELDS) {
    if (!latest.includes(`**${field}**`)) {
      errors.push(`${rel}: latest CHANGE_LEDGER entry missing **${field}**`);
    }
  }
  if (latest.match(/\*\*Commit\*\*.*pending merge/i) && latest.includes("PRODUCTION_VALIDATED")) {
    errors.push(`${rel}: CHANGE_LEDGER must not claim PRODUCTION_VALIDATED with pending merge`);
  }
  return errors;
}

export function checkModuleAuthority() {
  const text = readText(fromRoot("architecture/MODULE_REGISTRY.md"));
  const { modules, errors: parseErrors } = parseModuleRegistry(text);
  const errors = [...parseErrors];

  const allowedCoverage = new Set(["NOT_STARTED", "AUDIT_IN_PROGRESS", "AUTHORITY_ACTIVE", "SUPERSEDED"]);
  const activeForGraph = [];

  const moduleNames = new Set();
  for (const mod of modules) {
    if (moduleNames.has(mod.name)) {
      errors.push(`Duplicate registry module id: ${mod.name}`);
    }
    moduleNames.add(mod.name);

    const coverage = mod.fields["Registry coverage status"];
    const authorityPath = mod.fields["Authority path"];

    if (!coverage) {
      errors.push(`Module \`${mod.name}\` missing **Registry coverage status:**`);
      continue;
    }
    if (!allowedCoverage.has(coverage)) {
      errors.push(`Module \`${mod.name}\` invalid Registry coverage status: ${coverage}`);
    }

    if (!mod.fields["Authority path"]) {
      errors.push(`Module \`${mod.name}\` missing **Authority path:**`);
      continue;
    }

    if (coverage === COVERAGE_NOT_STARTED) {
      if (authorityPath !== "—" && authorityExists(authorityPath)) {
        errors.push(
          `Module \`${mod.name}\` is NOT_STARTED but authority path exists: ${authorityPath}`,
        );
      }
      continue;
    }

    if (!authorityExists(authorityPath)) {
      errors.push(`Module \`${mod.name}\` missing authority directory: ${authorityPath}`);
      continue;
    }

    if (coverage === COVERAGE_AUDIT) {
      errors.push(...checkAuthorityFiles(authorityPath, AUDIT_MINIMUM_FILES));
    }

    if (coverage === COVERAGE_ACTIVE) {
      errors.push(...checkAuthorityFiles(authorityPath, AUTHORITY_ACTIVE_FILES));

      const meta = readModuleGraphMeta(authorityPath);
      errors.push(...meta.errors);
      if (meta.id_prefix) {
        activeForGraph.push({ moduleName: mod.name, authorityPath, idPrefix: meta.id_prefix });
        const graph = validateKnowledgeGraph(authorityPath, meta.id_prefix, mod.name);
        if (!graph.ok) errors.push(...graph.errors);

      }

      const readme = readText(fromRoot(path.join(authorityPath, "README.md")));
      const requiredNav = [
        "CURRENT_STATE.md",
        "FUNCTION_CATALOG.md",
        "AGENT_CONTRACT.md",
        "CHANGE_LEDGER.md",
      ];
      for (const doc of requiredNav) {
        if (!readme.includes(doc)) {
          errors.push(`${authorityPath}/README.md must link or name ${doc} in navigation`);
        }
      }

      errors.push(...validateChangeLedger(authorityPath));
    }
  }

  const ns = validateGraphNamespaceRegistry(
    activeForGraph.map(({ moduleName, authorityPath }) => ({ moduleName, authorityPath })),
  );
  if (!ns.ok) errors.push(...ns.errors);

  const globalFnIds = new Map();
  for (const { authorityPath, idPrefix } of activeForGraph) {
    const catalog = validateFunctionCatalog(authorityPath, idPrefix);
    if (!catalog.ok) errors.push(...catalog.errors);
    for (const fid of catalog.functionIds ?? []) {
      if (globalFnIds.has(fid)) {
        errors.push(
          `Duplicate function ID ${fid} across modules ${globalFnIds.get(fid)} and ${authorityPath}`,
        );
      } else {
        globalFnIds.set(fid, authorityPath);
      }
    }
  }

  return {
    id: "module-authority",
    status: errors.length ? "fail" : "pass",
    errors,
    meta: { modules: modules.length, graphNamespaces: ns.prefixToModule?.size ?? 0 },
  };
}
