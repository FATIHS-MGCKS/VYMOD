import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./paths.mjs";

export function readText(absPath) {
  return fs.readFileSync(absPath, "utf8");
}

export function pathExists(absPath) {
  return fs.existsSync(absPath);
}

export function listFilesRecursive(dir, filter = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.name === "node_modules" || ent.name === ".git") continue;
    if (ent.isDirectory()) out.push(...listFilesRecursive(full, filter));
    else if (filter(full)) out.push(full);
  }
  return out;
}

export function rel(abs) {
  return path.relative(REPO_ROOT, abs);
}
