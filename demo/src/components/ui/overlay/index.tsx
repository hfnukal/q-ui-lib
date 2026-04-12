/**
 * @component overlay
 * @title Overlay
 * @version 1.0.0
 * @example S vlastním obsahem
 * Kliknutím na overlay nebo tlačítko ho zavřeš.
 * ```tsx
 * import { useSignal } from "@builder.io/qwik";
 * import { Overlay } from "~/components/ui/overlay";
 * import { Button } from "~/components/ui/button";
 * 
 * export default component$(() => {
 *   const open = useSignal(false);
 *   return (
 *     <>
 *       <Button onClick$={() => (open.value = true)}>Otevřít overlay</Button>
 *       {open.value && (
 *         <Overlay onClick$={() => (open.value = false)}>
 *           <div
 *             class="fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-raised p-6 shadow-xl"
 *             onClick$={(e) => e.stopPropagation()}
 *           >
 *             <p class="text-body text-label">Obsah nad overlayem</p>
 *             <Button class="mt-4" onClick$={() => (open.value = false)}>Zavřít</Button>
 *           </div>
 *         </Overlay>
 *       )}
 *     </>
 *   );
 * });
 * ```
 
 
 
 
 
 
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
