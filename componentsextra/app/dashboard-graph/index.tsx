/**
 * @component dashboard-graph
 * @title DashboardGraph
 * @version 1.0.0
 * @example Graf v kartě
 * Oblast Plot drží minimální výšku; `Chart` s výchozím `maintainAspectRatio: false` ji vyplní. Titulky doplňte přes `Card.Title` a `Card.Description` uvnitř `DashboardGraph.Header`.
 * ```tsx
 * import { Card } from "~/components/ui/base/card";
 * import { Chart } from "~/components/ui/base/chart";
 * import { DashboardGraph } from "~/components/ui/base/dashboard-graph";
 *
 * <DashboardGraph.Root class="max-w-2xl">
 *   <DashboardGraph.Header>
 *     <Card.Title>Návštěvy</Card.Title>
 *     <Card.Description>Týden po dnech</Card.Description>
 *   </DashboardGraph.Header>
 *   <DashboardGraph.Plot>
 *     <Chart
 *       type="line"
 *       class="h-56"
 *       data={{
 *         labels: ["Po", "Út", "St", "Čt", "Pá"],
 *         datasets: [
 *           {
 *             label: "Návštěvy",
 *             data: [12, 19, 15, 25, 22],
 *             borderColor: "hsl(var(--accent))",
 *             backgroundColor: "hsl(var(--accent) / 0.15)",
 *             fill: true,
 *             tension: 0.35,
 *           },
 *         ],
 *       }}
 *     />
 *   </DashboardGraph.Plot>
 * </DashboardGraph.Root>
 * ```
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { CardHeader, CardRoot } from "../card";

export type DashboardGraphRootProps = Omit<PropsOf<typeof CardRoot>, "class"> & {
  class?: string;
};

/**
 * Karta pro graf v přehledu — svislý sloupec, `min-h-0` pro správné dělení výšky v `Dashboard` rozložení.
 */
export const DashboardGraphRoot = component$<DashboardGraphRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex min-h-0 w-full min-w-0 flex-col";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <CardRoot {...rest} class={merged}>
      <Slot />
    </CardRoot>
  );
});

export type DashboardGraphHeaderProps = Omit<PropsOf<typeof CardHeader>, "class"> & {
  class?: string;
};

/** Hlavička stejně jako u karty — uvnitř často `Card.Title` / `Card.Description`. */
export const DashboardGraphHeader = component$<DashboardGraphHeaderProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = [className].filter(Boolean).join(" ");

  return <CardHeader {...rest} class={merged || undefined} />;
});

export type DashboardGraphPlotProps = Omit<PropsOf<"div">, "class"> & {
  /**
   * Tailwind třídy pro minimální výšku oblasti grafu.
   * Výchozí `min-h-[14rem]` — sladěno s komponentou `Chart` (`min-h-[12rem]` uvnitř).
   */
  minHeightClass?: string;
  class?: string;
};

/**
 * Kontejner pro `Chart` nebo vlastní vizualizaci — vodorovné odsazení jako u `Card.Content`, bez horního paddingu (pod hlavičkou).
 */
export const DashboardGraphPlot = component$<DashboardGraphPlotProps>((props) => {
  const {
    class: className,
    minHeightClass = "min-h-[14rem]",
    ...rest
  } = props;
  const base = [
    "relative w-full min-w-0 flex-1 px-6 pb-6 pt-0",
    minHeightClass,
  ]
    .filter(Boolean)
    .join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

/** `DashboardGraph.Root`, `Header`, `Plot` — grafický blok pro dashboard. */
export const DashboardGraph = {
  Root: DashboardGraphRoot,
  Header: DashboardGraphHeader,
  Plot: DashboardGraphPlot,
};
