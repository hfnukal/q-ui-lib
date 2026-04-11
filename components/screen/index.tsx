/**
 * @component screen
 * @title Screen
 * @version 1.0.0
 * @example
 * ```tsx
 * import { Screen } from "~/components/ui/screen";
 * 
 * <Screen>…</Screen>
 * ```
 * Ukázka v demo aplikaci: route `/components/screen` (zdroj `demo/src/routes/components/screen/index.tsx`).
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type ScreenProps = PropsOf<"div">;

/**
 * Viewport root: full screen, no body scroll, column flex (LAYOUT.md).
 * Compose with {@link ScrollArea} for inner scroll.
 */
export const Screen = component$<ScreenProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex h-screen w-screen min-h-0 min-w-0 flex-col overflow-hidden";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});
