import assert from "node:assert/strict";
import test from "node:test";
import { scanHardcodedUiContent } from "../checks/hardcoded-ui.mjs";
import { isLikelyUserVisibleCopy } from "../lib/jsx-hardcoded.mjs";

test("isLikelyUserVisibleCopy rejects paths and translation keys", () => {
  assert.equal(isLikelyUserVisibleCopy("./src/App"), false);
  assert.equal(isLikelyUserVisibleCopy("app.onboarding.title"), false);
  assert.equal(isLikelyUserVisibleCopy("/vendor/lib"), false);
  assert.equal(isLikelyUserVisibleCopy("Save changes"), true);
});

test("rejects mixed localized and hardcoded JSX text", () => {
  const source = `
    import { t } from "i18n";
    export function Welcome() {
      return (
        <section>
          <h1>{t("onboarding.welcome.title")}</h1>
          <p>Hardcoded welcome copy</p>
        </section>
      );
    }
  `;
  const { violations, parseError } = scanHardcodedUiContent(source, "Welcome.tsx");
  assert.equal(parseError, undefined);
  assert.ok(violations.length >= 1);
  assert.ok(violations.some((v) => v.includes("Hardcoded welcome copy")));
});

test("detects hardcoded accessibility label attribute", () => {
  const source = `
    export function Nav() {
      return <nav aria-label="Main navigation">...</nav>;
    }
  `;
  const { violations } = scanHardcodedUiContent(source, "Nav.tsx");
  assert.ok(violations.some((v) => v.includes("Main navigation")));
});

test("does not skip file when useTranslation is also present", () => {
  const source = `
    import { useTranslation } from "react-i18next";
    export function X() {
      const { t } = useTranslation();
      return (
        <>
          <span>{t("app.name")}</span>
          <button>Delete account</button>
        </>
      );
    }
  `;
  const { violations } = scanHardcodedUiContent(source, "X.tsx");
  assert.ok(violations.some((v) => v.includes("Delete account")));
});

test("allows technical JSX without user sentences", () => {
  const source = `
    export function X() {
      return <div className="flex-row">{42}</div>;
    }
  `;
  const { violations } = scanHardcodedUiContent(source, "X.tsx");
  assert.equal(violations.length, 0);
});
