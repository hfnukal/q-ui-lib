import { component$, PropFunction, useId } from "@builder.io/qwik";

export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  /** Accessible label; also sets <label htmlFor> when provided. */
  label?: string;
  onChange$?: PropFunction<(value: number) => void>;
}

/**
 * Native range input styled with Tailwind. Qwik UI Headless does not ship a
 * range slider; this is a lightweight, accessible complement to headless primitives.
 */
export const Slider = component$<SliderProps>((props) => {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const fieldId = useId();
  return (
    <div class="w-full max-w-md">
      {props.label ? (
        <label for={fieldId} class="mb-1 block text-sm font-medium text-slate-700">
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
        class="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      />
    </div>
  );
});
