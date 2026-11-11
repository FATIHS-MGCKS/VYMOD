import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { fromRoot } from "./paths.mjs";

export function loadYamlFile(absPath) {
  const raw = fs.readFileSync(absPath, "utf8");
  return yaml.parse(raw);
}

const EVIDENCE_TYPES = new Set(["evidence", "test_evidence"]);
const REQUIRED_NODE_FIELDS = ["id", "type", "title", "epistemic_status", "summary"];

/**
 * @param {string} authorityRel
 * @param {string} idPrefix
 * @param {string} [expectedModule]
 */
export function validateKnowledgeGraph(authorityRel, idPrefix, expectedModule) {
  const errors = [];
  const authorityAbs = fromRoot(authorityRel);
  const graphDir = path.join(authorityAbs, "graph");

  let schema;
  let nodesDoc;
  let edgesDoc;
  let invariantsDoc;
  try {
    schema = loadYamlFile(path.join(graphDir, "schema.yaml"));
    nodesDoc = loadYamlFile(path.join(graphDir, "nodes.yaml"));
    edgesDoc = loadYamlFile(path.join(graphDir, "edges.yaml"));
    invariantsDoc = loadYamlFile(path.join(graphDir, "invariants.yaml"));
  } catch (e) {
    return { ok: false, errors: [`${authorityRel}: malformed graph YAML — ${e.message}`] };
  }

  if (!schema?.version) errors.push(`${authorityRel}: schema.yaml missing version`);
  const allowedTypes = new Set(schema.node_types ?? []);
  const allowedEpistemic = new Set(schema.epistemic_status_values ?? []);
  const allowedRelations = new Set(schema.relation_types ?? []);

  if (schema.id_prefix !== idPrefix) {
    errors.push(`${authorityRel}: schema id_prefix ${schema.id_prefix} !== expected ${idPrefix}`);
  }
  if (expectedModule && schema.module !== expectedModule) {
    errors.push(`${authorityRel}: schema.module ${schema.module} !== ${expectedModule}`);
  }

  const nodes = nodesDoc?.nodes;
  if (!Array.isArray(nodes)) {
    errors.push(`${authorityRel}: nodes.yaml must define nodes array`);
    return { ok: false, errors };
  }

  const nodeById = new Map();
  for (const n of nodes) {
    for (const field of REQUIRED_NODE_FIELDS) {
      if (n[field] === undefined || n[field] === "") {
        errors.push(`${authorityRel}: node missing required field ${field}`);
      }
    }
    if (!n.id) continue;
    if (!n.id.startsWith(idPrefix)) {
      errors.push(`${authorityRel}: node ${n.id} must start with ${idPrefix}`);
    }
    if (nodeById.has(n.id)) errors.push(`${authorityRel}: duplicate node id ${n.id}`);
    nodeById.set(n.id, n);
    if (!allowedTypes.has(n.type)) {
      errors.push(`${authorityRel}: node ${n.id} invalid type ${n.type}`);
    }
    if (!allowedEpistemic.has(n.epistemic_status)) {
      errors.push(`${authorityRel}: node ${n.id} invalid epistemic_status`);
    }
    for (const sp of n.source_paths ?? []) {
      if (!fs.existsSync(fromRoot(sp))) {
        errors.push(`${authorityRel}: node ${n.id} missing source_path ${sp}`);
      }
    }
  }

  const edges = edgesDoc?.edges;
  if (!Array.isArray(edges)) {
    errors.push(`${authorityRel}: edges.yaml must define edges array`);
  } else {
    for (const e of edges) {
      if (!e.from || !e.to || !e.relation) {
        errors.push(`${authorityRel}: edge missing from/to/relation`);
        continue;
      }
      if (!allowedRelations.has(e.relation)) {
        errors.push(`${authorityRel}: invalid relation ${e.relation}`);
      }
      if (!nodeById.has(e.from)) errors.push(`${authorityRel}: dangling edge from ${e.from}`);
      if (!nodeById.has(e.to)) errors.push(`${authorityRel}: dangling edge to ${e.to}`);
    }
  }

  const invariants = invariantsDoc?.invariants;
  if (!Array.isArray(invariants)) {
    errors.push(`${authorityRel}: invariants.yaml must define invariants array`);
  } else {
    const invIds = new Set();
    for (const inv of invariants) {
      if (!inv.id) {
        errors.push(`${authorityRel}: invariant missing id`);
        continue;
      }
      if (!inv.id.startsWith(idPrefix)) {
        errors.push(`${authorityRel}: invariant ${inv.id} bad id prefix`);
      }
      if (invIds.has(inv.id)) errors.push(`${authorityRel}: duplicate invariant id ${inv.id}`);
      invIds.add(inv.id);
      if (!inv.statement) errors.push(`${authorityRel}: invariant ${inv.id} missing statement`);
      for (const ref of inv.evidence ?? []) {
        const node = nodeById.get(ref);
        if (!node) {
          errors.push(`${authorityRel}: invariant ${inv.id} missing evidence node ${ref}`);
        } else if (!EVIDENCE_TYPES.has(node.type)) {
          errors.push(
            `${authorityRel}: invariant ${inv.id} evidence ${ref} must be evidence|test_evidence, got ${node.type}`,
          );
        }
      }
      for (const sp of inv.source_paths ?? []) {
        if (!fs.existsSync(fromRoot(sp))) {
          errors.push(`${authorityRel}: invariant ${inv.id} missing source_path ${sp}`);
        }
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
