/**
 * @component tabs
 * @title Tabs
 * @version 1.1.2
 * @example Compound API (same data as TabsGroup)
 * `tabId` on the trigger and panel must match.
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
 *     <p>Overview of the basic information about this section.</p>
 *   </Tab.Panel>
 *   <Tab.Panel key="details">
 *     <p>Detailed description and advanced options.</p>
 *   </Tab.Panel>
 *   <Tab.Panel key="access">
 *     <p>Accessibility tips, keyboard shortcuts and screen readers.</p>
 *   </Tab.Panel>
 * </Tab.Root>
 * ```
 *
 * @example TabsGroup — horizontal
 * Data-driven shortcut `TabsGroup` with the same tabs as the compound API.
 * ```tsx
 * import { TabsGroup } from "~/components/ui/base/tabs";
 * 
 * const tabs = [
 *   { value: "overview", label: "Overview", content: "Overview of the basic information about this section." },
 *   { value: "details", label: "Details", content: "Detailed description and advanced options." },
 *   { value: "access", label: "Accessibility", content: "Accessibility tips, keyboard shortcuts and screen readers." },
 * ];
 * 
 * <TabsGroup tabs={tabs} defaultTabId="overview" />
 * ```
 *
 * @example TabsGroup — disabled item
 * TabsGroup — disabled item — see the example below.
 * ```tsx
 * import { TabsGroup } from "~/components/ui/base/tabs";
 * 
 * const tabs = [
 *   { value: "a", label: "Active A", content: "Content of active tab A." },
 *   { value: "b", label: "Disabled", content: "This text won't be shown for a disabled tab anyway.", disabled: true },
 *   { value: "c", label: "Active C", content: "Content of active tab C." },
 * ];
 * 
 * <TabsGroup tabs={tabs} defaultTabId="a" />
 * ```
 *
 * @example TabsGroup — vertical list
 * TabsGroup — vertical list — see the example below.
 * ```tsx
 * import { TabsGroup } from "~/components/ui/base/tabs";
 * 
 * const tabs = [
 *   { value: "overview", label: "Overview", content: "Overview of the basic information about this section." },
 *   { value: "details", label: "Details", content: "Detailed description and advanced options." },
 *   { value: "access", label: "Accessibility", content: "Accessibility tips, keyboard shortcuts and screen readers." },
 * ];
 * 
 * <TabsGroup tabs={tabs} vertical defaultTabId="overview" />
 * ```
 *
 * @example Line variant
 * Underlined tabs instead of the default bordered ones — `variant=&quot;line&quot;` on `Tab.Root` or `TabsGroup` .
 * ```tsx
 * import { TabsGroup } from "~/components/ui/base/tabs";
 *
 * const tabs = [
 *   { value: "overview", label: "Overview", content: "Overview of the basic information about this section." },
 *   { value: "details", label: "Details", content: "Detailed description and advanced options." },
 *   { value: "access", label: "Accessibility", content: "Accessibility tips, keyboard shortcuts and screen readers." },
 * ];
 *
 * <TabsGroup tabs={tabs} defaultTabId="overview" variant="line" />
 * ```
 *
 * @example Compound API — vertical
 * Set `vertical` on `Tab.Root` and the `verticalLayout` prop on `Tab.List` / `Tab.Panel`.
 * ```tsx
 * import { Tab } from "~/components/ui/base/tabs";
 * 
 * <Tab.Root vertical selectedTabId="overview" behavior="manual">
 *   <Tab.List verticalLayout>
 *     <Tab.Tab key="overview">Overview</Tab.Tab>
 *     <Tab.Tab key="details">Details</Tab.Tab>
 *   </Tab.List>
 *   <Tab.Panel key="overview" verticalLayout>
 *     <p>Overview of the basic information about this section.</p>
 *   </Tab.Panel>
 *   <Tab.Panel key="details" verticalLayout>
 *     <p>Detailed description and advanced options.</p>
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

/** Default variant — appearance matches {@link https://qwikui.com/docs/styled/tabs | Qwik UI Styled Tabs}; colors are tokens from COLORS.md. */
const triggerClass =
  "inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 font-medium whitespace-nowrap text-callout text-secondary-label ring-offset-background transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=selected]:border-separator-opaque data-[state=selected]:bg-surface-overlay data-[state=selected]:text-label data-[state=selected]:shadow-inner";

/** Line variant — underlined tabs; panel without a border. */
const triggerClassLine =
  "inline-flex items-center justify-center relative rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-2 font-medium whitespace-nowrap text-callout text-secondary-label ring-offset-background transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=selected]:border-accent data-[state=selected]:text-label data-[state=selected]:bg-transparent data-[state=selected]:shadow-none";

const panelClassBase =
  "text-body text-secondary-label ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md border border-separator-opaque bg-surface-raised p-4";

const panelClassHorizontal = `${panelClassBase} mt-2`;
const panelClassHorizontalLine =
  "text-body text-secondary-label ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-4";
const panelClassVertical = `${panelClassBase} mt-0 flex-1 min-w-0`;

const panelClassHorizontalBorderless = `${panelClassHorizontalLine}`;
const panelClassVerticalBorderless =
  "text-body text-secondary-label ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0 flex-1 min-w-0";

export function tabsListClassName(
  variant: "default" | "line",
  vertical: boolean,
): string {
  if (variant === "line") return listClassLine;
  return vertical ? listClassVertical : listClassHorizontal;
}

export function tabsTriggerClassName(variant: "default" | "line"): string {
  return variant === "line" ? triggerClassLine : triggerClass;
}

