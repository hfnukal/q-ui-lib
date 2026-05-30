import { expect, test, type Page } from "@playwright/test";
import { demoH1ForSlug } from "../../support/component-demo-title";
import { assertAllSectionExamplePreviews } from "../../support/first-example-preview";
import { componentDemoPath } from "../../support/demo-routes";

const SLUG = "sheet" as const;
const TITLE = demoH1ForSlug(SLUG);

function sectionByHeading(page: Page, heading: string) {
  return page.locator("section").filter({
    has: page.getByRole("heading", { name: heading, level: 2 }),
  });
}

async function openExamplePanel(section: ReturnType<typeof sectionByHeading>) {
  await expect(section).toBeVisible();
  await section.getByRole("tab", { name: "Example" }).click();
  /** První panel odpovídá záložce Example (viz `CodeExample` + pořadí `Tab.Panel`). */
  const examplePanel = section.getByRole("tabpanel").first();
  await expect(examplePanel).toBeVisible();
  return examplePanel;
}

/**
 * Otevře sheet z dané sekce, ověří otevřený `:modal` dialog (text titulku), zavře Escape.
 * `getByRole("dialog", { name })` u nativního `<dialog>` nemusí sedět napříč prohlížeči / ARIA.
 */
async function openSheetExpectClose(
  page: Page,
  sectionHeading: string,
  triggerName: string,
  /** Text z `Sheet.Title` — ověření uvnitř otevřeného modalního dialogu. */
  titleSubstring: string,
) {
  const section = sectionByHeading(page, sectionHeading);
  const examplePanel = await openExamplePanel(section);
  const trigger = examplePanel.getByRole("button", { name: triggerName });
  await expect(trigger).toBeVisible();
  await trigger.click();

  /** Nativní `showModal()` nastaví `open`; `:modal` v Playwright CSS selektoru nemusí být spolehlivý. */
  const dialog = page.locator("dialog.q-sheet-panel[open]");
  await expect(dialog).toBeVisible({ timeout: 15_000 });
  await expect(dialog).toContainText(titleSubstring);

  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.q-sheet-panel[open]")).toHaveCount(0, { timeout: 8000 });
}

const defaultAndSides: readonly {
  id: string;
  section: string;
  trigger: string;
  title: string;
}[] = [
  {
    id: "default-right",
    section: "Zprava (výchozí)",
    trigger: "Otevřít panel",
    title: "Nastavení",
  },
  {
    id: "side-top",
    section: "Strany panelu (top | bottom | left | right)",
    trigger: "Shora",
    title: "Panel shora",
  },
  {
    id: "side-bottom",
    section: "Strany panelu (top | bottom | left | right)",
    trigger: "Zdola",
    title: "Panel zdola",
  },
  {
    id: "side-left",
    section: "Strany panelu (top | bottom | left | right)",
    trigger: "Zleva",
    title: "Levý panel",
  },
  {
    id: "side-right",
    section: "Strany panelu (top | bottom | left | right)",
    trigger: "Zprava",
    title: "Pravý panel",
  },
] as const;

const fullscreens: readonly {
  id: string;
  trigger: string;
  title: string;
}[] = [
  { id: "fs-top", trigger: "Fullscreen shora", title: "Fullscreen top" },
  { id: "fs-bottom", trigger: "Fullscreen zdola", title: "Fullscreen bottom" },
  { id: "fs-left", trigger: "Fullscreen zleva", title: "Fullscreen left" },
  { id: "fs-right", trigger: "Fullscreen zprava", title: "Fullscreen right" },
] as const;

const FULLSCREEN_SECTION = "Fullscreen (top | bottom | left | right)" as const;

test.describe(`${TITLE} (base)`, () => {
  test.describe.configure({ mode: "serial" });

  test("Všechny ukázky (Example) obsahují náhled", async ({ page }) => {
    await page.goto(componentDemoPath({ slug: SLUG }), {
      waitUntil: "domcontentloaded",
    });
    await assertAllSectionExamplePreviews(page);
  });

  for (const row of defaultAndSides) {
    test(`otevře a zavře — ${row.id}`, async ({ page }) => {
      await page.goto(componentDemoPath({ slug: SLUG }), {
        waitUntil: "domcontentloaded",
      });
      await openSheetExpectClose(page, row.section, row.trigger, row.title);
    });
  }

  for (const row of fullscreens) {
    test(`otevře a zavře fullscreen — ${row.id}`, async ({ page }) => {
      await page.goto(componentDemoPath({ slug: SLUG }), {
        waitUntil: "domcontentloaded",
      });
      await openSheetExpectClose(page, FULLSCREEN_SECTION, row.trigger, row.title);
    });
  }
});
