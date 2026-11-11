import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { fromRoot } from "./paths.mjs";

export function loadYamlFile(absPath) {
  return yaml.parse(fs.readFileSync(absPath, "utf8"));
}

/**
 * @param {string} authorityRel e.g. architecture/modules/governance
 * @param {string} idPrefix e.g. GOV-
 */
export function validateKnowledgeGraph(authorityRel, idPrefix) {
  const errors = [];
  const authorityAbs = fromRoot(authorityRel);
  const graphDir = path.join(authorityAbs, "graph");

  const schema = loadYamlFile(path.join(graphDir, "schema.yaml"));
  const nodesDoc = loadYamlFile(path.join(graphDir, "nodes.yaml"));
  const edgesDoc = loadYamlFile(path.join(graphDir, "edges.yaml"));
  const invariantsDoc = loadYamlFile(path.join(graphDir, "invariants.yaml"));

  const allowedTypes = new Set(schema.node_types ?? []);
  const allowedEpistemic = new Set(schema.epistemic_status_values ?? []);
  const allowedRelations = new Set(schema.relation_types ?? []);

  if (schema.id_prefix !== idPrefix) {
    errors.push(`${authorityRel}: schema id_prefix must be ${idPrefix}`);
  }

  const nodes = nodesDoc.nodes ?? [];
  const nodeById = new Map();

  for (const n of nodes) {
    if (!n.id) {
      errors.push(`${authorityRel}: node missing id`);
      continue;
    }
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

  for (const e of edgesDoc.edges ?? []) {
    if (!allowedRelations.has(e.relation)) {
      errors.push(`${authorityRel}: invalid relation ${e.relation}`);
    }
    if (!nodeById.has(e.from)) errors.push(`${authorityRel}: dangling edge from ${e.from}`);
    if (!nodeById.has(e.to)) errors.push(`${authorityRel}: dangling edge to ${e.to}`);
  }

  for (const inv of invariantsDoc.invariants ?? []) {
    if (!inv.id?.startsWith(idPrefix)) {
      errors.push(`${authorityRel}: invariant ${inv.id} bad id prefix`);
    }
    for (const ref of inv.evidence ?? []) {
      if (!nodeById.has(ref)) {
        errors.push(`${authorityRel}: invariant ${inv.id} missing evidence node ${ref}`);
      }
    }
    for (const sp of inv.source_paths ?? []) {
      if (!fs.existsSync(fromRoot(sp))) {
        errors.push(`${authorityRel}: invariant ${inv.id} missing source_path ${sp}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
