import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Label as HeadlessLabel } from "@qwik-ui/headless";

export type LabelProps = PropsOf<typeof HeadlessLabel>;

/**
 * Form label on {@link https://qwikui.com/docs/headless/label | @qwik-ui/headless} with COLORS.md typography (`text-caption-1`, `text-label`).
 * Associates with a control via `for` / `htmlFor`; includes headless handling so double-click does not select the control incorrectly.
 */
export const Label = component$<LabelProps>((props) => {
  const base =
    "inline-flex cursor-default select-none text-caption-1 font-medium leading-none text-label peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
  const merged = [base, props.class].filter(Boolean).join(" ");

  return (
    <HeadlessLabel {...props} class={merged}>
      <Slot />
    </HeadlessLabel>
  );
});
