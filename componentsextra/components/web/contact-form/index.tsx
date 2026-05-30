/**
 * @component contact-form
 * @title Web — kontaktní formulář
 * @version 1.0.0
 * @example Jméno, e-mail, zpráva
 * Nativní formulář s přístupnými popisky; odeslání přes `onSubmit$`.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { WebContactForm } from "~/components/ui/contact-form";
 *
 * export default component$(() => (
 *   <WebContactForm
 *     submitLabel="Odeslat zprávu"
 *     onSubmit$={(ev) => {
 *       const fd = new FormData(ev.target as HTMLFormElement);
 *       console.log(fd.get("email"), fd.get("message"));
 *     }}
 *   />
 * ));
 * ```
 */

import { component$, type PropFunction } from "@builder.io/qwik";

export interface WebContactFormProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  /** Volitelná vlastní akce při odeslání (např. POST na API) */
  onSubmit$?: PropFunction<(event: SubmitEvent) => void>;
  class?: string;
}

const labelClass = "mb-1 block text-caption-1 font-medium text-label";
const inputClass =
  "w-full rounded-md border border-separator bg-background px-3 py-2 text-body text-label shadow-sm placeholder:text-placeholder focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/50";

const btnPrimary =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-callout font-medium bg-accent text-white shadow-sm hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50";

/**
 * Jednoduchý kontaktní formulář: jméno, e-mail, zpráva.
 */
export const WebContactForm = component$<WebContactFormProps>((props) => {
  const { title, description, submitLabel = "Odeslat", onSubmit$, class: className } = props;

  return (
    <section class={["bg-background", className ?? ""].filter(Boolean).join(" ")}>
      <div class="mx-auto max-w-xl px-4 py-14 md:px-6">
        {title ? <h2 class="text-title-2 font-bold text-label">{title}</h2> : null}
        {description ? <p class="mt-2 text-body text-secondary-label">{description}</p> : null}
        <form
          class="mt-8 space-y-5"
          preventdefault:submit
          onSubmit$={onSubmit$}
        >
          <div>
            <label for="web-contact-name" class={labelClass}>
              Jméno
            </label>
            <input id="web-contact-name" name="name" type="text" autoComplete="name" class={inputClass} />
          </div>
          <div>
            <label for="web-contact-email" class={labelClass}>
              E-mail
            </label>
            <input
              id="web-contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              class={inputClass}
            />
          </div>
          <div>
            <label for="web-contact-message" class={labelClass}>
              Zpráva
            </label>
            <textarea
              id="web-contact-message"
              name="message"
              required
              rows={5}
              class={`${inputClass} resize-y min-h-[120px]`}
            />
          </div>
          <button type="submit" class={btnPrimary}>
            {submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
});
