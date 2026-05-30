/**
 * @component progress
 * @title Progress
 * @version 1.0.0
 * @example Composite API
 * `Progress.Root` + `Progress.Indicator` — an example with a periodically changing value (simulating loading).
 * ```tsx
 * import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
 * import { Progress } from "~/components/ui/base/progress";
 * 
 * export default component$(() => {
 *   const v = useSignal(0);
 *   // eslint-disable-next-line qwik/no-use-visible-task
 *   useVisibleTask$(({ cleanup }) => {
 *     const id = window.setInterval(() => {
 *       v.value = v.value >= 100 ? 0 : v.value + 4;
 *     }, 350);
 *     cleanup(() => clearInterval(id));
 *   });
 *   return (
 *     <Progress.Root value={v.value} class="max-w-md">
 *       <Progress.Indicator />
 *     </Progress.Root>
 *   );
 * });
 * ```
 *
 * @example ProgressBar
 * A shortcut with the same look — internally root + indicator.
 * ```tsx
 * import { ProgressBar } from "~/components/ui/base/progress";
 * 
 * <ProgressBar value={66} class="max-w-md" />
 * ```
 *
 * @example Indeterminate state
 * `value=&#123;null&#125;` → `data-progress=&quot;indeterminate&quot;` and a shortened pulsing segment.
 * ```tsx
 * import { ProgressBar } from "~/components/ui/base/progress";
 * 
 * <ProgressBar value={null} class="max-w-md" />
 * ```
 *
 * @example Bound value
 * `bind:value` to a signal together with a `Slider`.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { ProgressBar } from "~/components/ui/base/progress";
 * import { Slider } from "~/components/ui/base/slider";
 * 
 * export default component$(() => {
 *   const v = useSignal(35);
 *   return (
 *     <div class="max-w-md space-y-4">
 *       <ProgressBar bind:value={v} />
 *       <Slider
 *         label="Value"
 *         value={v.value}
 *         onChange$={(n) => {
 *           v.value = n;
 *         }}
 *       />
 *     </div>
 *   );
 * });
 * ```
 
 
 
 
 
 
 
 
 
 */

import {
  component$,
  type FunctionComponent,
  type PropsOf,
  Slot,
} from "@builder.io/qwik";
import { Progress as HeadlessProgress } from "@qwik-ui/headless";

const rootClass =
  "relative h-2 w-full overflow-hidden rounded-full bg-fill-secondary ring-offset-background";

const indicatorClass =
  "q-ui-progress-indicator relative h-full w-full min-h-0 origin-left bg-accent transition-[transform] duration-500 ease-out motion-reduce:transition-none data-[progress=indeterminate]:!w-[30%] data-[progress=indeterminate]:motion-reduce:animate-none";

export type ProgressRootProps = PropsOf<typeof HeadlessProgress.Root>;

export type ProgressIndicatorProps = PropsOf<typeof HeadlessProgress.Indicator>;

/**
 * {@link https://qwikui.com/docs/headless/progress | Progress.Root} — role `progressbar`, `value` / `bind:value`, `null` = indeterminate state.
 */
export const ProgressRoot = component$<ProgressRootProps>((props) => {
  const merged = [rootClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessProgress.Root {...props} class={merged}>
      <Slot />
    </HeadlessProgress.Root>
  );
});

/**
 * Bar fill; the width is set by headless via `transform` (except `data-progress=indeterminate`, where there is a narrower segment with `animate-pulse`).
 * {@link https://github.com/QwikDev/qwik/issues/3531 | Context + Slot}: a standalone `component$` under `Progress.Root` in Qwik often does not receive `ProgressContext` from the headless root — hence `FunctionComponent` (as with `Tab.List` in `components/tabs`).
 */
export const ProgressIndicator: FunctionComponent<ProgressIndicatorProps> = (
  props,
) => {
  const merged = [indicatorClass, props.class].filter(Boolean).join(" ");
  return <HeadlessProgress.Indicator {...props} class={merged} />;
};

export const Progress = {
  Root: ProgressRoot,
  Indicator: ProgressIndicator,
};

export type ProgressBarProps = ProgressRootProps;

/**
 * Root + indicator in a single `component$` directly over headless — reliable context for `bind:value` and nesting inside hidden tab panels (without `ProgressRoot` → `Slot` → another `component$`).
 */
export const ProgressBar = component$<ProgressBarProps>((props) => {
  const { class: className, ...rest } = props;
  const mergedRoot = [rootClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessProgress.Root {...rest} class={mergedRoot}>
      <HeadlessProgress.Indicator class={indicatorClass} />
    </HeadlessProgress.Root>
  );
});
