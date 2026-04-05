import { component$ } from "@builder.io/qwik";
import { Tabs } from "@qwik-ui/headless";

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

const triggerClass =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 data-[state=selected]:bg-white data-[state=selected]:text-slate-900 data-[state=selected]:shadow-sm";

const panelClass =
  "mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 min-h-[4.5rem]";

/**
 * Accessible tabs (ARIA tabs pattern) on {@link https://qwikui.com/docs/headless/tabs | @qwik-ui/headless}
 * with Tailwind styling aligned to this library.
 */
export const TabsGroup = component$<TabsGroupProps>((props) => {
  const items = props.tabs;
  const firstEnabled = items.find((t) => !t.disabled)?.value ?? items[0]?.value ?? "";
  const defaultId = props.defaultTabId;
  const initialId =
    defaultId && items.some((t) => t.value === defaultId && !t.disabled)
      ? defaultId
      : firstEnabled;

  const rootBase = "w-full max-w-xl";
  const rootClass = props.vertical
    ? `${rootBase} flex flex-row flex-wrap gap-6 items-start`
    : rootBase;

  const listClass = props.vertical
    ? "inline-flex flex-col w-48 shrink-0 rounded-lg bg-slate-100/90 p-1 text-slate-600 gap-1"
    : "inline-flex h-10 items-center justify-center rounded-lg bg-slate-100/90 p-1 text-slate-600";

  const panelClassResolved = props.vertical ? `${panelClass} mt-0 flex-1 min-w-0` : panelClass;

  return (
    <Tabs.Root
      class={[rootClass, props.class].filter(Boolean).join(" ")}
      behavior={props.behavior}
      vertical={props.vertical}
      selectedTabId={initialId}
    >
      <Tabs.List class={listClass}>
        {items.map((item) => (
          <Tabs.Tab
            key={item.value}
            class={triggerClass}
            disabled={item.disabled}
          >
            {item.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Panel key={item.value} class={panelClassResolved} disabled={item.disabled}>
          <p>{item.content}</p>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
});
