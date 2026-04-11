/**
 * @component chart
 * @title Chart
 * @version 1.0.0
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

    const chart = new Chart(canvas, {
      type,
      data: cloneData(data),
      options: merged,
    });

    cleanup(() => {
      chart.destroy();
    });
  });

  const {
    type: _t,
    data: _d,
    options: _o,
    class: className,
    canvasClass,
    ...divAttrs
  } = props;

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
