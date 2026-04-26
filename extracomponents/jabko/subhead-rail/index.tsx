/**
 * @component subhead-rail
 * @title Jabko — řádek odkazů pod hero
 * @version 1.0.0
 * @example Rychlé odkazy na řadu produktů
 * Horizontální řada odkazů oddělených interpunkcí — podobně jako sekce pod hlavním bannerem.
 * ```tsx
 * import { JabkoSubheadRail } from "~/components/ui/subhead-rail";
 *
 * <JabkoSubheadRail
 *   items={[
 *     { label: "iPhone", href: "#iphone" },
 *     { label: "iPad", href: "#ipad" },
 *     { label: "Mac", href: "#mac" },
 *     { label: "Watch", href: "#watch" },
 *   ]}
 * />
 * ```
 */

import { component$ } from "@builder.io/qwik";

export interface JabkoSubheadRailItem {
  label: string;
  href: string;
}

export interface JabkoSubheadRailProps {
  items: JabkoSubheadRailItem[];
  /** Oddělovač mezi položkami (výchozí střední tečka) */
  separator?: string;
  class?: string;
}

const linkClass =
  "text-footnote text-link no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/**
 * Kompaktní navigace na související produktové stránky nebo kategorie.
 */
export const JabkoSubheadRail = component$<JabkoSubheadRailProps>((props) => {
  const { items, separator = "·", class: className } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      class={[
        "border-b border-separator bg-grouped-background/80 py-3 text-center",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Související produkty"
    >
      <ul class="m-0 flex list-none flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 text-footnote md:gap-x-3">
        {items.map((item, i) => (
          <li key={item.href + item.label} class="flex items-center gap-x-2 md:gap-x-3">
            {i > 0 ? (
              <span class="select-none text-tertiary-label" aria-hidden="true">
                {separator}
              </span>
            ) : null}
            <a href={item.href} class={linkClass}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
