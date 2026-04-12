/**
 * @component scroll-area
 * @title ScrollArea
 * @version 1.1.0
 * @example Složené API
 * `ScrollArea.Root` drží výšku a ořízne rohy; `ScrollArea.Viewport` scroluje obsah.
 * ```tsx
 * import { ScrollArea } from "~/components/ui/scroll-area";
 * 
 * <ScrollArea.Root class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised">
 *   <ScrollArea.Viewport class="p-4">
 *     <p class="text-body text-label">… dlouhý obsah …</p>
 *   </ScrollArea.Viewport>
 * </ScrollArea.Root>
 * ```
 *
 * @example Zkratka Pane
 * `ScrollArea.Pane` = Root + Viewport + slot; padding dejte přes `viewportClass`.
 * ```tsx
 * import { ScrollArea } from "~/components/ui/scroll-area";
 * 
 * <ScrollArea.Pane
 *   class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
 *   viewportClass="p-4"
 * >
 *   <p class="text-body text-label">… obsah …</p>
 * </ScrollArea.Pane>
 * ```
 *
 * @example Vodorovný scroll
 * Prop `direction=&quot;horizontal&quot;` na Viewport / Pane ( `LAYOUT.md` ).
 * ```tsx
 * import { ScrollArea } from "~/components/ui/scroll-area";
 * 
 * <ScrollArea.Pane
 *   direction="horizontal"
 *   class="w-full max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
 *   viewportClass="whitespace-nowrap p-4"
 * >
 *   <span class="inline-block min-w-max text-body text-label">
 *     Velmi dlouhý řádek bez zalamování …
 *   </span>
 * </ScrollArea.Pane>
 * ```
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";

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
  /** Uloží pozici scrollu do `sessionStorage` a po obnovení stránky ji obnoví. */
  keepScroll?: boolean;
  /** Klíč v rámci `sessionStorage` (více scrollů na stránce). */
  keepScrollId?: string;
};

/**
 * Scrollovatelná oblast — dědí zaoblení od rodiče (`rounded-[inherit]`).
 * Scrollbar je zjemňěný pomocí tokenů `fill-tertiary` / `fill-secondary` (COLORS.md).
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
  /** Třídy jen pro vnitřní viewport (např. `p-4`). */
  viewportClass?: string;
  /** Předáno na {@link ScrollAreaViewport}. */
  direction?: ScrollAreaViewportProps["direction"];
  keepScroll?: ScrollAreaViewportProps["keepScroll"];
  keepScrollId?: ScrollAreaViewportProps["keepScrollId"];
};

/**
 * Zkratka: {@link ScrollAreaRoot} + {@link ScrollAreaViewport} + obsah ve slotu.
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
