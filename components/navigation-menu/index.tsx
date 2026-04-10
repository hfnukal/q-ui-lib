/**
 * @component navigation-menu
 * @title NavigationMenu
 * @version 1.0.0
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

const contentClass =
  "absolute left-0 top-full z-50 mt-1.5 min-w-[12rem] overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised p-2 text-body text-label shadow-md outline-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const listClass =
  "m-0 flex list-none flex-wrap items-center gap-0 p-0";

const itemClass = "relative";

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

  const merged = ["relative z-10 flex max-w-max flex-1 items-center justify-center", className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      ref={rootRef}
      aria-label={ariaLabel}
      data-orientation="horizontal"
      {...rest}
      class={merged}
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
      <Slot />
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

export type NavigationMenuContentProps = PropsOf<"div">;

export const NavigationMenuContent = component$<NavigationMenuContentProps>((props) => {
  const root = useNavigationMenuRoot("NavigationMenu.Content");
  const item = useNavigationMenuItem("NavigationMenu.Content");
  const { class: className, ...rest } = props;

  if (item.value === undefined) {
    throw new Error(
      "NavigationMenu.Content vyžaduje <NavigationMenu.Item value=\"…\">.",
    );
  }

  const open = root.openValue.value === item.value;
  const merged = [contentClass, className].filter(Boolean).join(" ");

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
