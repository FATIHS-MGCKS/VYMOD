import assert from "node:assert/strict";
import test from "node:test";
import { validateFrontmatter } from "../checks/cursor-rules.mjs";

test("validateFrontmatter rejects invalid alwaysApply", () => {
  const errs = validateFrontmatter("description: test\nalwaysApply: yes\n", "bad.mdc");
  assert.ok(errs.some((e) => e.includes("alwaysApply must be true or false")));
});

test("validateFrontmatter rejects unsupported fields", () => {
  const errs = validateFrontmatter("description: test\nfoo: bar\n", "bad.mdc");
  assert.ok(errs.some((e) => e.includes('unsupported frontmatter field "foo"')));
});
