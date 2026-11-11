import assert from "node:assert/strict";
import test from "node:test";
import { validateI18nCatalogs, extractPlaceholders } from "../checks/i18n.mjs";

test("extractPlaceholders finds simple and plural placeholders", () => {
  const s = extractPlaceholders("{count, plural, one {#} other {#}} and {fieldName}");
  assert.deepEqual([...s].sort(), ["count", "fieldName"]);
});

test("validateI18nCatalogs passes canonical de/en catalogs", () => {
  const base = {
    "de-DE": {
      "app.name": "VYMOD",
      "errors.validation.required": "Feld {fieldName} fehlt.",
    },
    "en-US": {
      "app.name": "VYMOD",
      "errors.validation.required": "Field {fieldName} is required.",
    },
  };
  const loader = (tag) => base[tag];
  const result = validateI18nCatalogs(["de-DE", "en-US"], loader);
  assert.equal(result.ok, true);
});

test("validateI18nCatalogs fails on missing key", () => {
  const loader = (tag) =>
    tag === "de-DE"
      ? { "app.name": "VYMOD" }
      : { "app.name": "VYMOD", "extra.only.en": "x" };
  const result = validateI18nCatalogs(["de-DE", "en-US"], loader);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("Extra key") || e.includes("Missing key")));
});

test("validateI18nCatalogs fails on placeholder mismatch", () => {
  const loader = (tag) =>
    tag === "de-DE"
      ? { "k": "Hallo {name}" }
      : { "k": "Hello" };
  const result = validateI18nCatalogs(["de-DE", "en-US"], loader);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("Placeholder")));
});
