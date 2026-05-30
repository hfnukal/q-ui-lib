/**
 * @component box
 * @title Box
 * @version 1.0.0
 * @example Presets
 * Token presets: `padding`, `background`, border and rounding.
 * ```tsx
 * import { Box } from "~/components/ui/base/box";
 * 
 * <Box padding="md" margin="none" background="raised" border rounded="lg">
 *   Content
 * </Box>
 * ```
 *
 * @example Extending via class
 * Custom layout and appearance with a single class via `class`.
 * ```tsx
 * import { Box } from "~/components/ui/base/box";
 * 
 * <Box class="w-64 p-6 bg-surface-overlay rounded-xl border border-separator-opaque">
 *   Width and other styles via class
 * </Box>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

const paddingMap = {
  none: "",
  xs: "p-2",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
} as const;

const marginMap = {
  none: "",
  xs: "m-2",
  sm: "m-3",
  md: "m-4",
  lg: "m-6",
} as const;

const backgroundMap = {
  transparent: "",
  base: "bg-background",
  raised: "bg-surface-raised",
  overlay: "bg-surface-overlay",
  grouped: "bg-grouped-surface",
} as const;

const roundedMap = {
  none: "",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
} as const;

export type BoxProps = Omit<PropsOf<"div">, "class"> & {
  padding?: keyof typeof paddingMap;
  margin?: keyof typeof marginMap;
  background?: keyof typeof backgroundMap;
  /** Border + radius using separator token (COLORS.md) */
  border?: boolean;
  rounded?: keyof typeof roundedMap;
  class?: string;
};

/**
 * Generic layout/styling container (LAYOUT.md). Width/height via `class` (e.g. `w-full h-full`).
 * The root is fixed as `<div>` (`BoxProps` is based on `PropsOf<"div">`); the tag cannot be switched via the API.
 * Do not place inside `<p>` or `<pre>`.
 */
export const Box = component$<BoxProps>((props) => {
  const {
    class: className,
    padding = "none",
    margin = "none",
    background = "transparent",
    border = false,
    rounded = "none",
    ...rest
  } = props;

  const borderCls = border ? "border border-separator-opaque/40" : "";

  const base = [
    "min-h-0 min-w-0",
    paddingMap[padding],
    marginMap[margin],
    backgroundMap[background],
    borderCls,
    roundedMap[rounded],
  ]
    .filter(Boolean)
    .join(" ");

  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});
