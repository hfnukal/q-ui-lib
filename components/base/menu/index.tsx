/**
 * @component menu
 * @title Menu
 * @version 1.0.0
 * @example Basic usage
 * Basic usage — see the example below.
 * ```tsx
 * import { LuChevronRight } from "@qwikest/icons/lucide";
 * import { Menu, MenuItem } from "~/components/ui/base/menu";
 * 
 * <Menu.Root menuKey="example1">
 *   <Menu.Trigger>Options</Menu.Trigger>
 *   <Menu.Panel>
 *     <Menu.Item>Profile</Menu.Item>
 *     <Menu.Item>Billing</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.SubMenu>
 *       <Menu.SubTrigger>
 *         More Options
 *         <MenuItem.End><LuChevronRight /></MenuItem.End>
 *       </Menu.SubTrigger>
 *       <Menu.Panel>
 *         <Menu.Item>Export Data...</Menu.Item>
 *         <Menu.Separator />
 *         <Menu.SubMenu>
 *           <Menu.SubTrigger>
 *             Advanced
 *             <MenuItem.End><LuChevronRight /></MenuItem.End>
 *           </Menu.SubTrigger>
 *           <Menu.Panel>
 *             <Menu.Item>Clear Cache</Menu.Item>
 *             <Menu.Item>Reset Defaults</Menu.Item>
 *           </Menu.Panel>
 *         </Menu.SubMenu>
 *       </Menu.Panel>
 *     </Menu.SubMenu>
 *   </Menu.Panel>
 * </Menu.Root>
 * ```
 *
 * @example With MenuItem layout
 * With MenuItem layout — see the example below.
 * ```tsx
 * import { LuCopy, LuSave, LuTrash } from "@qwikest/icons/lucide";
 * import { Menu, MenuItem } from "~/components/ui/base/menu";
 * import { KbdShortcut } from "~/components/ui/base/kbd-shortcut";
 * 
 * <Menu.Root menuKey="example2">
 *   <Menu.Trigger>File</Menu.Trigger>
 *   <Menu.Panel>
 *     <Menu.Item>
 *       <MenuItem.Start><LuSave /></MenuItem.Start>
 *       <MenuItem.Label>Save</MenuItem.Label>
 *       <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
 *     </Menu.Item>
 *     <Menu.Item>
 *       <MenuItem.Start><LuCopy /></MenuItem.Start>
 *       <MenuItem.Label>Copy</MenuItem.Label>
 *       <MenuItem.End><KbdShortcut>⌘C</KbdShortcut></MenuItem.End>
 *     </Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item class="text-color-red">
 *       <MenuItem.Start><LuTrash /></MenuItem.Start>
 *       <MenuItem.Label>Move to Trash</MenuItem.Label>
 *       <MenuItem.End><KbdShortcut>⌘⌫</KbdShortcut></MenuItem.End>
 *     </Menu.Item>
 *   </Menu.Panel>
 * </Menu.Root>
 * ```
 *
 * @example CheckboxItem
 * The check is shown as a checkmark on the left. State is controlled by `bind:value`.
 * ```tsx
 * import { useSignal, component$ } from "@builder.io/qwik";
 * import { Menu, MenuItem } from "~/components/ui/base/menu";
 * 
 * export default component$(() => {
 *   const checkedSignal = useSignal(false);
 *   return (
 *     <Menu.Root menuKey="example3">
 *       <Menu.Trigger>Preferences</Menu.Trigger>
 *       <Menu.Panel>
 *         <Menu.Group>
 *           <Menu.Label>Settings</Menu.Label>
 *           <Menu.CheckBoxItem bind:value={checkedSignal}>
 *             <MenuItem.Label>Enable Sync ({checkedSignal.value ? "ON" : "OFF"})</MenuItem.Label>
 *           </Menu.CheckBoxItem>
 *         </Menu.Group>
 *       </Menu.Panel>
 *     </Menu.Root>
 *   );
 * });
 * ```
 *
 * @example RadioGroup & RadioButton
 * The selected item is marked with a dot. State is controlled by `bind:value` on `RadioGroup`.
 * ```tsx
 * import { useSignal, component$ } from "@builder.io/qwik";
 * import { Menu, MenuItem } from "~/components/ui/base/menu";
 * 
 * export default component$(() => {
 *   const radioSignal = useSignal("dark");
 *   return (
 *     <Menu.Root menuKey="example4">
 *       <Menu.Trigger>Theme</Menu.Trigger>
 *       <Menu.Panel>
 *         <Menu.Group>
 *           <Menu.Label>Appearance</Menu.Label>
 *           <Menu.RadioGroup bind:value={radioSignal}>
 *             <Menu.RadioButton value="light">
 *               <MenuItem.Label>Light</MenuItem.Label>
 *             </Menu.RadioButton>
 *             <Menu.RadioButton value="dark">
 *               <MenuItem.Label>Dark</MenuItem.Label>
 *             </Menu.RadioButton>
 *             <Menu.RadioButton value="system">
 *               <MenuItem.Label>System</MenuItem.Label>
 *             </Menu.RadioButton>
 *           </Menu.RadioGroup>
 *         </Menu.Group>
 *       </Menu.Panel>
 *     </Menu.Root>
 *   );
 * });
 * ```
 *
 *
 * @example MenuGroup (Menubar)
 * A grouping of multiple menus, allowing arrow-key navigation (ArrowLeft/ArrowRight) between them.
 * ```tsx
 * import { LuChevronRight } from "@qwikest/icons/lucide";
 * import { Menu, MenuItem } from "~/components/ui/base/menu";
 * 
 * <Menu.MenuGroup aria-label="Main menu">
 *   <Menu.Root menuKey="file">
 *     <Menu.Trigger>File</Menu.Trigger>
 *     <Menu.Panel>
 *       <Menu.Item>New</Menu.Item>
 *       <Menu.Item>Open</Menu.Item>
 *       <Menu.Separator />
 *       <Menu.SubMenu>
 *         <Menu.SubTrigger>
 *           Recent
 *           <MenuItem.End><LuChevronRight /></MenuItem.End>
 *         </Menu.SubTrigger>
 *         <Menu.Panel>
 *           <Menu.Item>file1.txt</Menu.Item>
 *           <Menu.Item>file2.txt</Menu.Item>
 *         </Menu.Panel>
 *       </Menu.SubMenu>
 *     </Menu.Panel>
 *   </Menu.Root>
 *   <Menu.Root menuKey="view">
 *     <Menu.Trigger>View</Menu.Trigger>
 *     <Menu.Panel>
 *       <Menu.Item>Zoom In</Menu.Item>
 *       <Menu.Item>Zoom Out</Menu.Item>
 *       <Menu.Separator />
 *       <Menu.SubMenu>
 *         <Menu.SubTrigger>
 *           Layout
 *           <MenuItem.End><LuChevronRight /></MenuItem.End>
 *         </Menu.SubTrigger>
 *         <Menu.Panel>
 *           <Menu.Item>Single</Menu.Item>
 *           <Menu.Item>Split</Menu.Item>
 *           <Menu.Item>Grid</Menu.Item>
 *         </Menu.Panel>
 *       </Menu.SubMenu>
 *     </Menu.Panel>
 *   </Menu.Root>
 * </Menu.MenuGroup>

 * ```
 */

