import fs from "node:fs";
import { fromRoot } from "../lib/paths.mjs";
import { listFilesRecursive, rel } from "../lib/read.mjs";

const SCAN_DIRS = ["apps", "src", "packages"];

// Heuristic: JSX/TSX string literals with 3+ letters in user components (excludes test/governance)
const STRING_LIT = />([A-Z][a-z]{2,}[^<{]*)</g;
const ATTR_STRING = /(?:title|label|placeholder|aria-label)\s*=\s*["']([^"']{3,})["']/gi;

export function checkHardcodedUi() {
  const roots = SCAN_DIRS.map((d) => fromRoot(d)).filter((d) => fs.existsSync(d));
  if (roots.length === 0) {
    return {
      id: "hardcoded-ui",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Create apps/, src/, or packages/ with UI code to enable scan",
      },
    };
  }

  const errors = [];
  const exts = new Set([".tsx", ".jsx", ".vue"]);
  for (const root of roots) {
    for (const file of listFilesRecursive(root, (f) => exts.has(f.slice(f.lastIndexOf("."))))) {
      if (file.includes(".test.") || file.includes("__tests__")) continue;
      const text = fs.readFileSync(file, "utf8");
      if (text.includes("i18n") || text.includes("t(") || text.includes("useTranslation")) continue;
      let m;
      while ((m = STRING_LIT.exec(text)) !== null) {
        const s = m[1].trim();
        if (/^[A-Z][a-z]+(\s+[a-z]+)+$/.test(s)) {
          errors.push(`Possible hardcoded UI string in ${rel(file)}: "${s}"`);
        }
      }
    }
  }

  return {
    id: "hardcoded-ui",
    status: errors.length ? "fail" : "pass",
    errors,
  };
}
