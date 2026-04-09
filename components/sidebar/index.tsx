import {
  $,
  component$,
  createContextId,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";

export interface SidebarContextValue {
  collapsed: Signal<boolean>;
  mobileOpen: Signal<boolean>;
  toggleCollapsed$: QRL<() => void>;
  openMobile$: QRL<() => void>;
  closeMobile$: QRL<() => void>;
  toggleMobile$: QRL<() => void>;
}

const sidebarContextId = createContextId<SidebarContextValue | undefined>("q-ui-lib.sidebar");

export type SidebarProviderProps = PropsOf<"div"> & {
  /** Výchozí stav „ikonového“ zúžení postranního panelu (desktop). */
  defaultCollapsed?: boolean;
};

/**
 * Obal aplikace / layoutu — drží stav sbaleného panelu a mobilního draweru.
 * Musí obepínat {@link SidebarRoot} a {@link SidebarInset}.
 */
export const SidebarProvider = component$<SidebarProviderProps>((props) => {
  const { defaultCollapsed = false, class: className, ...rest } = props;
  const collapsed = useSignal(defaultCollapsed);
  const mobileOpen = useSignal(false);

  useContextProvider(sidebarContextId, {
    collapsed,
    mobileOpen,
    toggleCollapsed$: $(() => {
      collapsed.value = !collapsed.value;
    }),
    openMobile$: $(() => {
      mobileOpen.value = true;
    }),
    closeMobile$: $(() => {
      mobileOpen.value = false;
    }),
    toggleMobile$: $(() => {
      mobileOpen.value = !mobileOpen.value;
    }),
  });

  const merged = [
    "group/sidebar-wrapper flex min-h-0 w-full flex-1 flex-col md:flex-row",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-q-sidebar-provider="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

function useSidebarContext(component: string): SidebarContextValue {
  const ctx = useContext(sidebarContextId);
  if (!ctx) {
    throw new Error(`${component} musí být uvnitř <Sidebar.Provider>.`);
  }
  return ctx;
}

export type SidebarRootProps = PropsOf<"aside"> & {
  /** Strana panelu (výchozí `left`). */
  side?: "left" | "right";
};

/**
 * Hlavní postranní panel — šířka podle `collapsed`, na `max-md` jako fixed drawer přes {@link SidebarProvider}.
 */
export const SidebarRoot = component$<SidebarRootProps>((props) => {
  const ctx = useSidebarContext("Sidebar.Root");
  const { side = "left", class: className, ...rest } = props;
  const collapsed = ctx.collapsed.value;
  const mobileOpen = ctx.mobileOpen.value;

  const borderSide = side === "left" ? "border-r" : "border-l";
  const positionSide = side === "left" ? "left-0" : "right-0";
  const slideClosed =
    side === "left"
      ? "max-md:-translate-x-full max-md:opacity-0 max-md:pointer-events-none"
      : "max-md:translate-x-full max-md:opacity-0 max-md:pointer-events-none";
  const slideOpen = "max-md:translate-x-0 max-md:opacity-100";

  const widthMd = collapsed ? "md:w-14" : "md:w-64";
  const mobileWidth = "max-md:w-[min(18rem,100vw-2rem)]";

  const base = [
    "relative z-50 flex h-full min-h-0 shrink-0 flex-col border-separator-opaque bg-grouped-surface text-label",
    "transition-[width,transform,opacity] duration-200 ease-out",
    borderSide,
    widthMd,
    mobileWidth,
    "max-md:fixed max-md:top-0 max-md:z-50 max-md:h-svh max-md:shadow-lg md:h-auto md:shadow-none",
    positionSide,
    mobileOpen ? slideOpen : slideClosed,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        type="button"
        class={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:pointer-events-none md:opacity-0",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden="true"
        tabIndex={-1}
        onClick$={ctx.closeMobile$}
      />
      <aside data-q-sidebar="" data-side={side} data-collapsed={collapsed ? "" : undefined} {...rest} class={base}>
        <Slot />
      </aside>
    </>
  );
});

export type SidebarInsetProps = PropsOf<"main">;

/** Hlavní obsah vedle panelu — `min-w-0` kvůli flex overflow. */
export const SidebarInset = component$<SidebarInsetProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["flex min-h-0 min-w-0 flex-1 flex-col bg-background", className].filter(Boolean).join(" ");
  return (
    <main data-q-sidebar-inset="" {...rest} class={merged}>
      <Slot />
    </main>
  );
});

export type SidebarHeaderProps = PropsOf<"div">;

export const SidebarHeader = component$<SidebarHeaderProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["flex shrink-0 flex-col gap-2 border-b border-separator-opaque p-3", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div data-q-sidebar-header="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SidebarFooterProps = PropsOf<"div">;

export const SidebarFooter = component$<SidebarFooterProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["mt-auto flex shrink-0 flex-col gap-2 border-t border-separator-opaque p-3", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div data-q-sidebar-footer="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SidebarContentProps = PropsOf<"div">;

/** Rolovatelný prostředek mezi hlavičkou a patičkou. */
export const SidebarContent = component$<SidebarContentProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div data-q-sidebar-content="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SidebarGroupProps = PropsOf<"div">;

export const SidebarGroup = component$<SidebarGroupProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["relative flex w-full min-w-0 flex-col py-2", className].filter(Boolean).join(" ");
  return (
    <div data-q-sidebar-group="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SidebarGroupLabelProps = PropsOf<"div">;

/** Při sbaleném panelu na desktopu je skrytý (zůstane čitelný pro SR přes `sr-only` pokud doplníš). */
export const SidebarGroupLabel = component$<SidebarGroupLabelProps>((props) => {
  const ctx = useSidebarContext("Sidebar.GroupLabel");
  const { class: className, ...rest } = props;
  const hideWhenCollapsed = ctx.collapsed.value ? "md:sr-only" : "";
  const merged = [
    "flex h-8 shrink-0 items-center rounded-md px-2 text-caption-1 font-medium text-secondary-label",
    hideWhenCollapsed,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div data-q-sidebar-group-label="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SidebarGroupContentProps = PropsOf<"div">;

export const SidebarGroupContent = component$<SidebarGroupContentProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["w-full min-w-0", className].filter(Boolean).join(" ");
  return (
    <div data-q-sidebar-group-content="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SidebarMenuProps = PropsOf<"ul">;

export const SidebarMenu = component$<SidebarMenuProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["flex w-full min-w-0 flex-col gap-0.5 p-0 list-none", className].filter(Boolean).join(" ");
  return (
    <ul data-q-sidebar-menu="" {...rest} class={merged}>
      <Slot />
    </ul>
  );
});

export type SidebarMenuItemProps = PropsOf<"li">;

export const SidebarMenuItem = component$<SidebarMenuItemProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["relative", className].filter(Boolean).join(" ");
  return (
    <li data-q-sidebar-menu-item="" {...rest} class={merged}>
      <Slot />
    </li>
  );
});

export type SidebarMenuButtonProps = PropsOf<"button"> & {
  /** Aktivní položka (např. aktuální route). */
  active?: boolean;
  /** Varianta vzhledu. */
  variant?: "default" | "outline";
};

/**
 * Tlačítko v menu; můžeš nahradit obsahem vlastní {@link https://qwik.builder.io/docs/components/link | Link} se stejnými třídami.
 */
export const SidebarMenuButton = component$<SidebarMenuButtonProps>((props) => {
  const ctx = useSidebarContext("Sidebar.MenuButton");
  const { active, variant = "default", class: className, ...rest } = props;
  const collapsed = ctx.collapsed.value;

  const variantClass =
    variant === "outline"
      ? "border border-separator-opaque bg-transparent shadow-sm hover:bg-surface-overlay hover:text-label"
      : "hover:bg-surface-overlay hover:text-label";

  const activeClass = active ? "bg-fill-secondary font-medium text-label" : "text-label";

  const merged = [
    "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-callout transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-grouped-surface",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClass,
    activeClass,
    collapsed ? "md:justify-center md:gap-0 md:px-0" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" data-active={active ? "" : undefined} data-q-sidebar-menu-button="" {...rest} class={merged}>
      <Slot />
    </button>
  );
});

export type SidebarMenuActionProps = PropsOf<"button">;

/** Vedlejší akce u položky menu (např. „⋯“), zarovnaná vpravo. */
export const SidebarMenuAction = component$<SidebarMenuActionProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = [
    "absolute right-1 top-1.5 flex aspect-square w-7 items-center justify-center rounded-md p-0 text-secondary-label",
    "hover:bg-surface-overlay hover:text-label",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" data-q-sidebar-menu-action="" {...rest} class={merged}>
      <Slot />
    </button>
  );
});

export type SidebarSeparatorProps = PropsOf<"div">;

export const SidebarSeparator = component$<SidebarSeparatorProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["mx-2 h-px shrink-0 bg-separator-opaque", className].filter(Boolean).join(" ");
  return <div data-q-sidebar-separator="" role="separator" {...rest} class={merged} />;
});

export type SidebarTriggerProps = PropsOf<"button">;

/** Otevře / zavře mobilní drawer; na `md+` přepíná sbalený stav (stejné jako {@link SidebarRail}). */
export const SidebarTrigger = component$<SidebarTriggerProps>((props) => {
  const ctx = useSidebarContext("Sidebar.Trigger");
  const { class: className, onClick$, ...rest } = props;
  const merged = [
    "inline-flex size-9 items-center justify-center rounded-md border border-separator-opaque bg-surface-raised text-label shadow-sm",
    "hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      data-q-sidebar-trigger=""
      {...rest}
      class={merged}
      aria-label="Přepnout postranní panel"
      onClick$={
        onClick$
          ? [
              $(() => {
                if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
                  ctx.toggleCollapsed$();
                } else {
                  ctx.toggleMobile$();
                }
              }),
              onClick$,
            ]
          : $(() => {
              if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
                ctx.toggleCollapsed$();
              } else {
                ctx.toggleMobile$();
              }
            })
      }
    >
      <Slot />
    </button>
  );
});

