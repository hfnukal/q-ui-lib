/**
 * @component about
 * @title Web — o nás
 * @version 1.0.0
 * @example Text a obrázek
 * Představení značky, týmu nebo vize; obsah přes slot.
 * ```tsx
 * import { WebAbout } from "~/components/ui/web/about";
 *
 * <WebAbout
 *   title="Kdo jsme"
 *   lead="Tým designérů a vývojářů z Prahy."
 *   image={{ src: "https://picsum.photos/seed/about/800/600", alt: "Tým v kanceláři" }}
 * >
 *   <p class="text-body text-secondary-label">
 *     Od roku 2018 pomáháme firmám s digitální transformací…
 *   </p>
 * </WebAbout>
 * ```
 */

import { component$, Slot } from "@builder.io/qwik";

export interface WebAboutProps {
  title: string;
  lead?: string;
  image?: { src: string; alt: string };
  /** Obrázek vlevo místo vpravo */
  imagePosition?: "left" | "right";
  class?: string;
}

/**
 * Sekce „O nás“ s nadpisem, úvodním odstavcem, slotem pro delší text a volitelným obrázkem.
 */
export const WebAbout = component$<WebAboutProps>((props) => {
  const { title, lead, image, imagePosition = "right", class: className } = props;
  const imageFirst = imagePosition === "left";

  const textBlock = (
    <div class="flex flex-col gap-4">
      <h2 class="text-title-2 font-bold text-label">{title}</h2>
      {lead ? <p class="text-headline text-secondary-label">{lead}</p> : null}
      <div class="text-body text-secondary-label">
        <Slot />
      </div>
    </div>
  );

  if (!image) {
    return (
      <section class={["bg-grouped-background", className ?? ""].filter(Boolean).join(" ")}>
        <div class="mx-auto max-w-3xl px-4 py-14 md:px-6">{textBlock}</div>
      </section>
    );
  }

  const media = (
    <div class="overflow-hidden rounded-2xl border border-separator bg-grouped-surface shadow-sm">
      <img
        src={image.src}
        alt={image.alt}
        width={800}
        height={600}
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  return (
    <section class={["bg-grouped-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div class="grid gap-10 md:grid-cols-2 md:items-center">
          {imageFirst ? (
            <>
              {media}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {media}
            </>
          )}
        </div>
      </div>
    </section>
  );
});
