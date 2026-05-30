import { test } from "@playwright/test";
import { demoH1ForSlug } from "../../support/component-demo-title";
import { assertAllSectionExamplePreviews } from "../../support/first-example-preview";
import { componentDemoPath } from "../../support/demo-routes";

const SLUG = "checkbox" as const;
const TITLE = demoH1ForSlug(SLUG);

test.describe(`${TITLE} (base)`, () => {
  test.describe.configure({ mode: "serial" });

  test("Všechny ukázky (Example) obsahují náhled", async ({ page }) => {
    await page.goto(componentDemoPath({ slug: SLUG }), {
      waitUntil: "domcontentloaded",
    });
    await assertAllSectionExamplePreviews(page);
  });
});
