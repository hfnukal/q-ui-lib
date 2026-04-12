/**
 * @component checkbox
 * @title Checkbox
 * @version 1.1.0
 * @example Složené API — bind:checked
 * `Checkbox.Root` + `Checkbox.Indicator`.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Checkbox, CheckboxCheckIcon } from "~/components/ui/checkbox";
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
 *         Stav: {checked.value ? "vybráno" : "nevybráno"}
 *       </span>
 *     </div>
 *   );
 * });
 * ```
 *
 * @example CheckboxControl
 * Jedna komponenta s ikonou; vždy s přímým headless stromem uvnitř (vhodné s `bind:checked`).
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { CheckboxControl } from "~/components/ui/checkbox";
 *
 * export default component$(() => {
 *   const ok = useSignal(false);
 *   return (
 *     <div class="flex items-center gap-2">
 *       <CheckboxControl bind:checked={ok} aria-label="Souhlasím" />
 *       <span class="text-sm text-muted-foreground">
 *         Stav: {ok.value ? "vybráno" : "nevybráno"}
 *       </span>
 *     </div>
 *   );
 * });
 * ```
 *
 * @example CheckboxField — klik na štítek
 * Kombinuje `CheckboxControl` a `Label`; klik na text přepne stejný signál jako checkbox.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { CheckboxField } from "~/components/ui/checkbox";
 *
 * export default component$(() => {
 *   const accepted = useSignal(false);
 *   return (
 *     <CheckboxField bind:checked={accepted} label="Souhlasím s podmínkami" />
 *   );
 * });
 * ```
 *
 * @example Vlastní řádek (Label + onClick$)
 * Stejné chování ručně: `aria-labelledby` + přepnutí signálu v `onClick$` na štítku (bez `htmlFor` / `for`).
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { CheckboxControl } from "~/components/ui/checkbox";
 * import { Label } from "~/components/ui/label";
 *
 * export default component$(() => {
 *   const v = useSignal(false);
 *   const id = "my-cb";
 *   const lid = "my-cb-lbl";
 *   return (
 *     <div class="flex items-center gap-2">
 *       <CheckboxControl bind:checked={v} id={id} aria-labelledby={lid} />
 *       <Label id={lid} class="cursor-pointer" onClick$={$(() => { v.value = !v.value; })}>
 *         Vlastní text
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

/** Bez `size-full` na hostu — skrytý headless indikátor (`display:none`) by jinak mohl nechat prázdný Qwik host a rozházet layout. */
const indicatorClass = "flex items-center justify-center text-current";

export type CheckboxRootProps = PropsOf<typeof HeadlessCheckbox.Root>;

export type CheckboxIndicatorProps = PropsOf<typeof HeadlessCheckbox.Indicator>;

/**
 * Styled {@link https://qwikui.com/docs/headless/checkbox | Checkbox.Root} (role=`checkbox`, klávesa Space).
 * Musí být `component$` + {@link Slot}, aby se děti promítly do headless kořene (stejný vzor jako {@link Label}).
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
 * Zobrazení stavu zaškrtnutí; skryté přes headless styly, když není checked.
 * `component$` + {@link Slot} kvůli správnému přenosu dětí do headless primitiva.
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
 * Složené API: {@link CheckboxRoot}, {@link CheckboxIndicator}
 * (v dokumentaci Qwik UI `Checkbox.*`).
 */
export const Checkbox = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
};

/** Výchozí kompaktní fajfka (currentColor = `text-white` z kořene při checked). */
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
 * Kořen + indikátor + ikona v jednom `component$` přímo nad headlessem (bez vnořeného {@link CheckboxRoot} / {@link CheckboxIndicator}),
 * aby Qwik správně promítl sloty a kontext — vnořené `component$` kolem stejného stromu rozbíjely chování po odškrtnutí.
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
  /** Text štítku; klik na štítek přepíná stejný stav jako checkbox. */
  label: string;
};

/**
 * {@link CheckboxControl} + {@link Label}: klik na text volitelně přes `onClick$` mění signál (`bind:checked`) nebo u neřízeného režimu
 * deleguje programový `click` na kořen checkboxu (žádné `for` — u `role="checkbox"` na `div` by hrozilo dvojité přepnutí).
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
