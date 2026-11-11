import assert from "node:assert/strict";
import test from "node:test";
import { checkRequiredFiles } from "../checks/required-files.mjs";

test("required P0 files exist", () => {
  const result = checkRequiredFiles();
  assert.equal(result.status, "pass", result.errors?.join("; "));
});
