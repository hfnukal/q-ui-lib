import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Tab, TabsGroup } from "~/components/ui/tabs";

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
      'Tab list exposes role="tablist"; triggers are role="tab" with aria-selected; panels use role="tabpanel" and hidden when inactive.',
  },
];

const withDisabled = [
  { value: "a", label: "Active A", content: "First panel content." },
  { value: "b", label: "Disabled", content: "Unreachable when disabled.", disabled: true },
  { value: "c", label: "Active C", content: "Third panel still works." },
];

const codeHorizontal = `import { TabsGroup } from "~/components/ui/tabs";

const tabs = [
  { value: "overview", label: "Overview", content: "…" },
  { value: "details", label: "Details", content: "…" },
  { value: "access", label: "Accessibility", content: "…" },
];

<TabsGroup tabs={tabs} defaultTabId="overview" />`;

const codeDisabled = `import { TabsGroup } from "~/components/ui/tabs";

const tabs = [
  { value: "a", label: "Active A", content: "…" },
  { value: "b", label: "Disabled", content: "…", disabled: true },
  { value: "c", label: "Active C", content: "…" },
];

<TabsGroup tabs={tabs} defaultTabId="a" />`;

const codeVertical = `import { TabsGroup } from "~/components/ui/tabs";

const tabs = [
  { value: "overview", label: "Overview", content: "…" },
  // …
];

<TabsGroup tabs={tabs} vertical defaultTabId="overview" />`;

const codeCompound = `import { Tab } from "~/components/ui/tabs";

<Tab.Root selectedTabId="overview" behavior="manual">
  <Tab.List>
    <Tab.Tab key="overview">Overview</Tab.Tab>
    <Tab.Tab key="details">Details</Tab.Tab>
    <Tab.Tab key="access">Accessibility</Tab.Tab>
  </Tab.List>
  <Tab.Panel key="overview">
    <p>…</p>
  </Tab.Panel>
  <Tab.Panel key="details">…</Tab.Panel>
  <Tab.Panel key="access">…</Tab.Panel>
</Tab.Root>`;

const codeCompoundVertical = `import { Tab } from "~/components/ui/tabs";

<Tab.Root vertical selectedTabId="overview" behavior="manual">
  <Tab.List verticalLayout>
    <Tab.Tab key="overview">Overview</Tab.Tab>
    <Tab.Tab key="details">Details</Tab.Tab>
  </Tab.List>
  <Tab.Panel key="overview" verticalLayout>…</Tab.Panel>
  <Tab.Panel key="details" verticalLayout>…</Tab.Panel>
</Tab.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Tabs</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Komponenty z{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">components/tabs</code> nad{" "}
          @qwik-ui/headless. Složené API: <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab.Root</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab.List</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab.Tab</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab.Panel</code>. Zkratka{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">TabsGroup</code> pro pole položek.
        </p>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Bloky níže používají{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">CodeExample</code> — stejný stylovaný{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab</code> jako v ukázkách.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Složené API (stejná data jako TabsGroup)</h2>
        <p class="max-w-prose text-sm text-slate-600">
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">key</code> na triggeru a panelu se musí shodovat
          (headless z něj dělá <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">tabId</code>).
        </p>
        <CodeExample code={codeCompound} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Tab.Root selectedTabId="overview" behavior="manual">
            <Tab.List>
              {sampleTabs.map((item) => (
                <Tab.Tab key={item.value}>
                  {item.label}
                </Tab.Tab>
              ))}
            </Tab.List>
            {sampleTabs.map((item) => (
              <Tab.Panel key={item.value}>
                <p>{item.content}</p>
              </Tab.Panel>
            ))}
          </Tab.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">TabsGroup — vodorovně</h2>
        <CodeExample code={codeHorizontal} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <TabsGroup tabs={sampleTabs} defaultTabId="overview" />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">TabsGroup — zakázaná položka</h2>
        <CodeExample code={codeDisabled} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <TabsGroup tabs={withDisabled} defaultTabId="a" />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">TabsGroup — svislý seznam</h2>
        <CodeExample code={codeVertical} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <TabsGroup tabs={sampleTabs} vertical defaultTabId="overview" />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Složené API — svisle</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Na <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab.Root</code> nastav{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">vertical</code> a na{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab.List</code> /{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tab.Panel</code> prop{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">verticalLayout</code>.
        </p>
        <CodeExample code={codeCompoundVertical} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Tab.Root vertical selectedTabId="overview" behavior="manual">
            <Tab.List verticalLayout>
              {sampleTabs.map((item) => (
                <Tab.Tab key={item.value}>
                  {item.label}
                </Tab.Tab>
              ))}
            </Tab.List>
            {sampleTabs.map((item) => (
              <Tab.Panel key={item.value} verticalLayout>
                <p>{item.content}</p>
              </Tab.Panel>
            ))}
          </Tab.Root>
        </CodeExample>
      </section>
    </div>
  );
});
