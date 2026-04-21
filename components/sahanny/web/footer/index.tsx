/**
 * @component footer
 * @title Web — patička
 * @version 1.0.0
 * @example Kontakty a mapa webu
 * Sloupce odkazů, kontakty, sociální sítě a právní řádky.
 * ```tsx
 * import { WebFooter } from "~/components/ui/footer";
 *
 * <WebFooter
 *   brand="Moje firma"
 *   tagline="Spolehlivý partner pro váš web."
 *   columns={[
 *     { title: "Produkty", links: [{ label: "Ceník", href: "#" }] },
 *     { title: "Firma", links: [{ label: "O nás", href: "#" }] },
 *   ]}
 *   contact={{ email: "hello@example.com", phone: "+420 …" }}
 *   social={[{ label: "LinkedIn", href: "https://linkedin.com" }]}
 *   legal={[{ label: "GDPR", href: "#" }, { label: "Obchodní podmínky", href: "#" }]}
 *   copyright="© 2026 Moje firma"
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebFooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface WebFooterProps {
  brand?: string;
  tagline?: string;
  columns?: WebFooterLinkGroup[];
  contact?: { email?: string; phone?: string; address?: string };
  social?: { label: string; href: string }[];
  legal?: { label: string; href: string }[];
  copyright?: string;
  class?: string;
}

const linkClass = "text-callout text-secondary-label no-underline hover:text-link";

/**
 * Spodní část stránky: značka, mapa webu, kontakt, sociální sítě a právní odkazy.
 */
export const WebFooter = component$<WebFooterProps>((props) => {
  const { brand, tagline, columns = [], contact, social = [], legal = [], copyright, class: className } = props;

  return (
    <footer
      class={[
        "border-t border-separator bg-grouped-background text-secondary-label",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div class="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div class="lg:col-span-1">
            {brand ? <p class="text-title-3 font-semibold text-label">{brand}</p> : null}
            {tagline ? <p class="mt-2 text-callout">{tagline}</p> : null}
            {contact ? (
              <address class="mt-4 not-italic text-callout">
                {contact.email ? (
                  <p>
                    <a href={`mailto:${contact.email}`} class={linkClass}>
                      {contact.email}
                    </a>
                  </p>
                ) : null}
                {contact.phone ? (
                  <p>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} class={linkClass}>
                      {contact.phone}
                    </a>
                  </p>
                ) : null}
                {contact.address ? <p class="mt-2 whitespace-pre-line text-tertiary-label">{contact.address}</p> : null}
              </address>
            ) : null}
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 class="text-caption-1 font-semibold uppercase tracking-wide text-label">{col.title}</h2>
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
          {social.length > 0 ? (
            <div>
              <h2 class="text-caption-1 font-semibold uppercase tracking-wide text-label">Sociální sítě</h2>
              <ul class="mt-3 flex flex-wrap gap-3">
                {social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} class={linkClass} target="_blank" rel="noreferrer noopener">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div class="mt-10 flex flex-col gap-4 border-t border-separator pt-8 md:flex-row md:items-center md:justify-between">
          {copyright ? <p class="text-caption-1 text-tertiary-label">{copyright}</p> : <span />}
          {legal.length > 0 ? (
            <ul class="flex flex-wrap gap-4">
              {legal.map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href} class="text-caption-1 text-tertiary-label no-underline hover:text-link">
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
