import fs from "node:fs";
import path from "node:path";
import { fromRoot } from "../lib/paths.mjs";

const RULES_DIR = fromRoot(".cursor/rules");
const SUPPORTED_FM_KEYS = new Set(["description", "alwaysApply", "globs"]);

export function validateFrontmatter(fm, file) {
  const errors = [];
  const lines = fm.split("\n");
  const keysSeen = new Set();

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;

    if (/^\s+-\s+/.test(line)) {
      if (!keysSeen.has("globs")) {
        errors.push(`${file}: YAML list entry outside globs block (line ${i + 1})`);
      }
      continue;
    }

    const m = /^([\w]+):\s*(.*)$/.exec(line);
    if (!m) {
      errors.push(`${file}: invalid frontmatter line: ${line}`);
      continue;
    }
    const key = m[1];
    const value = m[2].trim();
    keysSeen.add(key);

    if (!SUPPORTED_FM_KEYS.has(key)) {
      errors.push(`${file}: unsupported frontmatter field "${key}" (allowed: ${[...SUPPORTED_FM_KEYS].join(", ")})`);
    }
    if (key === "alwaysApply") {
      if (value !== "true" && value !== "false") {
        errors.push(`${file}: alwaysApply must be true or false, got ${value || "(empty)"}`);
      }
    }
    if (key === "description" && !value) {
      errors.push(`${file}: description must not be empty`);
    }
    if (key === "globs") {
      const hasInline = value.length > 0;
      const hasList = i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1]);
      if (!hasInline && !hasList) {
        errors.push(`${file}: globs must be a YAML list or inline value`);
      }
    }
  }

  const hasDescription = keysSeen.has("description");
  const alwaysApplyTrue = /^alwaysApply:\s*true\s*$/m.test(fm);
  if (!hasDescription && !alwaysApplyTrue) {
    errors.push(`${file}: frontmatter needs description or alwaysApply: true`);
  }

  return errors;
}

export function checkCursorRules() {
  const errors = [];
  if (!fs.existsSync(RULES_DIR)) {
    return { id: "cursor-rules", status: "fail", errors: ["Missing .cursor/rules"] };
  }
  const files = fs.readdirSync(RULES_DIR).filter((f) => f.endsWith(".mdc"));
  if (files.length === 0) errors.push("No .mdc cursor rules found");

  for (const file of files) {
    const text = fs.readFileSync(path.join(RULES_DIR, file), "utf8");
    if (!text.startsWith("---\n")) {
      errors.push(`${file}: missing opening frontmatter ---`);
      continue;
    }
    const end = text.indexOf("\n---\n", 4);
    if (end === -1) {
      errors.push(`${file}: missing closing frontmatter ---`);
      continue;
    }
    const fm = text.slice(4, end);
    errors.push(...validateFrontmatter(fm, file));
    if (!text.slice(end + 5).trim()) {
      errors.push(`${file}: empty rule body`);
    }
  }

  return { id: "cursor-rules", status: errors.length ? "fail" : "pass", errors };
}
