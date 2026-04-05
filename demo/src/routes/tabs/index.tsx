import { component$ } from "@builder.io/qwik";
import { TabsGroup } from "@components/tabs";

const sampleTabs = [
  {
    value: "overview",
    label: "Overview",
    content:
      "High-level summary of the feature. Tabs follow the WAI-ARIA tabs pattern with keyboard support.",
  },
  {
    value: "details",
    label: "Details",
    content:
      "Implementation uses @qwik-ui/headless for behavior and focus management; styling matches other demo components.",
  },
  {
    value: "access",
    label: "Accessibility",
    content:
      "Tab list exposes role=\"tablist\"; triggers are role=\"tab\" with aria-selected; panels use role=\"tabpanel\" and hidden when inactive.",
  },
];

const withDisabled = [
  { value: "a", label: "Active A", content: "First panel content." },
  { value: "b", label: "Disabled", content: "Unreachable when disabled.", disabled: true },
  { value: "c", label: "Active C", content: "Third panel still works." },
];

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Tabs</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Tabbed interface from{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">components/tabs</code>, built on
          @qwik-ui/headless.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Horizontal (manual activation)</h2>
        <TabsGroup tabs={sampleTabs} defaultTabId="overview" />
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">With disabled tab</h2>
        <TabsGroup tabs={withDisabled} defaultTabId="a" />
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Vertical list</h2>
        <TabsGroup tabs={sampleTabs} vertical defaultTabId="overview" />
      </section>
    </div>
  );
});
