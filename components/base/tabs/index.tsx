/**
 * @component tabs
 * @title Tabs
 * @version 1.1.2
 * @example Složené API (stejná data jako TabsGroup)
 * `tabId` na triggeru a panelu se musí shodovat.
 * ```tsx
 * import { Tab } from "~/components/ui/base/tabs";
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
 * import { TabsGroup } from "~/components/ui/base/tabs";
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
 * import { TabsGroup } from "~/components/ui/base/tabs";
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
 * import { TabsGroup } from "~/components/ui/base/tabs";
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
 * import { TabsGroup } from "~/components/ui/base/tabs";
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
 * import { Tab } from "~/components/ui/base/tabs";
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

import {
  $,
  component$,
  createContextId,
  Slot,
  type PropsOf,
  useContext,
  useContextProvider,
  useSignal,
  useTask$,
  useVisibleTask$,
  type Signal,
} from "@builder.io/qwik";

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

export type TabRootProps = Omit<PropsOf<"div">, "role"> & {
  /** `line` — podtržené záložky, obsah bez rámečku; výchozí varianta má rámeček kolem listu i panelu. */
  variant?: "default" | "line";
  /** Controlled selected tab id. */
  selectedTabId?: string;
  /** Activation mode. */
  behavior?: "automatic" | "manual";
  /** Orientation. */
  vertical?: boolean;
  "bind:selectedTabId"?: Signal<string | undefined>;
};

export type TabListProps = PropsOf<"div"> & {
  verticalLayout?: boolean;
};

export type TabTriggerProps = Omit<PropsOf<"button">, "role"> & {
  /** Explicit tab id for reliable panel matching. */
  tabId?: string;
  /** Optional alias for tab id (for compatibility). */
  _tabId?: string;
};

export type TabPanelProps = Omit<PropsOf<"div">, "children"> & {
  /** Match with `Tab.Tab tabId`. */
  tabId?: string;
  /**
   * Backward-compatible alias used in some existing examples.
   * Prefer `tabId`.
   */
  _tabId?: string;
  verticalLayout?: boolean;
  children?: PropsOf<"div">["children"];
};

const selectedTabIdContext = createContextId<Signal<string | undefined>>(
  "q-ui-lib.tabs.selected-tab-id",
);
const tabIdsContext = createContextId<Signal<string[]>>("q-ui-lib.tabs.ids");
const verticalContext = createContextId<Signal<boolean>>("q-ui-lib.tabs.vertical");
const behaviorContext = createContextId<Signal<"automatic" | "manual">>(
  "q-ui-lib.tabs.behavior",
);
const idPrefixContext = createContextId<Signal<string>>("q-ui-lib.tabs.id-prefix");
const autoTabIdContext = createContextId<Signal<number>>("q-ui-lib.tabs.auto-tab-id");
const autoPanelIdContext = createContextId<Signal<number>>("q-ui-lib.tabs.auto-panel-id");

/**
 * Styled Tabs root — layout, tokeny z COLORS.md.
 */
export const TabRoot = component$<TabRootProps>((props) => {
  const {
    variant = "default",
    class: className,
    selectedTabId,
    "bind:selectedTabId": bindSelectedTabId,
    behavior = "automatic",
    ...rest
  } = props;
  const rootBase = "w-full";
  const rootVertical = props.vertical ? "flex flex-row flex-wrap gap-6 items-start" : "";
  const merged = [rootBase, rootVertical, className].filter(Boolean).join(" ");
  const localSelectedTabIdSig = useSignal<string | undefined>(selectedTabId);
  const selectedTabIdSig = bindSelectedTabId ?? localSelectedTabIdSig;
  const tabIdsSig = useSignal<string[]>([]);
  const verticalSig = useSignal(Boolean(props.vertical));
  const behaviorSig = useSignal(behavior);
  const autoTabIdSig = useSignal(0);
  const autoPanelIdSig = useSignal(0);
  const prefixSig = useSignal(
    props.id && typeof props.id === "string" ? `${props.id}` : `tabs-${Math.random().toString(36).slice(2, 10)}`,
  );
  // Keep internal selection in sync when the parent passes a new `selectedTabId` (uncontrolled + prop updates).
  useTask$(({ track }) => {
    if (bindSelectedTabId) {
      return;
    }
    const next = track(() => props.selectedTabId);
    if (next !== undefined) {
      selectedTabIdSig.value = next;
    }
  });
  useContextProvider(selectedTabIdContext, selectedTabIdSig);
  useContextProvider(tabIdsContext, tabIdsSig);
  useContextProvider(verticalContext, verticalSig);
  useContextProvider(behaviorContext, behaviorSig);
  useContextProvider(idPrefixContext, prefixSig);
  useContextProvider(autoTabIdContext, autoTabIdSig);
  useContextProvider(autoPanelIdContext, autoPanelIdSig);

  useVisibleTask$(({ track }) => {
    track(() => tabIdsSig.value.length);
    track(() => selectedTabIdSig.value);
    if (selectedTabIdSig.value) {
      return;
    }
    if (tabIdsSig.value.length > 0) {
      selectedTabIdSig.value = tabIdsSig.value[0];
    }
  });

  return (
    <div {...rest} class={merged} data-variant={variant}>
      <Slot />
    </div>
  );
});

