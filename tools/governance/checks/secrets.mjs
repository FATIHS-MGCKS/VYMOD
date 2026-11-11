import fs from "node:fs";
import { REPO_ROOT } from "../lib/paths.mjs";
import { listFilesRecursive, rel } from "../lib/read.mjs";

const PATTERNS = [
  { name: "aws-access-key", re: /AKIA[0-9A-Z]{16}/ },
  { name: "private-key-block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  {
    name: "generic-api-key",
    re: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/i,
  },
];

const SKIP_EXT = new Set([
  ".png",
  ".jpg",
  ".woff",
  ".woff2",
  ".gif",
  ".ico",
  ".mp4",
  ".pdf",
]);

const SCAN_EXT = new Set([
  ".md",
  ".mdc",
  ".json",
  ".mjs",
  ".js",
  ".ts",
  ".tsx",
  ".yml",
  ".yaml",
  ".env",
  ".example",
]);

export function checkSecrets() {
  const errors = [];
  const files = listFilesRecursive(REPO_ROOT, (f) => {
    const ext = f.includes(".") ? f.slice(f.lastIndexOf(".")) : "";
    if (SKIP_EXT.has(ext)) return false;
    if (f.includes(`${pathSep}node_modules${pathSep}`)) return false;
    if (f.includes(`${pathSep}.git${pathSep}`)) return false;
    if (ext && !SCAN_EXT.has(ext) && ext !== "") return false;
    return true;
  });

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const { name, re } of PATTERNS) {
      if (re.test(text)) {
        errors.push(`Secret pattern ${name} matched in ${rel(file)}`);
      }
    }
  }

  return { id: "secrets", status: errors.length ? "fail" : "pass", errors };
}

const pathSep = "/";
