/**
 * @component badge
 * @title Badge
 * @version 1.0.0
 * @example
 * ```tsx
 * import { Badge } from "~/components/ui/badge";
 * 
 * <Badge>…</Badge>
 * ```
 * Ukázka v demo aplikaci: route `/components/badge` (zdroj `demo/src/routes/components/badge/index.tsx`).
 
 */

import { component$, Slot } from "@builder.io/qwik";

export interface BadgeProps {
  /** Visual style */
  variant?: "default" | "secondary" | "outline" | "destructive";
  /** Padding and type scale (COLORS.md caption tokens) */
  size?: "sm" | "md";
  /** Extra Tailwind classes merged after defaults */
  class?: string;
}

/**
 * Compact status or count label; tokens from COLORS.md (accent, fill, system-red, separators).
 * Default element is `span` — wrap in `Link` or use `class` for interactive affordances.
 */
export const Badge = component$<BadgeProps>((props) => {
  const base =
    "inline-flex items-center rounded-md border font-semibold transition-colors";

  const size = {
    sm: "px-1.5 py-0.5 text-caption-2",
    md: "px-2.5 py-0.5 text-caption-1",
  }[props.size ?? "md"];

  const variant = {
    default: "border-transparent bg-accent text-white shadow-sm",
    secondary:
      "border-transparent bg-fill-secondary text-secondary-label",
    outline: "border-separator-opaque bg-transparent text-label",
    destructive:
      "border-transparent bg-system-red text-white shadow-sm",
  }[props.variant ?? "default"];

  const merged = [base, size, variant, props.class].filter(Boolean).join(" ");

  return (
    <span class={merged}>
      <Slot />
    </span>
  );
});
