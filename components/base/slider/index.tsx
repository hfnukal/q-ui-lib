/**
 * @component slider
 * @title Slider
 * @version 1.0.0
 * @example Labeled value
 * Hodnotu drž v `useSignal` a předej ji jako `value` spolu s `onChange.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Slider } from "~/components/ui/base/slider";
 * 
 * export default component$(() => {
 *   const level = useSignal(40);
 *   return (
 *     <Slider
 *       label="Volume"
 *       value={level.value}
 *       onChange$={(v) => {
 *         level.value = v;
 *       }}
 *     />
 *   );
 * });
 * ```
 *
 * @example Min, max a krok
 * Props `min`, `max` a `step` pro rozsah a krok posuvníku.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Slider } from "~/components/ui/base/slider";
 * 
 * export default component$(() => {
 *   const price = useSignal(100);
 *   return (
 *     <Slider
 *       label="Price (USD)"
 *       min={0}
 *       max={500}
 *       step={25}
 *       value={price.value}
 *       onChange$={(v) => {
 *         price.value = v;
 *       }}
 *     />
 *   );
 * });
 * ```
 *
 * @example Velikost ukazatele (thumbSize)
 * Prop `thumbSize` mění velikost ukazatele i výšku dráhy: `sm`, `md` (výchozí), `lg`.
 * ```tsx
 * import { Slider } from "~/components/ui/base/slider";
 *
 * <div class="flex max-w-md flex-col gap-6">
 *   <Slider label="Malý (sm)" thumbSize="sm" value={30} />
 *   <Slider label="Střední (md)" thumbSize="md" value={50} />
 *   <Slider label="Velký (lg)" thumbSize="lg" value={70} />
 * </div>
 * ```
 *
 * @example Barva akcentu a pozadí
 * Props `color` a `backgroundColor` berou Tailwind třídy ( `accent-*`, `bg-*` z palety v `COLORS.md`).
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Slider } from "~/components/ui/base/slider";
 * 
 * export default component$(() => {
 *   const warmth = useSignal(50);
 *   return (
 *     <Slider
 *       label="Teplota"
 *       color="accent-system-orange"
 *       backgroundColor="bg-fill-quaternary"
 *       value={warmth.value}
 *       onChange$={(v) => {
 *         warmth.value = v;
 *       }}
 *     />
 *   );
 * });
 * ```
 
 
 
 
 
 
 
 
 
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
  /** Velikost ukazatele (thumb) — ovlivní WebKit/Mozilla pseudoprvek i výšku dráhy. */
  thumbSize?: "sm" | "md" | "lg";
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
  const thumb = props.thumbSize ?? "md";
  const thumbDim =
    thumb === "lg"
      ? "h-3 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5"
      : thumb === "sm"
        ? "h-1.5 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3"
        : "h-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4";
  const rail = [
    "w-full cursor-pointer appearance-none rounded-full",
    thumbDim,
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
