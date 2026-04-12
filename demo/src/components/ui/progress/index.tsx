/**
 * @component progress
 * @title Progress
 * @version 1.0.0
 * @example Složené API
 * `Progress.Root` + `Progress.Indicator` — ukázka s periodickou změnou hodnoty (simulace načítání).
 * ```tsx
 * import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
 * import { Progress } from "~/components/ui/progress";
 * 
 * export default component$(() => {
 *   const v = useSignal(0);
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
 * Zkratka se stejným vzhledem — vnitřně kořen + indikátor.
 * ```tsx
 * import { ProgressBar } from "~/components/ui/progress";
 * 
 * <ProgressBar value={66} class="max-w-md" />
 * ```
 *
 * @example Neurčitý stav
 * `value=&#123;null&#125;` → `data-progress=&quot;indeterminate&quot;` a zkrácený segment s pulzováním.
 * ```tsx
 * import { ProgressBar } from "~/components/ui/progress";
 * 
 * <ProgressBar value={null} class="max-w-md" />
 * ```
 *
 * @example Vázaná hodnota
 * `bind:value` na signál spolu se `Slider`.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { ProgressBar } from "~/components/ui/progress";
 * import { Slider } from "~/components/ui/slider";
 * 
 * export default component$(() => {
 *   const v = useSignal(35);
 *   return (
 *     <div class="max-w-md space-y-4">
 *       <ProgressBar bind:value={v} />
 *       <Slider
 *         label="Hodnota"
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
 * {@link https://qwikui.com/docs/headless/progress | Progress.Root} — role `progressbar`, `value` / `bind:value`, `null` = neurčitý stav.
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
 * Výplň pruhu; šířku určuje headless přes `transform` (kromě `data-progress=indeterminate`, kde je užší segment s `animate-pulse`).
 * {@link https://github.com/QwikDev/qwik/issues/3531 | Context + Slot}: samostatný `component$` pod `Progress.Root` v Qwiku často nedostane `ProgressContext` z headless kořene — proto `FunctionComponent` (jako u `Tab.List` v `components/tabs`).
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
 * Kořen + indikátor v jednom `component$` přímo nad headlessem — spolehlivý kontext pro `bind:value` a vnoření ve skrytých tab panelech (bez `ProgressRoot` → `Slot` → další `component$`).
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
