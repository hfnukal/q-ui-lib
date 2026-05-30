/**
 * @component button
 * @title Button
 * @version 2.1.0
 * @example Základní použití
 * Kliknutím spustí handler předaný přes `onClick$`.
 * ```tsx
 * <Button onClick$={$(() => { alert("Button clicked"); })}>Click me</Button>
 * ```
 *
 * @example Varianty (Styl)
 * Prop `variant`: `contained` (výchozí), `outline`, `text`.
 * ```tsx
 * <div class="flex flex-wrap gap-2">
 *   <Button variant="contained">Contained</Button>
 *   <Button variant="outline">Outline</Button>
 *   <Button variant="text">Text</Button>
 * </div>
 * ```
 *
 * @example Záměry (Barvy)
 * Prop `intent`: `primary` (výchozí), `secondary`, `danger`. Funguje i jako legacy `variant`.
 * ```tsx
 * <div class="flex flex-wrap gap-2">
 *   <Button intent="primary">Primary</Button>
 *   <Button intent="secondary">Secondary</Button>
 *   <Button intent="danger">Danger</Button>
 * </div>
 * ```
 *
 * @example Kombinace
 * ```tsx
 * <div class="flex flex-wrap gap-2">
 *   <Button variant="outline" intent="danger">Outline Danger</Button>
 *   <Button variant="text" intent="primary">Text Primary</Button>
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

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type ButtonProps = PropsOf<"button"> & {
  /** Visual variant: contained (default), outline, or text-only */
  variant?: "contained" | "outline" | "text" | "primary" | "secondary" | "danger";
  /** Color intent: primary (default), secondary, or danger */
  intent?: "primary" | "secondary" | "danger";
  /** Control padding and type scale (COLORS.md text tokens) */
  size?: "sm" | "md" | "lg";
};

/**
 * Button styled with COLORS.md tokens (accent, system-red, surfaces).
 * Supports contained, outline, and text variants with primary, secondary, and danger intents.
 */
export const Button = component$<ButtonProps>((props) => {
  const {
    class: className,
    variant = "contained",
    intent = "primary",
    size = "md",
    type = "button",
    ...rest
  } = props;

  // Determine actual style and color (handling legacy variant values)
  const isLegacy = ["primary", "secondary", "danger"].includes(variant);
  const v = isLegacy ? "contained" : (variant as "contained" | "outline" | "text");
  const i = isLegacy ? (variant as "primary" | "secondary" | "danger") : intent;

  const base =
    "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-caption-1",
    md: "px-4 py-2 text-callout",
    lg: "px-5 py-2.5 text-headline",
  }[size];

  const variantClasses = {
    primary: {
      contained: "bg-accent text-white shadow-sm hover:bg-accent/90 active:bg-accent/80",
      outline: "border border-accent text-accent hover:bg-accent/10 active:bg-accent/20",
      text: "text-accent hover:bg-accent/10 active:bg-accent/20",
    },
    secondary: {
      contained:
        "border border-separator-opaque bg-surface-raised text-label shadow-sm hover:bg-surface-overlay hover:border-separator",
      outline: "border border-separator-opaque text-label hover:bg-surface-raised active:bg-fill-secondary/20",
      text: "text-secondary-label hover:bg-fill-secondary/20 active:bg-fill-secondary/30",
    },
    danger: {
      contained: "bg-system-red text-white shadow-sm hover:bg-system-red/90 active:bg-system-red/80",
      outline: "border border-system-red text-system-red hover:bg-system-red/10 active:bg-system-red/20",
      text: "text-system-red hover:bg-system-red/10 active:bg-system-red/20",
    },
  }[i][v];

  const merged = [base, sizeClasses, variantClasses, className].filter(Boolean).join(" ");

  return (
    <button {...rest} type={type} class={merged}>
      <Slot />
    </button>
  );
});

