import fs from "node:fs";
import path from "node:path";
import { fromRoot } from "../lib/paths.mjs";
import { parseModuleRegistry } from "./module-registry.mjs";
import { readText } from "../lib/read.mjs";
import { validateKnowledgeGraph } from "../lib/knowledge-graph.mjs";

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

const GRAPH_PREFIX = {
  governance: "GOV-",
  i18n: "I18N-",
};

const FN_ID_RE = /\b([A-Z]{2,8}-FN-\d{3})\b/g;

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

function parseFunctionIds(modules) {
  const errors = [];
  const seen = new Map();
  for (const mod of modules) {
    const rel = mod.fields["Authority path"];
    if (!authorityExists(rel)) continue;
    const cat = fromRoot(path.join(rel, "FUNCTION_CATALOG.md"));
    if (!fs.existsSync(cat)) continue;
    const text = readText(cat);
    let m;
    const re = new RegExp(FN_ID_RE.source, "g");
    while ((m = re.exec(text)) !== null) {
      const id = m[1];
      if (seen.has(id)) {
        errors.push(`Duplicate function ID ${id} in ${mod.name} and ${seen.get(id)}`);
      } else {
        seen.set(id, mod.name);
      }
    }
  }
  return errors;
}

export function checkModuleAuthority() {
  const text = readText(fromRoot("architecture/MODULE_REGISTRY.md"));
  const { modules, errors: parseErrors } = parseModuleRegistry(text);
  const errors = [...parseErrors];

  const allowedCoverage = new Set(["NOT_STARTED", "AUDIT_IN_PROGRESS", "AUTHORITY_ACTIVE", "SUPERSEDED"]);

  for (const mod of modules) {
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
      const prefix = GRAPH_PREFIX[mod.name];
      if (!prefix) {
        errors.push(`Module \`${mod.name}\` AUTHORITY_ACTIVE requires graph id prefix mapping`);
      } else {
        const graph = validateKnowledgeGraph(authorityPath, prefix);
        if (!graph.ok) errors.push(...graph.errors);
      }
      const readme = readText(fromRoot(path.join(authorityPath, "README.md")));
      if (!readme.includes("Mandatory entry")) {
        errors.push(`${authorityPath}/README.md must include navigation / mandatory entry section`);
      }
    }
  }

  errors.push(...parseFunctionIds(modules));

  return {
    id: "module-authority",
    status: errors.length ? "fail" : "pass",
    errors,
    meta: { modules: modules.length },
  };
}
