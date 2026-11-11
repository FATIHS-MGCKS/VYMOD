import fs from "node:fs";
import path from "node:path";
import { loadYamlFile } from "./knowledge-graph.mjs";
import { fromRoot, REPO_ROOT } from "./paths.mjs";

const PREFIX_RE = /^[A-Z][A-Z0-9]{1,7}-$/;

/**
 * @param {object} schema
 * @param {string} authorityRel
 */
export function validateSchemaMetadata(schema, authorityRel) {
  const errors = [];
  const id_prefix = schema?.id_prefix;
  const module = schema?.module;
  if (!id_prefix || typeof id_prefix !== "string") {
    errors.push(`${authorityRel}: schema.yaml missing id_prefix`);
  } else if (!PREFIX_RE.test(id_prefix)) {
    errors.push(`${authorityRel}: invalid id_prefix ${id_prefix}`);
  }
  if (!module || typeof module !== "string") {
    errors.push(`${authorityRel}: schema.yaml missing module`);
  }
  return { module, id_prefix, errors };
}

/**
 * @param {string} authorityRel
 * @param {{ root?: string }} [options]
 */
export function readModuleGraphMeta(authorityRel, options = {}) {
  const root = options.root ?? REPO_ROOT;
  const errors = [];
  const schemaPath = path.join(root, authorityRel, "graph/schema.yaml");
  if (!fs.existsSync(schemaPath)) {
    return { errors: [`${authorityRel}: missing graph/schema.yaml`] };
  }
  try {
    const schema = loadYamlFile(schemaPath);
    const meta = validateSchemaMetadata(schema, authorityRel);
    return { module: meta.module, id_prefix: meta.id_prefix, errors: meta.errors };
  } catch (e) {
    return { errors: [`${authorityRel}: schema.yaml parse error — ${e.message}`] };
  }
}

/**
 * @param {{ moduleName: string; authorityPath: string }[]} activeModules
 * @param {{ root?: string }} [options]
 */
export function validateGraphNamespaceRegistry(activeModules, options = {}) {
  const errors = [];
  const prefixToModule = new Map();
  const moduleToPrefix = new Map();

  for (const { moduleName, authorityPath } of activeModules) {
    const meta = readModuleGraphMeta(authorityPath, options);
    errors.push(...meta.errors);
    if (!meta.id_prefix || !meta.module) continue;

    if (meta.module !== moduleName) {
      errors.push(
        `${authorityPath}: schema.module=${meta.module} must match registry module \`${moduleName}\``,
      );
    }

    if (prefixToModule.has(meta.id_prefix)) {
      errors.push(
        `Duplicate graph id_prefix ${meta.id_prefix} on modules ${prefixToModule.get(meta.id_prefix)} and ${moduleName}`,
      );
    } else {
      prefixToModule.set(meta.id_prefix, moduleName);
    }

    if (moduleToPrefix.has(moduleName)) {
      errors.push(`Duplicate module graph registration for ${moduleName}`);
    } else {
      moduleToPrefix.set(moduleName, meta.id_prefix);
    }
  }

  return { ok: errors.length === 0, errors, prefixToModule };
}
