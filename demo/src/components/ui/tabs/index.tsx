import { component$, type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Tabs as HeadlessTabs } from "@qwik-ui/headless";

/** Vzhled odpovídá {@link https://qwikui.com/docs/styled/tabs | Qwik UI Styled Tabs}; barvy jsou tokeny z COLORS.md. */
const triggerClass =
  "inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 font-medium whitespace-nowrap text-callout text-secondary-label ring-offset-background transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=selected]:border-separator-opaque data-[state=selected]:bg-surface-overlay data-[state=selected]:text-label data-[state=selected]:shadow-inner";

const panelClassBase =
  "text-body text-secondary-label ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const panelClassHorizontal = `${panelClassBase} mt-2`;
const panelClassVertical = `${panelClassBase} mt-0 flex-1 min-w-0`;

const listClassHorizontal =
  "inline-flex items-center justify-center rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label shadow-sm";

const listClassVertical =
  "inline-flex flex-col w-48 shrink-0 rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label gap-1 shadow-sm";

export type TabRootProps = PropsOf<typeof HeadlessTabs.Root>;

export type TabListProps = PropsOf<typeof HeadlessTabs.List> & {
  /** Match {@link TabRootProps.vertical} so list layout aligns with keyboard orientation. */
  verticalLayout?: boolean;
};

export type TabTriggerProps = PropsOf<typeof HeadlessTabs.Tab>;

export type TabPanelProps = PropsOf<typeof HeadlessTabs.Panel> & {
  /** Match {@link TabRootProps.vertical} for panel spacing next to a vertical list. */
  verticalLayout?: boolean;
};

/** Styled tab list (`role="tablist"`). FunctionComponent so HTabs `child.type` matches `tabListComponent`. */
export const TabList: FunctionComponent<TabListProps> = (props) => {
  const { verticalLayout, class: className, ...rest } = props;
  const base = verticalLayout ? listClassVertical : listClassHorizontal;
  const merged = [base, className].filter(Boolean).join(" ");
  return <HeadlessTabs.List {...rest} class={merged} />;
};

/** Styled tab trigger (`role="tab"`). FunctionComponent so HTabs matches `tabComponent`. */
export const TabTrigger: FunctionComponent<TabTriggerProps> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [triggerClass, className].filter(Boolean).join(" ");
  return <HeadlessTabs.Tab {...rest} class={merged} />;
};

/** Styled tab panel (`role="tabpanel"`). FunctionComponent so HTabs matches `tabPanelComponent`. */
export const TabPanel: FunctionComponent<TabPanelProps> = (props) => {
  const { verticalLayout, class: className, ...rest } = props;
  const base = verticalLayout ? panelClassVertical : panelClassHorizontal;
  const merged = [base, className].filter(Boolean).join(" ");
  return <HeadlessTabs.Panel {...rest} class={merged} />;
};

/**
 * Styled {@link https://qwikui.com/docs/headless/tabs | Tabs.Root} / {@link https://qwikui.com/docs/styled/tabs | styled příklad}: layout, tokeny z COLORS.md.
 * FunctionComponent (jako upstream HTabs), aby děti a `tab*Component` zůstaly sladěné s HTabs.
 */
export const TabRoot: FunctionComponent<TabRootProps> = (props) => {
  const rootBase = "w-full max-w-xl";
  const rootVertical = props.vertical ? "flex flex-row flex-wrap gap-6 items-start" : "";
  const merged = [rootBase, rootVertical, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessTabs.Root
      {...props}
      tabListComponent={props.tabListComponent ?? TabList}
      tabComponent={props.tabComponent ?? TabTrigger}
      tabPanelComponent={props.tabPanelComponent ?? TabPanel}
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
  Tab: TabTrigger,
  Panel: TabPanel,
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

  return (
    <Tab.Root
      class={props.class}
      behavior={props.behavior}
      vertical={vertical}
      selectedTabId={initialId}
    >
      <Tab.List verticalLayout={vertical}>
        {items.map((item) => (
          <Tab.Tab key={item.value} disabled={item.disabled}>
            {item.label}
          </Tab.Tab>
        ))}
      </Tab.List>
      {items.map((item) => (
        <Tab.Panel key={item.value} verticalLayout={vertical} disabled={item.disabled}>
          <p>{item.content}</p>
        </Tab.Panel>
      ))}
    </Tab.Root>
  );
});
