/**
 * @component separator
 * @title Separator
 * @version 1.0.0
 * @example Vodorovně
 * Výchozí `orientation=&quot;horizontal&quot;` — plná šířka kontejneru, výška 1&nbsp;px.
 * ```tsx
 * import { Separator } from "~/components/ui/separator";
 * 
 * <div class="space-y-3">
 *   <p class="text-body text-label">Oddíl jedna</p>
 *   <Separator />
 *   <p class="text-body text-label">Oddíl dvě</p>
 * </div>
 * ```
 *
 * @example Svisle
 * V řádku použij `items-stretch` na flex kontejneru, aby čára měla výšku řádku.
 * ```tsx
 * import { Separator } from "~/components/ui/separator";
 * 
 * <div class="flex h-12 items-stretch gap-3">
 *   <span class="flex items-center text-callout text-label">Vlevo</span>
 *   <Separator orientation="vertical" />
 *   <span class="flex items-center text-callout text-label">Vpravo</span>
 * </div>
 * ```
 *
 * @example Dekorativní
 * `decorative` nastaví `role=&quot;none&quot;` — vhodné, když oddělovač není strukturální landmark.
 * ```tsx
 * import { Separator } from "~/components/ui/separator";
 * 
 * <Separator decorative />
 * // role="none" — vypnuto z accessibility stromu (čistě vizuální)
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf } from "@builder.io/qwik";
import { Separator as HeadlessSeparator } from "@qwik-ui/headless";

export type SeparatorProps = PropsOf<typeof HeadlessSeparator>;

/**
 * Vizuální oddělovač na {@link https://qwikui.com/docs/headless/separator | @qwik-ui/headless} s tokenem `bg-separator` (COLORS.md).
 * Výchozí je vodorovná čára; `orientation="vertical"` pro svislou v flex layoutu (ideálně s `items-stretch` na rodiči).
 */
export const Separator = component$<SeparatorProps>((props) => {
  const base =
    "shrink-0 bg-separator data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-[2.5rem] data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch";
  const merged = [base, props.class].filter(Boolean).join(" ");

  return <HeadlessSeparator {...props} class={merged} />;
});
