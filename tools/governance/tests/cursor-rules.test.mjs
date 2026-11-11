import assert from "node:assert/strict";
import test from "node:test";
import { checkCursorRules } from "../checks/cursor-rules.mjs";

test("cursor rules validation passes in repo", () => {
  const result = checkCursorRules();
  assert.equal(result.status, "pass", result.errors?.join("; "));
});
