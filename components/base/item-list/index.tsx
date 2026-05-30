/**
 * @component item-list
 * @title ItemList
 * @version 1.0.0
 * @example Basic usage
 * Basic usage — see the example below.
 * ```tsx
 * import { ItemList } from "~/components/ui/base/item-list";
 * 
 * <ItemList>
 *   <li class="px-2 py-1.5 text-callout text-label">Item 1</li>
 *   <li class="px-2 py-1.5 text-callout text-label">Item 2</li>
 *   <li class="px-2 py-1.5 text-callout text-label">Item 3</li>
 * </ItemList>
 * ```
 *
 * @example With icons
 * With icons — see the example below.
 * ```tsx
 * import { ItemList } from "~/components/ui/base/item-list";
 * import { LuFileText, LuFolder, LuImage } from "@qwikest/icons/lucide";
 * 
 * <ItemList class="rounded-lg border border-separator-opaque bg-surface-raised">
 *   {[
 *     { icon: <LuFolder />, label: "Documents" },
 *     { icon: <LuFileText />, label: "File.pdf" },
 *     { icon: <LuImage />, label: "Photo.png" },
 *   ].map((item) => (
 *     <li class="flex items-center gap-2 px-3 py-2 text-callout text-label hover:bg-surface-overlay">
 *       <span class="text-secondary-label">{item.icon}</span>
 *       {item.label}
 *     </li>
 *   ))}
 * </ItemList>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type ItemListProps = PropsOf<"ul">;

/**
 * Simple column for a list of items (menu, select options, results…).
 * The wrapper acts as a `role="list"` `<ul>`; direct children should be `<li>` elements
 * or components that render to `<li>`.
 */
export const ItemList = component$<ItemListProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex flex-col py-1";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <ul role="list" {...rest} class={merged}>
      <Slot />
    </ul>
  );
});
