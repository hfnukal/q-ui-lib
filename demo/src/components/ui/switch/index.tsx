import { component$, type PropsOf } from "@builder.io/qwik";
import { Toggle as HeadlessToggle } from "@qwik-ui/headless";

export type SwitchProps = PropsOf<typeof HeadlessToggle>;

const rootClass =
  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-fill-secondary transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-accent [&[aria-pressed='true']_span]:translate-x-[1.25rem]";

const thumbClass =
  "pointer-events-none absolute left-[3px] top-1/2 block size-[18px] -translate-y-1/2 rounded-full bg-surface-overlay shadow-sm ring-1 ring-separator-opaque transition-transform duration-200 ease-in-out will-change-transform";

/**
 * Přepínač ve stylu přepínače (switch) nad {@link https://qwikui.com/docs/headless/toggle | @qwik-ui/headless Toggle}:
 * `aria-pressed`, `bind:pressed`, `onPressedChange$`, `disabled`.
 */
export const Switch = component$<SwitchProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = [rootClass, className].filter(Boolean).join(" ");

  return (
    <HeadlessToggle {...rest} class={merged}>
      <span class={thumbClass} aria-hidden="true" />
    </HeadlessToggle>
  );
});