/**
 * `Menu` is ARIA compatible with web accessibility standards.
 *
 * Usage:
 * ```tsx
 * import { Menu } from "~/components/ui/base/menu";
 *
 * <Menu.Root menuKey="example6">
 *   <Menu.Trigger>Options</Menu.Trigger>
 *   <Menu.Panel>
 *     <Menu.Item>Profile</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item>Settings</Menu.Item>
 *   </Menu.Panel>
 * </Menu.Root>
 * ```
 */
/**
 * Menu – ARIA keyboard navigation (WAI-ARIA Menu pattern)
 *
 * The context contains ONLY serializable data (string, number, array<string>).
 * onKeyDown$ is a file-level factory: makeKeyHandler(ctx) → handler.
 * Assigned to Item and SubTrigger — they capture keys when focused.
 */

import {
  $,
  component$,
  createContextId,
  FunctionComponent,
  PropsOf,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
  useStyles$,
  type Signal,
} from "@builder.io/qwik";
import { Popover } from "@qwik-ui/headless";

/**
 * Visual layout of a menu row — combine with an interactive wrapper
 * (e.g. `Menu.Item`). Composes `Start`, `Label`, `End`.
 */
export const MenuItemRoot = component$<PropsOf<"div">>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex w-full items-center gap-2";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

