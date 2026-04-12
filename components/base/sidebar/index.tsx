/**
 * @component sidebar
 * @title Sidebar
 * @version 1.0.0
 * @example Základní skladba
 * `Provider` → `Root` (panel) + `Inset` (hlavní plocha). `Rail` je úzký klikací pruh na vnitřním kraji panelu (desktop) — zobrazí se ve sbaleném stavu a rozbalí panel; v příkladu je `defaultCollapsed`, aby byl `Rail` vidět. Ikony v `MenuIcon`: jednotný obal `h-8 w-8` + SVG `h-5 w-5`. V záhlaví `Sidebar.HeaderTitle` schová „Aplikace“ při sbalení (`md:sr-only`); `Sidebar.Header` při sbalení vycentruje řádek (`md:justify-center`).
 * ```tsx
 * import { Sidebar } from "~/components/ui/sidebar";
 * 
 * <Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
 *   <Sidebar.Root>
 *     <Sidebar.Rail />
 *     <Sidebar.Header class="flex flex-row items-center gap-2 border-b p-3">
 *       <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-accent/20 text-label">
 *         <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *           <rect x="3" y="3" width="7" height="7" rx="1.5" />
 *           <rect x="14" y="3" width="7" height="7" rx="1.5" />
 *           <rect x="3" y="14" width="7" height="7" rx="1.5" />
 *           <rect x="14" y="14" width="7" height="7" rx="1.5" />
 *         </svg>
 *       </span>
 *       <Sidebar.HeaderTitle>Aplikace</Sidebar.HeaderTitle>
 *     </Sidebar.Header>
 *     <Sidebar.Content>
 *       <Sidebar.Group>
 *         <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
 *         <Sidebar.GroupContent>
 *           <Sidebar.Menu>
 *             <Sidebar.MenuItem>
 *               <Sidebar.MenuButton active>
 *                 <Sidebar.MenuIcon>
 *                   <span class="flex h-8 w-8 shrink-0 items-center justify-center text-label [&_svg]:h-5 [&_svg]:w-5">
 *                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
 *                       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
 *                       <path d="M9 22V12h6v10" />
 *                     </svg>
 *                   </span>
 *                 </Sidebar.MenuIcon>
 *                 <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
 *               </Sidebar.MenuButton>
 *             </Sidebar.MenuItem>
 *             <Sidebar.MenuItem>
 *               <Sidebar.MenuButton>
 *                 <Sidebar.MenuIcon>
 *                   <span class="flex h-8 w-8 shrink-0 items-center justify-center text-label [&_svg]:h-5 [&_svg]:w-5">
 *                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
 *                       <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
 *                     </svg>
 *                   </span>
 *                 </Sidebar.MenuIcon>
 *                 <Sidebar.MenuLabel>Projekty</Sidebar.MenuLabel>
 *               </Sidebar.MenuButton>
 *             </Sidebar.MenuItem>
 *           </Sidebar.Menu>
 *         </Sidebar.GroupContent>
 *       </Sidebar.Group>
 *     </Sidebar.Content>
 *   </Sidebar.Root>
 *   <Sidebar.Inset>
 *     <header class="flex items-center gap-2 border-b p-3">
 *       <Sidebar.Trigger aria-label="Panel">☰</Sidebar.Trigger>
 *       <span class="text-callout font-medium text-label">Hlavní obsah</span>
 *     </header>
 *     <div class="p-4 text-body text-secondary-label">
 *       Klik na <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">Rail</code> u pravého okraje sbaleného panelu nebo na trigger rozbalí navigaci.
 *     </div>
 *   </Sidebar.Inset>
 * </Sidebar.Provider>
 * ```
 *
 * @example Výchozí sbalený stav
 * Prop `defaultCollapsed` na `Provider` — užitečné pro úzké panely s ikonami; popisky v `GroupLabel` jsou na desktopu ve sbaleném režimu skryté ( `sr-only`).
 * ```tsx
 * import { Sidebar } from "~/components/ui/sidebar";
 * 
 * <Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
 *   <Sidebar.Root>
 *     <Sidebar.Rail />
 *     <Sidebar.Header class="flex flex-row items-center gap-2 border-b p-3">
 *       <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-accent/20 text-label">
 *         <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *           <rect x="3" y="3" width="7" height="7" rx="1.5" />
 *           <rect x="14" y="3" width="7" height="7" rx="1.5" />
 *           <rect x="3" y="14" width="7" height="7" rx="1.5" />
 *           <rect x="14" y="14" width="7" height="7" rx="1.5" />
 *         </svg>
 *       </span>
 *       <Sidebar.HeaderTitle>Aplikace</Sidebar.HeaderTitle>
 *     </Sidebar.Header>
 *     <Sidebar.Content>
 *       <Sidebar.Group>
 *         <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
 *         <Sidebar.GroupContent>
 *           <Sidebar.Menu>
 *             <Sidebar.MenuItem>
 *               <Sidebar.MenuButton active>
 *                 <Sidebar.MenuIcon>
 *                   <span class="text-base leading-none">◉</span>
 *                 </Sidebar.MenuIcon>
 *                 <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
 *               </Sidebar.MenuButton>
 *             </Sidebar.MenuItem>
 *             <Sidebar.MenuItem>
 *               <Sidebar.MenuButton>
 *                 <Sidebar.MenuIcon>
 *                   <span class="text-base leading-none">◇</span>
 *                 </Sidebar.MenuIcon>
 *                 <Sidebar.MenuLabel>Projekty</Sidebar.MenuLabel>
 *               </Sidebar.MenuButton>
 *             </Sidebar.MenuItem>
 *             <Sidebar.MenuItem>
 *               <Sidebar.MenuButton>
 *                 <Sidebar.MenuIcon>
 *                   <span class="text-base leading-none">▤</span>
 *                 </Sidebar.MenuIcon>
 *                 <Sidebar.MenuLabel>Dokumenty</Sidebar.MenuLabel>
 *               </Sidebar.MenuButton>
 *             </Sidebar.MenuItem>
 *             <Sidebar.MenuItem>
 *               <Sidebar.MenuButton>
 *                 <Sidebar.MenuIcon>
 *                   <span class="text-base leading-none">⚙</span>
 *                 </Sidebar.MenuIcon>
 *                 <Sidebar.MenuLabel>Nastavení</Sidebar.MenuLabel>
 *               </Sidebar.MenuButton>
 *             </Sidebar.MenuItem>
 *           </Sidebar.Menu>
 *         </Sidebar.GroupContent>
 *       </Sidebar.Group>
 *     </Sidebar.Content>
 *   </Sidebar.Root>
 *   <Sidebar.Inset>
 *     <header class="flex items-center gap-2 border-b p-3">
 *       <Sidebar.Trigger aria-label="Panel">☰</Sidebar.Trigger>
 *       <span class="text-callout font-medium text-label">Hlavní obsah</span>
 *     </header>
 *     <div class="p-4 text-body text-secondary-label">
 *       Ve sbaleném režimu zůstávají vidět ikony; nápisy položek a skupiny jsou pro čtečky (`sr-only`), po rozbalení se zobrazí vedle ikon.
 *     </div>
 *   </Sidebar.Inset>
 * </Sidebar.Provider>
 * ```
 *
 * @example MenuIcon + MenuLabel + MenuAction
 * `Sidebar.MenuIcon` / `Sidebar.MenuLabel` — viz výše. Rozbalovací řádkové menu: `DropdownMenu.Root` + `DropdownMenu.Trigger variant="icon"` (tečky). `Sidebar.Trigger` v `Inset` přepíná sbalený panel na desktopu — ikona „sbalit postranní panel“ (šipka do panelu). V `DropdownMenu.Item` lze vložit ikonu + text (`text-label` na SVG).
 * ```tsx
 * import { DropdownMenu } from "~/components/ui/dropdown-menu";
 * import { Sidebar } from "~/components/ui/sidebar";
 *
 * <Sidebar.Provider class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
 *   <Sidebar.Root>
 *     <Sidebar.Rail />
 *     <Sidebar.Content>
 *       <Sidebar.Menu>
 *         <Sidebar.MenuItem>
 *           <Sidebar.MenuButton>
 *             <Sidebar.MenuIcon>
 *               <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill-accent/25 text-caption-1 font-semibold text-label">
 *                 AK
 *               </span>
 *             </Sidebar.MenuIcon>
 *             <Sidebar.MenuLabel>Anna Kovářová</Sidebar.MenuLabel>
 *           </Sidebar.MenuButton>
 *           <DropdownMenu.Root class="absolute right-1 top-1.5 z-20 inline-block md:[aside[data-collapsed]_&]:hidden">
 *             <DropdownMenu.Trigger variant="icon" aria-label="Akce kontaktu" data-q-sidebar-menu-action="">
 *               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="opacity-90">
 *                 <circle cx="12" cy="6" r="1.75" />
 *                 <circle cx="12" cy="12" r="1.75" />
 *                 <circle cx="12" cy="18" r="1.75" />
 *               </svg>
 *             </DropdownMenu.Trigger>
 *             <DropdownMenu.Popover gutter={4}>
 *               <DropdownMenu.Item>
 *                 <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *                   <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
 *                   <path d="m22 6-10 7L2 6" />
 *                 </svg>
 *                 Zpráva
 *               </DropdownMenu.Item>
 *               <DropdownMenu.Item>
 *                 <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *                   <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
 *                 </svg>
 *                 Upravit
 *               </DropdownMenu.Item>
 *               <DropdownMenu.Separator />
 *               <DropdownMenu.Item>
 *                 <svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *                   <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
 *                 </svg>
 *                 Odebrat
 *               </DropdownMenu.Item>
 *             </DropdownMenu.Popover>
 *           </DropdownMenu.Root>
 *         </Sidebar.MenuItem>
 *         <Sidebar.MenuItem>
 *           <Sidebar.MenuButton>
 *             <Sidebar.MenuIcon>
 *               <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill-secondary/40 text-caption-1 font-semibold text-label">
 *                 MP
 *               </span>
 *             </Sidebar.MenuIcon>
 *             <Sidebar.MenuLabel>Marek Procházka</Sidebar.MenuLabel>
 *           </Sidebar.MenuButton>
 *           <DropdownMenu.Root class="absolute right-1 top-1.5 z-20 inline-block md:[aside[data-collapsed]_&]:hidden">
 *             <DropdownMenu.Trigger variant="icon" aria-label="Akce kontaktu" data-q-sidebar-menu-action="">
 *               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="opacity-90">
 *                 <circle cx="12" cy="6" r="1.75" />
 *                 <circle cx="12" cy="12" r="1.75" />
 *                 <circle cx="12" cy="18" r="1.75" />
 *               </svg>
 *             </DropdownMenu.Trigger>
 *             <DropdownMenu.Popover gutter={4}>
 *               <DropdownMenu.Item>
 *                 <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *                   <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
 *                   <path d="m22 6-10 7L2 6" />
 *                 </svg>
 *                 Zpráva
 *               </DropdownMenu.Item>
 *               <DropdownMenu.Item>
 *                 <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *                   <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
 *                 </svg>
 *                 Upravit
 *               </DropdownMenu.Item>
 *               <DropdownMenu.Separator />
 *               <DropdownMenu.Item>
 *                 <svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *                   <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
 *                 </svg>
 *                 Odebrat
 *               </DropdownMenu.Item>
 *             </DropdownMenu.Popover>
 *           </DropdownMenu.Root>
 *         </Sidebar.MenuItem>
 *       </Sidebar.Menu>
 *     </Sidebar.Content>
 *   </Sidebar.Root>
 *   <Sidebar.Inset>
 *     <header class="flex items-center gap-2 border-b p-3">
 *       <Sidebar.Trigger aria-label="Sbalit nebo rozbalit postranní panel">
 *         <svg class="h-5 w-5 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
 *           <path d="m11 17-5-5 5-5" />
 *           <path d="m18 17-5-5 5-5" />
 *         </svg>
 *       </Sidebar.Trigger>
 *       <span class="text-callout font-medium text-label">Hlavní obsah</span>
 *     </header>
 *     <div class="p-4 text-body text-secondary-label">
 *       Oba řádky mají stejné <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">DropdownMenu</code> u položky; v záhlaví <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">Sidebar.Trigger</code> s ikonou pro přepnutí šířky panelu (desktop).
 *     </div>
 *   </Sidebar.Inset>
 * </Sidebar.Provider>
 * ```
 *
 * @example Sbalený panel: ikony nebo zkratka
 * Bez `Sidebar.MenuIcon` doplň na `Sidebar.MenuLabel` prop `abbrevSource`, nebo použij `Sidebar.MenuButton` s `itemLabel` (zkratka v avataru `rounded-md`).
 * ```tsx
 * import { Sidebar } from "~/components/ui/sidebar";
 *
 * <Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
 *   <Sidebar.Root>
 *     <Sidebar.Rail />
 *     <Sidebar.Content>
 *       <Sidebar.Menu>
 *         <Sidebar.MenuItem>
 *           <Sidebar.MenuButton>
 *             <Sidebar.MenuIcon>
 *               <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-secondary/30 text-caption-1 font-medium text-label">
 *                 P
 *               </span>
 *             </Sidebar.MenuIcon>
 *             <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
 *           </Sidebar.MenuButton>
 *         </Sidebar.MenuItem>
 *         <Sidebar.MenuItem>
 *           <Sidebar.MenuButton>
 *             <Sidebar.MenuLabel abbrevSource="Správa dokumentů">Správa dokumentů</Sidebar.MenuLabel>
 *           </Sidebar.MenuButton>
 *         </Sidebar.MenuItem>
 *         <Sidebar.MenuItem>
 *           <Sidebar.MenuButton itemLabel="Nastavení účtu" />
 *         </Sidebar.MenuItem>
 *       </Sidebar.Menu>
 *     </Sidebar.Content>
 *   </Sidebar.Root>
 *   <Sidebar.Inset>
 *     <header class="flex items-center gap-2 border-b p-3">
 *       <Sidebar.Trigger aria-label="Přepnout panel">☰</Sidebar.Trigger>
 *       <span class="text-callout font-medium text-label">Rozbalte triggerem — zkratky vs. plné názvy</span>
 *     </header>
 *     <div class="p-4 text-body text-secondary-label">
 *       Ve sbaleném stavu: vlastní ikona, zkratka z `abbrevSource`, nebo vygenerovaná z `itemLabel`.
 *     </div>
 *   </Sidebar.Inset>
 * </Sidebar.Provider>
 * ```
 *
 */

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
  useTask$,
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

