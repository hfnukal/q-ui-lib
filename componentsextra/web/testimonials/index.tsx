/**
 * @component testimonials
 * @title Web — reference
 * @version 1.0.0
 * @example Citace klientů
 * Zvyšuje důvěru — jméno, role a volitelný avatar.
 * ```tsx
 * import { WebTestimonials } from "~/components/ui/testimonials";
 *
 * <WebTestimonials
 *   title="Říkají o nás"
 *   items={[
 *     {
 *       quote: "Dodání včas a bez překvapení na faktuře.",
 *       author: "Jana Nováková",
 *       role: "CEO, Example s.r.o.",
 *     },
 *     {
 *       quote: "Konečně web, který umíme sami upravovat.",
 *       author: "Petr Dvořák",
 *       role: "Marketing",
 *       avatarSrc: "https://i.pravatar.cc/120?img=12",
 *     },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebTestimonial {
  quote: string;
  author: string;
  role?: string;
  avatarSrc?: string;
}

export interface WebTestimonialsProps {
  title?: string;
  subtitle?: string;
  items: WebTestimonial[];
  class?: string;
}

/**
 * Sekce referencí s kartami citátů.
 */
export const WebTestimonials = component$<WebTestimonialsProps>((props) => {
  const { title, subtitle, items, class: className } = props;

  return (
    <section class={["bg-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div class="mx-auto max-w-2xl text-center">
          {title ? <h2 class="text-title-2 font-bold text-label">{title}</h2> : null}
          {subtitle ? <p class="mt-3 text-body text-secondary-label">{subtitle}</p> : null}
        </div>
        <ul class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.author + item.quote.slice(0, 24)}
              class="flex flex-col rounded-xl border border-separator bg-grouped-surface p-6 shadow-sm"
            >
              <blockquote class="flex-1">
                <p class="text-body text-label">&ldquo;{item.quote}&rdquo;</p>
              </blockquote>
              <footer class="mt-6 flex items-center gap-3 border-t border-separator pt-4">
                {item.avatarSrc ? (
                  <img
                    src={item.avatarSrc}
                    alt=""
                    width={48}
                    height={48}
                    class="h-12 w-12 rounded-full object-cover ring-2 ring-separator"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-fill-secondary text-callout font-semibold text-label"
                    aria-hidden="true"
                  >
                    {item.author.charAt(0)}
                  </div>
                )}
                <div>
                  <cite class="not-italic text-callout font-semibold text-label">{item.author}</cite>
                  {item.role ? <p class="text-caption-1 text-tertiary-label">{item.role}</p> : null}
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});