export type SidebarRailProps = PropsOf<"button">;

/**
 * Úzký pruh na vnitřním kraji panelu (u `side="left"` vpravo od panelu) — klik rozbalí sbalený panel (desktop).
 */
export const SidebarRail = component$<SidebarRailProps>((props) => {
  const ctx = useSidebarContext("Sidebar.Rail");
  const { class: className, ...rest } = props;
  const collapsed = ctx.collapsed.value;

  if (!collapsed) {
    return <span class="hidden" aria-hidden="true" />;
  }

  const merged = [
    "absolute inset-y-0 right-0 z-20 hidden w-3 translate-x-1/2 cursor-pointer rounded-sm border-0 bg-transparent p-0 transition-colors md:block",
    "hover:bg-fill-secondary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      data-q-sidebar-rail=""
      aria-label="Rozbalit postranní panel"
      {...rest}
      class={merged}
      onClick$={ctx.toggleCollapsed$}
    />
  );
});

/**
 * Postranní navigace — layout kompozice (SHADCN.md: bez headless modulu), tokeny dle COLORS.md.
 * Mobilní režim: overlay + drawer; desktop: flex vedle {@link SidebarInset}.
 */
export const Sidebar = {
  Provider: SidebarProvider,
  Root: SidebarRoot,
  Inset: SidebarInset,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupContent: SidebarGroupContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuAction: SidebarMenuAction,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
};
