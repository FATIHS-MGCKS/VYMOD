import fs from "node:fs";
import { execSync } from "node:child_process";
import { fromRoot, REPO_ROOT } from "../lib/paths.mjs";

function readPackageJson() {
  return JSON.parse(fs.readFileSync(fromRoot("package.json"), "utf8"));
}

function hasLockfile() {
  return (
    fs.existsSync(fromRoot("package-lock.json")) ||
    fs.existsSync(fromRoot("pnpm-lock.yaml")) ||
    fs.existsSync(fromRoot("yarn.lock"))
  );
}

function hasDependencyManifest(pkg) {
  const depCount = Object.keys(pkg.dependencies ?? {}).length;
  const devCount = Object.keys(pkg.devDependencies ?? {}).length;
  return depCount + devCount > 0;
}

export function checkDependencyAudit() {
  const pkg = readPackageJson();

  if (!hasLockfile()) {
    return {
      id: "dependency-audit",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Add a lockfile (package-lock.json, pnpm-lock.yaml, or yarn.lock)",
      },
    };
  }

  if (!hasDependencyManifest(pkg)) {
    return {
      id: "dependency-audit",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Add dependencies or devDependencies to package.json",
      },
    };
  }

  try {
    execSync("npm audit --audit-level=high", {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return {
      id: "dependency-audit",
      status: "pass",
      errors: [],
      meta: { tool: "npm audit", level: "high" },
    };
  } catch (e) {
    const detail = [e.stdout, e.stderr].filter(Boolean).join("\n").trim() || e.message;
    return {
      id: "dependency-audit",
      status: "fail",
      errors: [`npm audit reported high-or-critical vulnerabilities or execution failed`, detail],
    };
  }
}
