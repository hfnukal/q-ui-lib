/**
 * @component input
 * @title Input
 * @version 1.0.0
 * @example Základ
 * Základ — viz ukázka níže.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Input } from "~/components/ui/base/input";
 * 
 * export default component$(() => (
 *   <Input type="text" placeholder="Zadejte text…" />
 * ));
 * ```
 *
 * @example Se štítkem
 * Se štítkem — viz ukázka níže.
 * ```tsx
 * import { Input } from "~/components/ui/base/input";
 * import { Label } from "~/components/ui/base/label";
 * 
 * <div class="flex max-w-md flex-col gap-2">
 *   <Label for="user-email">E-mail</Label>
 *   <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
 * </div>
 * ```
 *
 * @example Stavy
 * `disabled` a `readOnly` — vlastní chybové zobrazení řeš přes `class` nebo obal (např. border-destructive).
 * ```tsx
 * import { Input } from "~/components/ui/base/input";
 * 
 * <div class="flex max-w-md flex-col gap-3">
 *   <Input placeholder="Běžný stav" />
 *   <Input disabled value="Disabled" />
 *   <Input readOnly value="Jen ke čtení" />
 * </div>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf } from "@builder.io/qwik";

export type InputProps = PropsOf<"input">;

/**
 * Native `<input>` styled with COLORS.md tokens (surface-raised, separator-opaque, placeholder, ring).
 * Passes through all standard input attributes; merge extra styles via `class`.
 */
export const Input = component$<InputProps>((props) => {
  const { class: className, ...rest } = props;
  const base = [
    "flex h-10 w-full min-w-0 rounded-md border border-separator-opaque bg-surface-raised px-3 py-2",
    "text-callout text-label shadow-sm transition-colors",
    "placeholder:text-placeholder",
    "file:border-0 file:bg-transparent file:text-callout file:font-medium file:text-label",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "read-only:bg-fill-secondary/30 read-only:cursor-default",
  ].join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return <input {...rest} class={merged} />;
});
