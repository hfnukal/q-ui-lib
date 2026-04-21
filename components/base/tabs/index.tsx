/**
 * @component tabs
 * @title Tabs
 * @version 1.1.1
 * @example Složené API (stejná data jako TabsGroup)
 * `key` na triggeru a panelu se musí shodovat (headless z něj dělá `tabId` ).
 * ```tsx
 * import { Tab } from "~/components/ui/tabs";
 * 
 * <Tab.Root selectedTabId="overview" behavior="manual">
 *   <Tab.List>
 *     <Tab.Tab key="overview">Overview</Tab.Tab>
 *     <Tab.Tab key="details">Details</Tab.Tab>
 *     <Tab.Tab key="access">Accessibility</Tab.Tab>
 *   </Tab.List>
 *   <Tab.Panel key="overview">
 *     <p>Přehled základních informací o této sekci.</p>
 *   </Tab.Panel>
 *   <Tab.Panel key="details">
 *     <p>Detailní popis a rozšířené možnosti.</p>
 *   </Tab.Panel>
 *   <Tab.Panel key="access">
 *     <p>Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky.</p>
 *   </Tab.Panel>
 * </Tab.Root>
 * ```
 *
 * @example TabsGroup — vodorovně
 * Datová zkratka `TabsGroup` se stejnými záložkami jako u složeného API.
 * ```tsx
 * import { TabsGroup } from "~/components/ui/tabs";
 * 
 * const tabs = [
 *   { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
 *   { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
 *   { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
 * ];
 * 
 * <TabsGroup tabs={tabs} defaultTabId="overview" />
 * ```
 *
 * @example TabsGroup — zakázaná položka
 * TabsGroup — zakázaná položka — viz ukázka níže.
 * ```tsx
 * import { TabsGroup } from "~/components/ui/tabs";
 * 
 * const tabs = [
 *   { value: "a", label: "Active A", content: "Obsah aktivní záložky A." },
 *   { value: "b", label: "Disabled", content: "Tento text se u zakázané záložky stejně nezobrazí.", disabled: true },
 *   { value: "c", label: "Active C", content: "Obsah aktivní záložky C." },
 * ];
 * 
 * <TabsGroup tabs={tabs} defaultTabId="a" />
 * ```
 *
 * @example TabsGroup — svislý seznam
 * TabsGroup — svislý seznam — viz ukázka níže.
 * ```tsx
 * import { TabsGroup } from "~/components/ui/tabs";
 * 
 * const tabs = [
 *   { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
 *   { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
 *   { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
 * ];
 * 
 * <TabsGroup tabs={tabs} vertical defaultTabId="overview" />
 * ```
 *
 * @example Varianta line
 * Podtržené záložky místo výchozích s rámečkem — `variant=&quot;line&quot;` na `Tab.Root` nebo `TabsGroup` .
 * ```tsx
 * import { TabsGroup } from "~/components/ui/tabs";
 *
 * const tabs = [
 *   { value: "overview", label: "Overview", content: "Přehled základních informací o této sekci." },
 *   { value: "details", label: "Details", content: "Detailní popis a rozšířené možnosti." },
 *   { value: "access", label: "Accessibility", content: "Tipy pro přístupnost, klávesové zkratky a čtečky obrazovky." },
 * ];
 *
 * <TabsGroup tabs={tabs} defaultTabId="overview" variant="line" />
 * ```
 *
 * @example Složené API — svisle
 * Na `Tab.Root` nastav `vertical` a na `Tab.List` / `Tab.Panel` prop `verticalLayout` .
 * ```tsx
 * import { Tab } from "~/components/ui/tabs";
 * 
 * <Tab.Root vertical selectedTabId="overview" behavior="manual">
 *   <Tab.List verticalLayout>
 *     <Tab.Tab key="overview">Overview</Tab.Tab>
 *     <Tab.Tab key="details">Details</Tab.Tab>
 *   </Tab.List>
 *   <Tab.Panel key="overview" verticalLayout>
 *     <p>Přehled základních informací o této sekci.</p>
 *   </Tab.Panel>
 *   <Tab.Panel key="details" verticalLayout>
 *     <p>Detailní popis a rozšířené možnosti.</p>
 *   </Tab.Panel>
 * </Tab.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Tabs as HeadlessTabs } from "@qwik-ui/headless";

/** Default variant — vzhled odpovídá {@link https://qwikui.com/docs/styled/tabs | Qwik UI Styled Tabs}; barvy jsou tokeny z COLORS.md. */
const triggerClass =
  "inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 font-medium whitespace-nowrap text-callout text-secondary-label ring-offset-background transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=selected]:border-separator-opaque data-[state=selected]:bg-surface-overlay data-[state=selected]:text-label data-[state=selected]:shadow-inner";

