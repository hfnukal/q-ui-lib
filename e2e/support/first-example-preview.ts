import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Jedna `<section>` obsahující `CodeExample` — po přepnutí na Example ověří,
 * že v panelu je skutečná ukázka (widget / médium / viditelný blok), ne prázdný layout.
 */
export async function assertSectionExampleHasPreview(section: Locator) {
  await expect(section).toBeVisible();
  const exampleTab = section.getByRole("tab", { name: "Example" }).first();
  await expect(exampleTab).toBeVisible();
  await exampleTab.click();
  const panel = section.getByRole("tabpanel").nth(0);
  await expectExamplePanelHasPreview(panel);
}

/**
 * První sekce s CodeExample na demo stránce.
 */
export async function assertFirstSectionExamplePreview(page: Page) {
  await assertSectionExampleHasPreview(page.locator("section").first());
}

/**
 * Všechny sekce, které mají záložku Example (CodeExample) — u každé ověří náhled.
 * Sekce bez CodeExample (pouze nadpis apod.) se přeskočí. Musí být otestována
 * alespoň jedna ukázka.
 */
export async function assertAllSectionExamplePreviews(page: Page) {
  const n = await page.locator("section").count();
  let tested = 0;
  for (let i = 0; i < n; i++) {
    const section = page.locator("section").nth(i);
    if ((await section.getByRole("tab", { name: "Example" }).count()) === 0) {
      continue;
    }
    await assertSectionExampleHasPreview(section);
    tested += 1;
  }
  expect(tested, "Alespoň jedna demo sekce s ukázkou (záložka Example)").toBeGreaterThan(0);
}

const WIDGET_SELECTOR = [
  "button:not([aria-hidden='true'])",
  "a[href]",
  "input",
  "textarea",
  "select",
  "table",
  "canvas",
  "img",
  "svg",
  "video",
  "iframe",
  '[role="img"]',
  '[role="progressbar"]',
  '[role="status"]',
  '[role="separator"]',
  '[role="slider"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="menu"]',
  '[role="menubar"]',
  '[role="navigation"]',
  '[role="radiogroup"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="dialog"]',
  '[role="toolbar"]',
  '[role="tablist"]',
  "[data-accordion]",
].join(", ");

async function expectExamplePanelHasPreview(panel: Locator) {
  await expect(panel).toBeVisible();

  const widget = panel.locator(WIDGET_SELECTOR);
  const n = await widget.count();
  for (let i = 0; i < n; i++) {
    const w = widget.nth(i);
    if (await w.isVisible().catch(() => false)) {
      await expect(w).toBeVisible();
      return;
    }
  }

  if ((await panel.getByText(/\S{2,}/).count()) > 0) {
    await expect(panel.getByText(/\S{2,}/).first()).toBeVisible();
    return;
  }

  const hasSizedDescendant = await panel.evaluate((root) => {
    const walk = (el: Element): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0")
        return false;
      const r = el.getBoundingClientRect();
      if (r.width >= 6 && r.height >= 6 && el !== root) return true;
      for (const c of el.children) {
        if (walk(c)) return true;
      }
      return false;
    };
    return walk(root);
  });

  expect(hasSizedDescendant).toBe(true);
}
