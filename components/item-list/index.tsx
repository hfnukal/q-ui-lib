/**
 * @component item-list
 * @title ItemList
 * @version 1.0.0
 * @example
 * ```tsx
 * import { ItemList } from "~/components/ui/item-list";
 * 
 * <ItemList>…</ItemList>
 * ```
 * Ukázka v demo aplikaci: route `/components/item-list` (zdroj `demo/src/routes/components/item-list/index.tsx`).
 
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
