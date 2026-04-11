/**
 * @component overlay
 * @title Overlay
 * @version 1.0.0
 * @example
 * ```tsx
 * import { Overlay } from "~/components/ui/overlay";
 * 
 * <Overlay>…</Overlay>
 * ```
 * Ukázka v demo aplikaci: route `/components/overlay` (zdroj `demo/src/routes/components/overlay/index.tsx`).
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type OverlayProps = PropsOf<"div">;

/**
 * Průhledné fixní pozadí přes celou obrazovku — základ pro vlastní modální vrstvy,
 * drawer nebo jiné překryvy mimo nativní `<dialog>`.
 * Obsah (případný close handler, spinner…) vkládej přes slot.
 */
export const Overlay = component$<OverlayProps>((props) => {
  const base =
    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm";
  const merged = [base, props.class].filter(Boolean).join(" ");
  return (
    <div {...props} class={merged}>
      <Slot />
    </div>
  );
});
