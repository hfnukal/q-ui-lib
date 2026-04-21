/**
 * @component navigation-menu
 * @title NavigationMenu
 * @version 1.0.0
 * @example Základní složení
 * `Item value` je potřeba u dvojice `Trigger` + `Content`. Přímé odkazy použij `Link`.
 * ```tsx
 * import { NavigationMenu } from "~/components/ui/navigation-menu";
 * 
 * <NavigationMenu.Root class="justify-start">
 *   <NavigationMenu.List>
 *     <NavigationMenu.Item value="produkty">
 *       <NavigationMenu.Trigger>Produkty</NavigationMenu.Trigger>
 *       <NavigationMenu.Content>
 *         <ul class="grid min-w-[200px] gap-1 p-1">
 *           <li>
 *             <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
 *               Knihovna
 *             </a>
 *           </li>
 *           <li>
 *             <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
 *               Šablony
 *             </a>
 *           </li>
 *         </ul>
 *       </NavigationMenu.Content>
 *     </NavigationMenu.Item>
 *     <NavigationMenu.Item>
 *       <NavigationMenu.Link href="#">Ceník</NavigationMenu.Link>
 *     </NavigationMenu.Item>
 *   </NavigationMenu.List>
 * </NavigationMenu.Root>
 * ```
 *
 * @example Oddělovač v liště
 * Oddělovač mezi položkami vodorovné lišty — `NavigationMenu.Separator`.
 * ```tsx
 * import { NavigationMenu } from "~/components/ui/navigation-menu";
 * 
 * <NavigationMenu.Root>
 *   <NavigationMenu.List>
 *     <NavigationMenu.Item value="dokumentace">
 *       <NavigationMenu.Trigger>Dokumentace</NavigationMenu.Trigger>
 *       <NavigationMenu.Content>
 *         <p class="px-2 py-1 text-caption-1 text-secondary-label">Začínáme</p>
 *         <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
 *           Úvod
 *         </a>
 *       </NavigationMenu.Content>
 *     </NavigationMenu.Item>
 *     <NavigationMenu.Separator />
 *     <NavigationMenu.Item>
 *       <NavigationMenu.Link href="#">Blog</NavigationMenu.Link>
 *     </NavigationMenu.Item>
 *   </NavigationMenu.List>
 * </NavigationMenu.Root>
 * ```
 *
 * @example Vlastní vzhled a barvy
 * Hlavní řádek: „Více“ s `contentAlign="start"` (panel pod levým okrajem triggeru). Pod tím další lišty — **kompaktní** velikost vs. **větší**, palety **teal** / **oranžová** / **fialová** (tokeny z COLORS).
 * ```tsx
 * import { NavigationMenu } from "~/components/ui/navigation-menu";
 *
 * <div class="flex flex-col gap-6 overflow-visible">
 *   <div class="flex flex-wrap items-center gap-3 rounded-xl border border-system-indigo/30 bg-system-indigo/10 px-3 py-2 shadow-sm">
 *     <div class="flex items-center gap-2">
 *       <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-system-indigo/25 text-callout font-semibold text-system-indigo">
 *         Q
 *       </span>
 *       <div class="flex flex-col gap-0.5">
 *         <span class="text-caption-1 font-medium text-label">Nástroje</span>
 *         <span class="inline-flex w-max items-center rounded-full bg-system-green/20 px-2 py-px text-caption-2 text-system-green">
 *           beta
 *         </span>
 *       </div>
 *     </div>
 *     <NavigationMenu.Root class="min-w-0 flex-1 justify-end overflow-visible">
 *       <NavigationMenu.List>
 *         <NavigationMenu.Item value="vice-hlavni">
 *           <NavigationMenu.Trigger class="rounded-lg text-system-indigo hover:bg-system-indigo/20 focus-visible:ring-system-indigo data-[state=open]:bg-system-indigo/25">
 *             Více
 *           </NavigationMenu.Trigger>
 *           <NavigationMenu.Content
 *             contentAlign="start"
 *             class="!mt-2 !overflow-y-auto w-[min(100vw-1.5rem,22rem)] max-h-[min(70vh,32rem)] rounded-xl border border-system-teal/35 bg-grouped-surface p-0 shadow-xl ring-offset-grouped-background"
 *           >
 *             <div class="border-b border-separator-opaque px-3 py-2">
 *               <div class="flex items-center justify-between gap-2">
 *                 <p class="text-caption-1 font-medium text-label">Rychlé akce</p>
 *                 <span class="rounded-md bg-system-orange/15 px-1.5 py-0.5 text-caption-2 text-system-orange">3 nové</span>
 *               </div>
 *               <p class="mt-1 text-caption-2 text-secondary-label">Popup se zarovnává `start` — levý okraj pod levým okrajem „Více“.</p>
 *             </div>
 *             <div class="grid gap-2 p-3 sm:grid-cols-2">
 *               <a
 *                 class="rounded-lg border border-separator bg-surface-raised p-3 text-callout text-label transition hover:border-system-teal/50 hover:bg-fill-secondary/30"
 *                 href="#"
 *               >
 *                 <span class="block font-medium">Průvodce</span>
 *                 <span class="mt-1 block text-caption-2 text-secondary-label">Interaktivní úvod</span>
 *               </a>
 *               <a
 *                 class="rounded-lg border border-separator bg-surface-raised p-3 text-callout text-label transition hover:border-system-teal/50 hover:bg-fill-secondary/30"
 *                 href="#"
 *               >
 *                 <span class="block font-medium">Šablony</span>
 *                 <span class="mt-1 block text-caption-2 text-secondary-label">Začni z příkladu</span>
 *               </a>
 *             </div>
 *             <div class="h-px bg-separator-opaque" role="presentation" />
 *             <ul class="p-2">
 *               <li>
 *                 <a class="block rounded-md px-2 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
 *                   Dokumentace
 *                 </a>
 *               </li>
 *               <li>
 *                 <a class="block rounded-md px-2 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
 *                   Podpora
 *                 </a>
 *               </li>
 *             </ul>
 *           </NavigationMenu.Content>
 *         </NavigationMenu.Item>
 *         <NavigationMenu.Separator />
 *         <NavigationMenu.Item>
 *           <NavigationMenu.Link class="rounded-lg text-system-indigo no-underline hover:bg-system-indigo/20" href="#">
 *             Přehled
 *           </NavigationMenu.Link>
 *         </NavigationMenu.Item>
 *       </NavigationMenu.List>
 *     </NavigationMenu.Root>
 *   </div>
 *
 *   <div class="space-y-3">
 *     <p class="text-caption-1 font-medium text-label">Další lišty — velikosti a barvy</p>
 *     <div class="flex flex-col gap-4 overflow-visible">
 *       <div>
 *         <p class="mb-1.5 text-caption-2 text-tertiary-label">Kompaktní (menší trigger i panel)</p>
 *         <div class="inline-flex max-w-full overflow-visible rounded-md border border-separator-opaque bg-surface-raised px-1.5 py-1">
 *           <NavigationMenu.Root class="justify-start">
 *             <NavigationMenu.List>
 *               <NavigationMenu.Item value="vice-kompakt">
 *                 <NavigationMenu.Trigger class="h-8 rounded-md px-2 text-caption-1 text-secondary-label hover:bg-fill-secondary/40">
 *                   Více
 *                 </NavigationMenu.Trigger>
 *                 <NavigationMenu.Content contentAlign="start" class="!mt-1.5 min-w-[10rem] max-w-[16rem] p-1.5 text-caption-2">
 *                   <a class="block rounded px-2 py-1.5 text-label hover:bg-surface-overlay" href="#">
 *                     Položka A
 *                   </a>
 *                   <a class="block rounded px-2 py-1.5 text-label hover:bg-surface-overlay" href="#">
 *                     Položka B
 *                   </a>
 *                 </NavigationMenu.Content>
 *               </NavigationMenu.Item>
 *             </NavigationMenu.List>
 *           </NavigationMenu.Root>
 *         </div>
 *       </div>
 *
 *       <div>
 *         <p class="mb-1.5 text-caption-2 text-tertiary-label">Teal — větší panel</p>
 *         <div class="overflow-visible rounded-xl border border-system-teal/40 bg-system-teal/10 px-2 py-1.5 shadow-sm">
 *           <NavigationMenu.Root class="justify-start">
 *             <NavigationMenu.List>
 *               <NavigationMenu.Item value="vice-teal">
 *                 <NavigationMenu.Trigger class="rounded-lg px-3 py-1.5 text-callout font-medium text-system-teal hover:bg-system-teal/20 data-[state=open]:bg-system-teal/25">
 *                   Více
 *                 </NavigationMenu.Trigger>
 *                 <NavigationMenu.Content
 *                   contentAlign="start"
 *                   class="!mt-2 min-w-[14rem] rounded-lg border border-system-teal/30 bg-grouped-surface p-2 shadow-lg"
 *                 >
 *                   <a class="block rounded-md px-3 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
 *                     Úvod
 *                   </a>
 *                   <a class="block rounded-md px-3 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
 *                     API
 *                   </a>
 *                 </NavigationMenu.Content>
 *               </NavigationMenu.Item>
 *             </NavigationMenu.List>
 *           </NavigationMenu.Root>
 *         </div>
 *       </div>
 *
 *       <div>
 *         <p class="mb-1.5 text-caption-2 text-tertiary-label">Oranžová akcentní lišta</p>
 *         <div class="overflow-visible rounded-xl border border-system-orange/35 bg-system-orange/10 px-2 py-1.5">
 *           <NavigationMenu.Root class="justify-start">
 *             <NavigationMenu.List>
 *               <NavigationMenu.Item value="vice-orange">
 *                 <NavigationMenu.Trigger class="rounded-lg px-3 py-1.5 text-callout font-medium text-system-orange hover:bg-system-orange/20 data-[state=open]:bg-system-orange/25">
 *                   Další
 *                 </NavigationMenu.Trigger>
 *                 <NavigationMenu.Content contentAlign="start" class="!mt-2 min-w-[13rem] rounded-lg border border-system-orange/25 bg-surface-raised p-2 shadow-md">
 *                   <a class="block rounded-md px-3 py-2 text-callout hover:bg-fill-secondary/30" href="#">
 *                     Nastavení
 *                   </a>
 *                   <a class="block rounded-md px-3 py-2 text-callout hover:bg-fill-secondary/30" href="#">
 *                     Odhlásit
 *                   </a>
 *                 </NavigationMenu.Content>
 *               </NavigationMenu.Item>
 *             </NavigationMenu.List>
 *           </NavigationMenu.Root>
 *         </div>
 *       </div>
 *
 *       <div>
 *         <p class="mb-1.5 text-caption-2 text-tertiary-label">Fialová / větší typografie</p>
 *         <div class="overflow-visible rounded-xl border border-system-purple/35 bg-system-purple/10 px-3 py-2">
 *           <NavigationMenu.Root class="justify-start">
 *             <NavigationMenu.List>
 *               <NavigationMenu.Item value="vice-purple">
 *                 <NavigationMenu.Trigger class="min-h-10 rounded-lg px-4 py-2 text-body font-medium text-system-purple hover:bg-system-purple/15 data-[state=open]:bg-system-purple/20">
 *                   Více
 *                 </NavigationMenu.Trigger>
 *                 <NavigationMenu.Content contentAlign="start" class="!mt-2 min-w-[15rem] rounded-xl border border-system-purple/25 bg-grouped-surface p-3 text-body shadow-lg">
 *                   <a class="block rounded-lg px-3 py-2.5 hover:bg-fill-secondary/35" href="#">
 *                     Profil
 *                   </a>
 *                   <a class="block rounded-lg px-3 py-2.5 hover:bg-fill-secondary/35" href="#">
 *                     Účet
 *                   </a>
 *                 </NavigationMenu.Content>
 *               </NavigationMenu.Item>
 *             </NavigationMenu.List>
 *           </NavigationMenu.Root>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @example Varianty contentAlign
 * `start` — pod levým okrajem triggeru; `end` — pod pravým okrajem (vhodné pro tlačítko vpravo); `center` — pod středem; `inlineEnd` — flyout **napravo** od triggeru (vodorovně).
 * ```tsx
 * import { NavigationMenu } from "~/components/ui/navigation-menu";
 *
 * <div class="flex flex-col gap-8 overflow-visible">
 *   <div>
 *     <p class="mb-2 text-caption-1 text-secondary-label">start</p>
 *     <NavigationMenu.Root class="justify-start">
 *       <NavigationMenu.List>
 *         <NavigationMenu.Item value="s">
 *           <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
 *           <NavigationMenu.Content contentAlign="start">
 *             <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
 *           </NavigationMenu.Content>
 *         </NavigationMenu.Item>
 *       </NavigationMenu.List>
 *     </NavigationMenu.Root>
 *   </div>
 *   <div>
 *     <p class="mb-2 text-caption-1 text-secondary-label">end</p>
 *     <NavigationMenu.Root class="flex w-full justify-end">
 *       <NavigationMenu.List>
 *         <NavigationMenu.Item value="e">
 *           <NavigationMenu.Trigger>Více</NavigationMenu.Trigger>
 *           <NavigationMenu.Content contentAlign="end">
 *             <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
 *           </NavigationMenu.Content>
 *         </NavigationMenu.Item>
 *       </NavigationMenu.List>
 *     </NavigationMenu.Root>
 *   </div>
 *   <div>
 *     <p class="mb-2 text-caption-1 text-secondary-label">center</p>
 *     <NavigationMenu.Root class="flex w-full justify-center">
 *       <NavigationMenu.List>
 *         <NavigationMenu.Item value="c">
 *           <NavigationMenu.Trigger>Uprostřed</NavigationMenu.Trigger>
 *           <NavigationMenu.Content contentAlign="center">
 *             <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
 *           </NavigationMenu.Content>
 *         </NavigationMenu.Item>
 *       </NavigationMenu.List>
 *     </NavigationMenu.Root>
 *   </div>
 *   <div>
 *     <p class="mb-2 text-caption-1 text-secondary-label">inlineEnd (vpravo od triggeru)</p>
 *     <NavigationMenu.Root class="justify-start">
 *       <NavigationMenu.List>
 *         <NavigationMenu.Item value="i">
 *           <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
 *           <NavigationMenu.Content contentAlign="inlineEnd" class="min-w-[12rem]">
 *             <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
 *           </NavigationMenu.Content>
 *         </NavigationMenu.Item>
 *       </NavigationMenu.List>
 *     </NavigationMenu.Root>
 *   </div>
 * </div>
 * ```
 
 
 */