export function tabsPanelClassName(
  variant: "default" | "line",
  vertical: boolean,
  panelBorder: boolean,
): string {
  if (!panelBorder) {
    return vertical ? panelClassVerticalBorderless : panelClassHorizontalBorderless;
  }
  if (variant === "line") {
    return vertical ? panelClassVertical : panelClassHorizontalLine;
  }
  return vertical ? panelClassVertical : panelClassHorizontal;
}

const listClassHorizontal =
  "inline-flex items-center justify-center rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label shadow-sm";
const listClassLine =
  "flex w-full items-center justify-start gap-0 rounded-none border-0 border-b border-separator bg-transparent p-0 text-secondary-label shadow-none";

const listClassVertical =
  "inline-flex flex-col w-48 shrink-0 rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label gap-1 shadow-sm";

export type TabRootProps = Omit<PropsOf<"div">, "role"> & {
  /** `line` — underlined tabs, content without a border; the default variant has a border around both the list and the panel. */
  variant?: "default" | "line";
  /** Border and raised background around tab panels (default variant only; line variant is always borderless). */
  panelBorder?: boolean;
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
  /** Overrides `panelBorder` from `Tab.Root`. */
  panelBorder?: boolean;
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
const variantContext = createContextId<Signal<"default" | "line">>("q-ui-lib.tabs.variant");
const panelBorderContext = createContextId<Signal<boolean>>("q-ui-lib.tabs.panel-border");

/**
 * Styled Tabs root — layout, tokens from COLORS.md.
 */
export const TabRoot = component$<TabRootProps>((props) => {
  const {
    variant = "default",
    panelBorder = true,
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
  const variantSig = useSignal(variant);
  const panelBorderSig = useSignal(panelBorder);
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
  useContextProvider(variantContext, variantSig);
  useContextProvider(panelBorderContext, panelBorderSig);

  useTask$(({ track }) => {
    variantSig.value = track(() => props.variant) ?? "default";
    panelBorderSig.value = track(() => props.panelBorder) ?? true;
  });

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
  const variantSig = useContext(variantContext);
  const { class: className, disabled, onClick$: userOnClick$, ...rest } = props;
  const merged = [
    tabsTriggerClassName(variantSig.value),
    className,
  ]
    .filter(Boolean)
    .join(" ");
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
      onKeyDown$={$((event, element) => {
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
      })}
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
      onKeyDown$={$((event, element) => {
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
      })}
    >
      <Slot />
    </button>
  );
});

export const TabList = component$<TabListProps>((props) => {
  const verticalSig = useContext(verticalContext);
  const variantSig = useContext(variantContext);
  const { class: className, verticalLayout, ...rest } = props;
  const vertical = verticalLayout || verticalSig.value;
  const defaultListClass = tabsListClassName(variantSig.value, vertical);
  const merged = [defaultListClass, className].filter(Boolean).join(" ");
  return (
    <div
      {...rest}
      role="tablist"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      class={merged}
    >
      <Slot />
    </div>
  );
});

export const TabPanel = component$<TabPanelProps>((props) => {
  const selectedTabIdSig = useContext(selectedTabIdContext);
  const prefixSig = useContext(idPrefixContext);
  const autoIdSig = useContext(autoPanelIdContext);
  const verticalSig = useContext(verticalContext);
  const variantSig = useContext(variantContext);
  const panelBorderSig = useContext(panelBorderContext);
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
  const { verticalLayout, class: className, hidden, tabId, _tabId, panelBorder, ...rest } =
    props;
  void tabId;
  void _tabId;
  const bordered = panelBorder ?? panelBorderSig.value;
  const merged = [
    tabsPanelClassName(
      variantSig.value,
      Boolean(verticalLayout || verticalSig.value),
      bordered,
    ),
    className,
  ]
    .filter(Boolean)
    .join(" ");
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
  const verticalSig = useContext(verticalContext);
  const panelBorderSig = useContext(panelBorderContext);
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
  const { verticalLayout, class: className, hidden, tabId, _tabId, panelBorder, ...rest } =
    props;
  void tabId;
  void _tabId;
  const bordered = panelBorder ?? panelBorderSig.value;
  const merged = [
    tabsPanelClassName(
      "line",
      Boolean(verticalLayout || verticalSig.value),
      bordered,
    ),
    className,
  ]
    .filter(Boolean)
    .join(" ");
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
 * Compound API in the Qwik UI style: {@link TabRoot}, {@link TabList}, {@link TabTrigger}, {@link TabPanel}
 * (often `Tabs.*` in the documentation — use the {@link Tabs} alias).
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

/** Alias for `Tab` — same API as `Tabs` in {@link https://qwikui.com/docs/styled/tabs | Qwik UI Styled}. */
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
  /** `line` — underlined tabs, content without a border. */
  variant?: TabRootProps["variant"];
  panelBorder?: boolean;
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

  const vertical = Boolean(props.vertical);
  const variant = props.variant ?? "default";
  const panelBorder = props.panelBorder ?? true;

  return (
    <Tab.Root
      class={props.class}
      behavior={props.behavior}
      vertical={vertical}
      variant={variant}
      panelBorder={panelBorder}
      selectedTabId={initialId}
    >
      <Tab.List>
        {items.map((item) => (
          <Tab.Tab key={item.value} tabId={item.value} disabled={item.disabled}>
            {item.label}
          </Tab.Tab>
        ))}
      </Tab.List>
      {items.map((item) => (
        <Tab.Panel key={item.value} tabId={item.value}>
          <p>{item.content}</p>
        </Tab.Panel>
      ))}
    </Tab.Root>
  );
});