/** Returns explicit tab id only — auto ids are assigned in {@link useTask$} to avoid mutating signals during render. */
function explicitTabId(props: { tabId?: string; _tabId?: string }): string | undefined {
  return props.tabId ?? props._tabId;
}

export const TabTrigger = component$<TabTriggerProps>((props) => {
  const selectedTabIdSig = useContext(selectedTabIdContext);
  const tabIdsSig = useContext(tabIdsContext);
  const verticalSig = useContext(verticalContext);
  const behaviorSig = useContext(behaviorContext);
  const prefixSig = useContext(idPrefixContext);
  const autoIdSig = useContext(autoTabIdContext);
  const resolvedTabIdSig = useSignal<string>(explicitTabId(props) ?? "");
  useTask$(({ track }) => {
    track(() => props.tabId);
    track(() => props._tabId);
    const explicit = explicitTabId(props);
    if (explicit) {
      resolvedTabIdSig.value = explicit;
      return;
    }
    if (!resolvedTabIdSig.value) {
      autoIdSig.value += 1;
      resolvedTabIdSig.value = `tab-${autoIdSig.value}`;
    }
  });
  const { class: className, disabled, onClick$: userOnClick$, ...rest } = props;
  const merged = [triggerClass, className].filter(Boolean).join(" ");
  const isSelected = selectedTabIdSig.value === resolvedTabIdSig.value;

  useVisibleTask$(({ track }) => {
    const id = track(() => resolvedTabIdSig.value);
    if (!tabIdsSig.value.includes(id)) {
      tabIdsSig.value = [...tabIdsSig.value, id];
    }
  });

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={`${prefixSig.value}-tab-${resolvedTabIdSig.value}`}
      aria-controls={`${prefixSig.value}-panel-${resolvedTabIdSig.value}`}
      aria-selected={isSelected}
      data-state={isSelected ? "selected" : "unselected"}
      data-tab-id={resolvedTabIdSig.value}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      class={merged}
      onClick$={$((event, element) => {
        selectedTabIdSig.value = resolvedTabIdSig.value;
        const extra = userOnClick$;
        if (extra && typeof extra === "function") {
          void (extra as (e: PointerEvent, el: HTMLButtonElement) => unknown)(event, element);
        }
      })}
      onKeyDown$={(event, element) => {
        const ids = tabIdsSig.value;
        const currentIndex = ids.indexOf(resolvedTabIdSig.value);
        if (currentIndex === -1 || ids.length === 0) {
          return;
        }

        const focusTab = (id: string) => {
          const selector = `[role="tab"][data-tab-id="${id}"]`;
          const target = element.parentElement?.querySelector<HTMLButtonElement>(selector);
          target?.focus();
          if (behaviorSig.value === "automatic") {
            selectedTabIdSig.value = id;
          }
        };

        if (
          (verticalSig.value && event.key === "ArrowDown") ||
          (!verticalSig.value && event.key === "ArrowRight")
        ) {
          event.preventDefault();
          const nextId = ids[(currentIndex + 1) % ids.length];
          if (nextId) {
            focusTab(nextId);
          }
        } else if (
          (verticalSig.value && event.key === "ArrowUp") ||
          (!verticalSig.value && event.key === "ArrowLeft")
        ) {
          event.preventDefault();
          const prevId = ids[(currentIndex - 1 + ids.length) % ids.length];
          if (prevId) {
            focusTab(prevId);
          }
        } else if (event.key === "Home") {
          event.preventDefault();
          const firstId = ids[0];
          if (firstId) {
            focusTab(firstId);
          }
        } else if (event.key === "End") {
          event.preventDefault();
          const lastId = ids[ids.length - 1];
          if (lastId) {
            focusTab(lastId);
          }
        } else if (
          behaviorSig.value === "manual" &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          selectedTabIdSig.value = resolvedTabIdSig.value;
        }
      }}
    >
      <Slot />
    </button>
  );
});

