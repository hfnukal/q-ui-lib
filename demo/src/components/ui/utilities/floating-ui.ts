/**
 * Sdílené Tailwind řetězce pro plovoucí UI (Popover, Dropdown, Combobox, HoverCard).
 * Viz UNIFICATION.md — veřejný kontrakt; změny podléhají semver.
 */

/** Výchozí „tlačítkový“ outline trigger (Popover, Dropdown `default`, Dialog, Sheet). */
export const floatingOutlineButtonTriggerClass =
  "inline-flex items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-3 py-2 font-medium text-callout text-label shadow-sm ring-offset-background transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Panel šipky u Popover / HoverCard (Floating UI umisťuje šipku absolutně k triggeru).
 */
export const floatingPanelArrowClass =
  "pointer-events-none absolute -top-2 z-10 h-2.5 w-2.5 rotate-45 border-l border-t border-separator-opaque bg-surface-raised shadow-sm";

/**
 * Výchozí obsah Popover panelu — šířka w-72, overflow-visible pro šipku / vnitřní layout.
 */
export const floatingPopoverPanelClass =
  "z-50 w-72 max-w-[min(18rem,calc(100vw-2rem))] overflow-visible rounded-lg border border-separator-opaque bg-surface-raised text-body text-label shadow-md outline-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Společný povrch rozbalovacího listboxu (Dropdown menu, Combobox) před kroucením fokusu / scrollem.
 */
export const floatingListboxPanelSurfaceClass =
  "z-50 min-w-[8rem] max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised p-1 text-body text-label shadow-md outline-none ring-offset-background";

/** Ring uvnitř panelu (menu / combobox). */
export const floatingPanelFocusRingClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** Celý řetězec pro DropdownMenu.Popover a SubContent (povrch + ring). */
export const floatingMenuListPanelClass = [
  floatingListboxPanelSurfaceClass,
  floatingPanelFocusRingClass,
].join(" ");

/** Combobox listbox: stejný povrch jako menu + vertikální scroll a max-height. */
export const floatingComboboxListPanelClass = [
  floatingListboxPanelSurfaceClass,
  floatingPanelFocusRingClass,
  "max-h-[min(15rem,50vh)] overflow-y-auto",
].join(" ");
