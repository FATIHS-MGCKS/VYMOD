import { fromRoot, REPO_ROOT } from "../lib/paths.mjs";
import { pathExists } from "../lib/read.mjs";

const REQUIRED = [
  "README.md",
  "AGENTS.md",
  ".cursor/rules/00-core-governance.mdc",
  ".cursor/rules/10-security.mdc",
  ".cursor/rules/20-privacy-gdpr.mdc",
  ".cursor/rules/30-i18n.mdc",
  ".cursor/rules/40-architecture.mdc",
  ".cursor/rules/50-quality-testing.mdc",
  ".cursor/rules/60-accessibility.mdc",
  "architecture/README.md",
  "architecture/MASTER_ARCHITECTURE.md",
  "architecture/MODULE_AUTHORITY_STANDARD.md",
  "architecture/SYSTEM_OVERVIEW.md",
  "architecture/MODULE_REGISTRY.md",
  "architecture/reference/SYNQDRIVE_REFERENCE_AUDIT.md",
  "architecture/SECURITY_INVARIANTS.md",
  "architecture/decisions/ADR-0001-governance-foundation.md",
  "architecture/integrations/SYNQDRIVE_CORE.md",
  "architecture/integrations/DIMO.md",
  "compliance/README.md",
  "compliance/GDPR.md",
  "compliance/DATA_INVENTORY.md",
  "compliance/DATA_CLASSIFICATION.md",
  "compliance/DATA_RETENTION.md",
  "compliance/DATA_SUBJECT_RIGHTS.md",
  "compliance/DPIA_SCREENING.md",
  "compliance/THREAT_MODEL.md",
  "compliance/ISO27001_CONTROL_MAPPING.md",
  "compliance/ISO27701_PRIVACY_MAPPING.md",
  "compliance/CRA_READINESS.md",
  "compliance/SECURITY_INCIDENT_RESPONSE.md",
  "compliance/THIRD_PARTY_PROCESSORS.md",
  "standards/I18N.md",
  "standards/ACCESSIBILITY.md",
  "standards/SECURE_CODING.md",
  "standards/API_SECURITY.md",
  "standards/MOBILE_SECURITY.md",
  "standards/TESTING.md",
  "docs/product/VYMOD_PRODUCT_VISION.md",
  "i18n/ADAPTER.md",
  "i18n/locales/de-DE.json",
  "i18n/locales/en-US.json",
];

export function checkRequiredFiles() {
  const errors = [];
  for (const rel of REQUIRED) {
    const abs = fromRoot(rel);
    if (!pathExists(abs)) errors.push(`Missing required file: ${rel}`);
  }
  return {
    id: "required-files",
    status: errors.length ? "fail" : "pass",
    errors,
    meta: { root: REPO_ROOT, count: REQUIRED.length },
  };
}
