/**
 * @component simple-banner
 * @title SimpleBanner
 * @version 0.0.1
 * @example Simple banner
 * Simple banner example
 * ```tsx
 * import { SimpleBanner } from "~/components/ui/qui-test-simple/simple-banner";
 *
 * <SimpleBanner tone="success" headline="Saved">
 *   The change was saved without any problems.
 * </SimpleBanner>
 * ```
 */
import { component$, Slot } from "@builder.io/qwik";

export interface SimpleBannerProps {
  tone?: "info" | "success" | "warning";
  headline: string;
  class?: string;
}

export const SimpleBanner = component$<SimpleBannerProps>((props) => {
  const toneClass = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
  }[props.tone ?? "info"];

  return (
    <section class={["rounded-md border px-4 py-3", toneClass, props.class].filter(Boolean).join(" ")}>
      <h3 class="text-sm font-semibold">{props.headline}</h3>
      <p class="mt-1 text-sm">
        <Slot />
      </p>
    </section>
  );
});
