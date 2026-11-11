import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default ?? _traverse;

const USER_FACING_ATTRS = new Set([
  "title",
  "label",
  "placeholder",
  "aria-label",
  "aria-labelledby",
  "alt",
  "aria-description",
]);

/**
 * @param {string} raw
 * @returns {boolean}
 */
export function isLikelyUserVisibleCopy(raw) {
  const s = raw.replace(/\s+/g, " ").trim();
  if (s.length < 2) return false;
  if (!/\p{L}/u.test(s)) return false;
  if (/^[\d\s.,:;!?+#%\-–—'"]+$/u.test(s)) return false;
  if (/^https?:\/\//i.test(s)) return false;
  if (/^\.{0,2}\//.test(s) || s.includes("\\")) return false;
  if (/^@[\w./-]+$/.test(s)) return false;
  if (/^[A-Z][A-Z0-9_]{2,}$/.test(s)) return false;
  if (/^[a-z][a-z0-9]*(\.[a-z0-9_]+)+$/.test(s)) return false;
  return true;
}

/**
 * @param {string} source
 * @param {string} fileLabel
 * @returns {{ violations: string[]; parseError?: string }}
 */
export function analyzeJsxSource(source, fileLabel = "input.tsx") {
  const violations = [];
  let ast;
  try {
    ast = parse(source, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
      errorRecovery: false,
    });
  } catch (e) {
    return {
      violations: [],
      parseError: `${fileLabel}: parse error — ${e.message}`,
    };
  }

  const report = (kind, text, loc) => {
    if (!isLikelyUserVisibleCopy(text)) return;
    const where = loc ? `:${loc.start.line}:${loc.start.column + 1}` : "";
    violations.push(`${fileLabel}${where}: hardcoded ${kind}: ${JSON.stringify(text.trim())}`);
  };

  traverse(ast, {
    JSXText(path) {
      report("JSX text", path.node.value, path.node.loc);
    },
    JSXAttribute(path) {
      const name = path.node.name.name;
      if (!USER_FACING_ATTRS.has(name)) return;
      const val = path.node.value;
      if (val?.type === "StringLiteral") {
        report(`attribute ${name}`, val.value, val.loc);
      }
    },
    JSXExpressionContainer(path) {
      if (path.parent?.type !== "JSXElement" && path.parent?.type !== "JSXFragment") return;
      const e = path.node.expression;
      if (e?.type === "StringLiteral") {
        report("JSX expression string", e.value, e.loc);
      }
    },
  });

  return { violations };
}
