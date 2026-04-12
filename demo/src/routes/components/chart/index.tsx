import { component$ } from "@builder.io/qwik";
import { Chart } from "~/components/ui/chart";
import { ChartCanvas } from "~/components/ui/chart";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Chart</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Čára (line)</h2>
        <CodeExample>
          <Desc>Export <code class="text-caption-1">Chart</code> je alias pro <code class="text-caption-1">ChartCanvas</code>.</Desc>
          <TabExample>
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
          </TabExample>
          <TabCode>{`import { Chart } from "~/components/ui/chart";

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
/>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Sloupce (bar)</h2>
        <CodeExample>
          <Desc>Graf typu <code class="text-caption-1">bar</code> — srovnání kategorií vedle sebe.</Desc>
          <TabExample>
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
          </TabExample>
          <TabCode>{`import { ChartCanvas } from "~/components/ui/chart";

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
/>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Doughnut</h2>
        <CodeExample>
          <Desc>Doughnut — viz ukázka níže.</Desc>
          <TabExample>
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
          </TabExample>
          <TabCode>{`import { Chart } from "~/components/ui/chart";

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
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
