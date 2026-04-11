/**
 * @component input
 * @title Input
 * @version 1.0.0
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
