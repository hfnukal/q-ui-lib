/**
 * @component radio-group
 * @title RadioGroup
 * @version 1.0.0
 * @example Základní použití
 * Základní použití — viz ukázka níže.
 * ```tsx
 * import { RadioGroup } from "~/components/ui/radio-group";
 * 
 * <RadioGroup.Root>
 *   <RadioGroup.Item name="plan" value="free" label="Free" />
 *   <RadioGroup.Item name="plan" value="pro" label="Pro" />
 *   <RadioGroup.Item name="plan" value="enterprise" label="Enterprise" />
 * </RadioGroup.Root>
 * ```
 *
 * @example Vodorovné rozložení
 * Přidej `class="flex-row flex-wrap gap-4"` na Root.
 * ```tsx
 * <RadioGroup.Root class="flex-row flex-wrap gap-4">
 *   <RadioGroup.Item name="size" value="sm" label="Small" />
 *   <RadioGroup.Item name="size" value="md" label="Medium" />
 *   <RadioGroup.Item name="size" value="lg" label="Large" />
 * </RadioGroup.Root>
 * ```
 *
 * @example Disabled položka
 * Jedna z položek může být nedostupná přes `disabled`.
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

/** Kontejner skupiny radio tlačítek (`role="radiogroup"`). */
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
  /** Viditelný popisek vedle radio vstupu. */
  label?: string;
}

/**
 * Nativní `<input type="radio">` s volitelným `label`. Pro sdílení `name` mezi
 * položkami předej `name` přímo každé `Item` nebo přes HTML `<form>`.
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

/** Složené API: `RadioGroup.Root` + `RadioGroup.Item`. */
export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
