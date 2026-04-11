/**
 * @component slider
 * @title Slider
 * @version 1.0.0
 * @example
 * ```tsx
 * import { Slider } from "~/components/ui/slider";
 * 
 * <Slider>…</Slider>
 * ```
 * Ukázka v demo aplikaci: route `/components/slider` (zdroj `demo/src/routes/components/slider/index.tsx`).
 
 */

import { component$, PropFunction, useId } from "@builder.io/qwik";

export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  /** Accessible label; also sets <label htmlFor> when provided. */
  label?: string;
  onChange$?: PropFunction<(value: number) => void>;
  /** Tailwind třídy pro akcent posuvníku (thumb / `accent-color`), výchozí `accent-accent`. */
  color?: string;
  /** Tailwind třídy pro pozadí dráhy, výchozí `bg-fill-secondary`. */
  backgroundColor?: string;
  /** Extra Tailwind classes merged after defaults on the range input. */
  class?: string;
}

/**
 * Native range input styled with COLORS.md tokens (fill-secondary, accent, ring).
 * Qwik UI Headless does not ship a range slider; lightweight complement to headless primitives.
 */
export const Slider = component$<SliderProps>((props) => {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const fieldId = useId();
  const accent = props.color ?? "accent-accent";
  const trackBg = props.backgroundColor ?? "bg-fill-secondary";
  const rail = [
    "h-2 w-full cursor-pointer appearance-none rounded-full",
    trackBg,
    accent,
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
  ].join(" ");

  return (
    <div class="w-full max-w-md">
      {props.label ? (
        <label
          for={fieldId}
          class="mb-1 block text-callout font-medium text-label"
        >
          {props.label}
        </label>
      ) : null}
      <input
        id={fieldId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={props.value ?? min}
        onInput$={(e) =>
          props.onChange$?.((e.target as HTMLInputElement).valueAsNumber)
        }
        class={[rail, props.class].filter(Boolean).join(" ")}
      />
    </div>
  );
});
