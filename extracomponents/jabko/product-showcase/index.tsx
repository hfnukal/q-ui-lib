/**
 * @component product-showcase
 * @title Jabko — produktový blok
 * @version 1.0.0
 * @example Sekce „tile“ vedle sebe
 * Dvousloupcový blok s obrázkem a textem — typické dlaždice na apple.com.
 * ```tsx
 * import { JabkoProductShowcase } from "~/components/ui/product-showcase";
 *
 * <JabkoProductShowcase
 *   align="image-right"
 *   eyebrow="MacBook Air"
 *   title="Létá. A přitom stojí pevně na zemi."
 *   description="Čip M3, tenký profil, celodenní výdrž baterie."
 *   image={{ src: "https://picsum.photos/seed/mac/960/720", alt: "Notebook" }}
 *   links={[
 *     { label: "Zjistit více", href: "#" },
 *     { label: "Koupit", href: "#" },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface JabkoProductShowcaseProps {
  align?: "image-left" | "image-right";
  eyebrow?: string;
  title: string;
  description?: string;
  image: { src: string; alt: string };
  /** Odkazy pod textem (např. Zjistit více / Koupit) */
  links?: { label: string; href: string }[];
  class?: string;
}

const linkClass =
  "text-callout font-normal text-link no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/**
 * Velká prezentace produktu: obrázek a typografie ve dvou sloupcích.
 */
export const JabkoProductShowcase = component$<JabkoProductShowcaseProps>((props) => {
  const {
    align = "image-left",
    eyebrow,
    title,
    description,
    image,
    links = [],
    class: className,
  } = props;

  const imageBlock = (
    <div class="overflow-hidden rounded-2xl border border-separator bg-grouped-surface shadow-sm">
      <img
        src={image.src}
        alt={image.alt}
        width={960}
        height={720}
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  const textBlock = (
    <div class="flex flex-col justify-center gap-4 px-2 py-4 md:px-4">
      {eyebrow ? (
        <p class="m-0 text-footnote font-semibold uppercase tracking-wide text-secondary-label">{eyebrow}</p>
      ) : null}
      <h2 class="m-0 text-balance text-title-2 font-semibold tracking-tight text-label md:text-title-1">
        {title}
      </h2>
      {description ? <p class="m-0 max-w-prose text-body text-secondary-label">{description}</p> : null}
      {links.length > 0 ? (
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <a key={l.href + l.label} href={l.href} class={linkClass}>
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );

  const imageOrder = align === "image-left" ? "md:order-1" : "md:order-2";
  const textOrder = align === "image-left" ? "md:order-2" : "md:order-1";

  return (
    <section
      class={[
        "border-b border-separator bg-grouped-background py-12 md:py-16 lg:py-20",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-6">
        <div class={["min-w-0", imageOrder].join(" ")}>{imageBlock}</div>
        <div class={["min-w-0", textOrder].join(" ")}>{textBlock}</div>
      </div>
    </section>
  );
});