import {
  $,
  component$,
  createContextId,
  type PropsOf,
  type Signal,
  Slot,
  useContext,
  useContextProvider,
  useId,
  useOnDocument,
  useSignal,
} from "@builder.io/qwik";

const triggerClass =
  "group inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-1 text-callout font-medium text-label outline-none ring-offset-background transition-colors hover:bg-surface-overlay focus:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-surface-overlay";

const linkClass =
  "inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-1 text-callout font-medium text-label no-underline outline-none ring-offset-background transition-colors hover:bg-surface-overlay focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** Společné styly panelu — pozice (`top`, `left`/`right`) řeší `contentAlign` + `contentLayoutByAlign`. */
const contentClassBase =
  "absolute z-50 min-w-[12rem] overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised p-2 text-body text-label shadow-md outline-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** Pozicování vůči obalu triggeru (`Item` má vnitřní `relative w-max` = šířka triggeru). */
const contentLayoutByAlign = {
  /** Pod triggerem, levé hrany zarovnané (výchozí). */
  start: "left-0 right-auto top-full mt-1.5",
  /** Pod triggerem, pravé hrany zarovnané — panel roste doleva (např. „Více“ vpravo v liště). */
  end: "left-auto right-0 top-full mt-1.5",
  /** Pod středem triggeru. */
  center: "left-1/2 right-auto top-full mt-1.5 -translate-x-1/2",
  /**
   * Vodorovný flyout: panel napravo od triggeru, horní hrany zarovnané (vhodné na úzké liště).
   * Na malém viewportu zvaž `end` nebo užší `max-w-*`.
   */
  inlineEnd: "left-full right-auto top-0 mt-0 ml-2",
} as const;

