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
  { id: "doc-links", run: checkDocLinks, aliasOf: "docs" },
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
let selected = CHECKS;
if (only) {
  selected = CHECKS.filter((c) => c.id === only || c.aliasOf === only);
  if (selected.length === 0) {
    console.error(`Unknown --only value: ${only}`);
    console.error(`Valid values: ${CHECKS.map((c) => c.id).join(", ")}, docs`);
    process.exit(1);
  }
}

const results = [];
let failed = false;

for (const { id, run } of selected) {
  let result;
  try {
    result = run();
    if (!result || !result.id) {
      result = {
        id,
        status: "fail",
        errors: ["Validator returned invalid result shape"],
      };
    }
  } catch (e) {
    result = {
      id,
      status: "fail",
      errors: [`Validator threw: ${e.message}`],
    };
  }

  results.push(result);
  if (result.status === "fail") failed = true;

  const icon = result.status === "pass" ? "OK" : result.status === "skip" ? "SKIP" : "FAIL";
  console.log(`[${icon}] ${result.id}`);
  for (const e of result.errors ?? []) console.log(`  - ${e}`);
  if (result.meta?.reason) {
    console.log(`  (${result.meta.reason}: ${result.meta.activation ?? ""})`);
  }
  if (result.meta?.warnings?.length) {
    for (const w of result.meta.warnings) console.log(`  - warning: ${w}`);
  }
  if (result.meta?.p1Blocker) console.log(`  (P1 note: ${result.meta.p1Blocker})`);
}

console.log("\n--- summary ---");
for (const r of results) {
  console.log(`${r.id}: ${r.status}`);
}

if (failed) process.exit(1);
process.exit(0);
