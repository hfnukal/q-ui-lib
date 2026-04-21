/**
 * @component dashboard
 * @title Dashboard
 * @version 1.0.0
 * @example Základ — layout + dlaždice
 * `Screen` omezí výšku v náhledu; `Dashboard.Root` rozloží postranní panel a hlavní sloupec. `Sidebar` má vestavěný `q:slot="sidebar"`. `Content` používá `ScrollArea.Pane`; `Tiles` obaluje `Grid` s rozumnou mřížkou pro metriky.
 * ```tsx
 * import { Badge } from "~/components/ui/badge";
 * import { Button } from "~/components/ui/button";
 * import { Card } from "~/components/ui/card";
 * import { Dashboard } from "~/components/ui/dashboard";
 * import { Screen } from "~/components/ui/screen";
 * import { Stack } from "~/components/ui/stack";
 *
 * <Screen class="max-h-[28rem] bg-background">
 *   <Dashboard.Root>
 *     <Dashboard.Sidebar>
 *       <Stack direction="column" gap={3} class="text-callout text-label">
 *         <span class="font-semibold">Navigace</span>
 *         <Button variant="secondary" size="sm" class="justify-start">
 *           Přehled
 *         </Button>
 *         <Button variant="secondary" size="sm" class="justify-start border-0 bg-transparent shadow-none hover:bg-fill-secondary/50">
 *           Reporty
 *         </Button>
 *       </Stack>
 *     </Dashboard.Sidebar>
 *     <Dashboard.Main>
 *       <Dashboard.Header>
 *         <Stack direction="row" gap={2} align="center" justify="between" class="w-full">
 *           <span class="text-callout font-medium text-label">Přehled</span>
 *           <Badge variant="secondary">Beta</Badge>
 *         </Stack>
 *       </Dashboard.Header>
 *       <Dashboard.Content viewportClass="p-4" keepScroll keepScrollId="dashboard-demo">
 *         <Stack direction="column" gap={4} class="pb-4">
 *           <Dashboard.Tiles columnsClass="grid-cols-1 sm:grid-cols-3" gap={3}>
 *             <Card.Root class="min-h-[5.5rem]">
 *               <Card.Content class="pt-4">
 *                 <p class="text-caption-1 text-secondary-label">Návštěvy</p>
 *                 <p class="text-title-2 font-semibold text-label">12,4k</p>
 *               </Card.Content>
 *             </Card.Root>
 *             <Card.Root class="min-h-[5.5rem]">
 *               <Card.Content class="pt-4">
 *                 <p class="text-caption-1 text-secondary-label">Konverze</p>
 *                 <p class="text-title-2 font-semibold text-label">3,2 %</p>
 *               </Card.Content>
 *             </Card.Root>
 *             <Card.Root class="min-h-[5.5rem]">
 *               <Card.Content class="pt-4">
 *                 <p class="text-caption-1 text-secondary-label">Čeká</p>
 *                 <p class="text-title-2 font-semibold text-label">18</p>
 *               </Card.Content>
 *             </Card.Root>
 *           </Dashboard.Tiles>
 *           <Card.Root>
 *             <Card.Header>
 *               <Card.Title>Aktivita</Card.Title>
 *               <Card.Description>Poslední záznamy v systému.</Card.Description>
 *             </Card.Header>
 *             <Card.Content>
 *               <p class="text-body text-secondary-label">
 *                 Scrollovatelný obsah — přidejte další odstavce, aby byl posuv vidět.
 *               </p>
 *             </Card.Content>
 *           </Card.Root>
 *         </Stack>
 *       </Dashboard.Content>
 *     </Dashboard.Main>
 *   </Dashboard.Root>
 * </Screen>
 * ```
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Grid, type GridProps } from "../grid";
import { ScrollArea, type ScrollAreaPaneProps } from "../scroll-area";

export type DashboardRootProps = Omit<PropsOf<"div">, "class"> & {
  class?: string;
};

/**
 * Kořen rozložení: řádek s pojmenovaným slotem `sidebar` a hlavním sloupcem ( `Main` + výchozí slot ).
 * Obvykle uvnitř {@link Screen} nebo kontejneru s `flex flex-1 min-h-0`.
 */
export const DashboardRoot = component$<DashboardRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden bg-background";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot name="sidebar" />
      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Slot />
      </div>
    </div>
  );
});

export type DashboardSidebarProps = Omit<PropsOf<"aside">, "class"> & {
  /** Např. `w-56`, `w-72` — výchozí `w-64`. */
  widthClass?: string;
  class?: string;
};

/**
 * Levý panel — kořen má `q:slot="sidebar"` pro vložení do {@link DashboardRoot}.
 * Vnitřní scroll přes `ScrollArea` (dlouhá navigace).
 */
export const DashboardSidebar = component$<DashboardSidebarProps>((props) => {
  const { class: className, widthClass = "w-64", ...rest } = props;
  const base = [
    "flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-separator-opaque bg-surface-raised",
    widthClass,
  ]
    .filter(Boolean)
    .join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <aside {...rest} q:slot="sidebar" class={merged}>
      <ScrollArea.Pane
        class="min-h-0 flex-1"
        viewportClass="p-3"
        direction="vertical"
      >
        <Slot />
      </ScrollArea.Pane>
    </aside>
  );
});

export type DashboardMainProps = Omit<PropsOf<"div">, "class"> & {
  class?: string;
};

/** Pravý sloupec: pod sebou `Header` a `Content`. */
export const DashboardMain = component$<DashboardMainProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type DashboardHeaderProps = Omit<PropsOf<"header">, "class"> & {
  class?: string;
};

/** Horní lišta hlavní oblasti — `shrink-0`, tokenový okraj a pozadí. */
export const DashboardHeader = component$<DashboardHeaderProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "shrink-0 border-b border-separator-opaque bg-surface-overlay px-4 py-3";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <header {...rest} class={merged}>
      <Slot />
    </header>
  );
});

export type DashboardContentProps = ScrollAreaPaneProps;

/**
 * Hlavní scrollovatelná plocha — deleguje na {@link ScrollArea.Pane} (`flex-1`, výchozí svislý scroll).
 */
export const DashboardContent = component$<DashboardContentProps>((props) => {
  const {
    class: rootClass,
    viewportClass,
    direction = "vertical",
    ...rest
  } = props;
  const rootBase = "min-h-0 flex-1";
  const mergedRoot = [rootBase, rootClass].filter(Boolean).join(" ");

  return (
    <ScrollArea.Pane
      {...rest}
      class={mergedRoot}
      viewportClass={viewportClass}
      direction={direction}
    >
      <Slot />
    </ScrollArea.Pane>
  );
});

export type DashboardTilesProps = GridProps;

/**
 * Mřížka pro metriky / karty — výchozí `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` a `gap-4`.
 * Předává se na {@link Grid}.
 */
export const DashboardTiles = component$<DashboardTilesProps>((props) => {
  const {
    columnsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    gap = 4,
    class: className,
    ...rest
  } = props;
  const merged = [className].filter(Boolean).join(" ");

  return (
    <Grid {...rest} columnsClass={columnsClass} gap={gap} class={merged} />
  );
});

/** Namespace: `Dashboard.Root`, `Dashboard.Sidebar`, `Dashboard.Main`, … */
export const Dashboard = {
  Root: DashboardRoot,
  Sidebar: DashboardSidebar,
  Main: DashboardMain,
  Header: DashboardHeader,
  Content: DashboardContent,
  Tiles: DashboardTiles,
};
