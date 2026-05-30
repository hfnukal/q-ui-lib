/**
 * @component scroll-area
 * @title ScrollArea
 * @version 1.1.0
 * @example Composite API
 * `ScrollArea.Root` holds the height and clips the corners; `ScrollArea.Viewport` scrolls the content.
 * ```tsx
 * import { ScrollArea } from "~/components/ui/base/scroll-area";
 * 
 * <ScrollArea.Root class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised">
 *   <ScrollArea.Viewport class="p-4">
 *     {Array.from({ length: 40 }, (_, i) => (
 *       <p key={i} class="text-body text-label">
 *         Row {i + 1} — sample text so the scroll is visible.
 *       </p>
 *     ))}
 *   </ScrollArea.Viewport>
 * </ScrollArea.Root>
 * ```
 *
 * @example Pane shortcut
 * `ScrollArea.Pane` = Root + Viewport + slot; set padding via `viewportClass`.
 * ```tsx
 * import { ScrollArea } from "~/components/ui/base/scroll-area";
 * 
 * <ScrollArea.Pane
 *   class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
 *   viewportClass="p-4"
 * >
 *   {Array.from({ length: 40 }, (_, i) => (
 *     <p key={i} class="text-body text-label">
 *       Row {i + 1} — sample text so the scroll is visible.
 *     </p>
 *   ))}
 * </ScrollArea.Pane>
 * ```
 *
 * @example Horizontal scroll
 * The `direction=&quot;horizontal&quot;` prop on Viewport / Pane ( `LAYOUT.md` ).
 * ```tsx
 * import { ScrollArea } from "~/components/ui/base/scroll-area";
 * 
 * <ScrollArea.Pane
 *   direction="horizontal"
 *   class="w-full max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
 *   viewportClass="whitespace-nowrap p-4"
 * >
 *   <span class="inline-block min-w-max text-body text-label">
 *     {Array.from({ length: 80 }, (_, i) => `Segment ${i + 1}`).join(" — ")}
 *   </span>
 * </ScrollArea.Pane>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export type ScrollAreaRootProps = PropsOf<"div">;

/**
 * Outer wrapper — hides corner overflow (`overflow-hidden`), the height/width is set by `class` (e.g. `h-72`).
 * Inspired by shadcn Scroll Area; no Radix — native scroll (without headless mapping; see CREATE.md).
 * `ScrollArea.Root` has a fixed root `<div>` (`PropsOf<"div">`) and does not support changing the tag.
 * Do not place inside `<p>` or `<pre>`.
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
  /** Scroll axis (LAYOUT.md). Default `both` = same behavior as before. */
  direction?: "vertical" | "horizontal" | "both";
  /** Saves the scroll position to `sessionStorage` and restores it after a page reload. */
  keepScroll?: boolean;
  /** Key within `sessionStorage` (multiple scrolls on a page). */
  keepScrollId?: string;
};

/**
 * Scrollable area — inherits rounding from the parent (`rounded-[inherit]`).
 * The scrollbar is softened using the `fill-tertiary` / `fill-secondary` tokens (COLORS.md).
 */
export const ScrollAreaViewport = component$<ScrollAreaViewportProps>((props) => {
  const {
    class: className,
    tabIndex,
    direction = "both",
    keepScroll,
    keepScrollId = "default",
    ...rest
  } = props;

  const viewportRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ track, cleanup }) => {
    track(() => viewportRef.value);
    track(() => keepScroll);
    track(() => keepScrollId);
    if (!keepScroll) {
      return;
    }
    const el = viewportRef.value;
    if (!el) {
      return;
    }
    const key = `qui-scroll-area:${keepScrollId}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const y = Number.parseFloat(saved);
      if (Number.isFinite(y)) {
        el.scrollTop = y;
      }
    }
    const onScroll = () => {
      sessionStorage.setItem(key, String(el.scrollTop));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    cleanup(() => el.removeEventListener("scroll", onScroll));
  });

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
      ref={viewportRef}
      data-scroll-area-viewport
      class={merged}
      tabIndex={tabIndex ?? 0}
    >
      <Slot />
    </div>
  );
});

export type ScrollAreaPaneProps = ScrollAreaRootProps & {
  /** Classes only for the inner viewport (e.g. `p-4`). */
  viewportClass?: string;
  /** Passed to {@link ScrollAreaViewport}. */
  direction?: ScrollAreaViewportProps["direction"];
  keepScroll?: ScrollAreaViewportProps["keepScroll"];
  keepScrollId?: ScrollAreaViewportProps["keepScrollId"];
};

/**
 * Shortcut: {@link ScrollAreaRoot} + {@link ScrollAreaViewport} + content in the slot.
 */
export const ScrollAreaPane = component$<ScrollAreaPaneProps>((props) => {
  const {
    class: rootClass,
    viewportClass,
    direction,
    keepScroll,
    keepScrollId,
    ...rootRest
  } = props;

  return (
    <ScrollAreaRoot {...rootRest} class={rootClass}>
      <ScrollAreaViewport
        class={viewportClass}
        direction={direction}
        keepScroll={keepScroll}
        keepScrollId={keepScrollId}
      >
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
