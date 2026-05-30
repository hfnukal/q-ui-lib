/**
 * @component input
 * @title Input
 * @version 1.0.0
 * @example Basics
 * Basics — see the example below.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Input } from "~/components/ui/base/input";
 * 
 * export default component$(() => (
 *   <Input type="text" placeholder="Enter text…" />
 * ));
 * ```
 *
 * @example With label
 * With label — see the example below.
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
 * @example States
 * `disabled` and `readOnly` — handle custom error display via `class` or a wrapper (e.g. border-destructive).
 * ```tsx
 * import { Input } from "~/components/ui/base/input";
 * 
 * <div class="flex max-w-md flex-col gap-3">
 *   <Input placeholder="Normal state" />
 *   <Input disabled value="Disabled" />
 *   <Input readOnly value="Read only" />
 * </div>
 * ```
 * @example Sizes (variant)
 * Prop `variant`: `xl`, `lg`, `md` (default), `sm`, `xs`.
 * ```tsx
 * import { Input } from "~/components/ui/base/input";
 *
 * <div class="flex flex-col gap-4">
 *   <Input variant="xl" placeholder="Extra Large" />
 *   <Input variant="lg" placeholder="Large" />
 *   <Input variant="md" placeholder="Medium (Default)" />
 *   <Input variant="sm" placeholder="Small" />
 *   <Input variant="xs" placeholder="Extra Small" />
 * </div>
 * ```
 */

import { component$, type PropsOf } from "@builder.io/qwik";

export type InputProps = PropsOf<"input"> & {
  /** Visual variant affecting size: xl, lg, md (default), sm, xs */
  variant?: "xl" | "lg" | "md" | "sm" | "xs";
};

const inputVariants = {
  xl: "h-14 px-5 py-4 text-title-3 file:text-title-3",
  lg: "h-12 px-4 py-3 text-headline file:text-headline",
  md: "h-10 px-3 py-2 text-callout file:text-callout",
  sm: "h-8 px-2.5 py-1.5 text-caption-1 file:text-caption-1",
  xs: "h-7 px-2 py-1 text-caption-2 file:text-caption-2",
};

/**
 * Native `<input>` styled with COLORS.md tokens (surface-raised, separator-opaque, placeholder, ring).
 * Passes through all standard input attributes; merge extra styles via `class`.
 */
export const Input = component$<InputProps>((props) => {
  const { class: className, variant = "md", ...rest } = props;
  const base = [
    "flex w-full min-w-0 rounded-md border border-separator-opaque bg-surface-raised transition-colors",
    "text-label shadow-sm",
    "placeholder:text-placeholder",
    "file:border-0 file:bg-transparent file:font-medium file:text-label",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "read-only:bg-fill-secondary/30 read-only:cursor-default",
  ].join(" ");
  const merged = [base, inputVariants[variant], className].filter(Boolean).join(" ");

  return <input {...rest} class={merged} />;
});
