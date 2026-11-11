import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runAll = path.join(path.dirname(fileURLToPath(import.meta.url)), "../run-all.mjs");

test("unknown --only exits with failure", () => {
  const r = spawnSync(process.execPath, [runAll, "--only", "not-a-real-check"], { encoding: "utf8" });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr + r.stdout, /Unknown --only/);
});
