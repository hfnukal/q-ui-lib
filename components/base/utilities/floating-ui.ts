/**
 * Sdílené Tailwind řetězce pro plovoucí UI (Popover, Dropdown, Combobox, HoverCard).
 * Viz UNIFICATION.md — veřejný kontrakt; změny podléhají semver.
 */

import type { Signal } from "@builder.io/qwik";

/**
 * Kotva pro výpočet polohy — stejné pravidlo jako v `@qwik-ui/headless` `FloatingPopover`:
 * `bind:anchor` (Tooltip) má přednost před `triggerRef` z `Popover.Trigger`.
 */
export function floatingAnchorFromPopoverContext(ctx: {
  anchorRef?: Signal<HTMLElement | undefined>;
  triggerRef?: Signal<HTMLElement | undefined>;
}): HTMLElement | undefined {
  const a = ctx.anchorRef?.value;
  return a != null ? a : ctx.triggerRef?.value;
}

/**
 * Osa kolmo k hraně panelu: headless nastaví jen jednu souřadnici (`left` nebo `top`) z middleware;
 * druhou musíme ukotvit na hranu + vycentrovat rotovaný čtverec (viz Floating UI docs — arrow).
 * Vychází z `floating` na headless kořeni (`popoverContextId`) — při runtime `flip` na jinou stranu může být potřeba vlastní `class` na šipce.
 */
export function floatingArrowEdgeClassForPlacement(
  floating: boolean | string | undefined,
): string {
  const placement = typeof floating === "string" ? floating : "bottom";
  const side = placement.split("-")[0];
  switch (side) {
    case "top":
      return "bottom-0 [transform:translateY(50%)_rotate(225deg)]";
    case "left":
      return "right-0 [transform:translateX(50%)_rotate(135deg)]";
    case "right":
      return "left-0 [transform:translateX(-50%)_rotate(315deg)]";
    case "bottom":
    default:
      return "top-0 [transform:translateY(-50%)_rotate(45deg)]";
  }
}

/** Výchozí „tlačítkový“ outline trigger (Popover, Dropdown `default`, Dialog, Sheet). */
export const floatingOutlineButtonTriggerClass =
  "inline-flex items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-3 py-2 font-medium text-callout text-label shadow-sm ring-offset-background transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Panel šipky u Popover / HoverCard (Floating UI umisťuje šipku absolutně k triggeru).
 * Rotaci a posun na hranu doplňuje {@link floatingArrowEdgeClassForPlacement} (hodnota `floating` z headless kontextu).
 */
export const floatingPanelArrowClass =
  "pointer-events-none absolute z-10 h-2 w-2 border-l border-t border-separator-opaque bg-surface-raised shadow-sm";

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

/** Combobox listbox: stejný povrch jako menu + vertikální scroll a max-height; horní hrana bez zaoblení kvůli napojení na input. */
export const floatingComboboxListPanelClass = [
  floatingListboxPanelSurfaceClass,
  floatingPanelFocusRingClass,
  "max-h-[min(15rem,50vh)] overflow-y-auto rounded-t-none border-t-0",
].join(" ");