const listClass =
  "m-0 flex list-none flex-wrap items-center gap-0 p-0";

/** `li` ve flex řádku; skutečný kontext pro `absolute` panel je vnitřní obal v {@link NavigationMenuItem}. */
const itemClass = "min-w-0 shrink-0";

const itemTriggerWrapClass = "relative w-max max-w-full";

interface NavigationMenuRootContext {
  openValue: Signal<string | null>;
  rootRef: Signal<HTMLElement | undefined>;
}

interface NavigationMenuItemContext {
  value: string | undefined;
  contentId: string;
}

const navigationMenuRootContextId = createContextId<
  NavigationMenuRootContext | undefined
>("q-ui-lib.navigation-menu.root");

const navigationMenuItemContextId = createContextId<
  NavigationMenuItemContext | undefined
>("q-ui-lib.navigation-menu.item");

function useNavigationMenuRoot(name: string): NavigationMenuRootContext {
  const ctx = useContext(navigationMenuRootContextId);
  if (!ctx) {
    throw new Error(`${name} musí být uvnitř <NavigationMenu.Root>.`);
  }
  return ctx;
}

function useNavigationMenuItem(name: string): NavigationMenuItemContext {
  const ctx = useContext(navigationMenuItemContextId);
  if (!ctx) {
    throw new Error(`${name} musí být uvnitř <NavigationMenu.Item>.`);
  }
  return ctx;
}

