import assert from "node:assert/strict";
import test from "node:test";
import { parseIcuMessage } from "../lib/icu.mjs";
import { validateI18nCatalogs } from "../checks/i18n.mjs";

test("collects argument, number, date and time placeholders", () => {
  const r = parseIcuMessage("Total {amount, number, currency} on {orderDate, date, short} at {seenAt, time, short}");
  assert.equal(r.ok, true);
  assert.deepEqual([...r.placeholders].sort(), ["amount", "orderDate", "seenAt"]);
});

test("does not treat formatting tag names or pound as placeholders", () => {
  const r = parseIcuMessage(
    "Hello <bold>{name}</bold> — {count, plural, one {# item} other {# items}}",
  );
  assert.equal(r.ok, true);
  assert.deepEqual([...r.placeholders].sort(), ["count", "name"]);
});

test("collects placeholders inside nested select within plural", () => {
  const r = parseIcuMessage(
    "{gender, select, female {{count, plural, one {One she} other {Many she}}} male {{count, plural, one {One he} other {Many he}}} other {Unknown}}",
  );
  assert.equal(r.ok, true);
  assert.deepEqual([...r.placeholders].sort(), ["count", "gender"]);
});

test("fails de-DE/en-US validation when date placeholder mismatches", () => {
  const de = { "event.when": "Am {orderDate, date, short}" };
  const en = { "event.when": "On {eventDate, date, short}" };
  const result = validateI18nCatalogs(["de-DE", "en-US"], (tag) => (tag === "de-DE" ? de : en));
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("Placeholder")));
});

test("passes when formatted placeholders match across locales", () => {
  const de = { "event.when": "Am {orderDate, date, short}" };
  const en = { "event.when": "On {orderDate, date, short}" };
  const result = validateI18nCatalogs(["de-DE", "en-US"], (tag) => (tag === "de-DE" ? de : en));
  assert.equal(result.ok, true);
});