export const TabTriggerLine = component$<TabTriggerProps>((props) => {
  const selectedTabIdSig = useContext(selectedTabIdContext);
  const tabIdsSig = useContext(tabIdsContext);
  const verticalSig = useContext(verticalContext);
  const behaviorSig = useContext(behaviorContext);
  const prefixSig = useContext(idPrefixContext);
  const autoIdSig = useContext(autoTabIdContext);
  const resolvedTabIdSig = useSignal<string>(explicitTabId(props) ?? "");
  useTask$(({ track }) => {
    track(() => props.tabId);
    track(() => props._tabId);
    const explicit = explicitTabId(props);
    if (explicit) {
      resolvedTabIdSig.value = explicit;
      return;
    }
    if (!resolvedTabIdSig.value) {
      autoIdSig.value += 1;
      resolvedTabIdSig.value = `tab-${autoIdSig.value}`;
    }
  });
  const { class: className, disabled, onClick$: userOnClick$, ...rest } = props;
  const merged = [triggerClassLine, className].filter(Boolean).join(" ");
  const isSelected = selectedTabIdSig.value === resolvedTabIdSig.value;

  useVisibleTask$(({ track }) => {
    const id = track(() => resolvedTabIdSig.value);
    if (!tabIdsSig.value.includes(id)) {
      tabIdsSig.value = [...tabIdsSig.value, id];
    }
  });

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={`${prefixSig.value}-tab-${resolvedTabIdSig.value}`}
      aria-controls={`${prefixSig.value}-panel-${resolvedTabIdSig.value}`}
      aria-selected={isSelected}
      data-state={isSelected ? "selected" : "unselected"}
      data-tab-id={resolvedTabIdSig.value}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      class={merged}
      onClick$={$((event, element) => {
        selectedTabIdSig.value = resolvedTabIdSig.value;
        const extra = userOnClick$;
        if (extra && typeof extra === "function") {
          void (extra as (e: PointerEvent, el: HTMLButtonElement) => unknown)(event, element);
        }
      })}
      onKeyDown$={(event, element) => {
        const ids = tabIdsSig.value;
        const currentIndex = ids.indexOf(resolvedTabIdSig.value);
        if (currentIndex === -1 || ids.length === 0) {
          return;
        }

        const focusTab = (id: string) => {
          const selector = `[role="tab"][data-tab-id="${id}"]`;
          const target = element.parentElement?.querySelector<HTMLButtonElement>(selector);
          target?.focus();
          if (behaviorSig.value === "automatic") {
            selectedTabIdSig.value = id;
          }
        };

        if (
          (verticalSig.value && event.key === "ArrowDown") ||
          (!verticalSig.value && event.key === "ArrowRight")
        ) {
          event.preventDefault();
          const nextId = ids[(currentIndex + 1) % ids.length];
          if (nextId) {
            focusTab(nextId);
          }
        } else if (
          (verticalSig.value && event.key === "ArrowUp") ||
          (!verticalSig.value && event.key === "ArrowLeft")
        ) {
          event.preventDefault();
          const prevId = ids[(currentIndex - 1 + ids.length) % ids.length];
          if (prevId) {
            focusTab(prevId);
          }
        } else if (event.key === "Home") {
          event.preventDefault();
          const firstId = ids[0];
          if (firstId) {
            focusTab(firstId);
          }
        } else if (event.key === "End") {
          event.preventDefault();
          const lastId = ids[ids.length - 1];
          if (lastId) {
            focusTab(lastId);
          }
        } else if (
          behaviorSig.value === "manual" &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          selectedTabIdSig.value = resolvedTabIdSig.value;
        }
      }}
    >
      <Slot />
    </button>
  );
});

export const TabList = component$<TabListProps>((props) => {
  const verticalSig = useContext(verticalContext);
  const { class: className, verticalLayout, ...rest } = props;
  return (
    <div
      {...rest}
      role="tablist"
      aria-orientation={verticalLayout || verticalSig.value ? "vertical" : "horizontal"}
      class={className}
    >
      <Slot />
    </div>
  );
});

