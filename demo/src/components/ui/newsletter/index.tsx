/**
 * @component newsletter
 * @title Web — odběr novinek
 * @version 1.0.0
 * @example E-mail a tlačítko
 * Jednoduchý řádek pro přihlášení k newsletteru.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { WebNewsletter } from "~/components/ui/newsletter";
 *
 * export default component$(() => (
 *   <WebNewsletter
 *     title="Novinky e-mailem"
 *     description="Žádný spam — maximálně jednou měsíčně."
 *     buttonLabel="Přihlásit"
 *     onSubmit$={(ev) => {
 *       const fd = new FormData(ev.target as HTMLFormElement);
 *       console.log(fd.get("email"));
 *     }}
 *   />
 * ));
 * ```
 */

import { component$, type PropFunction } from "@builder.io/qwik";

export interface WebNewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubmit$?: PropFunction<(event: SubmitEvent) => void>;
  class?: string;
}

const inputClass =
  "min-w-0 flex-1 rounded-md border border-separator bg-background px-3 py-2 text-body text-label shadow-sm placeholder:text-placeholder focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/50";

const btnPrimary =
  "inline-flex shrink-0 items-center justify-center rounded-md px-4 py-2 text-callout font-medium bg-accent text-white shadow-sm hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * Kompaktní blok s polem e-mail a odesláním přihlášení.
 */
export const WebNewsletter = component$<WebNewsletterProps>((props) => {
  const {
    title,
    description,
    placeholder = "váš@email.cz",
    buttonLabel = "Odebírat",
    onSubmit$,
    class: className,
  } = props;

  return (
    <section class={["border-y border-separator bg-surface-raised", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div class="max-w-md">
            {title ? <h2 class="text-title-3 font-bold text-label">{title}</h2> : null}
            {description ? <p class="mt-2 text-callout text-secondary-label">{description}</p> : null}
          </div>
          <form
            class="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center"
            preventdefault:submit
            onSubmit$={onSubmit$}
          >
            <label for="web-newsletter-email" class="sr-only">
              E-mail
            </label>
            <input
              id="web-newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={placeholder}
              class={inputClass}
            />
            <button type="submit" class={btnPrimary}>
              {buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
});