/** Left area for an icon or other visual indication. */
export const MenuItemStart = component$<PropsOf<"span">>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "flex shrink-0 items-center justify-center text-secondary-label [&_svg]:h-4 [&_svg]:w-4";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

/** Main item text — expands into the available space. */
export const MenuItemLabel = component$<PropsOf<"span">>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex-1 truncate text-left";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

/** Right area — typically `KbdShortcut` or a badge. */
export const MenuItemEnd = component$<PropsOf<"span">>((props) => {
  const { class: className, ...rest } = props;
  const base = "ml-auto flex shrink-0 items-center gap-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

/** Compound API for visual layout: `MenuItem.Root`, `MenuItem.Start`, `MenuItem.Label`, `MenuItem.End`. */
export const MenuItem = {
  Root: MenuItemRoot,
  Start: MenuItemStart,
  Label: MenuItemLabel,
  End: MenuItemEnd,
};

import { LuCheck, LuCircleDot } from "@qwikest/icons/lucide";
import { Separator as BaseSeparator } from "../separator";

const menuStyles = `
  .q-menu-trigger:focus,
  .q-menu-trigger[aria-expanded="true"],
  .q-menu-trigger[data-state="open"],
  .q-menu-trigger[data-open] {
    background-color: #3b82f6 !important;
    color: #ffffff !important;
    border-radius: 4px;
    outline: none;
  }
`;

// ── Context type ───────────────────────────────────────────────────────────

export type MenuContextState = {
  menuKey: string;
  activeId: string;
  itemIds: string[];
  itemIndex: number;
  /** ID of the SubTrigger in the parent menu — for ArrowLeft. Empty at root. */
  parentTriggerId: string;
  isOpen: boolean;
};

const menuCtxId = createContextId<MenuContextState>("q.menu");
const parentMenuCtxId = createContextId<MenuContextState>("q.menu.parent");

export const useMenuContext = () => useContext(menuCtxId);

// ── Keyboard handler factory ───────────────────────────────────────────────
// Navigation via DOM traversal — does not depend on ID registration.
// Finds all [role="menuitem"] in the current panel (not nested submenus).

/**
 * Returns all direct menuitems of the given panel (not items of nested submenus).
 * A menuitem belongs to the panel if its nearest [role="menu"] is this panel.
 */
const getMenuItems = (panel: Element): HTMLElement[] => {
  return Array.from(panel.querySelectorAll<HTMLElement>("[role='menuitem']")).filter(
    (el) => el.closest("[role='menu']") === panel
  );
};

/**
 * Closes all open submenus in the given panel.
 * Finds visible [role="menu"] panels inside and clicks their trigger (toggle off).
 * @param exceptTrigger — if provided, its submenu is not closed (for SubTrigger hover)
 */
const closeChildSubmenus = (menuPanel: Element, exceptTrigger?: HTMLElement) => {
  const subPanels = menuPanel.querySelectorAll<HTMLElement>("[role='menu']");
  subPanels.forEach((subPanel) => {
    const rect = subPanel.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return; // hidden
    // Find this subpanel's trigger (sibling in the Popover.Root wrapper)
    const wrapper = subPanel.parentElement;
    const trigger = wrapper?.querySelector<HTMLElement>("[aria-haspopup='menu']");
    if (trigger && trigger !== exceptTrigger) {
      trigger.click(); // close submenu
    }
  });
};

/**
 * Returns a Set of all currently visible [role="menu"] panels.
 */
const getVisiblePanels = (): Set<HTMLElement> => {
  return new Set(
    Array.from(document.querySelectorAll<HTMLElement>("[role='menu']")).filter(
      (p) => {
        const r = p.getBoundingClientRect();
        return r.width > 0 || r.height > 0;
      }
    )
  );
};

/**
 * Waits for a NEW submenu panel to appear (one not in the snapshot)
 * and focuses its first menuitem. Retry loop via rAF, max 300ms.
 */
const focusNewSubMenuItem = (existingPanels: Set<HTMLElement>) => {
  const start = performance.now();
  const tryFocus = () => {
    const allPanels = document.querySelectorAll<HTMLElement>("[role='menu']");
    for (const panel of allPanels) {
      if (existingPanels.has(panel)) continue; // existed before the click
      const rect = panel.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const items = getMenuItems(panel);
      if (items.length > 0) {
        items[0].focus();
        return;
      }
    }
    if (performance.now() - start < 500) {
      setTimeout(tryFocus, 10);
    }
  };
  setTimeout(tryFocus, 10);
};

const makeKeyHandler = (ctx: MenuContextState) => {
  return $((e: KeyboardEvent) => {
    const KEYS = [
      "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft",
      "Home", "End", "Enter", " ", "Escape",
    ];
    if (!KEYS.includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();

    // Find the focused menuitem and its panel
    const focusedEl = (e.target as HTMLElement)?.closest("[role='menuitem']") as HTMLElement | null;
    if (!focusedEl) return;
    const panel = focusedEl.closest("[role='menu']");
    if (!panel) return;

    // All menuitems of this panel (not nested submenus)
    const items = getMenuItems(panel);
    const curIdx = items.indexOf(focusedEl);
    const len = items.length;
    if (len === 0) return;

    const focusedIsSubTrigger = focusedEl.getAttribute("aria-haspopup") === "menu";

    const focusItem = (index: number) => {
      const el = items[index];
      el?.focus();
      ctx.activeId = el?.id ?? "";
    };

    // Helper: navigate to adjacent menu in a MenuGroup
    const navigateMenuGroup = (direction: "next" | "prev") => {
      // Find the MenuGroup container from the current panel
      const groupEl = (panel as HTMLElement).closest<HTMLElement>("[data-menu-group]");
      if (!groupEl) return false; // not inside a MenuGroup

      const groupTriggers = Array.from(
        groupEl.querySelectorAll<HTMLElement>("[data-menu-group-trigger]")
      );
      if (groupTriggers.length < 2) return false;

      // Find which group trigger owns the current panel chain
      // Walk up from the panel to find the top-level [data-menu-group-trigger]
      let el: HTMLElement | null = panel as HTMLElement;
      let ownerTrigger: HTMLElement | null = null;
      while (el && el !== groupEl) {
        const trigger = el.querySelector<HTMLElement>("[data-menu-group-trigger]");
        if (trigger && groupTriggers.includes(trigger)) {
          ownerTrigger = trigger;
          break;
        }
        el = el.parentElement;
      }
      if (!ownerTrigger) return false;

      const curGroupIdx = groupTriggers.indexOf(ownerTrigger);
      if (curGroupIdx === -1) return false;

      const nextGroupIdx = direction === "next"
        ? (curGroupIdx + 1) % groupTriggers.length
        : (curGroupIdx - 1 + groupTriggers.length) % groupTriggers.length;
      const nextTrigger = groupTriggers[nextGroupIdx];

      // Close all visible menus first
      ownerTrigger.click();
      // Open next menu without focusing an item inside
      nextTrigger.focus();
      nextTrigger.click();
      return true;
    };

    switch (e.key) {
      case "ArrowDown":
        focusItem((curIdx + 1) % len);
        break;
      case "ArrowUp":
        focusItem((curIdx - 1 + len) % len);
        break;
      case "Home":
        focusItem(0);
        break;
      case "End":
        focusItem(len - 1);
        break;

      case "ArrowRight":
      case "Enter":
      case " ": {
        if (focusedIsSubTrigger) {
          // Snapshot BEFORE the click — then we look for a NEW panel
          const before = getVisiblePanels();
          focusedEl.click();
          focusNewSubMenuItem(before);
        } else if (e.key === "ArrowRight") {
          // Not a SubTrigger — if inside MenuGroup, navigate to next menu
          navigateMenuGroup("next");
        } else if (e.key === "Enter" || e.key === " ") {
          focusedEl.click();
        }
        break;
      }

      case "ArrowLeft":
      case "Escape": {
        // Find the current panel and its parent trigger in the DOM
        const currentPanel = focusedEl.closest("[role='menu']");
        if (!currentPanel) break;

        // We look for the SubTrigger that opened this panel
        const wrapper = currentPanel.parentElement;
        const parentTrigger = wrapper?.querySelector<HTMLElement>(
          "[aria-haspopup='menu']"
        );

        if (parentTrigger) {
          // Check if this parentTrigger is a MenuGroup trigger (root level)
          const isGroupTrigger = parentTrigger.hasAttribute("data-menu-group-trigger");

          if (e.key === "ArrowLeft" && isGroupTrigger) {
            // At root panel of a grouped menu — navigate to prev menu in group
            if (!navigateMenuGroup("prev")) {
              // Fallback: just close
              parentTrigger.click();
              parentTrigger.focus();
            }
          } else if (e.key === "Escape" && isGroupTrigger) {
            // Escape at root of grouped menu — close and clear highlight
            parentTrigger.click();
            parentTrigger.focus();
          } else {
            // Close the submenu by clicking the trigger (toggle)
            parentTrigger.click();
            parentTrigger.focus();
          }
        }
        break;
      }
    }
  });
};

// ── MenuContextProvider ────────────────────────────────────────────────────

const MenuContextProvider = component$(
  (props: { menuKey?: string; parentTriggerId?: string }) => {
    useStyles$(menuStyles);
    const store = useStore<MenuContextState>({
      menuKey: props.menuKey ?? "menu",
      activeId: "",
      itemIds: [],
      itemIndex: 0,
      parentTriggerId: props.parentTriggerId ?? "",
      isOpen: false,
    });
    useContextProvider(menuCtxId, store);
    return <Slot />;
  }
);

// ── Styles ─────────────────────────────────────────────────────────────────

const itemClass =
  "flex w-full items-center gap-1 p-0 cursor-pointer outline-none rounded px-1";
/** Shared primary color for selected/active menu items, triggers and subtriggers. */
const ACTIVE_BG = "#3b82f6";   // blue-500
const ACTIVE_COLOR = "#ffffff"; // white text on primary bg
const activeStyle = { background: ACTIVE_BG, color: ACTIVE_COLOR, borderRadius: "4px" };
const panelBgClass =
  "bg-surface-raised border border-separator-opaque px-2 py-1";
const panelClass =
  `z-50 w-72 max-w-[min(18rem,calc(100vw-2rem))] overflow-visible text-body text-label outline-none shadow-md rounded-md  ${panelBgClass}`;

// ── Root ───────────────────────────────────────────────────────────────────

const rootClass = "inline-block";
type MenuRootProps = PropsOf<typeof Popover.Root> & {
  menuKey?: string;
  _parentTriggerId?: string;
  /** Internal: index within a MenuGroup */
  _groupIndex?: number;
};

export const Root: FunctionComponent<MenuRootProps> = (props) => {
  const { menuKey, _parentTriggerId, _groupIndex, floating, ...rest } = props;
  return (
    <MenuContextProvider
      menuKey={menuKey ?? props.id?.toString() ?? "menu" + _groupIndex}
      parentTriggerId={_parentTriggerId}
    >
      <Popover.Root
        {...rest}
        floating={floating || "bottom-start"}
        class={[rootClass, rest.class].filter(Boolean).join(" ")}
      />
    </MenuContextProvider>
  );
};

// ── Trigger ────────────────────────────────────────────────────────────────
// Main trigger — registers as an item, highlights when selected.
// ArrowDown/Up/Enter/Space open the menu and move focus to the first/last item.

export const Trigger = component$((props: PropsOf<typeof Popover.Trigger>) => {
  const ctx = useMenuContext();
  const myId = useSignal("");

  useTask$(() => {
    const id = `${ctx.menuKey}-item-${ctx.itemIndex}`;
    ctx.itemIds = [...ctx.itemIds, id];
    ctx.itemIndex++;
    myId.value = id;
  });

  return (
    <Popover.Trigger
      {...props}
      id={myId.value || undefined}
      onPointerDown$={$((e: Event, el: HTMLElement) => {
        el.focus();
      })}
      onMouseUp$={$((e: Event, el: HTMLElement) => {
        el.focus();
      })}
      data-menu-group-trigger
      class={[itemClass, "q-menu-trigger", props.class].filter(Boolean).join(" ")}
      role="menuitem"
      aria-haspopup="menu"
      data-open={ctx.isOpen ? "" : undefined}
      onKeyDown$={$((e: KeyboardEvent) => {
        // ── ArrowLeft / ArrowRight for MenuGroup navigation ──────────
        const isInGroup = !!(e.target as HTMLElement)?.closest("[data-menu-group]");
        if (isInGroup && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
          e.stopPropagation();

          const groupEl = (e.target as HTMLElement).closest<HTMLElement>("[data-menu-group]")!;
          const triggers = Array.from(
            groupEl.querySelectorAll<HTMLElement>("[data-menu-group-trigger]")
          );
          const currentEl = (e.target as HTMLElement)?.closest("[data-menu-group-trigger]") as HTMLElement;
          const curIdx = triggers.indexOf(currentEl);
          if (curIdx === -1 || triggers.length < 2) return;

          const nextIdx = e.key === "ArrowRight"
            ? (curIdx + 1) % triggers.length
            : (curIdx - 1 + triggers.length) % triggers.length;
          const nextTrigger = triggers[nextIdx];

          const isOpen = currentEl.hasAttribute("data-open");

          if (isOpen) {
            currentEl.click();
            nextTrigger.focus();
            nextTrigger.click();
          } else {
            nextTrigger.focus();
          }
          return;
        }

        const trigger = (e.target as HTMLElement)?.closest("[role='menuitem']") as HTMLElement;

        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          trigger?.click();
          return;
        }

        if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
        e.preventDefault();
        e.stopPropagation();

        const isOpen = trigger?.hasAttribute("data-open");

        if (isOpen) {
          const menuPanel = document.querySelector<HTMLElement>(`[role='menu'][data-menu-key='${ctx.menuKey}']`);
          if (menuPanel) {
            const items = getMenuItems(menuPanel);
            if (items.length > 0) {
              const target = e.key === "ArrowUp" ? items[items.length - 1] : items[0];
              target.focus();
              ctx.activeId = target.id ?? "";
            }
          }
        } else {
          trigger?.click();

          const focusLast = e.key === "ArrowUp";
          const start = performance.now();
          const tryFocus = () => {
            const menuPanel = document.querySelector<HTMLElement>(`[role='menu'][data-menu-key='${ctx.menuKey}']`);
            if (menuPanel) {
              const rect = menuPanel.getBoundingClientRect();
              if (rect.width > 0 || rect.height > 0) {
                const items = getMenuItems(menuPanel);
                if (items.length > 0) {
                  const target = focusLast ? items[items.length - 1] : items[0];
                  target.focus();
                  ctx.activeId = target.id ?? "";
                  return;
                }
              }
            }
            if (performance.now() - start < 500) {
              setTimeout(tryFocus, 10);
            }
          };
          setTimeout(tryFocus, 10);
        }
      })}
    >
      <Slot />
    </Popover.Trigger>
  );
});

// ── Item ───────────────────────────────────────────────────────────────────

export const Item = component$((props: PropsOf<"button">) => {
  const ctx = useMenuContext();
  const myId = useSignal("");

  useTask$(() => {
    const id = `${ctx.menuKey}-item-${ctx.itemIndex}`;
    ctx.itemIds = [...ctx.itemIds, id];
    ctx.itemIndex++;
    myId.value = id;
  });

  return (
    <button
      {...props}
      id={myId.value || undefined}
      class={[itemClass, props.class].filter(Boolean).join(" ")}
      role="menuitem"
      tabIndex={-1}
      data-active={ctx.activeId === myId.value && myId.value !== "" ? "" : undefined}
      style={ctx.activeId === myId.value && myId.value !== "" ? activeStyle : undefined}
      onMouseOver$={$(() => {
        ctx.activeId = myId.value;
        document.getElementById(myId.value)?.focus();
        // Close open submenus in this panel
        const el = document.getElementById(myId.value);
        const panel = el?.closest("[role='menu']");
        if (panel) closeChildSubmenus(panel);
      })}
      onFocus$={$(() => {
        ctx.activeId = myId.value;
      })}
      onKeyDown$={makeKeyHandler(ctx)}
    >
      {props.children ?? <Slot />}
    </button>
  );
});

// ── Panel ──────────────────────────────────────────────────────────────────

export const Panel = component$((props: PropsOf<typeof Popover.Panel>) => {
  const ctx = useMenuContext();
  const merged = [panelClass, props.class].filter(Boolean).join(" ");

  return (
    <Popover.Panel
      {...props}
      // class={merged}
      role="menu"
      aria-orientation="vertical"
      data-menu-key={ctx.menuKey}
      onToggle$={$((e: Event) => {
        const ev = e as any;
        if (ev.newState) {
          ctx.isOpen = ev.newState === "open";
        }
      })}
      onMouseLeave$={$(() => {
        ctx.activeId = "";
      })}
    >
      <div class={merged}>
        <Slot />
      </div>
    </Popover.Panel>
  );
});

// ── SubMenu ────────────────────────────────────────────────────────────────

const SubMenu = component$((props: Omit<MenuRootProps, "_parentTriggerId">) => {
  const parentCtx = useMenuContext();
  const triggerIdPrefix = `${parentCtx.menuKey}-item-${parentCtx.itemIndex}`;
  const menuKey = `${parentCtx.menuKey}-sub${parentCtx.itemIndex}`;

  useContextProvider(parentMenuCtxId, parentCtx);

  return (
    <Root
      floating="right-start"
      {...props}
      class={["w-full", props.class].filter(Boolean).join(" ")}
      menuKey={menuKey}
      _parentTriggerId={triggerIdPrefix}
    >
      <Slot />
    </Root>
  );
});

// ── SubTrigger ─────────────────────────────────────────────────────────────

export const SubTrigger = component$(
  (props: PropsOf<typeof Popover.Trigger>) => {
    const pCtx = useContext(parentMenuCtxId);
    const myId = useSignal("");

    useTask$(() => {
      const id = `${pCtx.menuKey}-item-${pCtx.itemIndex}`;
      pCtx.itemIds = [...pCtx.itemIds, id];
      pCtx.itemIndex++;
      myId.value = id;
    });

    return (
      <Popover.Trigger
        {...props}
        id={myId.value || undefined}
        class={[itemClass, props.class].filter(Boolean).join(" ")}
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        data-active={pCtx.activeId === myId.value && myId.value !== "" ? "" : undefined}
        style={pCtx.activeId === myId.value && myId.value !== "" ? activeStyle : undefined}
        onMouseOver$={$(() => {
          pCtx.activeId = myId.value;
          document.getElementById(myId.value)?.focus();
        })}
        onFocus$={$(() => {
          pCtx.activeId = myId.value;
        })}
        onKeyDown$={makeKeyHandler(pCtx)}
      >
        <Slot />
      </Popover.Trigger>
    );
  }
);

// ── CheckBoxItem ───────────────────────────────────────────────────────────

export const CheckBoxItem = component$<PropsOf<"button"> & {
  value?: boolean;
  "bind:value"?: Signal<boolean>;
}>((props) => {
  const { value, "bind:value": bindValue, onClick$, ...rest } = props;
  const internalSignal = useSignal(value ?? false);
  const isChecked = bindValue || internalSignal;

  const handleClick$ = $(() => {
    isChecked.value = !isChecked.value;
  });

  return (
    <Item {...rest} onClick$={[handleClick$, onClick$]}>
      <MenuItem.Start>
        {isChecked.value ? <LuCheck /> : <div class="h-4 w-4" />}
      </MenuItem.Start>
      <Slot />
    </Item>
  );
});

// ── RadioGroup & RadioButton ───────────────────────────────────────────────

export const radioGroupCtxId = createContextId<{
  valueSig: Signal<string>;
}>("q.menu.radioGroup");

export const RadioGroup = component$<{
  value?: string;
  "bind:value"?: Signal<string>;
} & PropsOf<"div">>((props) => {
  const { value, "bind:value": bindValue, ...rest } = props;
  const internalSignal = useSignal(value ?? "");
  const valueSig = bindValue || internalSignal;
  useContextProvider(radioGroupCtxId, { valueSig });

  return (
    <div {...rest} role="group">
      <Slot />
    </div>
  );
});

export const RadioButton = component$<PropsOf<"button"> & {
  value: string;
}>((props) => {
  const { value, onClick$, ...rest } = props;
  const ctx = useContext(radioGroupCtxId);
  const isChecked = ctx.valueSig.value === value;

  const handleClick$ = $(() => {
    ctx.valueSig.value = value;
  });

  return (
    <Item {...rest} onClick$={[handleClick$, onClick$]} role="menuitemradio" aria-checked={isChecked}>
      <MenuItem.Start>
        {isChecked ? <LuCircleDot /> : <div class="h-4 w-4" />}
      </MenuItem.Start>
      <Slot />
    </Item>
  );
});

// ── MenuGroup ──────────────────────────────────────────────────────────────
// Container for multiple Menu.Root side by side. ArrowLeft/Right on Trigger
// switches (focus + open) between menus in this group.

type MenuGroupProps = PropsOf<"div"> & {
  /** Accessible label for the menubar group */
  "aria-label"?: string;
};

export const MenuGroup = component$<MenuGroupProps>((props) => {
  const { class: className, "aria-label": ariaLabel = "Menu group", ...rest } = props;
  const merged = [
    "flex items-center gap-2 p-0",
    panelBgClass,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      {...rest}
      role="menubar"
      aria-label={ariaLabel}
      class={merged}
      data-menu-group
    >
      <Slot />
    </div>
  );
});

// ── Separator ──────────────────────────────────────────────────────────────

export const Separator = component$<PropsOf<typeof BaseSeparator>>((props) => {
  return (
    <BaseSeparator
      orientation={props.orientation || "horizontal"}
      {...props}
      class={[
        props.orientation === "vertical"
          ? "w-px h-full mx-1"
          : "h-px w-full my-1",
        "!bg-separator-opaque opacity-50",
        props.class
      ].filter(Boolean).join(" ")}
    />
  );
});

// ── Group & Label ──────────────────────────────────────────────────────────

export const Group = component$<PropsOf<"div">>((props) => {
  return (
    <div {...props} role="group" class={["", props.class].filter(Boolean).join(" ")}>
      <Slot />
    </div>
  );
});

export const Label = component$<PropsOf<"div">>((props) => {
  return (
    <div
      {...props}
      class={[
        "px-2 py-1.5 text-sm font-semibold opacity-70",
        props.class,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Slot />
    </div>
  );
});

// ── Exports ────────────────────────────────────────────────────────────────

export const Menu = { Root, Trigger, SubTrigger, Panel, Item, SubMenu, MenuGroup, CheckBoxItem, RadioGroup, RadioButton, Separator, Group, Label, MenuItem };
export default Menu;
