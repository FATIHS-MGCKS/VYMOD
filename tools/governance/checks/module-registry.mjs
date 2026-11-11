import { fromRoot } from "../lib/paths.mjs";
import { readText } from "../lib/read.mjs";

export function parseModuleRegistry(text) {
  const errors = [];
  const modules = [];
  const names = new Set();

  const badHeadings = [...text.matchAll(/^## (?!`)(.+)$/gm)];
  for (const m of badHeadings) {
    const title = m[1].trim();
    if (title.startsWith("|")) continue;
    if (title === "Module Registry") continue;
    errors.push(`Malformed module heading (expected ## \`name\`): ## ${title}`);
  }

  const sections = text.split(/^## `/gm).slice(1);
  for (const chunk of sections) {
    const nameEnd = chunk.indexOf("`");
    if (nameEnd === -1) {
      errors.push("Module section missing closing backtick in heading");
      continue;
    }
    const name = chunk.slice(0, nameEnd).trim();
    if (!name) {
      errors.push("Empty module name in MODULE_REGISTRY");
      continue;
    }
    if (names.has(name)) {
      errors.push(`Duplicate module entry: \`${name}\``);
    }
    names.add(name);

    const body = chunk.slice(nameEnd + 1);
    const fields = {};
    const re = /^- \*\*(Owner|Path|Status):\*\*\s*(.+)$/gm;
    let m;
    while ((m = re.exec(body)) !== null) {
      fields[m[1]] = m[2].trim().replace(/^`|`$/g, "");
    }
    modules.push({ name, fields });
  }

  return { modules, errors };
}

export function checkModuleRegistry() {
  const path = fromRoot("architecture/MODULE_REGISTRY.md");
  const text = readText(path);
  const { modules, errors: parseErrors } = parseModuleRegistry(text);
  const errors = [...parseErrors];

  if (modules.length === 0) errors.push("No modules found in MODULE_REGISTRY");

  for (const mod of modules) {
    for (const key of ["Owner", "Path", "Status"]) {
      if (!mod.fields[key]) {
        errors.push(`Module \`${mod.name}\` missing **${key}:**`);
      }
    }
    const status = mod.fields.Status;
    const allowed = new Set(["PLANNED", "SCAFFOLD", "ACTIVE", "DEPRECATED"]);
    if (status && !allowed.has(status)) {
      errors.push(`Module \`${mod.name}\` has invalid Status: ${status}`);
    }
  }

  return {
    id: "module-registry",
    status: errors.length ? "fail" : "pass",
    errors,
    meta: { modules: modules.length },
  };
}
