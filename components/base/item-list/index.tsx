/**
 * @component item-list
 * @title ItemList
 * @version 1.0.0
 * @example Základní použití
 * Základní použití — viz ukázka níže.
 * ```tsx
 * import { ItemList } from "~/components/ui/base/item-list";
 * 
 * <ItemList>
 *   <li class="px-2 py-1.5 text-callout text-label">Položka 1</li>
 *   <li class="px-2 py-1.5 text-callout text-label">Položka 2</li>
 *   <li class="px-2 py-1.5 text-callout text-label">Položka 3</li>
 * </ItemList>
 * ```
 *
 * @example S ikonami
 * S ikonami — viz ukázka níže.
 * ```tsx
 * import { ItemList } from "~/components/ui/base/item-list";
 * import { LuFileText, LuFolder, LuImage } from "@qwikest/icons/lucide";
 * 
 * <ItemList class="rounded-lg border border-separator-opaque bg-surface-raised">
 *   {[
 *     { icon: <LuFolder />, label: "Dokumenty" },
 *     { icon: <LuFileText />, label: "Soubor.pdf" },
 *     { icon: <LuImage />, label: "Fotka.png" },
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
 * Jednoduchý sloupec pro seznam položek (menu, select options, výsledky…).
 * Wrapper funguje jako `role="list"` `<ul>`; přímé potomky by měly být `<li>` prvky
 * nebo komponenty, které na `<li>` renderují.
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
