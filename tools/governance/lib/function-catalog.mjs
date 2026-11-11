import fs from "node:fs";
import path from "node:path";
import { fromRoot } from "./paths.mjs";
import { readText } from "./read.mjs";

const FN_ID_RE = /^[A-Z][A-Z0-9]{1,7}-FN-\d{3}$/;

/**
 * Parse markdown table rows after header into objects keyed by header names.
 * @param {string} markdown
 * @param {string} sectionHeading optional - only parse first table after heading
 */
export function parseFunctionCatalogTable(markdown) {
  const lines = markdown.split("\n");
  const headerIdx = lines.findIndex((l) => l.includes("| ID |") && l.includes("| Status |"));
  if (headerIdx === -1) return { headers: [], rows: [] };

  const headers = lines[headerIdx]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);
  const rows = [];
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("|") || !line.includes("-FN-")) break;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.length < headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}

function extractPath(sourceCell) {
  const m = sourceCell.match(/`([^`]+)`/);
  return m ? m[1].trim() : "";
}

function extractName(nameCell) {
  const m = nameCell.match(/`([^`]+)`/);
  return m ? m[1].trim() : nameCell.trim();
}

function exportSymbolExists(fileAbs, symbol) {
  const text = fs.readFileSync(fileAbs, "utf8");
  const patterns = [
    new RegExp(`export\\s+function\\s+${symbol}\\b`),
    new RegExp(`export\\s+async\\s+function\\s+${symbol}\\b`),
    new RegExp(`export\\s+const\\s+${symbol}\\b`),
    new RegExp(`export\\s+{\\s*[^}]*\\b${symbol}\\b`),
  ];
  return patterns.some((p) => p.test(text));
}

/**
 * @param {string} authorityRel
 * @param {string} idPrefix e.g. GOV-
 */
export function validateFunctionCatalog(authorityRel, idPrefix) {
  const errors = [];
  const catPath = fromRoot(path.join(authorityRel, "FUNCTION_CATALOG.md"));
  if (!fs.existsSync(catPath)) {
    return { ok: false, errors: [`${authorityRel}: missing FUNCTION_CATALOG.md`] };
  }

  const markdown = readText(catPath);
  const { rows } = parseFunctionCatalogTable(markdown);
  if (rows.length === 0) {
    errors.push(`${authorityRel}: FUNCTION_CATALOG.md has no function rows`);
  }

  const seenIds = new Set();
  for (const row of rows) {
    const id = row.ID?.trim();
    if (!id || !FN_ID_RE.test(id)) {
      errors.push(`${authorityRel}: invalid function ID ${id ?? "(missing)"}`);
      continue;
    }
    if (!id.startsWith(idPrefix)) {
      errors.push(`${authorityRel}: function ${id} must use prefix ${idPrefix}`);
    }
    if (seenIds.has(id)) errors.push(`${authorityRel}: duplicate function ID ${id}`);
    seenIds.add(id);

    const status = (row.Status ?? "").replace(/`/g, "").trim().toUpperCase();
    if (status === "NOT_IMPLEMENTED") continue;

    const kind = (row.Kind ?? "export").replace(/`/g, "").trim().toLowerCase();
    const src = extractPath(row.Source ?? "");
    if (!src) {
      errors.push(`${authorityRel}: ${id} ACTIVE without Source path`);
      continue;
    }
    const abs = fromRoot(src);
    if (!fs.existsSync(abs)) {
      errors.push(`${authorityRel}: ${id} missing source file ${src}`);
      continue;
    }

    if (kind === "cli") continue;

    const name = extractName(row.Name ?? "");
    if (name && kind === "export") {
      if (!exportSymbolExists(abs, name)) {
        errors.push(`${authorityRel}: ${id} export symbol \`${name}\` not found in ${src}`);
      }
    }
  }

  return { ok: errors.length === 0, errors, functionIds: [...seenIds] };
}