export type NavigationMenuRootProps = PropsOf<"nav"> & {
  /** Počátečně otevřená položka (`value` z {@link NavigationMenuItem}). */
  defaultValue?: string | null;
};

/**
 * Kořen navigačního menu (shadcn „Navigation Menu“) — horizontální lišta s rozbalovacími panely.
 * V @qwik-ui/headless primitiva nejsou ({@link https://github.com/qwikifiers/qwik-ui | Qwik UI}); chování je vlastní (Escape, klik mimo).
 */
export const NavigationMenuRoot = component$<NavigationMenuRootProps>((props) => {
  const { defaultValue = null, class: className, "aria-label": ariaLabel = "Hlavní navigace", ...rest } =
    props;
  const openValue = useSignal<string | null>(defaultValue ?? null);
  const rootRef = useSignal<HTMLElement>();

  useContextProvider(navigationMenuRootContextId, {
    openValue,
    rootRef,
  });

  useOnDocument(
    "pointerdown",
    $((event: Event) => {
      const el = rootRef.value;
      const t = event.target as Node | null;
      if (!el || !t || !el.contains(t)) {
        openValue.value = null;
      }
    }),
  );

  useOnDocument(
    "keydown",
    $((event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openValue.value !== null) {
        openValue.value = null;
      }
    }),
  );

  // Čtení openValue v JSX zajistí přerender při otevření; zvýšený z-index celého kořene,
  // aby rozbalený panel nepřekryl až následující toolbary se stejným/nevyšším z-indexem v DOM.
  const menuOpen = openValue.value !== null;
  const merged = [
    "relative flex max-w-max flex-1 items-center justify-center",
    menuOpen ? "z-[200]" : "z-10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      ref={rootRef}
      aria-label={ariaLabel}
      data-orientation="horizontal"
      {...rest}
      class={merged}
      data-state={menuOpen ? "open" : "closed"}
    >
      <Slot />
    </nav>
  );
});

