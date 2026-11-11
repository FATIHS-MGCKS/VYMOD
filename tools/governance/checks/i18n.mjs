import fs from "node:fs";
import { fromRoot } from "../lib/paths.mjs";

const LOCALES = ["de-DE", "en-US"];
const PLACEHOLDER_RE = /\{([a-zA-Z0-9_]+)(?:,\s*plural[^}]*)?\}/g;

function loadLocale(tag) {
  const p = fromRoot(`i18n/locales/${tag}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function extractPlaceholders(value) {
  const set = new Set();
  let m;
  const re = new RegExp(PLACEHOLDER_RE.source, "g");
  while ((m = re.exec(value)) !== null) {
    set.add(m[1]);
  }
  return set;
}

export function validateI18nCatalogs(locales = LOCALES, loader = loadLocale) {
  const errors = [];
  const maps = {};
  for (const tag of locales) {
    try {
      maps[tag] = loader(tag);
    } catch (e) {
      errors.push(`${tag}: invalid JSON — ${e.message}`);
    }
  }
  if (errors.length) return { ok: false, errors };

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
    const ref = extractPlaceholders(maps[base][k]);
    for (const tag of rest) {
      const other = extractPlaceholders(maps[tag][k]);
      for (const p of ref) {
        if (!other.has(p)) errors.push(`Placeholder {${p}} missing in ${tag} for key ${k}`);
      }
      for (const p of other) {
        if (!ref.has(p)) errors.push(`Placeholder {${p}} extra in ${tag} for key ${k}`);
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
