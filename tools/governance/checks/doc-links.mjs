import fs from "node:fs";
import path from "node:path";
import { fromRoot, REPO_ROOT } from "../lib/paths.mjs";
import { listFilesRecursive, readText, rel } from "../lib/read.mjs";

const SCAN_ROOTS = [
  "README.md",
  "AGENTS.md",
  "architecture",
  "compliance",
  "standards",
  "docs",
  "i18n/ADAPTER.md",
];

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;

function collectMarkdownFiles() {
  const files = [];
  for (const entry of SCAN_ROOTS) {
    const abs = fromRoot(entry);
    if (!fs.existsSync(abs)) continue;
    const stat = fs.statSync(abs);
    if (stat.isFile()) files.push(abs);
    else files.push(...listFilesRecursive(abs, (f) => f.endsWith(".md")));
  }
  return [...new Set(files)];
}

function resolveLink(fromFile, target) {
  const t = target.trim();
  if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("mailto:")) {
    return { skip: true };
  }
  if (t.startsWith("#")) return { skip: true };
  const [filePart, anchor] = t.split("#");
  const base = path.dirname(fromFile);
  const resolved = filePart ? path.resolve(base, filePart) : fromFile;
  return { skip: false, resolved, anchor };
}

export function checkDocLinks() {
  const errors = [];
  const checked = new Set();

  for (const file of collectMarkdownFiles()) {
    const text = readText(file);
    let m;
    while ((m = LINK_RE.exec(text)) !== null) {
      const { skip, resolved } = resolveLink(file, m[1]);
      if (skip) continue;
      const key = `${rel(file)} -> ${m[1]}`;
      if (checked.has(key)) continue;
      checked.add(key);
      if (!fs.existsSync(resolved)) {
        errors.push(`Broken link in ${rel(file)}: (${m[1]})`);
      }
    }
  }

  return {
    id: "doc-links",
    status: errors.length ? "fail" : "pass",
    errors,
    meta: { filesScanned: collectMarkdownFiles().length },
  };
}

export function checkDocLinksForRepo(rootDir) {
  const prev = REPO_ROOT;
  // test hook: not used in production
  void prev;
  return checkDocLinks();
}
