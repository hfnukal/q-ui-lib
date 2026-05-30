/**
 * @component hero
 * @title Web — hero sekce
 * @version 1.0.0
 * @example Úvodní blok
 * Nadpis H1, podnadpis, obrázek a hlavní CTA.
 * ```tsx
 * import { WebHero } from "~/components/ui/web/hero";
 *
 * <WebHero
 *   eyebrow="Vítejte"
 *   title="Stavíme weby, které prodávají"
 *   subtitle="Moderní stack, přístupnost a rychlé dodání."
 *   image={{ src: "https://picsum.photos/seed/hero/960/640", alt: "Ilustrace" }}
 *   cta={{ label: "Domluvit konzultaci", href: "#contact" }}
 *   ctaSecondary={{ label: "Ukázky prací", href: "#portfolio" }}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface WebHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: { src: string; alt: string };
  cta: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  class?: string;
}

const btnPrimary =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-headline font-medium bg-accent text-white shadow-sm hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

const btnSecondary =
  "inline-flex items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-5 py-2.5 text-headline font-medium text-label shadow-sm hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * První velký blok pod hlavičkou: H1, text, média a výzva k akci.
 */
export const WebHero = component$<WebHeroProps>((props) => {
  const { eyebrow, title, subtitle, image, cta, ctaSecondary, class: className } = props;

  return (
    <section
      class={[
        "border-b border-separator bg-grouped-background",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:px-6 md:py-16 lg:gap-14">
        <div class="flex flex-col gap-4">
          {eyebrow ? (
            <p class="text-caption-1 font-semibold uppercase tracking-wide text-link">{eyebrow}</p>
          ) : null}
          <h1 class="text-title-1 font-bold tracking-tight text-label">{title}</h1>
          {subtitle ? <p class="max-w-prose text-body text-secondary-label">{subtitle}</p> : null}
          <div class="flex flex-wrap gap-3 pt-2">
            <a href={cta.href} class={btnPrimary}>
              {cta.label}
            </a>
            {ctaSecondary ? (
              <a href={ctaSecondary.href} class={btnSecondary}>
                {ctaSecondary.label}
              </a>
            ) : null}
          </div>
        </div>
        {image ? (
          <div class="overflow-hidden rounded-2xl border border-separator bg-grouped-surface shadow-sm">
            <img
              src={image.src}
              alt={image.alt}
              width={960}
              height={640}
              class="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
});
