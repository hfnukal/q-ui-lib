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
