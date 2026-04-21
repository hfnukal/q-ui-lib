/**
 * @component ribbon
 * @title Jabko — promo lišta (ribbon)
 * @version 1.0.0
 * @example Horní akční pruh
 * Tenký pruh podobný apple.com — sdělení a volitelný odkaz.
 * ```tsx
 * import { JabkoRibbon } from "~/components/ui/ribbon";
 *
 * <JabkoRibbon
 *   message="Nakupujte dárky. Doručení včas na Vánoce."
 *   link={{ label: "Nakupovat", href: "#shop" }}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface JabkoRibbonProps {
  /** Hlavní text uprostřed lišty */
  message: string;
  /** Volitelný odkaz vpravo (např. „Více“) */
  link?: { label: string; href: string };
  /** Vizuální režim */
  tone?: "promo" | "neutral";
  class?: string;
}

const toneClass: Record<NonNullable<JabkoRibbonProps["tone"]>, string> = {
  promo: "bg-system-blue text-white",
  neutral: "bg-grouped-surface text-label border-b border-separator",
};

const linkClass =
  "inline-flex items-center gap-1 text-callout font-medium text-inherit underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Úzký informační pruh nad hlavičkou (akce, upozornění).
 */
export const JabkoRibbon = component$<JabkoRibbonProps>((props) => {
  const { message, link, tone = "promo", class: className } = props;

  return (
    <div
      role="region"
      aria-label="Akční sdělení"
      class={[toneClass[tone], "w-full", className ?? ""].filter(Boolean).join(" ")}
    >
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-footnote md:justify-center">
        <p class="m-0 max-w-4xl text-footnote md:text-callout">{message}</p>
        {link ? (
          <a href={link.href} class={linkClass}>
            {link.label}
            <span aria-hidden="true"> ›</span>
          </a>
        ) : null}
      </div>
    </div>
  );
});
