import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui/card";
import { Chart } from "~/components/ui/chart";
import { DashboardGraph } from "~/components/ui/dashboard-graph";
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
        <h1 class="text-title-2 text-label">DashboardGraph</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Graf v kartě</h2>
        <CodeExample>
          <Desc>Oblast Plot drží minimální výšku; <code class="text-caption-1">Chart</code> s výchozím <code class="text-caption-1">maintainAspectRatio: false</code> ji vyplní. Titulky doplňte přes <code class="text-caption-1">Card.Title</code> a <code class="text-caption-1">Card.Description</code> uvnitř <code class="text-caption-1">DashboardGraph.Header</code>.</Desc>
          <TabExample>
            <DashboardGraph.Root class="max-w-2xl">
              <DashboardGraph.Header>
                <Card.Title>Návštěvy</Card.Title>
                <Card.Description>Týden po dnech</Card.Description>
              </DashboardGraph.Header>
              <DashboardGraph.Plot>
                <Chart
                  type="line"
                  class="h-56"
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
              </DashboardGraph.Plot>
            </DashboardGraph.Root>
          </TabExample>
          <TabCode>{`import { Card } from "~/components/ui/card";
import { Chart } from "~/components/ui/chart";
import { DashboardGraph } from "~/components/ui/dashboard-graph";

<DashboardGraph.Root class="max-w-2xl">
  <DashboardGraph.Header>
    <Card.Title>Návštěvy</Card.Title>
    <Card.Description>Týden po dnech</Card.Description>
  </DashboardGraph.Header>
  <DashboardGraph.Plot>
    <Chart
      type="line"
      class="h-56"
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
  </DashboardGraph.Plot>
</DashboardGraph.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
