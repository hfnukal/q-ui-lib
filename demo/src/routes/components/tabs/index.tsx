import { component$ } from "@builder.io/qwik";
import { Tab } from "~/components/ui/tabs";
import { TabsGroup } from "~/components/ui/tabs";
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
        <h1 class="text-title-2 text-label">Tabs</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API (stejná data jako TabsGroup)</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">key</code> na triggeru a panelu se musí shodovat (headless z něj dělá <code class="text-caption-1">tabId</code> ).</Desc>
          <TabExample>
            <Tab.Root selectedTabId="overview" behavior="manual">
              <Tab.List>
                <Tab.Tab key="overview">Overview</Tab.Tab>
                <Tab.Tab key="details">Details</Tab.Tab>
                <Tab.Tab key="access">Accessibility</Tab.Tab>
              </Tab.List>
              <Tab.Panel key="overview">
                <p>Přehled základních informací o této sekci.</p>
              </Tab.Panel>
              <Tab.Panel key="details">
                <p>Detailní popis a rozšířené možnosti.</p>
              </Tab.Panel>
              <Tab.Panel key="access">
                <p>Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky.</p>
              </Tab.Panel>
            </Tab.Root>
          </TabExample>
          <TabCode>{`import { Tab } from "~/components/ui/tabs";

<Tab.Root selectedTabId="overview" behavior="manual">
  <Tab.List>
    <Tab.Tab key="overview">Overview</Tab.Tab>
    <Tab.Tab key="details">Details</Tab.Tab>
    <Tab.Tab key="access">Accessibility</Tab.Tab>
  </Tab.List>
  <Tab.Panel key="overview">
    <p>Přehled základních informací o této sekci.</p>
  </Tab.Panel>
  <Tab.Panel key="details">
    <p>Detailní popis a rozšířené možnosti.</p>
  </Tab.Panel>
  <Tab.Panel key="access">
    <p>Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky.</p>
  </Tab.Panel>
</Tab.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">TabsGroup — vodorovně</h2>
        <CodeExample>
          <Desc>Datová zkratka <code class="text-caption-1">TabsGroup</code> se stejnými záložkami jako u složeného API.</Desc>
          <TabExample>
            {(() => {
              const tabs = [
                { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
                { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
                { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
              ];
              return (
                <TabsGroup tabs={tabs} defaultTabId="overview" />
              );
            })()}
          </TabExample>
          <TabCode>{`import { TabsGroup } from "~/components/ui/tabs";

const tabs = [
  { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
  { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
  { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
];

<TabsGroup tabs={tabs} defaultTabId="overview" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">TabsGroup — zakázaná položka</h2>
        <CodeExample>
          <Desc>TabsGroup — zakázaná položka — viz ukázka níže.</Desc>
          <TabExample>
            {(() => {
              const tabs = [
                { value: "a", label: "Active A", content: "Obsah aktivní záložky A." },
                { value: "b", label: "Disabled", content: "Tento text se u zakázané záložky stejně nezobrazí.", disabled: true },
                { value: "c", label: "Active C", content: "Obsah aktivní záložky C." },
              ];
              return (
                <TabsGroup tabs={tabs} defaultTabId="a" />
              );
            })()}
          </TabExample>
          <TabCode>{`import { TabsGroup } from "~/components/ui/tabs";

const tabs = [
  { value: "a", label: "Active A", content: "Obsah aktivní záložky A." },
  { value: "b", label: "Disabled", content: "Tento text se u zakázané záložky stejně nezobrazí.", disabled: true },
  { value: "c", label: "Active C", content: "Obsah aktivní záložky C." },
];

<TabsGroup tabs={tabs} defaultTabId="a" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">TabsGroup — svislý seznam</h2>
        <CodeExample>
          <Desc>TabsGroup — svislý seznam — viz ukázka níže.</Desc>
          <TabExample>
            {(() => {
              const tabs = [
                { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
                { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
                { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
              ];
              return (
                <TabsGroup tabs={tabs} vertical defaultTabId="overview" />
              );
            })()}
          </TabExample>
          <TabCode>{`import { TabsGroup } from "~/components/ui/tabs";

const tabs = [
  { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
  { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
  { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
];

<TabsGroup tabs={tabs} vertical defaultTabId="overview" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianta line</h2>
        <CodeExample>
          <Desc>Podtržené záložky místo výchozích s rámečkem — <code class="text-caption-1">variant="line"</code> na <code class="text-caption-1">Tab.Root</code> nebo <code class="text-caption-1">TabsGroup</code> .</Desc>
          <TabExample>
            {(() => {
              const tabs = [
                { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
                { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
                { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
              ];
              return (
                <TabsGroup tabs={tabs} defaultTabId="overview" variant="line" />
              );
            })()}
          </TabExample>
          <TabCode>{`import { TabsGroup } from "~/components/ui/tabs";

const tabs = [
  { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
  { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
  { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
];

<TabsGroup tabs={tabs} defaultTabId="overview" variant="line" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API — svisle</h2>
        <CodeExample>
          <Desc>Na <code class="text-caption-1">Tab.Root</code> nastav <code class="text-caption-1">vertical</code> a na <code class="text-caption-1">Tab.List</code> / <code class="text-caption-1">Tab.Panel</code> prop <code class="text-caption-1">verticalLayout</code> .</Desc>
          <TabExample>
            <Tab.Root vertical selectedTabId="overview" behavior="manual">
              <Tab.List verticalLayout>
                <Tab.Tab key="overview">Overview</Tab.Tab>
                <Tab.Tab key="details">Details</Tab.Tab>
              </Tab.List>
              <Tab.Panel key="overview" verticalLayout>
                <p>Přehled základních informací o této sekci.</p>
              </Tab.Panel>
              <Tab.Panel key="details" verticalLayout>
                <p>Detailní popis a rozšířené možnosti.</p>
              </Tab.Panel>
            </Tab.Root>
          </TabExample>
          <TabCode>{`import { Tab } from "~/components/ui/tabs";

<Tab.Root vertical selectedTabId="overview" behavior="manual">
  <Tab.List verticalLayout>
    <Tab.Tab key="overview">Overview</Tab.Tab>
    <Tab.Tab key="details">Details</Tab.Tab>
  </Tab.List>
  <Tab.Panel key="overview" verticalLayout>
    <p>Přehled základních informací o této sekci.</p>
  </Tab.Panel>
  <Tab.Panel key="details" verticalLayout>
    <p>Detailní popis a rozšířené možnosti.</p>
  </Tab.Panel>
</Tab.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
