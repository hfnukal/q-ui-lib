/**
 * @component checkbox
 * @title Checkbox
 * @version 1.1.0
 * @example Compound API — bind:checked
 * `Checkbox.Root` + `Checkbox.Indicator`.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Checkbox, CheckboxCheckIcon } from "~/components/ui/base/checkbox";
 *
 * export default component$(() => {
 *   const checked = useSignal(false);
 *   return (
 *     <div class="flex items-center gap-2">
 *       <Checkbox.Root bind:checked={checked} aria-labelledby="demo-cb-compound-label">
 *         <Checkbox.Indicator>
 *           <CheckboxCheckIcon />
 *         </Checkbox.Indicator>
 *       </Checkbox.Root>
 *       <span id="demo-cb-compound-label" class="text-sm text-muted-foreground">
 *         State: {checked.value ? "selected" : "not selected"}
 *       </span>
 *     </div>
 *   );
 * });
 * ```
 *
 * @example CheckboxControl
 * A single component with an icon; always with a direct headless tree inside (suitable with `bind:checked`).
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { CheckboxControl } from "~/components/ui/base/checkbox";
 *
 * export default component$(() => {
 *   const ok = useSignal(false);
 *   return (
 *     <div class="flex items-center gap-2">
 *       <CheckboxControl bind:checked={ok} aria-label="I agree" />
 *       <span class="text-sm text-muted-foreground">
 *         State: {ok.value ? "selected" : "not selected"}
 *       </span>
 *     </div>
 *   );
 * });
 * ```
 *
 * @example CheckboxField — click on label
 * Combines `CheckboxControl` and `Label`; clicking the text toggles the same signal as the checkbox.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { CheckboxField } from "~/components/ui/base/checkbox";
 *
 * export default component$(() => {
 *   const accepted = useSignal(false);
 *   return (
 *     <CheckboxField bind:checked={accepted} label="I agree to the terms" />
 *   );
 * });
 * ```
 *
 * @example Custom row (Label + onClick$)
 * The same behavior manually: `aria-labelledby` + toggling the signal in `onClick on the label (without `htmlFor` / `for`).
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { CheckboxControl } from "~/components/ui/base/checkbox";
 * import { Label } from "~/components/ui/base/label";
 *
 * export default component$(() => {
 *   const v = useSignal(false);
 *   const id = "my-cb";
 *   const lid = "my-cb-lbl";
 *   return (
 *     <div class="flex items-center gap-2">
 *       <CheckboxControl bind:checked={v} id={id} aria-labelledby={lid} />
 *       <Label id={lid} class="cursor-pointer" onClick$={$(() => { v.value = !v.value; })}>
 *         Custom text
 *       </Label>
 *     </div>
 *   );
 * });
 * ```
 
 
 */

import { $, component$, type PropsOf, Slot, useId } from "@builder.io/qwik";
import { Checkbox as HeadlessCheckbox } from "@qwik-ui/headless";
import { Label } from "../label";

const rootClass =
  "peer box-border flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-separator-opaque bg-surface-raised text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background aria-checked:border-accent aria-checked:bg-accent";

/** Without `size-full` on the host — a hidden headless indicator (`display:none`) could otherwise leave an empty Qwik host and break the layout. */
const indicatorClass = "flex items-center justify-center text-current";

export type CheckboxRootProps = PropsOf<typeof HeadlessCheckbox.Root>;

export type CheckboxIndicatorProps = PropsOf<typeof HeadlessCheckbox.Indicator>;

/**
 * Styled {@link https://qwikui.com/docs/headless/checkbox | Checkbox.Root} (role=`checkbox`, Space key).
 * Must be `component$` + {@link Slot} so children are projected into the headless root (the same pattern as {@link Label}).
 */
export const CheckboxRoot = component$<CheckboxRootProps>((props) => {
  const merged = [rootClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCheckbox.Root {...props} class={merged}>
      <Slot />
    </HeadlessCheckbox.Root>
  );
});

/**
 * Displays the checked state; hidden via headless styles when not checked.
 * `component$` + {@link Slot} for correctly passing children into the headless primitive.
 */
export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  const merged = [indicatorClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCheckbox.Indicator {...props} class={merged}>
      <Slot />
    </HeadlessCheckbox.Indicator>
  );
});

/**
 * Compound API: {@link CheckboxRoot}, {@link CheckboxIndicator}
 * (in the Qwik UI documentation `Checkbox.*`).
 */
export const Checkbox = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
};

/** Default compact checkmark (currentColor = `text-white` from the root when checked). */
export const CheckboxCheckIcon = component$(() => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-3.5"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
});

export type CheckboxControlProps = CheckboxRootProps;

/**
 * Root + indicator + icon in a single `component$` directly over headless (without a nested {@link CheckboxRoot} / {@link CheckboxIndicator}),
 * so Qwik correctly projects the slots and context — nested `component$` around the same tree broke the behavior after unchecking.
 */
export const CheckboxControl = component$<CheckboxControlProps>((props) => {
  const { class: className, ...rest } = props;
  const mergedRoot = [rootClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessCheckbox.Root {...rest} class={mergedRoot}>
      <HeadlessCheckbox.Indicator class={indicatorClass}>
        <CheckboxCheckIcon />
      </HeadlessCheckbox.Indicator>
    </HeadlessCheckbox.Root>
  );
});

export type CheckboxFieldProps = CheckboxControlProps & {
  /** Label text; clicking the label toggles the same state as the checkbox. */
  label: string;
};

/**
 * {@link CheckboxControl} + {@link Label}: clicking the text optionally changes the signal via `onClick$` (`bind:checked`) or in uncontrolled mode
 * delegates a programmatic `click` to the checkbox root (no `for` — with `role="checkbox"` on a `div` a double toggle could occur).
 */
export const CheckboxField = component$<CheckboxFieldProps>((props) => {
  const { label, class: className, id: givenId, ...rest } = props;
  const gen = useId();
  const cbId = givenId ?? `cb-${gen}`;
  const lblId = `${cbId}-label`;
  const bound = props["bind:checked"];
  const wrapClass = ["flex items-center gap-2", className].filter(Boolean).join(" ");

  return (
    <div class={wrapClass}>
      <CheckboxControl {...rest} id={cbId} aria-labelledby={lblId} />
      <Label
        id={lblId}
        class="cursor-pointer select-none"
        onClick$={$(() => {
          if (bound) {
            bound.value = !bound.value;
            return;
          }
          document.getElementById(cbId)?.click();
        })}
      >
        {label}
      </Label>
    </div>
  );
});
