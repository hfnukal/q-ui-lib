/**
 * @component scroll-area
 * @title ScrollArea
 * @version 1.1.0
 * @example
 * ```tsx
 * import { ScrollArea } from "~/components/ui/scroll-area";
 * 
 * <ScrollArea.Root class="h-48 rounded-md border border-separator-opaque">
 *   <ScrollArea.Viewport direction="vertical">…</ScrollArea.Viewport>
 * </ScrollArea.Root>
 * ```
 * Ukázka v demo aplikaci: route `/components/scroll-area` (zdroj `demo/src/routes/components/scroll-area/index.tsx`).
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type ScrollAreaRootProps = PropsOf<"div">;

/**
 * Vnější obal — skryje přetečení rohů (`overflow-hidden`), výšku/šířku určuje `class` (např. `h-72`).
 * Inspirace shadcn Scroll Area; bez Radix — nativní scroll (bez headless mapování; viz CREATE.md).
 */
export const ScrollAreaRoot = component$<ScrollAreaRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "relative overflow-hidden";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ScrollAreaViewportProps = PropsOf<"div"> & {
  /** Osa scrollování (LAYOUT.md). Výchozí `both` = chování jako dříve. */
  direction?: "vertical" | "horizontal" | "both";
};

/**
 * Scrollovatelná oblast — dědí zaoblení od rodiče (`rounded-[inherit]`).
 * Scrollbar je zjemňěný pomocí tokenů `fill-tertiary` / `fill-secondary` (COLORS.md).
 */
export const ScrollAreaViewport = component$<ScrollAreaViewportProps>((props) => {
  const { class: className, tabIndex, direction = "both", ...rest } = props;

  const overflow =
    direction === "vertical"
      ? "overflow-y-auto overflow-x-hidden overscroll-y-contain"
      : direction === "horizontal"
        ? "overflow-x-auto overflow-y-hidden overscroll-x-contain"
        : "overflow-auto overscroll-contain";

  const base = [
    "h-full w-full max-h-full rounded-[inherit]",
    overflow,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "[scrollbar-gutter:stable]",
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2",
    "[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-fill-secondary/40",
    "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-fill-tertiary",
    "[&::-webkit-scrollbar-thumb]:hover:bg-fill-quaternary",
  ].join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div
      {...rest}
      data-scroll-area-viewport
      class={merged}
      tabIndex={tabIndex ?? 0}
    >
      <Slot />
    </div>
  );
});

export type ScrollAreaPaneProps = ScrollAreaRootProps & {
  /** Třídy jen pro vnitřní viewport (např. `p-4`). */
  viewportClass?: string;
  /** Předáno na {@link ScrollAreaViewport}. */
  direction?: ScrollAreaViewportProps["direction"];
};

/**
 * Zkratka: {@link ScrollAreaRoot} + {@link ScrollAreaViewport} + obsah ve slotu.
 */
export const ScrollAreaPane = component$<ScrollAreaPaneProps>((props) => {
  const { class: rootClass, viewportClass, direction, ...rootRest } = props;

  return (
    <ScrollAreaRoot {...rootRest} class={rootClass}>
      <ScrollAreaViewport class={viewportClass} direction={direction}>
        <Slot />
      </ScrollAreaViewport>
    </ScrollAreaRoot>
  );
});

/** Namespace: `ScrollArea.Root`, `ScrollArea.Viewport`, `ScrollArea.Pane`. */
export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Pane: ScrollAreaPane,
};
