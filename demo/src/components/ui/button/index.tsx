/**
 * @component button
 * @title Button
 * @version 2.0.0
 * @example Základní použití
 * Kliknutím spustí handler předaný přes `onClick.
 * ```tsx
 * <Button onClick$={$(() => { alert("Button clicked"); })}>Click me</Button>
 * ```
 *
 * @example Varianty
 * Prop `variant`: `primary` (výchozí), `secondary`, `danger`.
 * ```tsx
 * <div class="flex flex-wrap gap-2">
 *   <Button variant="primary">Primary</Button>
 *   <Button variant="secondary">Secondary</Button>
 *   <Button variant="danger">Danger</Button>
 * </div>
 * ```
 *
 * @example Velikosti
 * Prop `size`: `sm`, `md` (výchozí), `lg`.
 * ```tsx
 * <div class="flex flex-wrap items-center gap-2">
 *   <Button size="sm">Small</Button>
 *   <Button size="md">Medium</Button>
 *   <Button size="lg">Large</Button>
 * </div>
 * ```
 *
 * @example Disabled
 * Prop `disabled` zakazuje interakci a sníží opacity.
 * ```tsx
 * <div class="flex flex-wrap gap-2">
 *   <Button>Enabled</Button>
 *   <Button disabled>Disabled</Button>
 * </div>
 * ```
 
 
 
 
 
 
 */

import { component$, PropFunction, Slot } from "@builder.io/qwik";

export interface ButtonProps {
  /** Click handler */
  onClick$?: PropFunction<() => void>;
  /** Visual variant of the button */
  variant?: "primary" | "secondary" | "danger";
  /** Control padding and type scale (COLORS.md text tokens) */
  size?: "sm" | "md" | "lg";
  /** Disabled state */
  disabled?: boolean;
  /** Extra Tailwind classes merged after defaults */
  class?: string;
}

/**
 * Button styled with COLORS.md tokens (accent, system-red, surfaces); focus ring matches Tab triggers.
 * Put label or icons in the default slot (children).
 */
export const Button = component$<ButtonProps>((props) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const size = {
    sm: "px-2.5 py-1.5 text-caption-1",
    md: "px-4 py-2 text-callout",
    lg: "px-5 py-2.5 text-headline",
  }[props.size ?? "md"];

  const variant = {
    primary:
      "bg-accent text-white shadow-sm hover:bg-accent/90 active:bg-accent/80",
    secondary:
      "border border-separator-opaque bg-surface-raised text-label shadow-sm hover:bg-surface-overlay hover:border-separator",
    danger:
      "bg-system-red text-white shadow-sm hover:bg-system-red/90 active:bg-system-red/80",
  }[props.variant ?? "primary"];

  const merged = [base, size, variant, props.class].filter(Boolean).join(" ");

  return (
    <button type="button" class={merged} onClick$={props.onClick$} disabled={props.disabled}>
      <Slot />
    </button>
  );
});
