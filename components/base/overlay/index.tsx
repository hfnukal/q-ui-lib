/**
 * @component overlay
 * @title Overlay
 * @version 1.0.0
 * @example S vlastním obsahem
 * Kliknutím na overlay nebo tlačítko ho zavřeš.
 * ```tsx
 * import { useSignal } from "@builder.io/qwik";
 * import { Overlay } from "~/components/ui/base/overlay";
 * import { Button } from "~/components/ui/base/button";
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
import { Polymorphic } from "@qwik-ui/headless";

export type OverlayProps = Omit<PropsOf<"div">, "as"> & {
  /**
   * Root element. Default zůstává `div`; lze přepnout na `span` pro speciální textové kontejnery.
   */
  as?: "div" | "span";
};

/**
 * Průhledné fixní pozadí přes celou obrazovku — základ pro vlastní modální vrstvy,
 * drawer nebo jiné překryvy mimo nativní `<dialog>`.
 * Obsah (případný close handler, spinner…) vkládej přes slot.
 * Přes `as` lze přepnout root (`div` výchozí, `span` volitelné).
 * Pro běžné použití používejte blokové parenty; v `<p>`/`<pre>` dává smysl jen `as="span"` a omezený obsah.
 */
export const Overlay = component$<OverlayProps>((props) => {
  const { as = "div", ...rest } = props;
  const base =
    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm";
  const merged = [base, props.class].filter(Boolean).join(" ");
  return (
    <Polymorphic as={as} {...rest} class={merged}>
      <Slot />
    </Polymorphic>
  );
});
