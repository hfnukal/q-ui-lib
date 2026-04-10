/**
 * @component aspect-ratio
 * @title AspectRatio
 * @version 1.0.0
 */

import { component$, Slot } from "@builder.io/qwik";

export type AspectRatioProps = {
  /**
   * Poměr stran jako podíl šířky ku výšce (např. `16 / 9` pro video).
   * Odpovídá CSS vlastnosti `aspect-ratio`.
   */
  ratio?: number;
  class?: string;
};

/**
 * Kontejner s fixním poměrem stran (inspirace shadcn Aspect Ratio; v repu bez Radix — čisté CSS).
 * Děti typicky stylovat `h-full w-full object-cover`, aby vyplnily rámeček.
 */
export const AspectRatio = component$<AspectRatioProps>((props) => {
  const ratio = props.ratio ?? 16 / 9;
  const base = "relative w-full overflow-hidden";
  const merged = [base, props.class].filter(Boolean).join(" ");

  return (
    <div class={merged} style={{ aspectRatio: ratio }}>
      <Slot />
    </div>
  );
});
