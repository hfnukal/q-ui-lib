import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Badge } from "~/components/ui/base/badge";
import { Button } from "~/components/ui/base/button";
import { Card } from "~/components/ui/base/card";
import { ScrollArea } from "~/components/ui/base/scroll-area";
import { Screen } from "~/components/ui/base/screen";

type MetaGeneratedLite = { title?: string };

const META_GLOB = import.meta.glob<{ default: MetaGeneratedLite }>(
  "../components/ui/*/*/meta.generated.json",
  { eager: true },
);

function componentTitle(slug: string): string {
  const key = `../components/ui/${slug}/meta.generated.json`;
  const title = META_GLOB[key]?.default?.title?.trim();
  return title || slug.split("/").slice(-1)[0];
}

/** Route moduly demo komponent (slug `base/accordion`). */
const ROUTE_SLUGS = new Set(
  Object.keys(import.meta.glob("./qui-demo/components/*/*/index.tsx")).map(
    (file) =>
      file
        .replace(/^\.\/qui-demo\/components\//, "")
        .replace(/\/index\.tsx$/, ""),
  ),
);

/** Jen komponenty s reálnou UI implementací (meta) i hotovou demo route. */
const DEMO_SLUGS: string[] = Object.keys(META_GLOB)
  .map((file) =>
    file
      .replace(/^\.\.\/components\/ui\//, "")
      .replace(/\/meta\.generated\.json$/, ""),
  )
  .filter((slug) => ROUTE_SLUGS.has(slug))
  .sort((a, b) => a.localeCompare(b));

export default component$(() => {
  const grouped = DEMO_SLUGS.reduce<Record<string, string[]>>((acc, slug) => {
    const [group = "base"] = slug.split("/");
    (acc[group] ??= []).push(slug);
    return acc;
  }, {});

  return (
    <Screen class="bg-background text-label">
      <ScrollArea.Root class="min-h-0 flex-1">
        <ScrollArea.Viewport direction="vertical">
          <div class="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
            {/* Hero */}
            <header class="flex flex-col gap-6 border-b border-separator-opaque pb-10 sm:flex-row sm:items-end sm:justify-between">
              <div class="space-y-3">
                <Badge variant="secondary">qui-client</Badge>
                <h1 class="text-large-title font-bold tracking-tight text-label">
                  QUI Lib — rozcestník
                </h1>
                <p class="max-w-xl text-body text-secondary-label">
                  Kolekce Qwik UI komponent stylovaných pomocí Tailwind tokenů.
                  Vyber komponentu níže nebo si nejdřív vylaď barvy v Theme
                  editoru.
                </p>
              </div>
              <div class="flex shrink-0 flex-wrap gap-2">
                <a href="/qui-demo">
                  <Button>Theme editor</Button>
                </a>
                <a href="/qui-demo/components/base/button">
                  <Button variant="secondary">Začít komponentami</Button>
                </a>
              </div>
            </header>

            {/* Skupiny komponent */}
            {Object.entries(grouped).map(([group, slugs]) => (
              <section key={group} class="mt-12 space-y-5">
                <div class="flex items-baseline justify-between gap-4">
                  <h2 class="text-title-2 font-semibold capitalize text-label">
                    {group}
                  </h2>
                  <span class="text-caption-1 text-secondary-label">
                    {slugs.length} komponent
                  </span>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {slugs.map((slug) => (
                    <a
                      key={slug}
                      href={`/qui-demo/components/${slug}`}
                      class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Card.Root
                        as="div"
                        class="h-full transition-colors group-hover:border-accent/60 group-hover:bg-surface-overlay"
                      >
                        <Card.Header>
                          <Card.Title class="text-headline">
                            {componentTitle(slug)}
                          </Card.Title>
                          <Card.Description>
                            <code class="text-caption-1">{slug}</code>
                          </Card.Description>
                          <Card.Action>
                            <span
                              class="text-secondary-label transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </Card.Action>
                        </Card.Header>
                      </Card.Root>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </Screen>
  );
});

export const head: DocumentHead = {
  title: "QUI Lib — rozcestník",
  meta: [
    {
      name: "description",
      content: "Rozcestník demo komponent knihovny QUI Lib.",
    },
  ],
};
