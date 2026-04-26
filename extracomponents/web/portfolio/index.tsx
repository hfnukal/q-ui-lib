/**
 * @component portfolio
 * @title Web — portfolio / galerie
 * @version 1.0.0
 * @example Mřížka prací
 * Ukázky projektů s titulkem a popisem.
 * ```tsx
 * import { WebPortfolio } from "~/components/ui/portfolio";
 *
 * <WebPortfolio
 *   title="Vybrané práce"
 *   subtitle="Weby a aplikace z posledních měsíců."
 *   items={[
 *     {
 *       src: "https://picsum.photos/seed/p1/800/600",
 *       alt: "Projekt 1",
 *       title: "Rebrand e-shopu",
 *       caption: "UX, Qwik, Stripe",
 *     },
 *     {
 *       src: "https://picsum.photos/seed/p2/800/600",
 *       alt: "Projekt 2",
 *       title: "Firemní web",
 *     },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebPortfolioItem {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
}

export interface WebPortfolioProps {
  title?: string;
  subtitle?: string;
  items: WebPortfolioItem[];
  /** Počet sloupců na velkém zobrazení */
  columns?: 2 | 3;
  class?: string;
}

const colMap: Record<2 | 3, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
};

/**
 * Galerie prací s obrázky a popisky.
 */
export const WebPortfolio = component$<WebPortfolioProps>((props) => {
  const { title, subtitle, items, columns = 3, class: className } = props;

  return (
    <section class={["bg-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div class="mx-auto max-w-2xl text-center">
          {title ? <h2 class="text-title-2 font-bold text-label">{title}</h2> : null}
          {subtitle ? <p class="mt-3 text-body text-secondary-label">{subtitle}</p> : null}
        </div>
        <ul class={["mt-10 grid gap-6 sm:grid-cols-1", colMap[columns]].join(" ")}>
          {items.map((item) => (
            <li
              key={item.src + (item.title ?? "")}
              class="group overflow-hidden rounded-xl border border-separator bg-grouped-surface shadow-sm"
            >
              <div class="aspect-[4/3] overflow-hidden bg-fill-tertiary">
                <img
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={600}
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {(item.title ?? item.caption) ? (
                <div class="p-4">
                  {item.title ? <h3 class="text-headline font-semibold text-label">{item.title}</h3> : null}
                  {item.caption ? <p class="mt-1 text-caption-1 text-secondary-label">{item.caption}</p> : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});
