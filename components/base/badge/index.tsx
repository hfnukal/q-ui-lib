/**
 * @component badge
 * @title Badge
 * @version 1.0.0
 * @example Varianty
 * Varianty — viz ukázka níže.
 * ```tsx
 * import { Badge } from "~/components/ui/badge";
 * 
 * <div class="flex flex-wrap gap-2">
 *   <Badge variant="default">Default</Badge>
 *   <Badge variant="secondary">Secondary</Badge>
 *   <Badge variant="outline">Outline</Badge>
 *   <Badge variant="destructive">Destructive</Badge>
 * </div>
 * ```
 *
 * @example Velikosti
 * Velikosti — viz ukázka níže.
 * ```tsx
 * import { Badge } from "~/components/ui/badge";
 * 
 * <div class="flex flex-wrap items-center gap-2">
 *   <Badge size="sm">Small</Badge>
 *   <Badge size="md">Medium</Badge>
 * </div>
 * ```
 *
 * @example V řádku s textem
 * Doplňkové třídy (např. `align-middle`, `ml-2`) sloučíš přes `class`.
 * ```tsx
 * import { Badge } from "~/components/ui/badge";
 * 
 * <p class="text-body text-label">
 *   Verze 2.1
 *   <Badge variant="secondary" class="ml-2 align-middle">
 *     Beta
 *   </Badge>
 * </p>
 * ```
 
 
 
 
 
 
 
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
    "inline-flex items-center rounded-full border font-semibold transition-colors";

  const size = {
    sm: "px-1.5 pt-[2px] pb-0 text-caption-2",
    md: "px-2.5 pt-[2px] pb-0 text-caption-1",
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
