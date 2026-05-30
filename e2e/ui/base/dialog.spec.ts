import { expect, test, type Page } from "@playwright/test";
import { demoH1ForSlug } from "../../support/component-demo-title";
import { assertAllSectionExamplePreviews } from "../../support/first-example-preview";
import { componentDemoPath } from "../../support/demo-routes";

const SLUG = "dialog" as const;
const TITLE = demoH1ForSlug(SLUG);

test.describe(`${TITLE} (base)`, () => {
  test.describe.configure({ mode: "serial" });

  /** Sekce „Základní dialog“ — v izolovaném kontextu nejsou záměny s alert ukázkou ani s Code panelem. */
  function basicDialogSection(page: Page) {
    return page.locator("section").filter({
      has: page.getByRole("heading", { name: "Základní dialog", level: 2 }),
    });
  }

  test("Všechny ukázky (Example) obsahují náhled", async ({ page }) => {
    await page.goto(componentDemoPath({ slug: SLUG }), {
      waitUntil: "domcontentloaded",
    });
    await assertAllSectionExamplePreviews(page);
  });

  test("opens dialog from trigger", async ({ page }) => {
    await page.goto(componentDemoPath({ slug: SLUG }), {
      waitUntil: "domcontentloaded",
    });

    const section = basicDialogSection(page);
    await expect(section).toBeVisible();

    // CodeExample má záložky Example / Code — explicitně Example kvůli stabilnímu stavu před klikem (Qwik + headless tabs).
    await section.getByRole("tab", { name: "Example" }).click();

    const trigger = section.getByRole("button", { name: "Otevřít dialog" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    // Panel je <dialog role="dialog">; název z aria-labelledby (h2 v panelu).
    await expect(
      page.getByRole("dialog", { name: "Upravit profil" })
    ).toBeVisible();
  });
});
