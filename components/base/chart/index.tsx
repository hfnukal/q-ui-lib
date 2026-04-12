/**
 * @component chart
 * @title Chart
 * @version 1.0.0
 * @example Čára (line)
 * Export `Chart` je alias pro `ChartCanvas`.
 * ```tsx
 * import { Chart } from "~/components/ui/chart";
 * 
 * <Chart
 *   type="line"
 *   class="max-w-2xl"
 *   data={{
 *     labels: ["Po", "Út", "St", "Čt", "Pá"],
 *     datasets: [
 *       {
 *         label: "Návštěvy",
 *         data: [12, 19, 15, 25, 22],
 *         borderColor: "hsl(var(--accent))",
 *         backgroundColor: "hsl(var(--accent) / 0.15)",
 *         fill: true,
 *         tension: 0.35,
 *       },
 *     ],
 *   }}
 * />
 * ```
 *
 * @example Sloupce (bar)
 * Graf typu `bar` — srovnání kategorií vedle sebe.
 * ```tsx
 * import { ChartCanvas } from "~/components/ui/chart";
 * 
 * <ChartCanvas
 *   type="bar"
 *   class="max-w-2xl"
 *   data={{
 *     labels: ["Q1", "Q2", "Q3", "Q4"],
 *     datasets: [
 *       {
 *         label: "Tržby",
 *         data: [48, 62, 55, 71],
 *         backgroundColor: [
 *           "hsl(var(--system-blue))",
 *           "hsl(var(--system-green))",
 *           "hsl(var(--system-orange))",
 *           "hsl(var(--system-purple))",
 *         ],
 *       },
 *     ],
 *   }}
 * />
 * ```
 *
 * @example Doughnut
 * Doughnut — viz ukázka níže.
 * ```tsx
 * import { Chart } from "~/components/ui/chart";
 * 
 * <Chart
 *   type="doughnut"
 *   class="mx-auto max-w-sm"
 *   data={{
 *     labels: ["Hotovo", "Probíhá", "Čeká"],
 *     datasets: [
 *       {
 *         data: [62, 23, 15],
 *         backgroundColor: [
 *           "hsl(var(--system-green))",
 *           "hsl(var(--system-orange))",
 *           "hsl(var(--fill-secondary))",
 *         ],
 *         borderWidth: 0,
 *       },
 *     ],
 *   }}
 *   options={{ plugins: { legend: { position: "bottom" } } }}
 * />
 * ```
 
 
 
 
 
 
 
 */

import {
  component$,
  useSignal,
  useVisibleTask$,
  type PropsOf,
} from "@builder.io/qwik";
import type { ChartData, ChartOptions, ChartType } from "chart.js";

export type ChartCanvasProps = Omit<PropsOf<"div">, "class"> & {
  /** Typ grafu (Chart.js). */
  type: ChartType;
  /** Data grafu — musí být serializovatelné (bez funkcí v objektech pro SSR). */
  data: ChartData;
  /** Volitelné Chart.js options; funkce v options fungují jen při definici v klientském kontextu. */
  options?: ChartOptions;
  class?: string;
  canvasClass?: string;
};

function cloneData(data: ChartData): ChartData {
  return typeof structuredClone === "function"
    ? structuredClone(data)
    : (JSON.parse(JSON.stringify(data)) as ChartData);
}

/**
 * Canvas / Chart.js barvy musí být už „vyčíslené“ (rgb/hsl), ne řetězce s `var(...)`.
 * Jinak kontext canvasu často nenačte CSS proměnné a dataset skončí černě / šedě.
 */
function resolveCssColorForCanvas(raw: string, scope: HTMLElement): string {
  if (!raw.includes("var(")) {
    return raw;
  }
  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;color:" +
    raw.replace(/;/g, "") +
    ";";
  scope.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || raw;
}

function resolveColorValue(value: unknown, scope: HTMLElement): unknown {
  if (typeof value === "string") {
    return resolveCssColorForCanvas(value, scope);
  }
  if (Array.isArray(value)) {
    return value.map((v) => resolveColorValue(v, scope));
  }
  return value;
}

