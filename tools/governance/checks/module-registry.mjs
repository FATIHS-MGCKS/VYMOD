import { fromRoot } from "../lib/paths.mjs";
import { readText } from "../lib/read.mjs";

export function parseModuleRegistry(text) {
  const modules = [];
  const sections = text.split(/^## `/gm).slice(1);
  for (const chunk of sections) {
    const nameEnd = chunk.indexOf("`");
    if (nameEnd === -1) continue;
    const name = chunk.slice(0, nameEnd);
    const body = chunk.slice(nameEnd + 1);
    const fields = {};
    let m;
    const re = /^- \*\*(Owner|Path|Status):\*\*\s*(.+)$/gm;
    while ((m = re.exec(body)) !== null) {
      fields[m[1]] = m[2].trim().replace(/^`|`$/g, "");
    }
    modules.push({ name, fields });
  }
  return modules;
}

export function checkModuleRegistry() {
  const path = fromRoot("architecture/MODULE_REGISTRY.md");
  const text = readText(path);
  const modules = parseModuleRegistry(text);
  const errors = [];

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

  return { id: "module-registry", status: errors.length ? "fail" : "pass", errors, meta: { modules: modules.length } };
}
