/**
 * @component radio-group
 * @title RadioGroup
 * @version 1.0.0
 * @example Basic usage
 * Basic usage — see the example below.
 * ```tsx
 * import { RadioGroup } from "~/components/ui/base/radio-group";
 * 
 * <RadioGroup.Root>
 *   <RadioGroup.Item name="plan" value="free" label="Free" />
 *   <RadioGroup.Item name="plan" value="pro" label="Pro" />
 *   <RadioGroup.Item name="plan" value="enterprise" label="Enterprise" />
 * </RadioGroup.Root>
 * ```
 *
 * @example Horizontal layout
 * Add `class="flex-row flex-wrap gap-4"` on the Root.
 * ```tsx
 * <RadioGroup.Root class="flex-row flex-wrap gap-4">
 *   <RadioGroup.Item name="size" value="sm" label="Small" />
 *   <RadioGroup.Item name="size" value="md" label="Medium" />
 *   <RadioGroup.Item name="size" value="lg" label="Large" />
 * </RadioGroup.Root>
 * ```
 *
 * @example Disabled item
 * One of the items can be made unavailable via `disabled`.
 * ```tsx
 * <RadioGroup.Root>
 *   <RadioGroup.Item name="tier" value="basic" label="Basic" />
 *   <RadioGroup.Item name="tier" value="plus" label="Plus" disabled />
 *   <RadioGroup.Item name="tier" value="premium" label="Premium" />
 * </RadioGroup.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type RadioGroupRootProps = PropsOf<"div">;

/** Container for a group of radio buttons (`role="radiogroup"`). */
export const RadioGroupRoot = component$<RadioGroupRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex flex-col gap-2";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <div role="radiogroup" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export interface RadioGroupItemProps extends Omit<PropsOf<"input">, "type"> {
  /** Visible label next to the radio input. */
  label?: string;
}

/**
 * Native `<input type="radio">` with an optional `label`. To share `name` between
 * items, pass `name` directly to each `Item` or via an HTML `<form>`.
 */
export const RadioGroupItem = component$<RadioGroupItemProps>((props) => {
  const { label, class: className, id, ...rest } = props;
  const inputId = id ?? `radio-${String(rest.value ?? "")}`;
  return (
    <div class={["flex items-center gap-2", className].filter(Boolean).join(" ")}>
      <input
        type="radio"
        id={inputId}
        {...rest}
        class="h-4 w-4 shrink-0 accent-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {label && (
        <label
          for={inputId}
          class="cursor-pointer select-none text-caption-1 font-medium text-label peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
});

/** Composite API: `RadioGroup.Root` + `RadioGroup.Item`. */
export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
