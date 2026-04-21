/**
 * @component stack
 * @title Stack
 * @version 1.0.0
 * @example Sloupec
 * Sloupec ( `direction=&quot;column&quot;` ), mezery přes `gap`.
 * ```tsx
 * import { Stack } from "~/components/ui/stack";
 * 
 * <Stack direction="column" gap={4} align="stretch">
 *   <div class="h-8 rounded bg-fill-secondary" />
 *   <div class="h-8 rounded bg-fill-tertiary" />
 * </Stack>
 * ```
 *
 * @example Řádek
 * Řádek se zarovnáním na střed a rozložením `justify=&quot;between&quot;`.
 * ```tsx
 * import { Stack } from "~/components/ui/stack";
 * 
 * <Stack direction="row" gap={2} align="center" justify="between" class="w-full max-w-md">
 *   <span class="text-callout">Vlevo</span>
 *   <span class="text-callout">Vpravo</span>
 * </Stack>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type StackDirection = "row" | "column";

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

export type StackProps = Omit<PropsOf<"div">, "class"> & {
  direction?: StackDirection;
  /** Tailwind spacing scale: `gap-{gap}` */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
  align?: keyof typeof alignMap;
  justify?: keyof typeof justifyMap;
  wrap?: boolean;
  class?: string;
};

/**
 * Flex stack with gap / align / justify (LAYOUT.md). Prefer over ad-hoc `flex` blocks.
 */
export const Stack = component$<StackProps>((props) => {
  const {
    class: className,
    direction = "column",
    gap,
    align,
    justify,
    wrap,
    ...rest
  } = props;

  const flexDir = direction === "row" ? "flex-row" : "flex-col";
  const gapCls = gap !== undefined ? `gap-${gap}` : "";
  const alignCls = align ? alignMap[align] : "";
  const justifyCls = justify ? justifyMap[justify] : "";
  const wrapCls = wrap ? "flex-wrap" : "";

  const base = ["flex min-h-0 min-w-0", flexDir, gapCls, alignCls, justifyCls, wrapCls]
    .filter(Boolean)
    .join(" ");

  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});
