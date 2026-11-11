import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkExpoRouteRoot } from "../checks/expo-route-root.mjs";

test("positive: production mobile app uses app/ route root", () => {
  const result = checkExpoRouteRoot({ skipExportProbe: true });
  assert.equal(result.status, "pass", result.errors?.join("; "));
  assert.equal(result.meta.routerDirectory, "app");
  assert.ok(result.meta.logicalPaths.includes("/welcome"));
});

test("negative: src/app collision fails validation", () => {
  const mobileRoot = path.resolve(process.cwd(), "apps/mobile");
  const probe = path.join(mobileRoot, "src", "app");
  fs.mkdirSync(probe, { recursive: true });
  fs.writeFileSync(path.join(probe, "_layout.tsx"), "export default function X(){return null}", "utf8");
  try {
    const result = checkExpoRouteRoot({ skipExportProbe: true });
    assert.equal(result.status, "fail");
    assert.ok(result.errors.some((e) => e.includes("src/app")));
  } finally {
    fs.rmSync(probe, { recursive: true, force: true });
  }
});
