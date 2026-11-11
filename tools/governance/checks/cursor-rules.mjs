import fs from "node:fs";
import path from "node:path";
import { fromRoot } from "../lib/paths.mjs";

const RULES_DIR = fromRoot(".cursor/rules");

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
    const hasDescription = /^description:\s*.+/m.test(fm);
    const alwaysApply = /^alwaysApply:\s*true\s*$/m.test(fm);
    if (!hasDescription && !alwaysApply) {
      errors.push(`${file}: frontmatter needs description or alwaysApply`);
    }
    if (!text.slice(end + 5).trim()) {
      errors.push(`${file}: empty rule body`);
    }
  }

  return { id: "cursor-rules", status: errors.length ? "fail" : "pass", errors };
}
