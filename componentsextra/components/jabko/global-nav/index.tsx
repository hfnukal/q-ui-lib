/**
 * @component global-nav
 * @title Jabko — globální navigace
 * @version 1.0.0
 * @example Minimalistická horní lišta
 * Logo vlevo, odkazy uprostřed, slot pro akce vpravo — vzor apple.com.
 * ```tsx
 * import { JabkoGlobalNav } from "~/components/ui/global-nav";
 *
 * <JabkoGlobalNav
 *   brandLabel="Apple"
 *   navItems={[
 *     { label: "Obchod", href: "#store" },
 *     { label: "Mac", href: "#mac" },
 *     { label: "iPhone", href: "#iphone" },
 *   ]}
 * />
 * ```
 */

import { component$, Slot } from "@builder.io/qwik";

export interface JabkoGlobalNavItem {
  label: string;
  href: string;
}

export interface JabkoGlobalNavProps {
  /** Text odkazu značky (logo lze vložit slotem logo) */
  brandLabel?: string;
  brandHref?: string;
  /** Hlavní položky — na větších obrazovkách vizuálně vycentrované */
  navItems?: JabkoGlobalNavItem[];
  /** Přilepení při scrollu */
  sticky?: boolean;
  class?: string;
}

const linkClass =
  "rounded-sm px-2 py-1.5 text-footnote text-secondary-label no-underline transition-colors hover:text-label focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * Kompaktní horní navigace s důrazem na typografii a odkazové řádky.
 */
export const JabkoGlobalNav = component$<JabkoGlobalNavProps>((props) => {
  const {
    brandLabel = "",
    brandHref = "/",
    navItems = [],
    sticky,
    class: className,
  } = props;

  const shell = [
    "w-full border-b border-separator/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75",
    sticky ? "sticky top-0 z-50" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header class={shell}>
      <div class="relative mx-auto flex h-11 max-w-7xl items-center px-4 md:h-12 md:px-6">
        <div class="flex min-w-[44px] shrink-0 items-center justify-start">
          <Slot name="logo" />
          {brandLabel ? (
            <a
              href={brandHref}
              class="text-footnote font-semibold tracking-tight text-label no-underline hover:opacity-80"
            >
              {brandLabel}
            </a>
          ) : null}
        </div>

        <nav
          class="flex flex-1 flex-wrap items-center justify-center gap-0.5 px-2 md:absolute md:left-1/2 md:top-1/2 md:max-w-[min(720px,72vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:justify-center md:gap-1 md:px-0 lg:gap-2"
          aria-label="Hlavní nabídka"
        >
          <ul class="m-0 flex list-none flex-wrap items-center justify-center gap-0.5 md:gap-1 lg:gap-2">
            {navItems.map((item) => (
              <li key={item.href + item.label}>
                <a href={item.href} class={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div class="flex min-w-[44px] shrink-0 items-center justify-end">
          <Slot name="actions" />
        </div>
      </div>
    </header>
  );
});
