/**
 * @component kbd-shortcut
 * @title KbdShortcut
 * @version 1.0.0
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type KbdShortcutProps = PropsOf<"kbd">;

/**
 * Stylovaný `<kbd>` prvek pro zobrazení klávesových zkratek.
 * Obsah vkládej přes slot: `⌘K`, `Ctrl+S`, nebo více `<kbd>` vedle sebe.
 */
export const KbdShortcut = component$<KbdShortcutProps>((props) => {
  const base =
    "inline-flex items-center gap-1 rounded border border-separator-opaque bg-surface-raised px-1.5 py-0.5 font-mono text-caption-2 text-secondary-label shadow-sm";
  const merged = [base, props.class].filter(Boolean).join(" ");
  return (
    <kbd {...props} class={merged}>
      <Slot />
    </kbd>
  );
});
