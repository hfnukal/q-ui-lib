/**
 * @component cta-section
 * @title Web — výzva k akci (pruh)
 * @version 1.0.0
 * @example Pl šířka CTA
 * Výrazný blok s nadpisem a tlačítkem.
 * ```tsx
 * import { WebCtaSection } from "~/components/ui/cta-section";
 *
 * <WebCtaSection
 *   title="Připraveni začít?"
 *   description="Napište nám — odpovíme do jednoho pracovního dne."
 *   ctaLabel="Kontaktovat"
 *   ctaHref="#contact"
 *   variant="accent"
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebCtaSectionProps {
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref?: string;
  /** `accent` — výraznější pozadí; `default` — jemnější plocha */
  variant?: "default" | "accent";
  class?: string;
}

const btn =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-headline font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * Konverzní pruh s krátkou výzvou a hlavní akcí.
 */
export const WebCtaSection = component$<WebCtaSectionProps>((props) => {
  const { title, description, ctaLabel, ctaHref = "#", variant = "default", class: className } = props;

  const shell =
    variant === "accent"
      ? "border border-accent/30 bg-accent/10"
      : "border border-separator bg-surface-raised";

  const btnClass = `${btn} bg-accent text-white hover:bg-accent/90`;

  return (
    <section class={["bg-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div class={`rounded-2xl px-6 py-10 md:px-10 md:py-12 ${shell}`}>
          <div class="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div class="max-w-2xl">
              <h2 class="text-title-2 font-bold text-label">{title}</h2>
              {description ? <p class="mt-2 text-body text-secondary-label">{description}</p> : null}
            </div>
            <a href={ctaHref} class={btnClass}>
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});
