/**
 * @component textarea
 * @title Textarea
 * @version 1.0.0
 * @example Basics
 * Basics — see the example below.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Textarea } from "~/components/ui/base/textarea";
 * 
 * export default component$(() => (
 *   <Textarea placeholder="Write a message…" rows={4} />
 * ));
 * ```
 *
 * @example With a label
 * With a label — see the example below.
 * ```tsx
 * import { Textarea } from "~/components/ui/base/textarea";
 * import { Label } from "~/components/ui/base/label";
 * 
 * <div class="flex max-w-md flex-col gap-2">
 *   <Label for="msg">Message</Label>
 *   <Textarea id="msg" name="message" placeholder="Content…" rows={5} />
 * </div>
 * ```
 *
 * @example Disabled resizing (disableResize)
 * The `disableResize` prop disables the native corner drag — useful for a fixed height or a flex layout.
 * ```tsx
 * import { Textarea } from "~/components/ui/base/textarea";
 * import { Label } from "~/components/ui/base/label";
 *
 * <div class="flex max-w-md flex-col gap-2">
 *   <Label for="fixed">Message (fixed height)</Label>
 *   <Textarea id="fixed" placeholder="Cannot be enlarged…" rows={4} disableResize />
 * </div>
 * ```
 *
 * @example States
 * `disabled` and `readOnly` — handle error states via `class` or a wrapper.
 * ```tsx
 * import { Textarea } from "~/components/ui/base/textarea";
 * 
 * <div class="flex max-w-md flex-col gap-3">
 *   <Textarea placeholder="Regular state" rows={3} />
 *   <Textarea disabled placeholder="Disabled" rows={3} />
 *   <Textarea readOnly value="Read only" rows={3} />
 * </div>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf } from "@builder.io/qwik";

export type TextareaProps = PropsOf<"textarea"> & {
  /** Disables user resizing (native `resize`). */
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
