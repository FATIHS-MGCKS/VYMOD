export const CHANGE_LEDGER_REQUIRED_FIELDS = [
  "Date",
  "PR",
  "Code baseline",
  "Affected components",
  "BEFORE",
  "WHY",
  "CHANGE",
  "EXPECTED_EFFECT",
  "VALIDATION",
  "OBSERVED_EFFECT",
  "NON_EFFECTS",
  "TRADEOFFS",
  "REMAINING_GAPS",
  "Evidence",
  "Validation status",
];

/**
 * @param {string} text full CHANGE_LEDGER.md content
 * @param {string} relLabel path label for errors
 */
export function validateChangeLedgerText(text, relLabel) {
  const errors = [];
  const sections = text.split(/^## CHG-/gm).slice(1);
  if (sections.length === 0) {
    errors.push(`${relLabel}: CHANGE_LEDGER has no CHG-* entries`);
    return errors;
  }
  const latest = sections[sections.length - 1];
  for (const field of CHANGE_LEDGER_REQUIRED_FIELDS) {
    if (!latest.includes(`**${field}**`)) {
      errors.push(`${relLabel}: latest CHANGE_LEDGER entry missing **${field}**`);
    }
  }
  if (latest.match(/\*\*Commit\*\*.*pending merge/i) && latest.includes("PRODUCTION_VALIDATED")) {
    errors.push(`${relLabel}: CHANGE_LEDGER must not claim PRODUCTION_VALIDATED with pending merge`);
  }
  return errors;
}
