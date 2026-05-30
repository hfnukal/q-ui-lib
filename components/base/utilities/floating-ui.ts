/**
 * Shared Tailwind strings for floating UI (Popover, Dropdown, Combobox, HoverCard).
 * See UNIFICATION.md — public contract; changes are subject to semver.
 */

import type { Signal } from "@builder.io/qwik";

/**
 * Anchor for position calculation — same rule as in `@qwik-ui/headless` `FloatingPopover`:
 * `bind:anchor` (Tooltip) takes precedence over `triggerRef` from `Popover.Trigger`.
 */
export function floatingAnchorFromPopoverContext(ctx: {
  anchorRef?: Signal<HTMLElement | undefined>;
  triggerRef?: Signal<HTMLElement | undefined>;
}): HTMLElement | undefined {
  const a = ctx.anchorRef?.value;
  return a != null ? a : ctx.triggerRef?.value;
}

/**
 * Axis perpendicular to the panel edge: headless sets only one coordinate (`left` or `top`) from the middleware;
 * we have to anchor the other to the edge + center the rotated square (see Floating UI docs — arrow).
 * Based on `floating` on the headless root (`popoverContextId`) — on a runtime `flip` to another side a custom `class` on the arrow may be needed.
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

/** Default “button” outline trigger (Popover, Dropdown `default`, Dialog, Sheet). */
export const floatingOutlineButtonTriggerClass =
  "inline-flex items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-3 py-2 font-medium text-callout text-label shadow-sm ring-offset-background transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Arrow panel for Popover / HoverCard (Floating UI positions the arrow absolutely relative to the trigger).
 * Rotation and the shift to the edge are added by {@link floatingArrowEdgeClassForPlacement} (the `floating` value from the headless context).
 */
export const floatingPanelArrowClass =
  "pointer-events-none absolute z-10 h-2 w-2 border-l border-t border-separator-opaque bg-surface-raised shadow-sm";

/**
 * Default Popover panel content — width w-72, overflow-visible for the arrow / inner layout.
 */
export const floatingPopoverPanelClass =
  "z-50 w-72 max-w-[min(18rem,calc(100vw-2rem))] overflow-visible rounded-lg border border-separator-opaque bg-surface-raised text-body text-label shadow-md outline-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Common surface of the expanding listbox (Dropdown menu, Combobox) before focus trapping / scrolling.
 */
export const floatingListboxPanelSurfaceClass =
  "z-50 min-w-[8rem] max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised p-1 text-body text-label shadow-md outline-none ring-offset-background";

/** Ring inside the panel (menu / combobox). */
export const floatingPanelFocusRingClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** Full string for DropdownMenu.Popover and SubContent (surface + ring). */
export const floatingMenuListPanelClass = [
  floatingListboxPanelSurfaceClass,
  floatingPanelFocusRingClass,
].join(" ");

/** Combobox listbox: same surface as the menu + vertical scroll and max-height; top edge without rounding to connect to the input. */
export const floatingComboboxListPanelClass = [
  floatingListboxPanelSurfaceClass,
  floatingPanelFocusRingClass,
  "max-h-[min(15rem,50vh)] overflow-y-auto rounded-t-none border-t-0",
].join(" ");
