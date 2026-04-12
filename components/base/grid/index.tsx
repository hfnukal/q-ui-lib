/**
 * @component grid
 * @title Grid
 * @version 1.0.0
 * @example 12 sloupců
 * Dva bloky po šesti sloupcích v mřížce `grid-cols-12`.
 * ```tsx
 * import { Grid } from "~/components/ui/grid";
 * 
 * <Grid columnsClass="grid-cols-12" gap={4} class="w-full max-w-3xl">
 *   <div class="col-span-6 rounded-lg bg-surface-raised p-4 text-callout">6</div>
 *   <div class="col-span-6 rounded-lg bg-surface-overlay p-4 text-callout">6</div>
 * </Grid>
 * ```
 *
 * @example Responzivní
 * `Resizable` + v každém panelu mřížka s `repeat(auto-fill, minmax(8rem, 1fr))` — počet sloupců závisí na šířce panelu.
 * ```tsx
 * import { Grid } from "~/components/ui/grid";
 * import { Resizable } from "~/components/ui/resizable";
 *
 * <Resizable.PanelGroup
 *   direction="horizontal"
 *   defaultSplit={50}
 *   class="h-64 w-full rounded-lg border border-separator-opaque/40"
 * >
 *   <Resizable.Panel side="start" minSize={22} class="p-3">
 *     <Grid columnsClass="grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]" gap={3} class="h-full min-h-0 w-full">
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 1</div>
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 2</div>
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 3</div>
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 4</div>
 *     </Grid>
 *   </Resizable.Panel>
 *   <Resizable.Handle withHandle />
 *   <Resizable.Panel side="end" minSize={22} class="p-3">
 *     <Grid columnsClass="grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]" gap={3} class="h-full min-h-0 w-full">
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 1</div>
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 2</div>
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 3</div>
 *       <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 4</div>
 *     </Grid>
 *   </Resizable.Panel>
 * </Resizable.PanelGroup>
 * ```
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type GridProps = Omit<PropsOf<"div">, "class"> & {
  /**
   * Tailwind column classes, e.g. `grid-cols-12` or `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` (LAYOUT.md).
   */
  columnsClass?: string;
  /** Tailwind spacing scale: `gap-{gap}` */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
  class?: string;
};

/**
 * CSS grid helper — `grid` + optional columns and gap (LAYOUT.md).
 */
export const Grid = component$<GridProps>((props) => {
  const { class: className, columnsClass, gap, ...rest } = props;
  const gapCls = gap !== undefined ? `gap-${gap}` : "";
  const base = ["grid min-h-0 min-w-0", columnsClass, gapCls].filter(Boolean).join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});
