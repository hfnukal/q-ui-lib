/**
 * @component hero-spotlight
 * @title Jabko — hero spotlight
 * @version 1.0.0
 * @example Produktový úvodní blok
 * Velká typografie, podnadpis a dvojice CTA jako „Zjistit více“ / „Koupit“.
 * ```tsx
 * import { JabkoHeroSpotlight } from "~/components/ui/hero-spotlight";
 *
 * <JabkoHeroSpotlight
 *   variant="dark"
 *   eyebrow="iPhone 16 Pro"
 *   title="Titanium."
 *   subtitle="Naprosto nový design a špičkové foto."
 *   primaryCta={{ label: "Zjistit více", href: "#learn" }}
 *   secondaryCta={{ label: "Koupit", href: "#buy" }}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface JabkoHeroSpotlightProps {
  /** Světlý nebo tmavý blok (apple.com často střídá) */
  variant?: "light" | "dark";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Primární odkaz (obvykle „Zjistit více“) */
  primaryCta: { label: string; href: string };
  /** Sekundární odkaz (obvykle „Koupit“) */
  secondaryCta?: { label: string; href: string };
  /** Volitelné pozadí — obrázek přes celou šířku */
  media?: { src: string; alt: string };
  class?: string;
}

const variantShell: Record<NonNullable<JabkoHeroSpotlightProps["variant"]>, string> = {
  light: "bg-grouped-background text-label",
  dark: "bg-label text-background",
};

const linkPrimary =
  "inline-flex items-center justify-center text-callout font-normal text-link no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

const linkSecondaryLight = `${linkPrimary} text-link`;
const linkSecondaryDark = `${linkPrimary} text-background/90`;

/**
 * Centrový hero s velkým nadpisem a typickými dvěma textovými CTA.
 */
export const JabkoHeroSpotlight = component$<JabkoHeroSpotlightProps>((props) => {
  const {
    variant = "light",
    eyebrow,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    media,
    class: className,
  } = props;

  const isDark = variant === "dark";
  const secondaryLinkClass = isDark ? linkSecondaryDark : linkSecondaryLight;

  return (
    <section
      class={[
        "relative overflow-hidden",
        variantShell[variant],
        media ? "min-h-[480px] md:min-h-[560px]" : "py-16 md:py-24",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {media ? (
        <div class="absolute inset-0">
          <img
            src={media.src}
            alt={media.alt}
            width={1920}
            height={1080}
            class="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          <div
            class={[
              "absolute inset-0",
              isDark ? "bg-label/55" : "bg-background/40",
            ].join(" ")}
            aria-hidden="true"
          />
        </div>
      ) : null}

      <div class="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center md:px-6">
        {eyebrow ? (
          <p
            class={[
              "m-0 text-footnote font-semibold uppercase tracking-[0.12em]",
              isDark ? "text-background/85" : "text-secondary-label",
            ].join(" ")}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 class="mt-2 max-w-4xl text-balance text-title-1 font-semibold tracking-tight md:text-[3.5rem] md:leading-[1.05] lg:text-[4rem]">
          {title}
        </h1>
        {subtitle ? (
          <p
            class={[
              "mt-3 max-w-2xl text-balance text-title-3 font-normal md:text-headline",
              isDark ? "text-background/80" : "text-secondary-label",
            ].join(" ")}
          >
            {subtitle}
          </p>
        ) : null}
        <div class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href={primaryCta.href} class={linkPrimary}>
            {primaryCta.label}
          </a>
          {secondaryCta ? (
            <a href={secondaryCta.href} class={secondaryLinkClass}>
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
});