export type NavigationMenuListProps = PropsOf<"ul">;

export const NavigationMenuList = component$<NavigationMenuListProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = [listClass, className].filter(Boolean).join(" ");
  return (
    <ul data-navigation-menu-list="" {...rest} class={merged}>
      <Slot />
    </ul>
  );
});

export type NavigationMenuItemProps = PropsOf<"li"> & {
  /**
   * Jednoznačný identifikátor položky s {@link NavigationMenuTrigger} / {@link NavigationMenuContent}.
   * U položky jen s {@link NavigationMenuLink} může chybět.
   */
  value?: string;
};

export const NavigationMenuItem = component$<NavigationMenuItemProps>((props) => {
  const { value, class: className, ...rest } = props;
  const contentId = useId();

  useContextProvider(navigationMenuItemContextId, {
    value,
    contentId,
  });

  const merged = [itemClass, className].filter(Boolean).join(" ");
  return (
    <li role="none" {...rest} class={merged}>
      <div class={itemTriggerWrapClass}>
        <Slot />
      </div>
    </li>
  );
});

export type NavigationMenuTriggerProps = PropsOf<"button">;

export const NavigationMenuTrigger = component$<NavigationMenuTriggerProps>((props) => {
  const root = useNavigationMenuRoot("NavigationMenu.Trigger");
  const item = useNavigationMenuItem("NavigationMenu.Trigger");
  const { class: className, onClick$, ...rest } = props;

  if (item.value === undefined) {
    throw new Error(
      "NavigationMenu.Trigger vyžaduje <NavigationMenu.Item value=\"…\">.",
    );
  }

  const v = item.value;
  const open = root.openValue.value === v;
  const merged = [triggerClass, className].filter(Boolean).join(" ");

  const toggle$ = $(() => {
    root.openValue.value = root.openValue.value === v ? null : v;
  });

  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={item.contentId}
      data-state={open ? "open" : "closed"}
      class={merged}
      {...rest}
      onClick$={onClick$ ? ([toggle$, onClick$] as const) : toggle$}
    >
      <Slot />
    </button>
  );
});

