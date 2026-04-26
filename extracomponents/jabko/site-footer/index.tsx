/**
 * @component site-footer
 * @title Jabko — patička webu
 * @version 1.0.0
 * @example Sloupce odkazů a právní řádek
 * Struktura podobná apple.com — několik sloupců, drobný text a právní odkazy.
 * ```tsx
 * import { JabkoSiteFooter } from "~/components/ui/site-footer";
 *
 * <JabkoSiteFooter
 *   columns={[
 *     { title: "Nakupovat a naučit se", links: [{ label: "Obchod", href: "#" }] },
 *     { title: "Účet", links: [{ label: "Spravovat účet", href: "#" }] },
 *   ]}
 *   legal={[
 *     { label: "Zásady ochrany osobních údajů", href: "#" },
 *     { label: "Podmínky použití", href: "#" },
 *   ]}
 *   copyright="© 2026 Jabko Demo"
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface JabkoSiteFooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface JabkoSiteFooterProps {
  columns?: JabkoSiteFooterColumn[];
  /** Spodní řádek drobných odkazů */
  legal?: { label: string; href: string }[];
  copyright?: string;
  /** Volitelný úvodní odstavec (např. region / krátká poznámka) */
  footnote?: string;
  class?: string;
}

const colTitle = "text-caption-1 font-semibold text-label";
const linkClass = "text-footnote text-secondary-label no-underline hover:text-link";

/**
 * Rozsáhlá patička s mřížkou odkazů a právním blokem.
 */
export const JabkoSiteFooter = component$<JabkoSiteFooterProps>((props) => {
  const { columns = [], legal = [], copyright, footnote, class: className } = props;

  return (
    <footer
      class={[
        "border-t border-separator bg-grouped-background text-secondary-label",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div class="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        {footnote ? <p class="mb-8 max-w-3xl text-footnote leading-relaxed text-tertiary-label">{footnote}</p> : null}

        {columns.length > 0 ? (
          <div class="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 class={["m-0", colTitle].join(" ")}>{col.title}</h2>
                <ul class="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <a href={l.href} class={linkClass}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        <div class="mt-10 flex flex-col gap-4 border-t border-separator pt-6 md:flex-row md:items-center md:justify-between">
          {copyright ? (
            <p class="m-0 order-2 text-footnote text-tertiary-label md:order-1">{copyright}</p>
          ) : null}
          {legal.length > 0 ? (
            <ul class="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 order-1 md:order-2 md:justify-end">
              {legal.map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href} class="text-footnote text-secondary-label no-underline hover:text-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
});
