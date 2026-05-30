/**
 * @component header
 * @title Web — hlavička
 * @version 1.0.0
 * @example Logo a navigace
 * Horní lišta s názvem značky, odkazy a volitelným CTA.
 * ```tsx
 * import { WebHeader } from "~/components/ui/header";
 *
 * <WebHeader
 *   brand="Moje firma"
 *   navItems={[
 *     { label: "Služby", href: "#features" },
 *     { label: "Kontakt", href: "#contact" },
 *   ]}
 *   cta={{ label: "Začít", href: "#cta" }}
 * />
 * ```
 */

import { component$, Slot } from "@builder.io/qwik";

export interface WebHeaderNavItem {
  label: string;
  href: string;
}

export interface WebHeaderProps {
  /** Viditelný text značky (lze nahradit slotem logo) */
  brand?: string;
  navItems?: WebHeaderNavItem[];
  /** Primární akce vpravo (např. „Přihlásit se“) */
  cta?: { label: string; href: string };
  /** Přilepení k hornímu okraji při scrollu */
  sticky?: boolean;
  class?: string;
}

const btnPrimary =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-callout font-medium bg-accent text-white shadow-sm hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * Hlavička webu: logo (slot nebo text), hlavní navigace a volitelné CTA.
 */
export const WebHeader = component$<WebHeaderProps>((props) => {
  const { brand, navItems = [], cta, sticky, class: className } = props;
  const shell = [
    "border-b border-separator bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
    sticky ? "sticky top-0 z-40" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header class={shell}>
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div class="flex min-w-0 items-center gap-3">
          <Slot name="logo" />
          {brand ? (
            <a href="/" class="truncate text-title-3 font-semibold text-label no-underline hover:text-link">
              {brand}
            </a>
          ) : null}
        </div>
        <nav class="flex flex-1 flex-wrap items-center justify-end gap-1 md:gap-2" aria-label="Hlavní navigace">
          <ul class="flex flex-wrap items-center gap-1 md:gap-3">
            {navItems.map((item) => (
              <li key={item.href + item.label}>
                <a
                  href={item.href}
                  class="rounded-md px-2 py-1.5 text-callout text-secondary-label no-underline hover:bg-fill-secondary/30 hover:text-label"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {cta ? (
            <a href={cta.href} class={btnPrimary}>
              {cta.label}
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
});
