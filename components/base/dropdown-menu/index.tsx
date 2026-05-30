/**
 * @component dropdown-menu
 * @title DropdownMenu
 * @version 1.4.0
 * @example Základní menu
 * Základní menu — viz ukázka níže.
 * ```tsx
 * import { DropdownMenu } from "~/components/ui/base/dropdown-menu";
 * 
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>Otevřít menu</DropdownMenu.Trigger>
 *   <DropdownMenu.Popover gutter={4}>
 *     <DropdownMenu.Item>Profil</DropdownMenu.Item>
 *     <DropdownMenu.Item>Nastavení</DropdownMenu.Item>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item>Odebrat</DropdownMenu.Item>
 *   </DropdownMenu.Popover>
 * </DropdownMenu.Root>
 * ```
 *
 * @example Skupiny a popisky
 * Skupiny a popisky — viz ukázka níže.
 * ```tsx
 * import { DropdownMenu } from "~/components/ui/base/dropdown-menu";
 * 
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>Účet</DropdownMenu.Trigger>
 *   <DropdownMenu.Popover gutter={4}>
 *     <DropdownMenu.Group>
 *       <DropdownMenu.Label>Můj účet</DropdownMenu.Label>
 *       <DropdownMenu.Item>Profil</DropdownMenu.Item>
 *       <DropdownMenu.Item>Fakturace</DropdownMenu.Item>
 *     </DropdownMenu.Group>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Group>
 *       <DropdownMenu.Label>Nebezpečná zóna</DropdownMenu.Label>
 *       <DropdownMenu.Item>Odhlásit se</DropdownMenu.Item>
 *     </DropdownMenu.Group>
 *   </DropdownMenu.Popover>
 * </DropdownMenu.Root>
 * ```
 *
 * @example Checkbox a radio
 * Pro vícenásobný výběr použij `CheckboxItem` s `bind:value` ; pro jednu hodnotu `RadioGroup` s `bind:value` a `RadioItem` .
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { DropdownMenu } from "~/components/ui/base/dropdown-menu";
 * 
 * export const MenuWithSelection = component$(() => {
 *   const notifications = useSignal(true);
 *   const theme = useSignal("system");
 * 
 *   return (
 *     <DropdownMenu.Root>
 *       <DropdownMenu.Trigger>Volby</DropdownMenu.Trigger>
 *       <DropdownMenu.Popover gutter={4}>
 *         <DropdownMenu.CheckboxItem bind:value={notifications}>
 *           Oznámení
 *         </DropdownMenu.CheckboxItem>
 *         <DropdownMenu.Separator />
 *         <DropdownMenu.RadioGroup bind:value={theme}>
 *           <DropdownMenu.RadioItem value="light">Světlý</DropdownMenu.RadioItem>
 *           <DropdownMenu.RadioItem value="dark">Tmavý</DropdownMenu.RadioItem>
 *           <DropdownMenu.RadioItem value="system">Systém</DropdownMenu.RadioItem>
 *         </DropdownMenu.RadioGroup>
 *       </DropdownMenu.Popover>
 *     </DropdownMenu.Root>
 *   );
 * });

 * ```
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
import { Popover as HeadlessPopover } from "@qwik-ui/headless";

/**
 * Vizuální layout řádku menu — kombinuj s interaktivním wrapperem
 * (např. `DropdownMenu.Item`). Skládá `Start`, `Label`, `End`.
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

/** Levá plocha pro ikonu nebo jinou vizuální indikaci. */
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

/** Hlavní text položky — roztahuje se do dostupného prostoru. */
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

/** Pravá plocha — typicky `KbdShortcut` nebo badge. */
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

/** Složené API pro vizuální layout: `MenuItem.Root`, `MenuItem.Start`, `MenuItem.Label`, `MenuItem.End`. */
export const MenuItem = {
  Root: MenuItemRoot,
  Start: MenuItemStart,
  Label: MenuItemLabel,
  End: MenuItemEnd,
};