/** Line variant — podtržené záložky; panel bez rámečku. */
const triggerClassLine =
  "inline-flex items-center justify-center relative rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-2 font-medium whitespace-nowrap text-callout text-secondary-label ring-offset-background transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=selected]:border-accent data-[state=selected]:text-label data-[state=selected]:bg-transparent data-[state=selected]:shadow-none";

const panelClassBase =
  "text-body text-secondary-label ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md border border-separator-opaque bg-surface-raised p-4";

const panelClassHorizontal = `${panelClassBase} mt-2`;
const panelClassHorizontalLine =
  "text-body text-secondary-label ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-4";
const panelClassVertical = `${panelClassBase} mt-0 flex-1 min-w-0`;

const listClassHorizontal =
  "inline-flex items-center justify-center rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label shadow-sm";
const listClassLine =
  "flex w-full items-center justify-start gap-0 rounded-none border-0 border-b border-separator bg-transparent p-0 text-secondary-label shadow-none";

const listClassVertical =
  "inline-flex flex-col w-48 shrink-0 rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label gap-1 shadow-sm";

export type TabRootProps = PropsOf<typeof HeadlessTabs.Root> & {
  /** `line` — podtržené záložky, obsah bez rámečku; výchozí varianta má rámeček kolem listu i panelu. */
  variant?: "default" | "line";
};

export type TabListProps = PropsOf<typeof HeadlessTabs.List> & {
  /** Match {@link TabRootProps.vertical} so list layout aligns with keyboard orientation. */
  verticalLayout?: boolean;
};

export type TabTriggerProps = PropsOf<typeof HeadlessTabs.Tab>;

export type TabPanelProps = PropsOf<typeof HeadlessTabs.Panel> & {
  /** Match {@link TabRootProps.vertical} for panel spacing next to a vertical list. */
  verticalLayout?: boolean;
};

/** Styled tab list — default variant. FunctionComponent so HTabs `child.type` matches `tabListComponent`. */
export const TabList: FunctionComponent<TabListProps> = (props) => {
  const { verticalLayout, class: className, ...rest } = props;
  const base = verticalLayout ? listClassVertical : listClassHorizontal;
  const merged = [base, className].filter(Boolean).join(" ");
  return <HeadlessTabs.List {...rest} class={merged} />;
};

/** Tab list for `variant="line"` — podtržený řádek bez rámečku. */
export const TabListLine: FunctionComponent<TabListProps> = (props) => {
  const { verticalLayout: _, class: className, ...rest } = props;
  const merged = [listClassLine, className].filter(Boolean).join(" ");
  return <HeadlessTabs.List {...rest} class={merged} />;
};

/** Styled tab trigger — default variant. FunctionComponent so HTabs matches `tabComponent`. */
export const TabTrigger: FunctionComponent<TabTriggerProps> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [triggerClass, className].filter(Boolean).join(" ");
  return <HeadlessTabs.Tab {...rest} class={merged} />;
};

/** Tab trigger for `variant="line"` — spodní okraj jako indikátor. */
export const TabTriggerLine: FunctionComponent<TabTriggerProps> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [triggerClassLine, className].filter(Boolean).join(" ");
  return <HeadlessTabs.Tab {...rest} class={merged} />;
};

/** Styled tab panel — default variant. FunctionComponent so HTabs matches `tabPanelComponent`. */
export const TabPanel: FunctionComponent<TabPanelProps> = (props) => {
  const { verticalLayout, class: className, ...rest } = props;
  const base = verticalLayout ? panelClassVertical : panelClassHorizontal;
  const merged = [base, className].filter(Boolean).join(" ");
  return <HeadlessTabs.Panel {...rest} class={merged} />;
};

