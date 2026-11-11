# Secure Coding

Baseline: OWASP ASVS 5.0 (API/server) and secure SDLC practices.

- TypeScript strict when TS is used; no `any` for trust boundaries without justification
- Validate and canonicalize input; reject unknown fields on APIs
- Parameterized queries; no string-built SQL
- Output encoding for XSS contexts
- Constant-time comparisons for secrets
- Least privilege IAM (when cloud exists)
- Dependencies pinned; audit in CI
- No secrets in git — gitleaks/secret scan in CI

See API_SECURITY.md and MOBILE_SECURITY.md for platform specifics.
