import { expect, test, type Page } from "@playwright/test";
import { demoH1ForSlug } from "../../support/component-demo-title";
import { assertAllSectionExamplePreviews } from "../../support/first-example-preview";
import { componentDemoPath } from "../../support/demo-routes";

const SLUG = "accordion" as const;
const TITLE = demoH1ForSlug(SLUG);

function sectionBySubheading(page: Page, subheading: RegExp) {
  return page.locator("section").filter({
    has: page.getByRole("heading", { level: 2 }).filter({ hasText: subheading }),
  });
}

/** Panel s ukázkou (CodeExample — první `tabpanel` je záložka Example). */
function exampleTabPanel(section: ReturnType<typeof sectionBySubheading>) {
  return section.getByRole("tabpanel").nth(0);
}

test.describe(`${TITLE} (base)`, () => {
  test.describe.configure({ mode: "serial" });

  test("Všechny ukázky (Example) obsahují náhled", async ({ page }) => {
    await page.goto(componentDemoPath({ slug: SLUG }), {
      waitUntil: "domcontentloaded",
    });
    await assertAllSectionExamplePreviews(page);
  });

  test("Compound API: přepínání panelů v Example", async ({ page }) => {
    await page.goto(componentDemoPath({ slug: SLUG }), {
      waitUntil: "domcontentloaded",
    });

    const section = sectionBySubheading(page, /Compound API/);
    await expect(section).toBeVisible();
    await section.getByRole("tab", { name: "Example" }).click();

    const panel = exampleTabPanel(section);
    await panel.getByRole("button", { name: "Základní informace" }).click();
    const firstPanelBody = panel
      .locator("[data-collapsible-content]")
      .filter({ hasText: "Stručný úvod do tématu a odkazy na další zdroje." });
    await expect(firstPanelBody).toBeVisible({ timeout: 15_000 });

    await panel.getByRole("button", { name: "Pokročilé možnosti" }).click();
    const secondPanelBody = panel
      .locator("[data-collapsible-content]")
      .filter({ hasText: "Rozšířená nastavení a tipy pro každodenní použití." });
    await expect(secondPanelBody).toBeVisible({ timeout: 15_000 });
    await expect(firstPanelBody).toBeHidden();
  });

  test("AccordionList (single): přepnutí otevřeného panelu v Example", async ({
    page,
  }) => {
    await page.goto(componentDemoPath({ slug: SLUG }), {
      waitUntil: "domcontentloaded",
    });

    const section = sectionBySubheading(page, /Single open panel/);
    await expect(section).toBeVisible();
    await section.getByRole("tab", { name: "Example" }).click();

    const panel = exampleTabPanel(section);
    await panel.getByRole("button", { name: "Co je Qwik?" }).click();
    const basicsBody = panel
      .locator("[data-collapsible-content]")
      .filter({
        hasText:
          "Framework zaměřený na okamžité načtení a minimální JavaScript na klientu.",
      });
    await expect(basicsBody).toBeVisible({ timeout: 15_000 });

    await panel.getByRole("button", { name: "Co je resumability?" }).click();
    const resumeBody = panel
      .locator("[data-collapsible-content]")
      .filter({
        hasText:
          "Server může obnovit stav aplikace bez velkého hydration bundle.",
      });
    await expect(resumeBody).toBeVisible({ timeout: 15_000 });
    await expect(basicsBody).toBeHidden();
  });
});
