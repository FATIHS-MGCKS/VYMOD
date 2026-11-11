import fs from "node:fs";
import { execSync } from "node:child_process";
import { fromRoot, REPO_ROOT } from "../lib/paths.mjs";
import { listFilesRecursive } from "../lib/read.mjs";

const APP_ROOTS = ["apps", "src", "packages"];

function hasApplicationTypeScript() {
  for (const dir of APP_ROOTS) {
    const root = fromRoot(dir);
    if (!fs.existsSync(root)) continue;
    for (const file of listFilesRecursive(root, (f) => /\.(ts|tsx)$/.test(f))) {
      if (file.includes(".test.") || file.includes("__tests__")) continue;
      if (file.includes(`${fs.sep}tools${fs.sep}governance${fs.sep}`)) continue;
      return true;
    }
  }
  return false;
}

export function checkTypecheck() {
  const tsconfig = fromRoot("tsconfig.json");
  if (!fs.existsSync(tsconfig)) {
    return {
      id: "typecheck",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Add tsconfig.json for application TypeScript",
      },
    };
  }

  if (!hasApplicationTypeScript()) {
    return {
      id: "typecheck",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Add TypeScript sources under apps/, src/, or packages/",
      },
    };
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(fromRoot("package.json"), "utf8"));
    const script = pkg.scripts?.typecheck ? "npm run typecheck" : "npx tsc --noEmit -p tsconfig.json";
    execSync(script, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { id: "typecheck", status: "pass", errors: [] };
  } catch (e) {
    const detail = [e.stdout, e.stderr].filter(Boolean).join("\n").trim() || e.message;
    return {
      id: "typecheck",
      status: "fail",
      errors: ["TypeScript check failed", detail],
    };
  }
}
