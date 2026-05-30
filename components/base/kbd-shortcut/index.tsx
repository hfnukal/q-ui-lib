/**
 * @component kbd-shortcut
 * @title KbdShortcut
 * @version 1.0.0
 * @example Basic usage
 * Basic usage — see the example below.
 * ```tsx
 * import { KbdShortcut } from "~/components/ui/base/kbd-shortcut";
 * 
 * <KbdShortcut>⌘K</KbdShortcut>
 * ```
 *
 * @example Multiple keys
 * Multiple instances side by side for multi-key shortcuts.
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
 * @example Inline in text
 * Shortcuts placed directly into a sentence — readable alongside regular text.
 * ```tsx
 * import { KbdShortcut } from "~/components/ui/base/kbd-shortcut";
 * 
 * <p class="text-body text-secondary-label">
 *   Press <KbdShortcut>⌘S</KbdShortcut> to save or{" "}
 *   <KbdShortcut>Esc</KbdShortcut> to cancel.
 * </p>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type KbdShortcutProps = PropsOf<"kbd">;

/**
 * Styled `<kbd>` element for displaying keyboard shortcuts.
 * Pass content via the slot: `⌘K`, `Ctrl+S`, or multiple `<kbd>` side by side.
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
