/**
 * @component aspect-ratio
 * @title AspectRatio
 * @version 1.0.0
 * @example Výchozí 16∶9
 * Prop `ratio` vynecháno — použije se `16 / 9`.
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * <AspectRatio class="max-w-md rounded-lg border border-separator-opaque/40">
 *   <img
 *     src="https://picsum.photos/seed/aspect1/800/450"
 *     alt="Ukázka"
 *     width={800}
 *     height={450}
 *     class="h-full w-full object-cover"
 *   />
 * </AspectRatio>
 * ```
 *
 * @example Čtverec
 * `ratio={"{1}"}` pro poměr 1∶1.
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * <AspectRatio ratio={1} class="max-w-xs rounded-lg border border-separator-opaque/40">
 *   <img
 *     src="https://picsum.photos/seed/aspect2/400/400"
 *     alt="Čtverec"
 *     width={400}
 *     height={400}
 *     class="h-full w-full object-cover"
 *   />
 * </AspectRatio>
 * ```
 *
 * @example Vlastní poměr
 * Libovolné číslo = šířka / výška (zde široké plátno `2.39`).
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * @example Kinematografický poměr 2.39 : 1 
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * <AspectRatio ratio={2.39} class="max-w-2xl rounded-lg border border-separator-opaque/40">
 *   <div class="flex h-full w-full items-center justify-center bg-fill-tertiary/50 text-callout text-secondary-label">
 *     Obsah místo obrázku
 *   </div>
 * </AspectRatio>
 * ```
 
 
 
 
 */

import { component$, Slot } from "@builder.io/qwik";

export type AspectRatioProps = {
  /**
   * Poměr stran jako podíl šířky ku výšce (např. `16 / 9` pro video).
   * Odpovídá CSS vlastnosti `aspect-ratio`.
   */
  ratio?: number;
  /**
   * Root element. Use `as="span"` when nesting inside text-only containers like `<p>` or `<pre>`.
   */
  as?: "div" | "span";
  class?: string;
};

/**
 * Kontejner s fixním poměrem stran (inspirace shadcn Aspect Ratio; v repu bez Radix — čisté CSS).
 * Děti typicky stylovat `h-full w-full object-cover`, aby vyplnily rámeček.
 * Root je pevně `<div>` (bez `as`/`asChild`), proto komponentu nevkládejte do `<p>` ani `<pre>`.
 */
export const AspectRatio = component$<AspectRatioProps>((props) => {
  const ratio = props.ratio ?? 16 / 9;
  const base = "relative block w-full overflow-hidden";
  const merged = [base, props.class].filter(Boolean).join(" ");
  const Tag = props.as ?? "span";

  return (
    <Tag class={merged} style={{ aspectRatio: ratio }}>
      <Slot />
    </Tag>
  );
});
