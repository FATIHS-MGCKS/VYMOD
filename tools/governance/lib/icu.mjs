import { parse } from "@formatjs/icu-messageformat-parser";
import { TYPE } from "@formatjs/icu-messageformat-parser/types.js";

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
 * Collect ICU placeholder variable names (not formatting tag names or # pound tokens).
 *
 * @param {import('@formatjs/icu-messageformat-parser').MessageFormatElement[]} nodes
 * @param {Set<string>} placeholders
 */
function walkAst(nodes, placeholders) {
  if (!nodes) return;
  for (const el of nodes) {
    switch (el.type) {
      case TYPE.literal:
        break;
      case TYPE.argument:
      case TYPE.number:
      case TYPE.date:
      case TYPE.time:
        placeholders.add(el.value);
        break;
      case TYPE.select:
      case TYPE.plural:
        placeholders.add(el.value);
        walkSelectOrPluralOptions(el.options, placeholders);
        break;
      case TYPE.pound:
        break;
      case TYPE.tag:
        walkAst(el.children, placeholders);
        break;
      default:
        break;
    }
  }
}

/**
 * @param {Record<string, { value: import('@formatjs/icu-messageformat-parser').MessageFormatElement[] }>} options
 * @param {Set<string>} placeholders
 */
function walkSelectOrPluralOptions(options, placeholders) {
  if (!options) return;
  for (const opt of Object.values(options)) {
    walkAst(opt.value, placeholders);
  }
}
