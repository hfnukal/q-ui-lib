/**
 * @component textarea
 * @title Textarea
 * @version 1.0.0
 * @example Základ
 * Základ — viz ukázka níže.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Textarea } from "~/components/ui/base/textarea";
 * 
 * export default component$(() => (
 *   <Textarea placeholder="Napište zprávu…" rows={4} />
 * ));
 * ```
 *
 * @example Se štítkem
 * Se štítkem — viz ukázka níže.
 * ```tsx
 * import { Textarea } from "~/components/ui/base/textarea";
 * import { Label } from "~/components/ui/base/label";
 * 
 * <div class="flex max-w-md flex-col gap-2">
 *   <Label for="msg">Zpráva</Label>
 *   <Textarea id="msg" name="message" placeholder="Obsah…" rows={5} />
 * </div>
 * ```
 *
 * @example Zakázané přetahování (disableResize)
 * Prop `disableResize` zakáže nativní přetahování rohu — vhodné pro fixní výšku nebo layout s flexem.
 * ```tsx
 * import { Textarea } from "~/components/ui/base/textarea";
 * import { Label } from "~/components/ui/base/label";
 *
 * <div class="flex max-w-md flex-col gap-2">
 *   <Label for="fixed">Zpráva (fixní výška)</Label>
 *   <Textarea id="fixed" placeholder="Nelze zvětšit…" rows={4} disableResize />
 * </div>
 * ```
 *
 * @example Stavy
 * `disabled` a `readOnly` — chybové stavy řeš přes `class` nebo obal.
 * ```tsx
 * import { Textarea } from "~/components/ui/base/textarea";
 * 
 * <div class="flex max-w-md flex-col gap-3">
 *   <Textarea placeholder="Běžný stav" rows={3} />
 *   <Textarea disabled placeholder="Disabled" rows={3} />
 *   <Textarea readOnly value="Jen ke čtení" rows={3} />
 * </div>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf } from "@builder.io/qwik";

export type TextareaProps = PropsOf<"textarea"> & {
  /** Zakáže uživatelské měnění velikosti (nativní `resize`). */
  disableResize?: boolean;
};

/**
 * Native `<textarea>` styled with COLORS.md tokens (surface-raised, separator-opaque, placeholder, ring).
 * Passes through all standard textarea attributes; merge extra styles via `class`.
 */
export const Textarea = component$<TextareaProps>((props) => {
  const { class: className, disableResize, ...rest } = props;
  const base = [
    "flex min-h-20 w-full min-w-0 rounded-md border border-separator-opaque bg-surface-raised px-3 py-2",
    "text-callout text-label shadow-sm transition-colors",
    "placeholder:text-placeholder",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "read-only:bg-fill-secondary/30 read-only:cursor-default",
    disableResize ? "resize-none" : "resize-y",
  ].join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return <textarea {...rest} class={merged} />;
});
