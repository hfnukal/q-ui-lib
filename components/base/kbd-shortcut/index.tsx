/**
 * @component kbd-shortcut
 * @title KbdShortcut
 * @version 1.0.0
 * @example Základní použití
 * Základní použití — viz ukázka níže.
 * ```tsx
 * import { KbdShortcut } from "~/components/ui/base/kbd-shortcut";
 * 
 * <KbdShortcut>⌘K</KbdShortcut>
 * ```
 *
 * @example Více kláves
 * Více instancí vedle sebe pro víceznakové zkratky.
 * ```tsx
 * import { KbdShortcut } from "~/components/ui/base/kbd-shortcut";
 * 
 * <span class="flex items-center gap-1">
 *   <KbdShortcut>Ctrl</KbdShortcut>
 *   <KbdShortcut>Shift</KbdShortcut>
 *   <KbdShortcut>P</KbdShortcut>
 * </span>
 * ```
 *
 * @example Inline v textu
 * Zkratky vložené přímo do věty — čitelné vedle běžného textu.
 * ```tsx
 * import { KbdShortcut } from "~/components/ui/base/kbd-shortcut";
 * 
 * <p class="text-body text-secondary-label">
 *   Stiskni <KbdShortcut>⌘S</KbdShortcut> pro uložení nebo{" "}
 *   <KbdShortcut>Esc</KbdShortcut> pro zrušení.
 * </p>
 * ```
 
 
 
 
 
 
 
 
 
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