import { LuCheck, LuCircleDot } from "@qwikest/icons/lucide";
import { Separator as BaseSeparator } from "../separator";
import {
  floatingMenuListPanelClass,
  floatingOutlineButtonTriggerClass,
} from "../utilities/floating-ui";

const dropdownStyles = `
  .q-dropdown-trigger:focus,
  .q-dropdown-trigger[aria-expanded="true"],
  .q-dropdown-trigger[data-state="open"],
  .q-dropdown-trigger[data-open] {
    background-color: #3b82f6 !important;
    color: #ffffff !important;
    border-radius: 4px;
    outline: none;
  }
`;

// ── Context type ───────────────────────────────────────────────────────────

export type DropdownContextState = {
  menuKey: string;
  activeId: string;
  itemIds: string[];
  itemIndex: number;
  isOpen: boolean;
};

const dropdownCtxId = createContextId<DropdownContextState>("q.dropdown");

export const useDropdownContext = () => useContext(dropdownCtxId);

// ── Keyboard handler factory ───────────────────────────────────────────────

const getMenuItems = (panel: Element): HTMLElement[] => {
  return Array.from(panel.querySelectorAll<HTMLElement>("[role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio']")).filter(
    (el) => el.closest("[role='menu']") === panel
  );
};

const makeKeyHandler = (ctx: DropdownContextState) => {
  return $((e: KeyboardEvent) => {
    const KEYS = [
      "ArrowUp", "ArrowDown",
      "Home", "End", "Enter", " ", "Escape",
    ];
    if (!KEYS.includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();

    const focusedEl = (e.target as HTMLElement)?.closest("[role^='menuitem']") as HTMLElement | null;
    if (!focusedEl) return;
    const panel = focusedEl.closest("[role='menu']");
    if (!panel) return;

    const items = getMenuItems(panel);
    const curIdx = items.indexOf(focusedEl);
    const len = items.length;
    if (len === 0) return;

    const focusItem = (index: number) => {
      const el = items[index];
      el?.focus();
      ctx.activeId = el?.id ?? "";
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
      case "Enter":
      case " ":
        focusedEl.click();
        break;
      case "Escape": {
        const currentPanel = focusedEl.closest("[role='menu']");
        if (!currentPanel) break;
        const wrapper = currentPanel.parentElement;
        const trigger = wrapper?.querySelector<HTMLElement>("[aria-haspopup='menu']");
        if (trigger) {
          trigger.click();
          trigger.focus();
        }
        break;
      }
    }
  });
};

// ── Components ─────────────────────────────────────────────────────────────

const itemClass = "flex w-full items-center gap-2 p-0 cursor-pointer outline-none rounded-sm px-2 py-1.5 text-callout text-label transition-colors";
const activeStyle = { background: "#3b82f6", color: "#ffffff", borderRadius: "4px" };
const panelClass = [floatingMenuListPanelClass, "z-50 min-w-32 overflow-visible text-body text-label outline-none"].join(" ");

export const DropdownMenuRoot = component$((props: PropsOf<typeof HeadlessPopover.Root> & { menuKey?: string }) => {
  const { menuKey, ...rest } = props;
  useStyles$(dropdownStyles);
  const store = useStore<DropdownContextState>({
    menuKey: menuKey ?? props.id?.toString() ?? "dropdown",
    activeId: "",
    itemIds: [],
    itemIndex: 0,
    isOpen: false,
  });
  useContextProvider(dropdownCtxId, store);
  return (
    <HeadlessPopover.Root {...rest} floating={rest.floating || "bottom-start"}>
      <Slot />
    </HeadlessPopover.Root>
  );
});

export const DropdownMenuTrigger = component$((props: PropsOf<typeof HeadlessPopover.Trigger>) => {
  const ctx = useDropdownContext();
  const myId = useSignal("");

  useTask$(() => {
    const id = `${ctx.menuKey}-trigger`;
    myId.value = id;
  });

  return (
    <HeadlessPopover.Trigger
      {...props}
      id={myId.value || undefined}
      class={[floatingOutlineButtonTriggerClass, "q-dropdown-trigger", props.class].filter(Boolean).join(" ")}
      aria-haspopup="menu"
      data-open={ctx.isOpen ? "" : undefined}
      onKeyDown$={$((e: KeyboardEvent) => {
        const trigger = (e.target as HTMLElement)?.closest("[aria-haspopup='menu']") as HTMLElement;
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
    </HeadlessPopover.Trigger>
  );
});

export const DropdownMenuPopover = component$((props: PropsOf<typeof HeadlessPopover.Panel>) => {
  const ctx = useDropdownContext();
  const merged = [panelClass, props.class].filter(Boolean).join(" ");

  return (
    <HeadlessPopover.Panel
      {...props}
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
    </HeadlessPopover.Panel>
  );
});

export const DropdownMenuItem = component$((props: PropsOf<"button">) => {
  const ctx = useDropdownContext();
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
      style={ctx.activeId === myId.value && myId.value !== "" ? activeStyle : undefined}
      onMouseOver$={$(() => {
        ctx.activeId = myId.value;
        document.getElementById(myId.value)?.focus();
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

export const DropdownMenuSeparator = component$((props: PropsOf<typeof BaseSeparator>) => (
  <BaseSeparator
    orientation="horizontal"
    {...props}
    class={["h-px w-full my-1 !bg-separator-opaque opacity-50", props.class].filter(Boolean).join(" ")}
  />
));

export const DropdownMenuGroup = component$((props: PropsOf<"div">) => (
  <div {...props} role="group" class={["py-0.5", props.class].filter(Boolean).join(" ")}>
    <Slot />
  </div>
));

export const DropdownMenuGroupLabel = component$((props: PropsOf<"div">) => (
  <div
    {...props}
    class={["px-2 py-1.5 text-caption-1 font-medium text-secondary-label", props.class].filter(Boolean).join(" ")}
  >
    <Slot />
  </div>
));

export const DropdownMenuCheckboxItem = component$<PropsOf<"button"> & {
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
    <DropdownMenuItem
      {...rest}
      role="menuitemcheckbox"
      aria-checked={isChecked.value}
      onClick$={[handleClick$, onClick$]}
    >
      <MenuItem.Start>
        {isChecked.value ? <LuCheck /> : <div class="h-4 w-4" />}
      </MenuItem.Start>
      <Slot />
    </DropdownMenuItem>
  );
});

export const radioGroupCtxId = createContextId<{
  valueSig: Signal<string>;
}>("q.dropdown.radioGroup");

export const DropdownMenuRadioGroup = component$<{
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

export const DropdownMenuRadioItem = component$<PropsOf<"button"> & {
  value: string;
}>((props) => {
  const { value, onClick$, ...rest } = props;
  const ctx = useContext(radioGroupCtxId);
  const isChecked = ctx.valueSig.value === value;

  const handleClick$ = $(() => {
    ctx.valueSig.value = value;
  });

  return (
    <DropdownMenuItem
      {...rest}
      role="menuitemradio"
      aria-checked={isChecked}
      onClick$={[handleClick$, onClick$]}
    >
      <MenuItem.Start>
        {isChecked ? <LuCircleDot /> : <div class="h-4 w-4" />}
      </MenuItem.Start>
      <Slot />
    </DropdownMenuItem>
  );
});

export const DropdownMenuItemIndicator = component$((props: PropsOf<"span">) => (
  <span
    {...props}
    class={["ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center text-label", props.class].filter(Boolean).join(" ")}
  >
    <Slot />
  </span>
));

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Popover: DropdownMenuPopover,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Group: DropdownMenuGroup,
  GroupLabel: DropdownMenuGroupLabel,
  Label: DropdownMenuGroupLabel,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  ItemIndicator: DropdownMenuItemIndicator,
  MenuItem,
};
