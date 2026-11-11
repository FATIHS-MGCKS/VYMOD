import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import { fromRoot } from "../lib/paths.mjs";
import { readText } from "../lib/read.mjs";
import { parseIcuMessage } from "../lib/icu.mjs";

const LOCALES = ["de-DE", "en-US"];
const KEY_LINE_RE = /^\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*:/gm;

let compiledValidator = null;

function getCatalogValidator() {
  if (!compiledValidator) {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    const schema = JSON.parse(readText(fromRoot("i18n/catalog.schema.json")));
    compiledValidator = ajv.compile(schema);
  }
  return compiledValidator;
}

function loadLocaleFromDisk(tag) {
  const p = fromRoot(`i18n/locales/${tag}.json`);
  const text = fs.readFileSync(p, "utf8");
  return { text, data: JSON.parse(text), path: p };
}

export function findDuplicateKeysInJsonText(text, fileLabel) {
  const errors = [];
  const seen = new Map();
  let m;
  const re = new RegExp(KEY_LINE_RE.source, "gm");
  while ((m = re.exec(text)) !== null) {
    const key = m[1];
    const line = text.slice(0, m.index).split("\n").length;
    if (seen.has(key)) {
      errors.push(`Duplicate key "${key}" in ${fileLabel} (lines ${seen.get(key)} and ${line})`);
    } else {
      seen.set(key, line);
    }
  }
  return errors;
}

export function validateCatalogObject(data, tag) {
  const errors = [];
  const validate = getCatalogValidator();
  const valid = validate(data);
  if (!valid) {
    for (const err of validate.errors ?? []) {
      errors.push(`${tag}: schema — ${err.instancePath || "(root)"} ${err.message}`);
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== "string") {
      errors.push(`${tag}: key "${key}" translation must be a string`);
      continue;
    }
    if (value.trim().length === 0) {
      errors.push(`${tag}: key "${key}" translation must not be empty`);
    }
    const icu = parseIcuMessage(value, `${tag}.${key}`);
    if (!icu.ok) errors.push(icu.error);
  }

  return errors;
}

export function extractPlaceholders(value) {
  const icu = parseIcuMessage(value);
  if (icu.ok) return icu.placeholders;
  const fallback = new Set();
  const re = /\{([a-zA-Z0-9_]+)\}/g;
  let m;
  while ((m = re.exec(value)) !== null) fallback.add(m[1]);
  return fallback;
}

export function validateI18nCatalogs(locales = LOCALES, loader) {
  const errors = [];
  const maps = {};

  for (const tag of locales) {
    try {
      if (loader) {
        maps[tag] = loader(tag);
        errors.push(...validateCatalogObject(maps[tag], tag));
      } else {
        const { text, data } = loadLocaleFromDisk(tag);
        errors.push(...findDuplicateKeysInJsonText(text, tag));
        maps[tag] = data;
        errors.push(...validateCatalogObject(data, tag));
      }
    } catch (e) {
      errors.push(`${tag}: invalid JSON — ${e.message}`);
    }
  }

  const loaded = locales.filter((t) => maps[t]);
  if (loaded.length < locales.length) {
    return { ok: false, errors };
  }

  const [base, ...rest] = locales;
  const baseKeys = new Set(Object.keys(maps[base]));
  for (const tag of rest) {
    const keys = new Set(Object.keys(maps[tag]));
    for (const k of baseKeys) {
      if (!keys.has(k)) errors.push(`Missing key in ${tag}: ${k}`);
    }
    for (const k of keys) {
      if (!baseKeys.has(k)) errors.push(`Extra key in ${tag} not in ${base}: ${k}`);
    }
  }

  for (const k of baseKeys) {
    const ref = parseIcuMessage(maps[base][k], `${base}.${k}`);
    const refSet = ref.ok ? ref.placeholders : extractPlaceholders(maps[base][k]);
    for (const tag of rest) {
      const other = parseIcuMessage(maps[tag][k], `${tag}.${k}`);
      const otherSet = other.ok ? other.placeholders : extractPlaceholders(maps[tag][k]);
      for (const p of refSet) {
        if (!otherSet.has(p)) errors.push(`Placeholder {${p}} missing in ${tag} for key ${k}`);
      }
      for (const p of otherSet) {
        if (!refSet.has(p)) errors.push(`Placeholder {${p}} extra in ${tag} for key ${k}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function checkI18n() {
  const result = validateI18nCatalogs();
  return {
    id: "i18n",
    status: result.ok ? "pass" : "fail",
    errors: result.errors,
  };
}