export type NavigationMenuContentProps = PropsOf<"div"> & {
  /**
   * Zarovnání panelu vůči **triggeru** (viz vnitřní obal u {@link NavigationMenuItem}).
   * `end` = pod triggerem, pravé hrany zarovnané; `inlineEnd` = panel vpravo od triggeru (flyout).
   */
  contentAlign?: keyof typeof contentLayoutByAlign;
};

export const NavigationMenuContent = component$<NavigationMenuContentProps>((props) => {
  const root = useNavigationMenuRoot("NavigationMenu.Content");
  const item = useNavigationMenuItem("NavigationMenu.Content");
  const { class: className, contentAlign = "start", ...rest } = props;

  if (item.value === undefined) {
    throw new Error(
      "NavigationMenu.Content vyžaduje <NavigationMenu.Item value=\"…\">.",
    );
  }

  const open = root.openValue.value === item.value;
  const layoutCls = contentLayoutByAlign[contentAlign] ?? contentLayoutByAlign.start;
  const merged = [contentClassBase, layoutCls, className].filter(Boolean).join(" ");

  return (
    <div
      id={item.contentId}
      role="region"
      data-state={open ? "open" : "closed"}
      hidden={!open}
      class={merged}
      {...rest}
    >
      <Slot />
    </div>
  );
});

export type NavigationMenuLinkProps = PropsOf<"a">;

/** Přímý odkaz v liště (bez rozbalovacího panelu). */
export const NavigationMenuLink = component$<NavigationMenuLinkProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = [linkClass, className].filter(Boolean).join(" ");
  return <a {...rest} class={merged} />;
});

export type NavigationMenuSeparatorProps = PropsOf<"li">;

/** Svislý oddělovač mezi položkami v {@link NavigationMenuList}. */
export const NavigationMenuSeparator = component$<NavigationMenuSeparatorProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = [className].filter(Boolean).join(" ");
  return (
    <li role="presentation" {...rest} class={merged}>
      <span class="flex h-9 items-center px-1" aria-hidden="true">
        <span class="block h-4 w-px bg-separator-opaque" />
      </span>
    </li>
  );
});

/**
 * Složené API ve stylu shadcn/ui Navigation Menu; styly z COLORS.md (tokeny jako u Dropdown menu).
 */
export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Separator: NavigationMenuSeparator,
};
