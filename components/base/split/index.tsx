/**
 * @component split
 * @title Split
 * @version 1.0.0
 * @example Vodorovně
 * Dva panely vedle sebe — fixní šířka v pixelech a zbytek `1fr`.
 * ```tsx
 * import { Split } from "~/components/ui/base/split";
 * 
 * <Split.Root direction="horizontal" class="h-32 rounded-lg border border-separator-opaque">
 *   <Split.Panel size="120px" class="bg-surface-raised p-3 text-callout">
 *     Fixní
 *   </Split.Panel>
 *   <Split.Panel size="1fr" class="bg-surface-overlay p-3 text-callout">
 *     Zbytek
 *   </Split.Panel>
 * </Split.Root>
 * ```
 *
 * @example Svisle
 * Svislé panely: horní s fixní výškou, spodní vyplní zbytek.
 * ```tsx
 * import { Split } from "~/components/ui/base/split";
 * 
 * <Split.Root direction="vertical" class="h-48 rounded-lg border border-separator-opaque">
 *   <Split.Panel size="4rem" class="bg-surface-raised p-2 text-caption-1">Top</Split.Panel>
 *   <Split.Panel size="1fr" class="bg-surface-overlay p-2 text-caption-1">Bottom</Split.Panel>
 * </Split.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type SplitDirection = "horizontal" | "vertical";

export type SplitRootProps = Omit<PropsOf<"div">, "class"> & {
  direction?: SplitDirection;
  class?: string;
};

/**
 * Static flex split (non-resizable). Use {@link Split.Panel} with `size` for basis / flex growth (LAYOUT.md).
 */
export const SplitRoot = component$<SplitRootProps>((props) => {
  const { class: className, direction = "horizontal", ...rest } = props;
  const dir =
    direction === "vertical"
      ? "flex h-full min-h-0 w-full min-w-0 flex-col"
      : "flex h-full min-h-0 w-full min-w-0 flex-row";
  const merged = [dir, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SplitPanelProps = Omit<PropsOf<"div">, "class"> & {
  /**
   * Fixed CSS length (e.g. `200px`, `12rem`) or `1fr` / `flex` for a growing pane.
   */
  size?: string;
  class?: string;
};

export const SplitPanel = component$<SplitPanelProps>((props) => {
  const { class: className, size = "1fr", style: userStyle, ...rest } = props;
  const flexGrow =
    size === "1fr" || size === "flex"
      ? "min-h-0 min-w-0 flex-1"
      : "shrink-0 grow-0";

  const merged = [flexGrow, className].filter(Boolean).join(" ");

  const fixedBasis =
    size === "1fr" || size === "flex"
      ? undefined
      : size;

  const style =
    fixedBasis !== undefined
      ? {
          ...(typeof userStyle === "object" && userStyle !== null && !Array.isArray(userStyle)
            ? userStyle
            : {}),
          flexBasis: fixedBasis,
        }
      : userStyle;

  return (
    <div {...rest} class={merged} style={style}>
      <Slot />
    </div>
  );
});

/** @see LAYOUT.md — static split + {@link SplitPanel} */
export const Split = {
  Root: SplitRoot,
  Panel: SplitPanel,
};