export const TabPanel = component$<TabPanelProps>((props) => {
  const selectedTabIdSig = useContext(selectedTabIdContext);
  const prefixSig = useContext(idPrefixContext);
  const autoIdSig = useContext(autoPanelIdContext);
  const resolvedTabIdSig = useSignal<string>(explicitTabId(props) ?? "");
  useTask$(({ track }) => {
    track(() => props.tabId);
    track(() => props._tabId);
    const explicit = explicitTabId(props);
    if (explicit) {
      resolvedTabIdSig.value = explicit;
      return;
    }
    if (!resolvedTabIdSig.value) {
      autoIdSig.value += 1;
      resolvedTabIdSig.value = `tab-${autoIdSig.value}`;
    }
  });
  const { verticalLayout, class: className, hidden, tabId, _tabId, ...rest } = props;
  void verticalLayout;
  void tabId;
  void _tabId;
  const merged = [panelClassHorizontal, className].filter(Boolean).join(" ");
  const isSelected =
    selectedTabIdSig.value === resolvedTabIdSig.value;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={`${prefixSig.value}-panel-${resolvedTabIdSig.value}`}
      aria-labelledby={`${prefixSig.value}-tab-${resolvedTabIdSig.value}`}
      data-tab-id={resolvedTabIdSig.value}
      hidden={hidden ?? !isSelected}
      data-state={isSelected ? "selected" : "unselected"}
      class={merged}
    >
      <Slot />
    </div>
  );
});

export const TabPanelLine = component$<TabPanelProps>((props) => {
  const selectedTabIdSig = useContext(selectedTabIdContext);
  const prefixSig = useContext(idPrefixContext);
  const autoIdSig = useContext(autoPanelIdContext);
  const resolvedTabIdSig = useSignal<string>(explicitTabId(props) ?? "");
  useTask$(({ track }) => {
    track(() => props.tabId);
    track(() => props._tabId);
    const explicit = explicitTabId(props);
    if (explicit) {
      resolvedTabIdSig.value = explicit;
      return;
    }
    if (!resolvedTabIdSig.value) {
      autoIdSig.value += 1;
      resolvedTabIdSig.value = `tab-${autoIdSig.value}`;
    }
  });
  const { verticalLayout, class: className, hidden, tabId, _tabId, ...rest } = props;
  void verticalLayout;
  void tabId;
  void _tabId;
  const merged = [panelClassHorizontalLine, className].filter(Boolean).join(" ");
  const isSelected =
    selectedTabIdSig.value === resolvedTabIdSig.value;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={`${prefixSig.value}-panel-${resolvedTabIdSig.value}`}
      aria-labelledby={`${prefixSig.value}-tab-${resolvedTabIdSig.value}`}
      data-tab-id={resolvedTabIdSig.value}
      hidden={hidden ?? !isSelected}
      data-state={isSelected ? "selected" : "unselected"}
      class={merged}
    >
      <Slot />
    </div>
  );
});

/**
 * Složené API ve stylu Qwik UI: {@link TabRoot}, {@link TabList}, {@link TabTrigger}, {@link TabPanel}
 * (v dokumentaci často `Tabs.*` — použij alias {@link Tabs}).
 */
export const Tab = {
  Root: TabRoot,
  List: TabList,
  ListLine: TabList,
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

  const listClass = isLine
    ? listClassLine
    : vertical
      ? listClassVertical
      : listClassHorizontal;
  const triggerClassName = isLine ? triggerClassLine : triggerClass;
  const panelClassName = isLine
    ? panelClassHorizontalLine
    : vertical
      ? panelClassVertical
      : panelClassHorizontal;

  return (
    <Tab.Root
      class={props.class}
      behavior={props.behavior}
      vertical={vertical}
      variant={props.variant}
      selectedTabId={initialId}
    >
      <Tab.List class={listClass}>
        {items.map((item) => (
          <Tab.Tab
            key={item.value}
            tabId={item.value}
            disabled={item.disabled}
            class={triggerClassName}
          >
            {item.label}
          </Tab.Tab>
        ))}
      </Tab.List>
      {items.map((item) => (
        <Tab.Panel
          key={item.value}
          tabId={item.value}
          class={panelClassName}
        >
          <p>{item.content}</p>
        </Tab.Panel>
      ))}
    </Tab.Root>
  );
});
