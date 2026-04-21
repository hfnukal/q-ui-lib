/**
 * @component faq
 * @title Web — často kladené dotazy
 * @version 1.0.0
 * @example Harmonika z details
 * Každá otázka je `<details>` — funguje bez JS, vhodné pro SEO.
 * ```tsx
 * import { WebFaq } from "~/components/ui/faq";
 *
 * <WebFaq
 *   title="Časté dotazy"
 *   items={[
 *     { question: "Jak dlouho trvá realizace?", answer: "Typicky 4–8 týdnů podle rozsahu." },
 *     { question: "Pracujete i mimo Prahu?", answer: "Ano, většina komunikace probíhá online." },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebFaqItem {
  question: string;
  answer: string;
}

export interface WebFaqProps {
  title?: string;
  subtitle?: string;
  items: WebFaqItem[];
  class?: string;
}

/**
 * FAQ jako skupina rozbalovacích bloků (`<details>`).
 */
export const WebFaq = component$<WebFaqProps>((props) => {
  const { title, subtitle, items, class: className } = props;

  return (
    <section class={["bg-grouped-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <div class="text-center">
          {title ? <h2 class="text-title-2 font-bold text-label">{title}</h2> : null}
          {subtitle ? <p class="mt-3 text-body text-secondary-label">{subtitle}</p> : null}
        </div>
        <div class="mt-10 space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              class="group rounded-xl border border-separator bg-grouped-surface open:shadow-sm"
            >
              <summary class="cursor-pointer list-none px-5 py-4 text-headline font-medium text-label marker:content-none [&::-webkit-details-marker]:hidden">
                <span class="flex items-center justify-between gap-4">
                  {item.question}
                  <span
                    class="text-tertiary-label transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </span>
              </summary>
              <div class="border-t border-separator px-5 py-4 text-body text-secondary-label">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
});
