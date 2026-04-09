import { component$, type PropsOf } from "@builder.io/qwik";

export type TextareaProps = PropsOf<"textarea">;

/**
 * Native `<textarea>` styled with COLORS.md tokens (surface-raised, separator-opaque, placeholder, ring).
 * Passes through all standard textarea attributes; merge extra styles via `class`.
 */
export const Textarea = component$<TextareaProps>((props) => {
  const { class: className, ...rest } = props;
  const base = [
    "flex min-h-20 w-full min-w-0 rounded-md border border-separator-opaque bg-surface-raised px-3 py-2",
    "text-callout text-label shadow-sm transition-colors",
    "placeholder:text-placeholder",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "read-only:bg-fill-secondary/30 read-only:cursor-default",
    "resize-y",
  ].join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return <textarea {...rest} class={merged} />;
});
