import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import type { MetaGenerated } from "./meta-generated.types";

const loadMetaGenerated = server$(async (relativePath: string) => {
  const { readMetaGeneratedForUiIndex } = await import("./read-meta-generated");
  return readMetaGeneratedForUiIndex(relativePath);
});

function formatParamValue(v: unknown): string {
  if (v === true || v === false) return v ? "true" : "false";
  if (v === null) return "null";
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x === "string")) return v.join(" | ");
    return JSON.stringify(v);
  }
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** apiTree surface with only `params` / `slot` (primitive in meta). */
function isPrimitiveApiSurface(tree: Record<string, unknown>): boolean {
  const keys = Object.keys(tree);
  return keys.every((k) => k === "params" || k === "slot");
}

function omitSlot(node: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(node).filter(([k]) => k !== "slot"),
  );
}

const ParamsTable = component$<{
  params: Record<string, unknown>;
  compact?: boolean;
}>((props) => {
  const rows = Object.entries(props.params);
  if (rows.length === 0) return null;
  const compact = props.compact === true;
  return (
    <div class={compact ? "mt-2" : "mt-2 overflow-x-auto"}>
      <table
        class={[
          "w-full border-collapse text-left",
          compact ? "text-caption-1" : "min-w-[28rem] text-sm",
        ].join(" ")}
      >
        <thead>
          <tr
            class={[
              "border-b border-separator-opaque text-secondary-label",
              compact ? "" : "",
            ].join(" ")}
          >
            <th class="py-1.5 pr-3 font-medium">Prop</th>
            <th class="py-1.5 font-medium">Type / values</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, val]) => (
            <tr
              key={name}
              class="border-b border-separator align-top text-label last:border-0"
            >
              <td class="py-1.5 pr-3 font-mono text-caption-1">{name}</td>
              <td class="py-1.5 font-mono text-caption-1 break-all text-secondary-label">
                {formatParamValue(val)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

/** One branch of the compound API — without `slot`, a visual tree. */
const StructurePart = component$<{
  name: string;
  node: Record<string, unknown>;
  depth: number;
}>((props) => {
  const cleaned = omitSlot(props.node);
  const params = cleaned.params as Record<string, unknown> | undefined;
  const childrenRaw = cleaned.children as
    | Record<string, unknown>
    | undefined;
  const childEntries = childrenRaw
    ? Object.entries(childrenRaw)
    : [];
  const hasParams = params && Object.keys(params).length > 0;
  const hasChildren = childEntries.length > 0;

  return (
    <li class="relative list-none">
      <div
        class={[
          "flex min-w-0 flex-col gap-1",
          props.depth > 0 ? "pb-1" : "",
        ].join(" ")}
      >
        <div class="flex flex-wrap items-center gap-2">
          <span
            class={[
              "inline-flex max-w-full items-center rounded-lg border border-separator-opaque bg-fill-secondary px-2.5 py-1 font-mono text-caption-1 font-medium text-label shadow-sm",
              props.depth === 0 ? "text-xs" : "text-caption-1",
            ].join(" ")}
          >
            {props.name}
          </span>
        </div>
        {hasParams ? (
          <div class="ml-0.5 pl-3">
            <ParamsTable params={params!} compact />
          </div>
        ) : null}
      </div>

      {hasChildren ? (
        <ul
          class={[
            "relative mt-2 space-y-0",
            "ml-2 border-l border-separator-opaque pl-4",
          ].join(" ")}
        >
          {childEntries.map(([childName, childNode]) => {
            const sub =
              childNode &&
              typeof childNode === "object" &&
              !Array.isArray(childNode)
                ? (childNode as Record<string, unknown>)
                : {};
            return (
              <StructurePart
                key={childName}
                name={childName}
                node={sub}
                depth={props.depth + 1}
              />
            );
          })}
        </ul>
      ) : null}
    </li>
  );
});

const CompoundStructure = component$<{ apiTree: Record<string, unknown> }>(
  (props) => {
    const roots = Object.entries(omitSlot(props.apiTree)).filter(
      ([k]) => k !== "params",
    );
    if (roots.length === 0) {
      return (
        <p class="text-caption-1 text-tertiary-label">
          There are no parts in the structure.
        </p>
      );
    }

    return (
      <div class="rounded-xl border border-separator-opaque bg-surface-raised/40 p-4 shadow-sm">
        <ul class="space-y-4">
          {roots.map(([rootName, rootNode]) => {
            const node =
              rootNode &&
              typeof rootNode === "object" &&
              !Array.isArray(rootNode)
                ? (rootNode as Record<string, unknown>)
                : {};
            return (
              <StructurePart
                key={rootName}
                name={rootName}
                node={node}
                depth={0}
              />
            );
          })}
        </ul>
      </div>
    );
  },
);

const ApiStructureBlock = component$<{ meta: MetaGenerated }>((props) => {
  const tree = props.meta.apiTree;
  const primitiveLayout =
    props.meta.kind !== "compound" && isPrimitiveApiSurface(tree);
  const paramsOnly = tree.params as Record<string, unknown> | undefined;
  const hasParams =
    paramsOnly && typeof paramsOnly === "object" && !Array.isArray(paramsOnly)
      ? Object.keys(paramsOnly).length > 0
      : false;

  if (primitiveLayout) {
    return (
      <div>
        <h4 class="text-caption-1 font-medium text-secondary-label">
          Public props
        </h4>
        <div class="mt-2 rounded-xl border border-separator-opaque bg-surface-raised/40 p-4 shadow-sm">
          {hasParams ? (
            <ParamsTable params={paramsOnly!} />
          ) : (
            <p class="text-caption-1 text-tertiary-label">
              There is no props table in meta (empty{" "}
              <code class="text-caption-1">params</code>).
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 class="text-caption-1 font-medium text-secondary-label">
        Composition (compound)
      </h4>
      <p class="mt-1 text-caption-1 text-tertiary-label">
        API parts without generator items of type <code class="text-caption-1">slot</code>.
      </p>
      <div class="mt-3">
        <CompoundStructure apiTree={tree} />
      </div>
    </div>
  );
});

const MetaResolved = component$<{ meta: MetaGenerated }>((props) => {
  const m = props.meta;
  return (
    <div class="mt-6 space-y-6">
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt class="text-tertiary-label">name</dt>
        <dd class="font-mono text-xs text-label">{m.name}</dd>
        <dt class="text-tertiary-label">title</dt>
        <dd class="text-label">{m.title}</dd>
        <dt class="text-tertiary-label">version</dt>
        <dd class="font-mono text-xs text-label">{m.version}</dd>
        <dt class="text-tertiary-label">kind</dt>
        <dd class="font-mono text-xs text-label">{m.kind}</dd>
        {m.registry != null ? (
          <>
            <dt class="text-tertiary-label">registry</dt>
            <dd class="font-mono text-xs text-label">{m.registry}</dd>
          </>
        ) : null}
      </dl>

      {(m.dependencies?.length ?? 0) > 0 ? (
        <div>
          <h4 class="text-caption-1 font-medium text-secondary-label">
            dependencies
          </h4>
          <p class="mt-1 font-mono text-xs text-label">
            {m.dependencies!.join(", ")}
          </p>
        </div>
      ) : null}

      {(m.npmDependencies?.length ?? 0) > 0 ? (
        <div>
          <h4 class="text-caption-1 font-medium text-secondary-label">
            npmDependencies
          </h4>
          <p class="mt-1 font-mono text-xs text-label">
            {m.npmDependencies!.join(", ")}
          </p>
        </div>
      ) : null}

      <ApiStructureBlock meta={m} />
    </div>
  );
});

export interface ComponentPropsTableProps {
  /**
   * Path to the `.tsx` relative to the demo root, e.g.
   * `src/components/ui/button/index.tsx`.
   */
  filePath: string;
  class?: string;
}

/**
 * Loads `meta.generated.json` next to the component and displays the registry metadata (apiTree, version, …).
 */
export const ComponentPropsTable = component$<ComponentPropsTableProps>(
  (props) => {
    const resource = useResource$(async ({ track }) => {
      track(() => props.filePath);
      return loadMetaGenerated(props.filePath);
    });

    return (
      <div class={props.class}>
        <h3 class="text-base font-semibold text-label">Metadata</h3>
        <p class="mt-1 text-callout text-secondary-label">
          Source: <code class="text-xs">meta.generated.json</code> (see{" "}
          <code class="text-xs">npm run generate</code>)
        </p>
        <Resource
          value={resource}
          onPending={() => (
            <p class="mt-3 text-sm text-tertiary-label">Loading metadata…</p>
          )}
          onRejected={(err) => (
            <p class="mt-3 text-sm text-system-red">{err.message}</p>
          )}
          onResolved={(meta) =>
            meta ? (
              <MetaResolved meta={meta} />
            ) : (
              <p class="mt-3 text-sm text-tertiary-label">
                File{" "}
                <code class="text-xs">
                  {props.filePath.replace(/index\.tsx$/, "meta.generated.json")}
                </code>{" "}
                not found or path not allowed.
              </p>
            )
          }
        />
      </div>
    );
  },
);
