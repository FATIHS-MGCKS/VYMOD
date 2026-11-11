import fs from "node:fs";
import { spawnSync } from "node:child_process";
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

const SKIP_EXT = new Set([".png", ".jpg", ".woff", ".woff2", ".gif", ".ico", ".mp4", ".pdf"]);
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

function regexSecretScan() {
  const errors = [];
  const files = listFilesRecursive(REPO_ROOT, (f) => {
    const ext = f.includes(".") ? f.slice(f.lastIndexOf(".")) : "";
    if (SKIP_EXT.has(ext)) return false;
    if (f.includes("/node_modules/")) return false;
    if (f.includes("/.git/")) return false;
    if (f.includes("/tools/governance/tests/")) return false;
    if (f.includes("/tools/governance/fixtures/")) return false;
    if (ext && !SCAN_EXT.has(ext) && ext !== "") return false;
    return true;
  });

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const { name, re } of PATTERNS) {
      if (re.test(text)) {
        errors.push(`Baseline pattern ${name} matched in ${rel(file)}`);
      }
    }
  }
  return errors;
}

function gitleaksAvailable() {
  const r = spawnSync("gitleaks", ["version"], { encoding: "utf8" });
  return r.status === 0;
}

function runGitleaks() {
  const args = ["detect", "--source", REPO_ROOT, "--no-banner", "--redact", "--exit-code", "1"];
  const r = spawnSync("gitleaks", args, { encoding: "utf8" });
  if (r.error) {
    return { ran: false, error: r.error.message };
  }
  if (r.status === 0) return { ran: true, findings: [] };
  if (r.status === 1) {
    return {
      ran: true,
      findings: [`gitleaks reported leaks (see CI log)`, r.stdout?.trim(), r.stderr?.trim()].filter(Boolean),
    };
  }
  return {
    ran: true,
    findings: [`gitleaks execution failed (exit ${r.status})`, r.stderr?.trim()].filter(Boolean),
  };
}

export function checkSecrets() {
  const errors = [...regexSecretScan()];
  const meta = { baselinePatterns: true };

  if (gitleaksAvailable()) {
    const gl = runGitleaks();
    meta.gitleaks = "executed";
    if (gl.findings?.length) errors.push(...gl.findings);
  } else if (process.env.CI === "true") {
    errors.push(
      "gitleaks binary not found in CI — install gitleaks before npm run validate (see .github/workflows/governance.yml)",
    );
    meta.gitleaks = "missing_in_ci";
  } else {
    meta.gitleaks = "skipped_local";
    meta.p1Blocker =
      "Install gitleaks locally for parity with CI, or rely on workflow gitleaks step (P1: mandatory local install doc)";
  }

  return { id: "secrets", status: errors.length ? "fail" : "pass", errors, meta };
}