/** Projde vlastnosti datasetu a nahradí barvy s `var(` rozlišenými hodnotami. */
function resolveChartDataCssVars(data: ChartData, scope: HTMLElement): void {
  const datasets = data.datasets;
  if (!datasets?.length) {
    return;
  }
  const colorLikeKeys = [
    "backgroundColor",
    "borderColor",
    "hoverBackgroundColor",
    "hoverBorderColor",
    "pointBackgroundColor",
    "pointBorderColor",
    "pointHoverBackgroundColor",
    "pointHoverBorderColor",
  ] as const;
  for (const ds of datasets) {
    const row = ds as Record<string, unknown>;
    for (const key of colorLikeKeys) {
      if (key in row && row[key] != null) {
        row[key] = resolveColorValue(row[key], scope);
      }
    }
  }
}

/**
 * Canvas graf nad [Chart.js](https://www.chartjs.org/), inicializace v prohlížeči přes `useVisibleTask$`
 * (dynamický import `chart.js`, bez vykonávání na serveru). Registrace přes vestavěné `registerables`
 * (všechny běžné typy grafů a škály).
 */
export const ChartCanvas = component$<ChartCanvasProps>((props) => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  useVisibleTask$(async ({ track, cleanup }) => {
    const canvas = canvasRef.value;
    if (!canvas) {
      return;
    }

    const type = track(() => props.type);
    const data = track(() => props.data);
    const options = track(() => props.options);

    const { Chart, registerables } = await import("chart.js");
    Chart.register(...registerables);

    const root = canvas.parentElement ?? canvas;
    const hsl = (name: string, fallback: string) => {
      const raw = getComputedStyle(root).getPropertyValue(name).trim();
      return raw ? `hsl(${raw})` : fallback;
    };

    const tick = hsl("--secondary-label", "#64748b");
    const grid = hsl("--separator", "rgba(148, 163, 184, 0.35)");

    const themed: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: tick },
        },
        tooltip: {
          titleColor: tick,
          bodyColor: tick,
          backgroundColor: hsl("--surface-raised", "#f8fafc"),
          borderColor: hsl("--separator-opaque", "#e2e8f0"),
          borderWidth: 1,
        },
      },
      scales:
        type === "line" ||
        type === "bar" ||
        type === "scatter" ||
        type === "bubble"
          ? {
              x: {
                ticks: { color: tick },
                grid: { color: grid },
              },
              y: {
                ticks: { color: tick },
                grid: { color: grid },
              },
            }
          : undefined,
    };

    const merged: ChartOptions = {
      ...themed,
      ...options,
      plugins: {
        ...themed.plugins,
        ...options?.plugins,
      },
      scales: options?.scales ?? themed.scales,
    };

    const chartData = cloneData(data);
    resolveChartDataCssVars(chartData, root);

    const chart = new Chart(canvas, {
      type,
      data: chartData,
      options: merged,
    });

    cleanup(() => {
      chart.destroy();
    });
  });

  const domProps = { ...(props as unknown as Record<string, unknown>) };
  const className = domProps.class as string | undefined;
  const canvasClass = domProps.canvasClass as string | undefined;
  delete domProps.type;
  delete domProps.data;
  delete domProps.options;
  delete domProps.class;
  delete domProps.canvasClass;
  const divAttrs = domProps as Omit<PropsOf<"div">, "class" | "children">;

  const wrap = [
    "relative w-full min-h-[12rem] min-w-0",
    className,
  ].filter(Boolean).join(" ");

  const cv = ["block h-full w-full max-h-[24rem]", canvasClass]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...divAttrs} class={wrap}>
      <canvas ref={canvasRef} class={cv} />
    </div>
  );
});

/** Alias pro sjednocení s názvem komponenty v dokumentaci. */
export const Chart = ChartCanvas;

export type ChartProps = ChartCanvasProps;
