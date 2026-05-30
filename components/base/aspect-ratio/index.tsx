/**
 * @component aspect-ratio
 * @title AspectRatio
 * @version 1.0.0
 * @example Default 16∶9
 * Prop `ratio` omitted — `16 / 9` is used.
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * <AspectRatio class="max-w-md rounded-lg border border-separator-opaque/40">
 *   <img
 *     src="https://picsum.photos/seed/aspect1/800/450"
 *     alt="Sample"
 *     width={800}
 *     height={450}
 *     class="h-full w-full object-cover"
 *   />
 * </AspectRatio>
 * ```
 *
 * @example Square
 * `ratio={"{1}"}` for a 1∶1 ratio.
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * <AspectRatio ratio={1} class="max-w-xs rounded-lg border border-separator-opaque/40">
 *   <img
 *     src="https://picsum.photos/seed/aspect2/400/400"
 *     alt="Square"
 *     width={400}
 *     height={400}
 *     class="h-full w-full object-cover"
 *   />
 * </AspectRatio>
 * ```
 *
 * @example Custom ratio
 * Any number = width / height (here a wide canvas `2.39`).
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * @example Cinematic ratio 2.39 : 1 
 * ```tsx
 * import { AspectRatio } from "~/components/ui/base/aspect-ratio";
 * 
 * <AspectRatio ratio={2.39} class="max-w-2xl rounded-lg border border-separator-opaque/40">
 *   <div class="flex h-full w-full items-center justify-center bg-fill-tertiary/50 text-callout text-secondary-label">
 *     Content instead of an image
 *   </div>
 * </AspectRatio>
 * ```




*/

import { component$, Slot } from "@builder.io/qwik";

export type AspectRatioProps = {
  /**
   * Aspect ratio as the proportion of width to height (e.g. `16 / 9` for video).
   * Maps to the CSS `aspect-ratio` property.
   */
  ratio?: number;
  /**
   * Root element. Use `as="span"` when nesting inside text-only containers like `<p>` or `<pre>`.
   */
  as?: "div" | "span";
  class?: string;
};

/**
 * Container with a fixed aspect ratio (inspired by shadcn Aspect Ratio; in this repo without Radix — pure CSS).
 * Children are typically styled `h-full w-full object-cover` to fill the frame.
 * The root is fixed as `<div>` (no `as`/`asChild`), so do not place the component inside `<p>` or `<pre>`.
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