export type SidebarMenuButtonContextValue = {
  hasMenuIcon: Signal<boolean>;
};

const sidebarMenuButtonContextId = createContextId<SidebarMenuButtonContextValue | undefined>(
  "q-ui-lib.sidebar-menu-button",
);

/** Zkratka pro „hraný“ avatar bez vlastní ikony (dvě slova → iniciály, jedno slovo → max. 2 znaky). */
export function sidebarLabelAbbrev(source: string): string {
  const t = source.trim();
  if (!t) return "";
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const c1 = Array.from(parts[0]!)[0] ?? "";
    const c2 = Array.from(parts[1]!)[0] ?? "";
    return `${c1}${c2}`.toUpperCase();
  }
  return Array.from(t)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

/** Stav sbaleného panelu a mobilního draweru — pouze uvnitř {@link SidebarProvider}. */
export function useSidebar(): SidebarContextValue {
  return useSidebarContext("useSidebar");
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

  /** Jeden DOM uzel sloupce (backdrop + aside), aby {@link SidebarProvider} flex měl jen [shell, inset] — fragment [backdrop, aside] jinak vytváří třetí „sloupec“ a obsah může překrývat odkazy. */
  const shell = [
    "relative z-[60] flex h-full min-h-0 shrink-0 flex-col border-separator-opaque bg-grouped-surface text-label",
    "transition-[width,transform,opacity] duration-200 ease-out",
    borderSide,
    widthMd,
    mobileWidth,
    "max-md:fixed max-md:top-0 max-md:z-[60] max-md:h-svh max-md:shadow-lg md:h-auto md:shadow-none",
    positionSide,
    mobileOpen ? slideOpen : slideClosed,
  ].join(" ");

  const asideMerged = ["relative flex min-h-0 min-w-0 flex-1 flex-col", className].filter(Boolean).join(" ");

  return (
    <div data-q-sidebar-shell="" class={shell}>
      <button
        type="button"
        class={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden="true"
        tabIndex={-1}
        onClick$={ctx.closeMobile$}
      />
      <aside data-q-sidebar="" data-side={side} data-collapsed={collapsed ? "" : undefined} {...rest} class={asideMerged}>
        <Slot />
      </aside>
    </div>
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
  const ctx = useSidebarContext("Sidebar.Header");
  const collapsed = ctx.collapsed.value;
  const { class: className, ...rest } = props;
  const merged = [
    "flex shrink-0 flex-col gap-2 border-b border-separator-opaque p-3",
    collapsed ? "md:justify-center" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div data-q-sidebar-header="" {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type SidebarHeaderTitleProps = PropsOf<"span">;

/**
 * Nadpis v {@link SidebarHeader} — při sbaleném panelu na desktopu se skryje (`sr-only`), zůstane vidět značka / ikona vlevo.
 */
export const SidebarHeaderTitle = component$<SidebarHeaderTitleProps>((props) => {
  const ctx = useSidebarContext("Sidebar.HeaderTitle");
  const collapsed = ctx.collapsed.value;
  const { class: className, ...rest } = props;
  const merged = [
    "min-w-0 text-callout font-medium text-label",
    collapsed ? "md:sr-only" : "truncate",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span data-q-sidebar-header-title="" {...rest} class={merged}>
      <Slot />
    </span>
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

export type SidebarMenuIconProps = PropsOf<"span">;

/**
 * Ikonová část tlačítka menu — vždy viditelná, i v sbaleném stavu.
 * Registruje přítomnost ikony u {@link SidebarMenuButton}; bez ní {@link SidebarMenuLabel} zobrazí zkratku v avataru.
 */
export const SidebarMenuIcon = component$<SidebarMenuIconProps>((props) => {
  const mb = useContext(sidebarMenuButtonContextId);
  useTask$(() => {
    if (mb?.hasMenuIcon) mb.hasMenuIcon.value = true;
  });
  const { class: className, ...rest } = props;
  const merged = ["shrink-0", className].filter(Boolean).join(" ");
  return (
    <span data-q-sidebar-menu-icon="" {...rest} class={merged}>
      <Slot />
    </span>
  );
});

export type SidebarMenuLabelProps = PropsOf<"span"> & {
  /**
   * Text pro zkrácený monogram ve sbaleném panelu (`md+`), pokud není {@link SidebarMenuIcon}.
   * Např. „Můj projekt“ → „MP“; jedno slovo → max. 2 znaky.
   */
  abbrevSource?: string;
};

/**
 * Textová část tlačítka menu — při sbalení na desktopu plný text jen pro AT (`sr-only`),
 * pokud chybí {@link SidebarMenuIcon}, viditelná je zkratka v „hraném“ avataru (`rounded-md`).
 */
export const SidebarMenuLabel = component$<SidebarMenuLabelProps>((props) => {
  const ctx = useSidebarContext("Sidebar.MenuLabel");
  const mb = useContext(sidebarMenuButtonContextId);
  const { class: className, abbrevSource = "", ...rest } = props;
  const collapsed = ctx.collapsed.value;
  const hasMenuIcon = mb?.hasMenuIcon.value ?? false;
  const showAbbrevAvatar = collapsed && !hasMenuIcon;
  const abbrev = sidebarLabelAbbrev(abbrevSource);

  /**
   * Ve sbaleném stavu: s {@link SidebarMenuIcon} nesmí label roztahovat řádek (`md:flex-none`).
   * Bez ikony (jen zkratka z `abbrevSource`) musí obal na `md+` vyplnit šířku tlačítka a vnitřně vycentrovat monogram —
   * jinak se vizuálně liší od řádků s ikonou v prvním slotu.
   */
  const outerClass = [
    "flex min-w-0 items-center gap-2",
    !collapsed
      ? "flex-1"
      : hasMenuIcon
        ? "flex-1 md:flex-none md:min-w-0 md:basis-0"
        : "flex-1 w-full gap-0 md:w-full md:flex-none md:justify-center md:gap-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const textClass = [collapsed ? "md:sr-only" : "truncate"].filter(Boolean).join(" ");

  return (
    <span data-q-sidebar-menu-label="" {...rest} class={outerClass}>
      {showAbbrevAvatar && (
        <span
          class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-secondary/30 text-caption-1 font-semibold uppercase leading-none text-label md:flex"
          aria-hidden="true"
        >
          {abbrev || "?"}
        </span>
      )}
      <span class={textClass}>
        <Slot />
      </span>
    </span>
  );
});

export type SidebarMenuButtonProps = PropsOf<"button"> & {
  /** Aktivní položka (např. aktuální route). */
  active?: boolean;
  /** Varianta vzhledu. */
  variant?: "default" | "outline";
  /**
   * Krátký label: vygeneruje {@link SidebarMenuIcon} (zkratka) + {@link SidebarMenuLabel} bez vlastních children.
   */
  itemLabel?: string;
};

/**
 * Tlačítko v menu; můžeš nahradit obsahem vlastní {@link https://qwik.builder.io/docs/components/link | Link} se stejnými třídami.
 */
export const SidebarMenuButton = component$<SidebarMenuButtonProps>((props) => {
  const ctx = useSidebarContext("Sidebar.MenuButton");
  const { active, variant = "default", itemLabel, class: className, ...rest } = props;
  const collapsed = ctx.collapsed.value;

  const hasMenuIcon = useSignal(false);
  useContextProvider(sidebarMenuButtonContextId, { hasMenuIcon });

  // fill-secondary (≈50% lightness) at 20%+ opacity is visible on white (light) and dark backgrounds.
  // data-[active]: selectors have higher CSS specificity than hover:, so active hover safely overrides.
  const variantClass =
    variant === "outline"
      ? "border border-separator-opaque bg-transparent shadow-sm hover:bg-fill-secondary/20 data-[active]:bg-fill-secondary/30 data-[active]:hover:bg-fill-secondary/40"
      : "hover:bg-fill-secondary/20 data-[active]:bg-fill-secondary/30 data-[active]:hover:bg-fill-secondary/40";

  const activeClass = active ? "font-medium text-label" : "text-label";

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
      {itemLabel !== undefined && itemLabel !== "" ? (
        <>
          <SidebarMenuIcon>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-secondary/30 text-caption-1 font-semibold uppercase leading-none text-label"
              aria-hidden="true"
            >
              {sidebarLabelAbbrev(itemLabel)}
            </span>
          </SidebarMenuIcon>
          <SidebarMenuLabel>{itemLabel}</SidebarMenuLabel>
        </>
      ) : (
        <Slot />
      )}
    </button>
  );
});

export type SidebarMenuActionProps = PropsOf<"button">;

/** Vedlejší akce u položky menu (např. „⋯“), zarovnaná vpravo. Ve sbaleném panelu na desktopu skrytá. */
export const SidebarMenuAction = component$<SidebarMenuActionProps>((props) => {
  const ctx = useSidebarContext("Sidebar.MenuAction");
  const collapsed = ctx.collapsed.value;
  const { class: className, ...rest } = props;
  const merged = [
    "absolute right-1 top-1.5 z-10 flex aspect-square w-7 items-center justify-center rounded-md p-0 text-secondary-label",
    "hover:bg-fill-secondary/10 hover:text-label",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    collapsed ? "md:hidden" : "",
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
 * Postranní navigace — layout kompozice (bez @qwik-ui/headless modulu; viz BASE_COMPONENTS.md), tokeny dle COLORS.md.
 * Mobilní režim: overlay + drawer; desktop: flex vedle {@link SidebarInset}.
 */
export const Sidebar = {
  Provider: SidebarProvider,
  /** Stejné jako {@link sidebarLabelAbbrev} — zkratky pro sbalený panel. */
  labelAbbrev: sidebarLabelAbbrev,
  Root: SidebarRoot,
  Inset: SidebarInset,
  Header: SidebarHeader,
  HeaderTitle: SidebarHeaderTitle,
  Footer: SidebarFooter,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupContent: SidebarGroupContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuIcon: SidebarMenuIcon,
  MenuLabel: SidebarMenuLabel,
  MenuAction: SidebarMenuAction,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
};
