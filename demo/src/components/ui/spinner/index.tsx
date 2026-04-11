/**
 * @component spinner
 * @title Spinner
 * @version 1.0.0
 */

import { component$ } from "@builder.io/qwik";

export interface SpinnerProps {
  /** Vizuální velikost */
  size?: "sm" | "md" | "lg";
  /** Doplňkové Tailwind třídy (např. barva) */
  class?: string;
  /**
   * Text pro čtečky (`role="status"`). Bez něj je spinner dekorativní (`aria-hidden`).
   */
  label?: string;
}

const sizeClass = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-[3px]",
} as const;

const base =
  "inline-block shrink-0 rounded-full border-fill-tertiary border-t-accent align-middle animate-spin motion-reduce:animate-none";

/**
 * Otočný indikátor načítání (SVG-free), barvy z COLORS.md (`accent`, výplně).
 */
export const Spinner = component$<SpinnerProps>((props) => {
  const size = sizeClass[props.size ?? "md"];
  const merged = [base, size, props.class].filter(Boolean).join(" ");
  const label = props.label;

  if (label) {
    return (
      <span class="inline-flex items-center gap-2" role="status">
        <span class={merged} aria-hidden="true" />
        <span class="sr-only">{label}</span>
      </span>
    );
  }

  return <span class={merged} aria-hidden="true" />;
});
