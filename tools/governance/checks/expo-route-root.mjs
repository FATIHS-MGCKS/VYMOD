import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fromRoot } from "../lib/paths.mjs";

const MOBILE_REL = "apps/mobile";
const ROUTE_ROOT_REL = `${MOBILE_REL}/app`;
const SRC_APP_COLLISION = `${MOBILE_REL}/src/app`;

/** Route files that must exist under apps/mobile/app (groups omitted from URL). */
const REQUIRED_ROUTE_FILES = [
  "index.tsx",
  "_layout.tsx",
  "+not-found.tsx",
  "(public)/_layout.tsx",
  "(public)/welcome.tsx",
  "(public)/sign-in.tsx",
  "(public)/sign-up.tsx",
  "(onboarding)/_layout.tsx",
  "(onboarding)/verify-email.tsx",
  "(onboarding)/vehicle-request.tsx",
  "(onboarding)/approval-pending.tsx",
  "(app)/_layout.tsx",
  "(app)/(tabs)/_layout.tsx",
  "(app)/(tabs)/index.tsx",
  "(app)/(tabs)/location.tsx",
  "(app)/(tabs)/intelligence.tsx",
  "(app)/(tabs)/security.tsx",
  "(app)/(tabs)/profile.tsx",
  "(app)/vehicle/[vehicleId].tsx",
];

/** Logical paths Expo must expose (smoke list — not from Jest route map). */
const REQUIRED_LOGICAL_PATHS = [
  "/",
  "/welcome",
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/vehicle-request",
  "/approval-pending",
  "/location",
  "/intelligence",
  "/security",
  "/profile",
  "/vehicle/[vehicleId]",
  "+not-found",
];

const FORBIDDEN_UNDER_APP = [
  "navigation",
  "providers",
  "authorization.ts",
  "routePolicy.ts",
];

function posixFilesUnder(dir, base = "") {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (fs.statSync(abs).isDirectory()) {
      out.push(...posixFilesUnder(abs, rel));
    } else if (/\.(tsx|ts|jsx|js)$/.test(name)) {
      out.push(rel.replace(/\\/g, "/"));
    }
  }
  return out;
}

function resolveRouterDirectory(mobileRoot) {
  const srcApp = path.join(mobileRoot, "src", "app");
  if (fs.existsSync(srcApp)) {
    return { dir: "src/app", collision: true };
  }
  return { dir: "app", collision: false };
}

function logicalPathsFromRouteFiles(files) {
  const paths = new Set();
  for (const file of files) {
    if (file === "+not-found.tsx") {
      paths.add("+not-found");
      continue;
    }
    if (file === "index.tsx") {
      paths.add("/");
      continue;
    }
    const noExt = file.replace(/\.(tsx|ts|jsx|js)$/, "");
    const segments = noExt
      .split("/")
      .filter((s) => !s.startsWith("_") && !s.startsWith("+") && s !== "_layout")
      .filter((s) => !/^\([^)]+\)$/.test(s));
    const grouped = segments.join("/");
    if (!grouped || grouped === "index") {
      paths.add("/");
      continue;
    }
    paths.add(`/${grouped}`);
  }
  return paths;
}

export function checkExpoRouteRoot(options = {}) {
  const mobileRoot = fromRoot(MOBILE_REL);
  const routeRoot = fromRoot(ROUTE_ROOT_REL);
  const srcApp = fromRoot(SRC_APP_COLLISION);
  const errors = [];
  const meta = { routerDirectory: null, logicalPaths: [] };

  if (fs.existsSync(srcApp)) {
    errors.push(`${SRC_APP_COLLISION} must not exist (Expo selects src/app over app/)`);
  }

  if (!fs.existsSync(routeRoot)) {
    errors.push(`${ROUTE_ROOT_REL} is missing`);
    return { id: "expo-route-root", status: "fail", errors, meta };
  }

  for (const rel of REQUIRED_ROUTE_FILES) {
    const abs = path.join(routeRoot, rel);
    if (!fs.existsSync(abs)) {
      errors.push(`missing route screen: app/${rel}`);
    }
  }

  for (const forbidden of FORBIDDEN_UNDER_APP) {
    if (fs.existsSync(path.join(routeRoot, forbidden))) {
      errors.push(`forbidden application-logic path under app/: ${forbidden}`);
    }
  }

  const resolved = resolveRouterDirectory(mobileRoot);
  meta.routerDirectory = resolved.dir;
  if (resolved.collision) {
    errors.push("getRouterDirectory would select src/app");
  } else if (resolved.dir !== "app") {
    errors.push(`unexpected router directory: ${resolved.dir}`);
  }

  const routeFiles = posixFilesUnder(routeRoot);
  const logical = logicalPathsFromRouteFiles(routeFiles);
  meta.logicalPaths = [...logical].sort();

  for (const required of REQUIRED_LOGICAL_PATHS) {
    if (!logical.has(required)) {
      errors.push(`expected route path not discovered from app/: ${required}`);
    }
  }

  if (!options.skipExportProbe) {
    try {
      const out = execSync("npx expo export --platform ios --output-dir /tmp/vymod-route-probe", {
        cwd: mobileRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, CI: "true" },
        timeout: 180_000,
      });
      const combined = out;
      if (/Using src\/app as the root directory/i.test(combined)) {
        errors.push("expo export log shows src/app as router root");
      }
    } catch (e) {
      const msg = `${e.stdout ?? ""}${e.stderr ?? ""}`;
      if (/Using src\/app as the root directory/i.test(msg)) {
        errors.push("expo export log shows src/app as router root");
      } else if (errors.length === 0) {
        errors.push(`expo export probe failed: ${e.message}`);
      }
    }
  }

  return {
    id: "expo-route-root",
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    meta,
  };
}
