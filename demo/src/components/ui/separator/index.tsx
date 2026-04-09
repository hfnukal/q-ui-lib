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
