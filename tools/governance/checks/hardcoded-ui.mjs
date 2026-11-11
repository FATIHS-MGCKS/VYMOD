import fs from "node:fs";
import path from "node:path";
import { fromRoot } from "../lib/paths.mjs";
import { listFilesRecursive, rel } from "../lib/read.mjs";
import { analyzeJsxSource } from "../lib/jsx-hardcoded.mjs";

const SCAN_DIRS = ["apps", "src", "packages"];
const SUPPORTED_UI_EXT = new Set([".tsx", ".jsx"]);
const UNSUPPORTED_UI_EXT = new Set([".vue"]);

export function scanHardcodedUiContent(source, fileLabel) {
  return analyzeJsxSource(source, fileLabel);
}

export function checkHardcodedUi() {
  const roots = SCAN_DIRS.map((d) => fromRoot(d)).filter((d) => fs.existsSync(d));
  if (roots.length === 0) {
    return {
      id: "hardcoded-ui",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Create apps/, src/, or packages/ with UI code to enable scan",
        supportedSourceTypes: ["jsx", "tsx"],
        unsupportedSourceTypes: ["vue"],
      },
    };
  }

  const errors = [];
  const warnings = [];
  let scannedJsx = 0;
  let unsupportedFiles = 0;

  for (const root of roots) {
    for (const file of listFilesRecursive(root)) {
      const ext = path.extname(file);
      if (file.includes(".test.") || file.includes("__tests__") || file.includes("__fixtures__")) {
        continue;
      }
      if (UNSUPPORTED_UI_EXT.has(ext)) {
        unsupportedFiles += 1;
        continue;
      }
      if (!SUPPORTED_UI_EXT.has(ext)) continue;

      scannedJsx += 1;
      const source = fs.readFileSync(file, "utf8");
      const { violations, parseError } = analyzeJsxSource(source, rel(file));
      if (parseError) errors.push(parseError);
      errors.push(...violations);
    }
  }

  if (scannedJsx === 0 && unsupportedFiles > 0) {
    return {
      id: "hardcoded-ui",
      status: "skip",
      errors: [],
      meta: {
        reason: "NOT_IMPLEMENTED",
        activation: "Add .jsx/.tsx UI sources (Vue is not supported by this gate)",
        supportedSourceTypes: ["jsx", "tsx"],
        unsupportedSourceTypes: ["vue"],
        unsupportedFileCount: unsupportedFiles,
      },
    };
  }

  if (unsupportedFiles > 0) {
    warnings.push(
      `${unsupportedFiles} .vue file(s) present; hardcoded-ui gate supports jsx/tsx only (not fully implemented for Vue).`,
    );
  }

  return {
    id: "hardcoded-ui",
    status: errors.length ? "fail" : "pass",
    errors,
    meta: {
      supportedSourceTypes: ["jsx", "tsx"],
      unsupportedSourceTypes: ["vue"],
      scannedJsxFiles: scannedJsx,
      warnings,
    },
  };
}
