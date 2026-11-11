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
 * @param {import('@babel/types').Expression} expr
 * @returns {boolean}
 */
export function isAllowedLocalizationExpression(expr) {
  if (expr?.type === "CallExpression") {
    const c = expr.callee;
    if (c.type === "Identifier" && c.name === "t") return true;
    if (c.type === "MemberExpression" && !c.computed && c.property?.type === "Identifier" && c.property.name === "t") {
      return true;
    }
  }
  return false;
}

/**
 * @param {import('@babel/types').Expression | import('@babel/types').JSXEmptyExpression} expr
 * @param {(text: string, loc?: object) => void} emit
 */
function collectHardcodedExpression(expr, emit) {
  if (!expr || expr.type === "JSXEmptyExpression") return;
  if (expr.type === "StringLiteral") {
    emit(expr.value, expr.loc);
    return;
  }
  if (expr.type === "TemplateLiteral" && expr.expressions.length === 0) {
    const cooked = expr.quasis.map((q) => q.value.cooked ?? "").join("");
    emit(cooked, expr.loc);
    return;
  }
  if (isAllowedLocalizationExpression(expr)) return;
}

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
        return;
      }
      if (val?.type === "JSXExpressionContainer") {
        collectHardcodedExpression(val.expression, (text, loc) => {
          report(`attribute ${name} expression`, text, loc);
        });
      }
    },
    JSXExpressionContainer(path) {
      if (path.parent?.type === "JSXAttribute") return;
      if (path.parent?.type !== "JSXElement" && path.parent?.type !== "JSXFragment") return;
      collectHardcodedExpression(path.node.expression, (text, loc) => {
        report("JSX expression string", text, loc);
      });
    },
  });

  return { violations };
}
