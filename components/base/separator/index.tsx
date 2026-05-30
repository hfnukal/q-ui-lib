/**
 * @component separator
 * @title Separator
 * @version 1.0.0
 * @example Horizontal
 * Default `orientation=&quot;horizontal&quot;` — full container width, height 1&nbsp;px.
 * ```tsx
 * import { Separator } from "~/components/ui/base/separator";
 * 
 * <div class="space-y-3">
 *   <p class="text-body text-label">Section one</p>
 *   <Separator />
 *   <p class="text-body text-label">Section two</p>
 * </div>
 * ```
 *
 * @example Vertical
 * In a row use `items-stretch` on the flex container so the line has the row height.
 * ```tsx
 * import { Separator } from "~/components/ui/base/separator";
 * 
 * <div class="flex h-12 items-stretch gap-3">
 *   <span class="flex items-center text-callout text-label">Left</span>
 *   <Separator orientation="vertical" />
 *   <span class="flex items-center text-callout text-label">Right</span>
 * </div>
 * ```
 *
 * @example Decorative
 * `decorative` sets `role=&quot;none&quot;` — suitable when the separator is not a structural landmark.
 * ```tsx
 * import { Separator } from "~/components/ui/base/separator";
 * 
 * <Separator decorative />
 * // role="none" — removed from the accessibility tree (purely visual)
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf } from "@builder.io/qwik";
import { Separator as HeadlessSeparator } from "@qwik-ui/headless";

export type SeparatorProps = PropsOf<typeof HeadlessSeparator>;

/**
 * Visual separator on {@link https://qwikui.com/docs/headless/separator | @qwik-ui/headless} with the `bg-separator` token (COLORS.md).
 * The default is a horizontal line; `orientation="vertical"` for a vertical one in a flex layout (ideally with `items-stretch` on the parent).
 */
export const Separator = component$<SeparatorProps>((props) => {
  const base =
    "shrink-0 bg-separator data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-[2.5rem] data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch";
  const merged = [base, props.class].filter(Boolean).join(" ");

  return <HeadlessSeparator {...props} class={merged} />;
});
