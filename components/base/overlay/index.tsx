/**
 * @component overlay
 * @title Overlay
 * @version 1.0.0
 * @example With custom content
 * Click the overlay or the button to close it.
 * ```tsx
 * import { useSignal } from "@builder.io/qwik";
 * import { Overlay } from "~/components/ui/base/overlay";
 * import { Button } from "~/components/ui/base/button";
 * 
 * export default component$(() => {
 *   const open = useSignal(false);
 *   return (
 *     <>
 *       <Button onClick$={() => (open.value = true)}>Open overlay</Button>
 *       {open.value && (
 *         <Overlay onClick$={() => (open.value = false)}>
 *           <div
 *             class="fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-raised p-6 shadow-xl"
 *             onClick$={(e) => e.stopPropagation()}
 *           >
 *             <p class="text-body text-label">Content above the overlay</p>
 *             <Button class="mt-4" onClick$={() => (open.value = false)}>Close</Button>
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
   * Root element. Default stays `div`; can be switched to `span` for special text containers.
   */
  as?: "div" | "span";
};

/**
 * Transparent fixed background covering the whole screen — a base for custom modal layers,
 * drawers, or other overlays outside the native `<dialog>`.
 * Pass content (an optional close handler, spinner…) via the slot.
 * Via `as` you can switch the root (`div` default, `span` optional).
 * For common usage use block parents; in `<p>`/`<pre>` only `as="span"` and limited content make sense.
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
