/**
 * @component pagination
 * @title Pagination
 * @version 1.0.0
 * @example Basic usage
 * Props `selectedPage`, `totalPages`, `onPageChange — keep the current page in `useSignal`.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/base/pagination";
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
 * @example More sibling pages
 * Prop `siblingCount` (default 1) widens the window around the active page.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/base/pagination";
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
 * @example Custom arrow labels
 * `customArrowTexts` — short texts instead of the default PREV / NEXT.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/base/pagination";
 * 
 * export default component$(() => {
 *   const page = useSignal(1);
 *   return (
 *     <Pagination
 *       selectedPage={page.value}
 *       totalPages={8}
 *       customArrowTexts={{ previous: "Back", next: "Forward" }}
 *       onPageChange$={$((p) => {
 *         page.value = p;
 *       })}
 *     />
 *   );
 * });
 * ```
 *
 * @example Disabled
 * Non-interactive pagination via the `disabled` prop.
 * ```tsx
 * import { $, component$ } from "@builder.io/qwik";
 * import { Pagination } from "~/components/ui/base/pagination";
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
 * Root navigation: flex, spacing between elements (the headless `gap` in the type does not yet apply to the DOM).
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
 * Pagination over {@link https://qwikui.com/docs/headless/pagination | @qwik-ui/headless Pagination} —
 * styles from COLORS.md (surface, accent, ring). `prefix` / `suffix` slots on the arrows; arrow text via `customArrowTexts`.
 *
 * Note: headless maps `nextButtonClass` to the **previous** page and `prevButtonClass` to the **next** — the wrapper unifies both to the same look.
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
