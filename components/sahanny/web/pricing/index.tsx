/**
 * @component pricing
 * @title Web — ceník
 * @version 1.0.0
 * @example Porovnání balíčků
 * Karty s cenou, seznamem funkcí a CTA.
 * ```tsx
 * import { WebPricing } from "~/components/ui/pricing";
 *
 * <WebPricing
 *   title="Ceník"
 *   subtitle="Vyberte si plán podle fáze projektu."
 *   plans={[
 *     {
 *       name: "Start",
 *       price: "9 900 Kč",
 *       period: "jednorázově",
 *       features: ["Landing stránka", "Kontaktní formulář", "Základní SEO"],
 *       ctaLabel: "Nezávazně poptat",
 *       ctaHref: "#contact",
 *     },
 *     {
 *       name: "Pro",
 *       price: "29 900 Kč",
 *       period: "jednorázově",
 *       features: ["Vše ze Start", "Blog", "Analytika"],
 *       ctaLabel: "Domluvit hovor",
 *       ctaHref: "#contact",
 *       highlighted: true,
 *     },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebPricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  ctaLabel: string;
  ctaHref?: string;
  /** Zvýrazněný „doporučený“ plán */
  highlighted?: boolean;
}

export interface WebPricingProps {
  title?: string;
  subtitle?: string;
  plans: WebPricingPlan[];
  class?: string;
}

const btnPrimary =
  "inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-callout font-medium bg-accent text-white shadow-sm hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

const btnSecondary =
  "inline-flex w-full items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-4 py-2.5 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * Porovnání cenových balíčků v mřížce karet.
 */
export const WebPricing = component$<WebPricingProps>((props) => {
  const { title, subtitle, plans, class: className } = props;

  return (
    <section class={["bg-grouped-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div class="mx-auto max-w-2xl text-center">
          {title ? <h2 class="text-title-2 font-bold text-label">{title}</h2> : null}
          {subtitle ? <p class="mt-3 text-body text-secondary-label">{subtitle}</p> : null}
        </div>
        <ul class="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const card = plan.highlighted
              ? "relative rounded-2xl border-2 border-accent bg-background p-6 shadow-md ring-1 ring-accent/20"
              : "rounded-2xl border border-separator bg-grouped-surface p-6 shadow-sm";
            const btn = plan.highlighted ? btnPrimary : btnSecondary;
            return (
              <li key={plan.name} class={card}>
                {plan.highlighted ? (
                  <p class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-caption-1 font-medium text-white">
                    Doporučeno
                  </p>
                ) : null}
                <h3 class="text-title-3 font-semibold text-label">{plan.name}</h3>
                <p class="mt-4 flex items-baseline gap-1">
                  <span class="text-title-1 font-bold text-label">{plan.price}</span>
                  {plan.period ? (
                    <span class="text-callout text-tertiary-label">/ {plan.period}</span>
                  ) : null}
                </p>
                {plan.description ? (
                  <p class="mt-2 text-callout text-secondary-label">{plan.description}</p>
                ) : null}
                <ul class="mt-6 space-y-2 border-t border-separator pt-6">
                  {plan.features.map((f) => (
                    <li key={f} class="flex gap-2 text-callout text-secondary-label">
                      <span class="text-system-green" aria-hidden="true">
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={plan.ctaHref ?? "#"} class={`${btn} mt-8`}>
                  {plan.ctaLabel}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
});
