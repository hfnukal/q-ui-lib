import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import type { UiFileScan } from "~/server/ui-component-introspect";
import { marked } from "marked";

const loadUiFileScan = server$(async (relativePath: string) => {
  const { scanSingleUiFile } = await import("~/server/ui-component-introspect");
  return scanSingleUiFile(relativePath);
});

const ComponentPropsTableResolved = component$<{ scan: UiFileScan }>(
  (props) => {
    const file = props.scan;

    if (file.components.length === 0) {
      return (
        <p class="mt-3 text-sm text-slate-500">
          Žádný export <code class="text-xs">component$</code>,{" "}
          <code class="text-xs">FunctionComponent</code> ani namespace objekt s identifikátory.
        </p>
      );
    }

    return (
      <ul class="mt-4 flex flex-col gap-6">
        {file.components.map((c) => (
          <li key={c.name}>
            <h3 class="text-base font-semibold text-slate-900">{c.name}</h3>
            {c.props.length === 0 ? (
              <p class="mt-1 text-sm text-slate-500">
                {c.propsAreExtendedOnly
                  ? "Žádné lokálně přidané props (typ je jen PropsOf / intrinsics z knihoven)."
                  : "Bez rozparsovaných props."}
              </p>
            ) : (
              <div class="mt-2 overflow-x-auto">
                <table class="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 text-slate-500">
                      <th class="py-2 pr-4 font-medium">Prop</th>
                      <th class="py-2 pr-4 font-medium">Typ</th>
                      <th class="py-2 font-medium">Popis</th>
                      <th class="py-2 font-medium">Povinné</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.props.map((p) => (
                      <tr
                        key={p.name}
                        class="border-b border-slate-100 align-top text-slate-700 last:border-0"
                      >
                        <td class="py-2 pr-4 font-mono text-xs text-slate-900">
                          {p.name}
                          {p.optional ? (
                            <span class="ml-1 text-slate-400">?</span>
                          ) : null}
                        </td>
                        <td class="py-2 pr-4 font-mono text-xs break-all text-slate-600">
                          {p.type}
                        </td>
                        <td class="py-2 pr-4 text-xs text-slate-600">
                          {p.docs ? (
                            <span
                              class="break-words prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={marked(
                                p.docs,
                                { async: false },
                              )}
                            />
                          ) : null}
                        </td>
                        <td class="py-2 text-xs">
                          {p.optional ? "ne" : "ano"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  },
);

export interface ComponentPropsTableProps {
  /**
   * Cesta k `.tsx` relativně ke kořenu dema, např.
   * `src/components/ui/button/index.tsx`.
   */
  filePath: string;
  class?: string;
}

/**
 * Načte introspekci na serveru a zobrazí tabulku exportovaných `component$` a props.
 */
export const ComponentPropsTable = component$<ComponentPropsTableProps>(
  (props) => {
    const resource = useResource$(async ({ track }) => {
      track(() => props.filePath);
      return loadUiFileScan(props.filePath);
    });

    return (
      <div class={props.class}>
        <Resource
          value={resource}
          onPending={() => (
            <p class="mt-3 text-sm text-slate-500">Načítám props…</p>
          )}
          onRejected={(err) => (
            <p class="mt-3 text-sm text-red-600">{err.message}</p>
          )}
          onResolved={(file) =>
            file ? (
              <ComponentPropsTableResolved scan={file} />
            ) : (
              <p class="mt-3 text-sm text-slate-500">
                Soubor {props.filePath} nenalezen nebo nepovolená cesta.
              </p>
            )
          }
        />
      </div>
    );
  },
);
