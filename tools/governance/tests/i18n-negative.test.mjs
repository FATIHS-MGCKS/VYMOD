import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateI18nCatalogs,
  findDuplicateKeysInJsonText,
  validateCatalogObject,
} from "../checks/i18n.mjs";
const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../fixtures/i18n");

function loadFixture(name) {
  const raw = fs.readFileSync(path.join(fixturesDir, name), "utf8");
  return JSON.parse(raw);
}

test("rejects invalid key names via schema", () => {
  const errs = validateCatalogObject({ "Bad-Key": "x" }, "fixture");
  assert.ok(errs.some((e) => e.includes("schema")));
});

test("rejects empty and non-string translations", () => {
  assert.ok(validateCatalogObject({ "app.name": "" }, "fixture").some((e) => e.includes("empty")));
  const errs = validateCatalogObject({ "app.name": 42 }, "fixture");
  assert.ok(errs.some((e) => e.includes("must be a string")));
});

test("rejects malformed ICU plural", () => {
  const errs = validateCatalogObject(
    { "vehicle.list.count": "{count, plural, one {#" },
    "fixture",
  );
  assert.ok(errs.some((e) => e.includes("malformed ICU")));
});

test("detects duplicate keys in raw JSON text", () => {
  const text = `{
    "app.name": "A",
    "app.name": "B"
  }`;
  const errs = findDuplicateKeysInJsonText(text, "dup.json");
  assert.ok(errs.some((e) => e.includes('Duplicate key "app.name"')));
});

test("fixture: missing/extra keys fail parity", () => {
  const de = loadFixture("bad-missing-key.de-DE.json");
  const en = loadFixture("bad-missing-key.en-US.json");
  const result = validateI18nCatalogs(["de-DE", "en-US"], (tag) => (tag === "de-DE" ? de : en));
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("Missing key")));
});

test("fixture: placeholder mismatch fails", () => {
  const de = loadFixture("bad-placeholder.de-DE.json");
  const en = loadFixture("bad-placeholder.en-US.json");
  const result = validateI18nCatalogs(["de-DE", "en-US"], (tag) => (tag === "de-DE" ? de : en));
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("Placeholder")));
});
