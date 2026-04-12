/**
 * @component pagination
 * @title Pagination
 * @version 1.0.0
 * @example Základní použití
 * Props `selectedPage`, `totalPages`, `onPageChange — aktuální stránka drž v `useSignal`.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/pagination";
 * 
 * export default component$(() => {
 *   const page = useSignal(1);
 *   return (
 *     <Pagination
 *       selectedPage={page.value}
 *       totalPages={10}
 *       onPageChange$={$((p) => {
 *         page.value = p;
 *       })}
 *     />
 *   );
 * });
 * ```
 *
 * @example Více sousedních stránek
 * Prop `siblingCount` (výchozí 1) rozšiřuje okno kolem aktivní stránky.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/pagination";
 * 
 * export default component$(() => {
 *   const page = useSignal(5);
 *   return (
 *     <Pagination
 *       selectedPage={page.value}
 *       totalPages={24}
 *       siblingCount={2}
 *       onPageChange$={$((p) => {
 *         page.value = p;
 *       })}
 *     />
 *   );
 * });
 * ```
 *
 * @example Vlastní popisky šipek
 * `customArrowTexts` — krátké texty místo výchozích PREV / NEXT.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/pagination";
 * 
 * export default component$(() => {
 *   const page = useSignal(1);
 *   return (
 *     <Pagination
 *       selectedPage={page.value}
 *       totalPages={8}
 *       customArrowTexts={{ previous: "Zpět", next: "Vpřed" }}
 *       onPageChange$={$((p) => {
 *         page.value = p;
 *       })}
 *     />
 *   );
 * });
 * ```
 *
 * @example Zakázáno
 * Neinteraktivní stránkování přes prop `disabled`.
 * ```tsx
 * import { $, component$ } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/pagination";
 * 
 * export default component$(() => (
 *   <Pagination
 *     selectedPage={3}
 *     totalPages={10}
 *     disabled
 *     onPageChange$={$(() => {})}
 *   />
 * ));
 * ```
 
 
 
 
 
 
 
 */

import { component$, type PropsOf } from "@builder.io/qwik";
import { Pagination as HeadlessPagination } from "@qwik-ui/headless";

/**
 * Kořenová navigace: flex, mezery mezi prvky (headless `gap` v typu zatím neaplikuje na DOM).
 */
const navClass =
  "mx-auto flex w-full max-w-fit flex-wrap items-center justify-center gap-1 text-callout text-secondary-label";

const pageDefaultClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-2 font-medium text-label shadow-sm transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const pageSelectedClass =
  "border-accent bg-accent text-white shadow-sm hover:bg-accent/90 hover:text-white";

const ellipsisClass =
  "inline-flex h-9 min-w-9 cursor-default items-center justify-center text-secondary-label";

const arrowClass =
  "inline-flex h-9 items-center justify-center gap-1 rounded-md border border-separator-opaque bg-surface-raised px-2.5 font-medium text-label shadow-sm transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export type PaginationProps = PropsOf<typeof HeadlessPagination>;

/**
 * Stránkování nad {@link https://qwikui.com/docs/headless/pagination | @qwik-ui/headless Pagination} —
 * styly z COLORS.md (surface, accent, ring). Sloty `prefix` / `suffix` u šipek; text šipek přes `customArrowTexts`.
 *
 * Pozn.: headless mapuje `nextButtonClass` na **předchozí** stránku a `prevButtonClass` na **další** — obal sjednocuje oba na stejný vzhled.
 */
export const Pagination = component$<PaginationProps>((props) => {
  const {
    class: userNavClass,
    defaultClass: userPageDefault,
    selectedClass: userPageSelected,
    dividerClass: userEllipsis,
    nextButtonClass: userPrevVisual,
    prevButtonClass: userNextVisual,
    ...rest
  } = props;

  return (
    <HeadlessPagination
      {...rest}
      class={[navClass, userNavClass].filter(Boolean).join(" ")}
      defaultClass={[pageDefaultClass, userPageDefault].filter(Boolean).join(" ")}
      selectedClass={[pageSelectedClass, userPageSelected].filter(Boolean).join(" ")}
      dividerClass={[ellipsisClass, userEllipsis].filter(Boolean).join(" ")}
      nextButtonClass={[arrowClass, userPrevVisual].filter(Boolean).join(" ")}
      prevButtonClass={[arrowClass, userNextVisual].filter(Boolean).join(" ")}
    />
  );
});
