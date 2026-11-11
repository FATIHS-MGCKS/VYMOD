#!/usr/bin/env node
import { checkRequiredFiles } from "./checks/required-files.mjs";
import { checkCursorRules } from "./checks/cursor-rules.mjs";
import { checkDocLinks } from "./checks/doc-links.mjs";
import { checkModuleRegistry } from "./checks/module-registry.mjs";
import { checkI18n } from "./checks/i18n.mjs";
import { checkHardcodedUi } from "./checks/hardcoded-ui.mjs";
import { checkSecrets } from "./checks/secrets.mjs";
import { checkDependencyAudit } from "./checks/dependency-audit.mjs";
import { checkTypecheck } from "./checks/typecheck.mjs";

const CHECKS = [
  { id: "required-files", run: checkRequiredFiles },
  { id: "cursor-rules", run: checkCursorRules },
  { id: "doc-links", run: checkDocLinks },
  { id: "module-registry", run: checkModuleRegistry },
  { id: "i18n", run: checkI18n },
  { id: "hardcoded-ui", run: checkHardcodedUi },
  { id: "secrets", run: checkSecrets },
  { id: "dependency-audit", run: checkDependencyAudit },
  { id: "typecheck", run: checkTypecheck },
];

function parseOnly(argv) {
  const idx = argv.indexOf("--only");
  if (idx === -1) return null;
  return argv[idx + 1];
}

const only = parseOnly(process.argv);
const selected = only
  ? CHECKS.filter((c) => c.id === only || (only === "docs" && c.id === "doc-links"))
  : CHECKS;

const results = [];
let failed = false;

for (const { run } of selected) {
  const result = run();
  results.push(result);
  if (result.status === "fail") failed = true;
  const icon = result.status === "pass" ? "OK" : result.status === "skip" ? "SKIP" : "FAIL";
  console.log(`[${icon}] ${result.id}`);
  for (const e of result.errors ?? []) console.log(`  - ${e}`);
  if (result.meta?.reason) {
    console.log(`  (${result.meta.reason}: ${result.meta.activation ?? ""})`);
  }
}

console.log("\n--- summary ---");
for (const r of results) {
  console.log(`${r.id}: ${r.status}`);
}

if (failed) process.exit(1);
process.exit(0);
