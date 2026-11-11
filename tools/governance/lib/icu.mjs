import { parse } from "@formatjs/icu-messageformat-parser";

/**
 * @param {string} message
 * @returns {{ ok: true; placeholders: Set<string> } | { ok: false; error: string }}
 */
export function parseIcuMessage(message, keyLabel = "") {
  try {
    const ast = parse(message);
    const placeholders = new Set();
    walkAst(ast, placeholders);
    return { ok: true, placeholders };
  } catch (e) {
    const prefix = keyLabel ? `${keyLabel}: ` : "";
    return { ok: false, error: `${prefix}malformed ICU MessageFormat — ${e.message}` };
  }
}

/**
 * @param {import('@formatjs/icu-messageformat-parser').MessageFormatElement[]} nodes
 * @param {Set<string>} placeholders
 */
function walkAst(nodes, placeholders) {
  for (const el of nodes) {
    switch (el.type) {
      case 1:
        placeholders.add(el.value);
        break;
      case 5:
      case 6:
      case 7:
      case 8:
        if (el.value) placeholders.add(el.value);
        for (const opt of el.options ? Object.values(el.options) : []) {
          walkAst(opt.value, placeholders);
        }
        break;
      default:
        break;
    }
  }
}