/** Tab panel for `variant="line"` — bez rámečku. */
export const TabPanelLine: FunctionComponent<TabPanelProps> = (props) => {
  const { verticalLayout: _, class: className, ...rest } = props;
  const merged = [panelClassHorizontalLine, className].filter(Boolean).join(" ");
  return <HeadlessTabs.Panel {...rest} class={merged} />;
};

/**
 * Styled {@link https://qwikui.com/docs/headless/tabs | Tabs.Root} / {@link https://qwikui.com/docs/styled/tabs | styled příklad}: layout, tokeny z COLORS.md.
 * FunctionComponent (jako upstream HTabs), aby děti a `tab*Component` zůstaly sladěné s HTabs.
 */
export const TabRoot: FunctionComponent<TabRootProps> = (props) => {
  const { variant = "default", class: className, ...rest } = props;
  const isLine = variant === "line";
  const rootBase = "w-full max-w-xl";
  const rootVertical = props.vertical ? "flex flex-row flex-wrap gap-6 items-start" : "";
  const merged = [rootBase, rootVertical, className].filter(Boolean).join(" ");
  return (
    <HeadlessTabs.Root
      {...rest}
      tabListComponent={props.tabListComponent ?? (isLine ? TabListLine : TabList)}
      tabComponent={props.tabComponent ?? (isLine ? TabTriggerLine : TabTrigger)}
      tabPanelComponent={props.tabPanelComponent ?? (isLine ? TabPanelLine : TabPanel)}
      class={merged}
    />
  );
};

/**
 * Složené API ve stylu Qwik UI: {@link TabRoot}, {@link TabList}, {@link TabTrigger}, {@link TabPanel}
 * (v dokumentaci často `Tabs.*` — použij alias {@link Tabs}).
 */
export const Tab = {
  Root: TabRoot,
  List: TabList,
  ListLine: TabListLine,
  Tab: TabTrigger,
  TriggerLine: TabTriggerLine,
  Panel: TabPanel,
  PanelLine: TabPanelLine,
};

/** Alias pro `Tab` — stejné API jako `Tabs` v {@link https://qwikui.com/docs/styled/tabs | Qwik UI Styled}. */
export const Tabs = Tab;

export type TabItemData = {
  value: string;
  label: string;
  content: string;
  disabled?: boolean;
};

export interface TabsGroupProps {
  tabs: TabItemData[];
  /** Initial selected tab (`value` of an item). Defaults to the first enabled tab. */
  defaultTabId?: string;
  /** `automatic`: focus/hover can activate tab; `manual`: activation on click/Enter/Space only. */
  behavior?: "automatic" | "manual";
  /** Vertical tab list and arrow-key navigation (Up/Down). */
  vertical?: boolean;
  /** `line` — podtržené záložky, obsah bez rámečku. */
  variant?: TabRootProps["variant"];
  class?: string;
}

/**
 * Convenience wrapper over {@link Tab} for data-driven tabs.
 */
export const TabsGroup = component$<TabsGroupProps>((props) => {
  const items = props.tabs;
  const firstEnabled = items.find((t) => !t.disabled)?.value ?? items[0]?.value ?? "";
  const defaultId = props.defaultTabId;
  const initialId =
    defaultId && items.some((t) => t.value === defaultId && !t.disabled)
      ? defaultId
      : firstEnabled;

  const vertical = props.vertical;
  const isLine = props.variant === "line";

  const ListComp = isLine ? TabListLine : TabList;
  const TriggerComp = isLine ? TabTriggerLine : TabTrigger;
  const PanelComp = isLine ? TabPanelLine : TabPanel;

  return (
    <Tab.Root
      class={props.class}
      behavior={props.behavior}
      vertical={vertical}
      variant={props.variant}
      selectedTabId={initialId}
    >
      <ListComp verticalLayout={isLine ? false : vertical}>
        {items.map((item) => (
          <TriggerComp key={item.value} disabled={item.disabled}>
            {item.label}
          </TriggerComp>
        ))}
      </ListComp>
      {items.map((item) => (
        <PanelComp key={item.value} verticalLayout={isLine ? false : vertical} disabled={item.disabled}>
          <p>{item.content}</p>
        </PanelComp>
      ))}
    </Tab.Root>
  );
});
