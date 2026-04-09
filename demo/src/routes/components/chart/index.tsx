import { component$, useSignal } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Chart, ChartCanvas } from "~/components/ui/chart";

const codeLine = `import { Chart } from "~/components/ui/chart";

<Chart
  type="line"
  class="max-w-2xl"
  data={{
    labels: ["Po", "Út", "St", "Čt", "Pá"],
    datasets: [
      {
        label: "Návštěvy",
        data: [12, 19, 15, 25, 22],
        borderColor: "hsl(var(--accent))",
        backgroundColor: "hsl(var(--accent) / 0.15)",
        fill: true,
        tension: 0.35,
      },
    ],
  }}
/>`;

const codeBar = `import { ChartCanvas } from "~/components/ui/chart";

<ChartCanvas
  type="bar"
  class="max-w-2xl"
  data={{
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Tržby",
        data: [48, 62, 55, 71],
        backgroundColor: [
          "hsl(var(--system-blue))",
          "hsl(var(--system-green))",
          "hsl(var(--system-orange))",
          "hsl(var(--system-purple))",
        ],
      },
    ],
  }}
/>`;

const codeDoughnut = `import { Chart } from "~/components/ui/chart";

<Chart
  type="doughnut"
  class="mx-auto max-w-sm"
  data={{
    labels: ["Hotovo", "Probíhá", "Čeká"],
    datasets: [
      {
        data: [62, 23, 15],
        backgroundColor: [
          "hsl(var(--system-green))",
          "hsl(var(--system-orange))",
          "hsl(var(--fill-secondary))",
        ],
        borderWidth: 0,
      },
    ],
  }}
  options={{ plugins: { legend: { position: "bottom" } } }}
/>`;

export default component$(() => {
  const slice = useSignal(35);

  const doughnutReactive = {
    labels: ["Hotovo", "Zbývá"],
    datasets: [
      {
        data: [slice.value, 100 - slice.value],
        backgroundColor: [
          "hsl(var(--system-teal))",
          "hsl(var(--fill-tertiary))",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 font-semibold text-label">Chart</h1>
        <p class="mt-2 max-w-prose text-callout text-secondary-label">
          Canvas grafy přes{" "}
          <code class="rounded-md bg-fill-secondary px-1.5 py-0.5 text-caption-1 text-label">
            chart.js
          </code>
          . Inicializace probíhá v prohlížeči (
          <code class="text-caption-1 text-label">useVisibleTask$</code>
          , dynamický import), aby se knihovna nespouštěla při SSR. Barvy tooltipů a os
          se snaží číst z CSS proměnných dema (COLORS.md).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Čára (line)</h2>
        <p class="text-callout text-secondary-label">
          Export <code class="text-caption-1 text-label">Chart</code> je alias pro{" "}
          <code class="text-caption-1 text-label">ChartCanvas</code>.
        </p>
        <CodeExample layout="tabs" code={codeLine}>
          <div class="rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <Chart
              type="line"
              class="max-w-2xl"
              data={{
                labels: ["Po", "Út", "St", "Čt", "Pá"],
                datasets: [
                  {
                    label: "Návštěvy",
                    data: [12, 19, 15, 25, 22],
                    borderColor: "hsl(var(--accent))",
                    backgroundColor: "hsl(var(--accent) / 0.15)",
                    fill: true,
                    tension: 0.35,
                  },
                ],
              }}
            />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Sloupce (bar)</h2>
        <CodeExample layout="tabs" code={codeBar}>
          <div class="rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <ChartCanvas
              type="bar"
              class="max-w-2xl"
              data={{
                labels: ["Q1", "Q2", "Q3", "Q4"],
                datasets: [
                  {
                    label: "Tržby",
                    data: [48, 62, 55, 71],
                    backgroundColor: [
                      "hsl(var(--system-blue))",
                      "hsl(var(--system-green))",
                      "hsl(var(--system-orange))",
                      "hsl(var(--system-purple))",
                    ],
                  },
                ],
              }}
            />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Doughnut</h2>
        <CodeExample layout="tabs" code={codeDoughnut}>
          <div class="rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <Chart
              type="doughnut"
              class="mx-auto max-w-sm"
              data={{
                labels: ["Hotovo", "Probíhá", "Čeká"],
                datasets: [
                  {
                    data: [62, 23, 15],
                    backgroundColor: [
                      "hsl(var(--system-green))",
                      "hsl(var(--system-orange))",
                      "hsl(var(--fill-secondary))",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Reaktivní data</h2>
        <p class="text-callout text-secondary-label">
          Při změně props se úloha znovu spustí a graf se přegeneruje (např. posuvník
          mění <code class="text-caption-1 text-label">data</code>).
        </p>
        <div class="max-w-sm space-y-4 rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
          <label class="flex flex-col gap-2 text-callout text-label">
            Podíl „Hotovo“: {slice.value}%
            <input
              type="range"
              min={0}
              max={100}
              value={slice.value}
              onInput$={(e) => {
                const el = e.target as HTMLInputElement;
                slice.value = Number(el.value);
              }}
              class="w-full accent-accent"
            />
          </label>
          <Chart type="doughnut" class="mx-auto max-w-xs" data={doughnutReactive} />
        </div>
      </section>
    </div>
  );
});
