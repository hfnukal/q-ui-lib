import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { ComponentPropsTable } from "~/components/demo/component-props";

export const useUiLibraryPaths = routeLoader$(async (): Promise<string[]> => {
  const { listUiComponentRelativePaths } = await import(
    "~/server/ui-component-introspect"
  );
  return listUiComponentRelativePaths();
});

export default component$(() => {
  const paths = useUiLibraryPaths();

  return (
    <div class="min-h-screen bg-slate-50 px-6 py-10 text-slate-800">
      <header class="mb-10 max-w-5xl">
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
          UI components (ts-morph)
        </h1>
        <p class="mt-2 max-w-prose text-slate-600">
          Soubory <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">src/components/ui/*/index.tsx</code>{" "}
          — exportované <code class="text-sm">component$</code> a jejich props z TypeScriptu.
        </p>
      </header>

      <div class="mx-auto flex max-w-5xl flex-col gap-10">
        {paths.value.map((filePath) => (
          <section
            key={filePath}
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 class="font-mono text-sm font-medium text-slate-900">
              {filePath}
            </h2>
            <ComponentPropsTable filePath={filePath} />
          </section>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Admin — UI introspect",
  meta: [
    {
      name: "description",
      content: "Seznam UI komponent a props (ts-morph)",
    },
  ],
};
