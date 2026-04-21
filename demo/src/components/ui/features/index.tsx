/**
 * @component features
 * @title Web — vlastnosti / služby
 * @version 1.0.0
 * @example Mřížka výhod
 * Ikony (emoji) nebo krátký label a popis u každé položky.
 * ```tsx
 * import { WebFeatures } from "~/components/ui/features";
 *
 * <WebFeatures
 *   title="Co nabízíme"
 *   subtitle="Tři pilíře naší práce."
 *   columns={3}
 *   items={[
 *     { icon: "⚡", title: "Rychlost", description: "Optimalizovaný výkon a Core Web Vitals." },
 *     { icon: "🔒", title: "Bezpečnost", description: "Osvědčené postupy a šifrování." },
 *     { icon: "♿", title: "Přístupnost", description: "WCAG a srozumitelná navigace." },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebFeatureItem {
  /** Krátký symbol nebo emoji zobrazené v „ikoně“ */
  icon?: string;
  title: string;
  description: string;
}

export interface WebFeaturesProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: WebFeatureItem[];
  /** Počet sloupců na velkém viewportu */
  columns?: 2 | 3 | 4;
  class?: string;
}

const colMap: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/**
 * Sekce služeb nebo výhod s nadpisem a kartami.
 */
export const WebFeatures = component$<WebFeaturesProps>((props) => {
  const { eyebrow, title, subtitle, items, columns = 3, class: className } = props;
  const grid = colMap[columns];

  return (
    <section class={["bg-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div class="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p class="text-caption-1 font-semibold uppercase tracking-wide text-link">{eyebrow}</p>
          ) : null}
          {title ? <h2 class="mt-2 text-title-2 font-bold text-label">{title}</h2> : null}
          {subtitle ? <p class="mt-3 text-body text-secondary-label">{subtitle}</p> : null}
        </div>
        <ul class={["mt-10 grid gap-6 sm:grid-cols-1", grid].join(" ")}>
          {items.map((item) => (
            <li
              key={item.title}
              class="rounded-xl border border-separator bg-grouped-surface p-6 shadow-sm"
            >
              {item.icon ? (
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-lg bg-fill-secondary text-title-3"
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
              ) : null}
              <h3 class="mt-4 text-title-3 font-semibold text-label">{item.title}</h3>
              <p class="mt-2 text-callout text-secondary-label">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});
