/**
 * @component label
 * @title Label
 * @version 1.0.1
 * @example With a field
 * Prop `for` (or `htmlFor`) pairs the label with the input's `id`.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Input } from "~/components/ui/base/input";
 * import { Label } from "~/components/ui/base/label";
 * 
 * export default component$(() => (
 *   <div class="flex flex-col gap-2">
 *     <Label for="demo-email">E-mail</Label>
 *     <Input id="demo-email" type="email" placeholder="you@example.com" />
 *   </div>
 * ));
 * ```
 *
 * @example Peer + disabled
 * The `peer` class belongs on the input; `peer-disabled:*` on the label only reacts when the input comes before the label in the DOM — you can fix the layout with a grid (rows 2 / 1).
 * ```tsx
 * import { Input } from "~/components/ui/base/input";
 * import { Label } from "~/components/ui/base/label";
 * 
 * // In the DOM, .peer must come before Label (because of Tailwind peer-*).
 * <div class="grid grid-cols-1 gap-2">
 *   <Input
 *     id="demo-locked"
 *     disabled
 *     value="Cannot edit"
 *     class="peer col-start-1 row-start-2"
 *   />
 *   <Label for="demo-locked" class="col-start-1 row-start-1">
 *     Locked field
 *   </Label>
 * </div>
 * ```
 
 
 
 
 
 
 
 
 
 */

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
