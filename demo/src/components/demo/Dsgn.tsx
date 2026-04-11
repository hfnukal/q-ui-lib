import {
  component$,
  useStore,
  useSignal,
  useContext,
  useContextProvider,
  createContextId,
  $,
  sync$,
  Slot,
  jsx,
  type QRL,
  type JSXOutput,
} from "@builder.io/qwik";

// ─── Drag MIME ────────────────────────────────────────────────────────────────
export const DSGN_DRAG_MIME = "application/x-q-ui-slug";

// ─── Meta types ───────────────────────────────────────────────────────────────
type ApiTreeNode = {
  slot?: boolean;
  params?: Record<string, unknown>;
  children?: Record<string, ApiTreeNode>;
};

type MetaGenerated = {
  name: string;
  title: string;
  kind: "primitive" | "compound";
  apiTree: Record<string, ApiTreeNode> | ApiTreeNode;
};

// ─── Store types ──────────────────────────────────────────────────────────────
export type NodeId = string;

export interface DsgnNode {
  id: NodeId;
  slug: string;
  /** Slot klíč → seznam ID dětí. */
  slots: Record<string, NodeId[]>;
  /** Uživatelem zadané hodnoty props (vše jako string, konvertuje se při renderu). */
  editedProps: Record<string, string>;
  /** Textový obsah slotu (použit v preview pokud slot nemá child nodes). */
  slotText: Record<string, string>;
}

export interface DsgnStore {
  nodes: Record<NodeId, DsgnNode>;
  canvas: NodeId[];
  selectedId: NodeId | null;
  _nextId: number;
}

export interface DsgnActions {
  addToCanvas$: QRL<(slug: string) => void>;
  addToSlot$: QRL<(parentId: NodeId, slotKey: string, slug: string) => void>;
  deleteNode$: QRL<(nodeId: NodeId) => void>;
  selectNode$: QRL<(nodeId: NodeId | null) => void>;
  updateProp$: QRL<(nodeId: NodeId, key: string, value: string) => void>;
  updateSlotText$: QRL<(nodeId: NodeId, slotKey: string, text: string) => void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────
export const DsgnContext = createContextId<DsgnStore>("dsgn-store");
export const DsgnActionsContext = createContextId<DsgnActions>("dsgn-actions");

// ─── Meta + module glob ───────────────────────────────────────────────────────
const META_GLOB = import.meta.glob<{ default: MetaGenerated }>(
  "../ui/*/meta.generated.json",
  { eager: true },
);
const MODULE_GLOB = import.meta.glob<Record<string, unknown>>(
  "../ui/*/index.tsx",
  { eager: true },
);

// ─── Slot registry — odvozeno z meta.generated.json ──────────────────────────

function buildSlotDefs(meta: MetaGenerated): Array<{ key: string; label: string }> {
  const tree = meta.apiTree as Record<string, ApiTreeNode> | ApiTreeNode;

  if (meta.kind === "primitive") {
    const node = tree as ApiTreeNode;
    return node.slot ? [{ key: "default", label: "Content" }] : [];
  }

  // compound — Root.children se slot:true jsou named slots; Root.slot → default slot
  const root = ((tree as Record<string, ApiTreeNode>)["Root"] ?? {}) as ApiTreeNode;
  const slots: Array<{ key: string; label: string }> = [];

  if (root.slot) slots.push({ key: "default", label: "Content" });

  for (const [key, part] of Object.entries(root.children ?? {})) {
    if ((part as ApiTreeNode).slot) {
      slots.push({ key: key.toLowerCase(), label: key });
    }
  }

  return slots;
}

export const SLOT_MAP: Record<string, Array<{ key: string; label: string }>> =
  Object.fromEntries(
    Object.entries(META_GLOB).map(([path, mod]) => {
      const slug = path.replace(/^.*\/ui\//, "").replace(/\/meta\.generated\.json$/, "");
      return [slug, buildSlotDefs(mod.default)];
    }),
  );

/** Seřazený seznam všech dostupných slugů odvozených z meta.generated.json. */
export const ALL_SLUGS: string[] = Object.keys(SLOT_MAP).sort();

export function getSlugMeta(slug: string): MetaGenerated | null {
  return (META_GLOB[`../ui/${slug}/meta.generated.json`]?.default ?? null) as MetaGenerated | null;
}
export function getSlugModule(slug: string): Record<string, unknown> | null {
  return (MODULE_GLOB[`../ui/${slug}/index.tsx`] ?? null) as Record<string, unknown> | null;
}

function slugToLabel(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("\u00a0");
}

/** Převede editedProps (string) na správné JS typy podle apiTree.params. */
function convertProps(
  editedProps: Record<string, string>,
  params: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(editedProps)) {
    if (!v) continue;
    const meta = params[k];
    if (meta === "boolean") out[k] = v === "true";
    else if (Array.isArray(meta) && typeof (meta as unknown[])[0] === "number") out[k] = Number(v);
    else out[k] = v;
  }
  return out;
}

// ─── DsgnDropZone ─────────────────────────────────────────────────────────────
const DsgnDropZone = component$<{
  onDrop$: QRL<(slug: string) => void>;
  label?: string;
  compact?: boolean;
}>((props) => {
  const active = useSignal(false);
  const depth = useSignal(0);

  return (
    <div
      preventdefault:dragover
      preventdefault:drop
      data-drop-slug=""
      class={[
        "flex items-center justify-center rounded border-2 border-dashed text-caption-1 transition-colors select-none",
        props.compact ? "min-h-8 px-2 py-1.5" : "min-h-20 px-3 py-6",
        active.value
          ? "border-accent bg-accent/10 text-accent"
          : "border-separator-opaque/60 text-tertiary-label hover:border-separator hover:text-secondary-label",
      ].join(" ")}
      onDragEnter$={() => { depth.value++; active.value = true; }}
      onDragLeave$={() => {
        depth.value = Math.max(0, depth.value - 1);
        if (depth.value === 0) active.value = false;
      }}
      onDrop$={[
        sync$((e: DragEvent, el: Element) => {
          const slug =
            e.dataTransfer?.getData("application/x-q-ui-slug") ||
            e.dataTransfer?.getData("text/plain") || "";
          (el as HTMLElement).dataset.dropSlug = slug;
        }),
        $((e: DragEvent, el: Element) => {
          active.value = false;
          depth.value = 0;
          const slug = ((el as HTMLElement).dataset.dropSlug ?? "").trim();
          (el as HTMLElement).dataset.dropSlug = "";
          if (slug) props.onDrop$(slug);
        }),
      ]}
    >
      {active.value ? "↓ Pusť zde" : (props.label ?? "+ přidat")}
    </div>
  );
});

// ─── DsgnNodeView ─────────────────────────────────────────────────────────────
const LEAF_ICONS: Record<string, string> = {
  separator: "──────────", spinner: "◌", avatar: "( AV )",
  progress: "[████░░░░]", slider: "◉─────", switch: "⬭○", checkbox: "☐",
  input: "[ Input… ]", textarea: "[ Textarea… ]", select: "[ Select ▾ ]",
  "radio-group": "○  ○  ●", "file-input": "📁 Choose",
  "kbd-shortcut": "⌘K", pagination: "← 1 2 3 →",
  chart: "📊 Chart", table: "⊞ Table", carousel: "◁ image ▷", calendar: "📅",
  sonner: "🔔 Toast", menu: "≡ Menu",
};

const DsgnNodeView = component$<{ nodeId: NodeId; depth?: number }>((props) => {
  const store = useContext(DsgnContext);
  const actions = useContext(DsgnActionsContext);
  const { nodeId, depth = 0 } = props;

  const node = store.nodes[nodeId];
  if (!node) return null;

  const slotDefs = SLOT_MAP[node.slug] ?? [];
  const isLeaf = slotDefs.length === 0;
  const isSelected = store.selectedId === nodeId;

  return (
    <div
      class={[
        "overflow-hidden rounded-lg border bg-surface-raised shadow-sm transition-colors",
        isSelected
          ? "border-accent ring-2 ring-accent/30"
          : "border-separator-opaque",
        depth > 0 ? "shadow-none" : "",
      ].join(" ")}
    >
      {/* Header — kliknutí vybere uzel */}
      <div
        class={[
          "flex cursor-pointer items-center justify-between gap-2 border-b border-separator-opaque/60 px-3 py-1.5 transition-colors",
          isSelected ? "bg-accent/10" : "bg-fill-secondary/40 hover:bg-fill-secondary/70",
        ].join(" ")}
        onClick$={[
          sync$((e: Event) => { e.stopPropagation(); }),
          $(() => { actions.selectNode$(nodeId); }),
        ]}
      >
        <span class="text-caption-1 font-semibold text-label">{slugToLabel(node.slug)}</span>
        <button
          type="button"
          class="flex h-5 w-5 items-center justify-center rounded text-caption-2 text-tertiary-label transition-colors hover:bg-fill-secondary hover:text-system-red focus:outline-none"
          onClick$={[
            sync$((e: Event) => { e.stopPropagation(); }),
            $(() => { actions.deleteNode$(nodeId); }),
          ]}
          aria-label="Smazat"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div class={isLeaf ? "p-3" : "space-y-2 p-2"}>
        {isLeaf ? (
          <div class="flex min-h-8 items-center justify-center rounded bg-fill-secondary/40 px-3 py-2">
            <span class="font-mono text-caption-1 text-secondary-label">
              {LEAF_ICONS[node.slug] ?? slugToLabel(node.slug)}
            </span>
          </div>
        ) : (
          slotDefs.map((slot) => {
            const slotKey = slot.key;
            const slotLabel = slot.label;
            const children = node.slots[slotKey] ?? [];
            return (
              <div key={slotKey} class="space-y-1.5">
                {slotDefs.length > 1 && (
                  <span class="block px-1 text-caption-2 font-medium text-tertiary-label">
                    {slotLabel}
                  </span>
                )}
                {children.map((childId) => (
                  <DsgnNodeView key={childId} nodeId={childId} depth={depth + 1} />
                ))}
                <DsgnDropZone
                  compact
                  label={`+ ${slotLabel}`}
                  onDrop$={(slug: string) => actions.addToSlot$(nodeId, slotKey, slug)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

// ─── DsgnPreviewNode ──────────────────────────────────────────────────────────
const DsgnPreviewNode = component$<{ nodeId: NodeId; store: DsgnStore }>((props) => {
  const { nodeId, store } = props;
  const node = store.nodes[nodeId];
  if (!node) return null;

  const meta = getSlugMeta(node.slug);
  const mod = getSlugModule(node.slug);

  if (!meta || !mod) {
    return (
      <span class="inline-flex items-center rounded bg-fill-secondary px-2 py-1 text-caption-1 text-secondary-label">
        {node.slug}
      </span>
    );
  }

  const title = meta.title;
  const tree = meta.apiTree as Record<string, ApiTreeNode>;

  const childNodes = (slotKey: string): JSXOutput[] =>
    (node.slots[slotKey] ?? []).map((childId) => (
      <DsgnPreviewNode key={childId} nodeId={childId} store={store} />
    ));

  const slotContent = (slotKey: string, partLabel: string, hasMeta: boolean): JSXOutput => {
    const kids = childNodes(slotKey);
    if (kids.length > 0) return kids as unknown as JSXOutput;
    const txt = node.slotText[slotKey];
    if (txt) return txt as unknown as JSXOutput;
    return hasMeta
      ? jsx("span", { class: "text-caption-1 text-tertiary-label italic", children: partLabel })
      : null;
  };

  // ── Compound ──────────────────────────────────────────────────────────────
  if (meta.kind === "compound") {
    const namespace = mod[title] as Record<string, unknown> | undefined;
    if (!namespace) return <span class="text-caption-1 text-tertiary-label">{title}</span>;

    const Root = namespace["Root"] as ((...a: unknown[]) => JSXOutput) | undefined;
    if (!Root) return null;

    const rootMeta = (tree["Root"] ?? {}) as ApiTreeNode;
    const rootParams = rootMeta.params ?? {};
    const rootProps = convertProps(node.editedProps, rootParams);
    const partKeys = Object.keys(rootMeta.children ?? {});

    const parts = partKeys.map((partKey) => {
      const PartComp = namespace[partKey] as ((...a: unknown[]) => JSXOutput) | undefined;
      if (!PartComp) return null;
      const partMeta = (rootMeta.children?.[partKey] ?? {}) as ApiTreeNode;
      const content = slotContent(partKey.toLowerCase(), partKey, !!partMeta.slot);
      return jsx(PartComp as any, { key: partKey, children: content });
    });

    const rootKids = rootMeta.slot ? [...parts, ...childNodes("default")] : parts;
    return jsx(Root as any, { ...rootProps, children: rootKids });
  }

  // ── Primitive ─────────────────────────────────────────────────────────────
  const Comp = mod[title] as ((...a: unknown[]) => JSXOutput) | undefined;
  if (!Comp) return <span class="text-caption-1 text-tertiary-label">{title}</span>;

  const rootNode = tree as unknown as ApiTreeNode;
  const params = rootNode.params ?? {};
  const compProps = convertProps(node.editedProps, params);

  if (rootNode.slot) {
    return jsx(Comp as any, {
      ...compProps,
      children: slotContent("default", title, true),
    });
  }
  return jsx(Comp as any, compProps);
});

// ─── DsgnCanvas ───────────────────────────────────────────────────────────────
export const DsgnCanvas = component$<{ class?: string }>((props) => {
  const store = useContext(DsgnContext);
  const actions = useContext(DsgnActionsContext);

  return (
    <div
      class={[
        "flex min-h-0 flex-1 flex-col gap-3",
        props.class,
      ].filter(Boolean).join(" ")}
    >
      {store.canvas.map((id) => (
        <DsgnNodeView key={id} nodeId={id} />
      ))}

      <DsgnDropZone
        label={store.canvas.length === 0 ? "Přetáhni komponentu z levého panelu" : "+ přidat komponentu"}
        onDrop$={actions.addToCanvas$}
      />

      {/* JSON model */}
      <details class="mt-2 shrink-0 text-caption-2">
        <summary class="cursor-pointer select-none text-secondary-label hover:text-label">
          JSON model
        </summary>
        <pre class="mt-2 max-h-56 overflow-auto rounded-md border border-separator-opaque/40 bg-background p-3 font-mono text-caption-2 text-label">
          {JSON.stringify({ canvas: store.canvas, nodes: store.nodes }, null, 2)}
        </pre>
      </details>

      {/* Live preview */}
      {store.canvas.length > 0 && (
        <div class="mt-2 shrink-0">
          <div class="mb-2 text-caption-1 font-medium text-secondary-label">Náhled instancí</div>
          <div class="flex flex-col gap-4 rounded-xl border border-separator-opaque bg-grouped-surface p-4">
            {store.canvas.map((id) => (
              <DsgnPreviewNode key={id} nodeId={id} store={store} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ─── DsgnProperties ───────────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-md border border-separator-opaque bg-background px-2 py-1 text-callout text-label outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1";
const selectClass = inputClass;
const labelClass = "block text-caption-1 font-medium text-secondary-label";

/** Panel vlastností vybrané komponenty. */
export const DsgnProperties = component$(() => {
  const store = useContext(DsgnContext);
  const actions = useContext(DsgnActionsContext);

  const selectedId = store.selectedId;
  const node = selectedId ? store.nodes[selectedId] : null;

  if (!node) {
    return (
      <div class="flex flex-1 items-center justify-center p-6">
        <p class="text-center text-callout text-tertiary-label">
          Klikni na komponentu v canvasu pro úpravu vlastností
        </p>
      </div>
    );
  }

  const meta = getSlugMeta(node.slug);
  if (!meta) {
    return (
      <div class="p-4">
        <p class="text-callout text-secondary-label">Žádná meta pro {node.slug}</p>
      </div>
    );
  }

  const tree = meta.apiTree as Record<string, ApiTreeNode>;
  const isCompound = meta.kind === "compound";

  /** Vyrenderuje editory pro params objekt. */
  const ParamEditors = component$<{
    params: Record<string, unknown>;
    prefix?: string;
  }>((pprops) => {
    const { params, prefix = "" } = pprops;
    const node2 = store.nodes[store.selectedId!];
    if (!node2) return null;

    return (
      <>
        {Object.entries(params).map(([key, type]) => {
          if (type === "function") return null;
          const storeKey = prefix ? `${prefix}.${key}` : key;
          const current = node2.editedProps[storeKey] ?? "";

          if (type === "boolean") {
            return (
              <label key={storeKey} class="flex cursor-pointer items-center gap-2 py-1">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-separator-opaque accent-accent"
                  checked={current === "true"}
                  onChange$={(e, el) => actions.updateProp$(node2.id, storeKey, String(el.checked))}
                />
                <span class="text-callout text-label">{key}</span>
              </label>
            );
          }

          if (Array.isArray(type)) {
            return (
              <div key={storeKey} class="space-y-1">
                <label class={labelClass}>{key}</label>
                <select
                  class={selectClass}
                  value={current}
                  onChange$={(e, el) => actions.updateProp$(node2.id, storeKey, el.value)}
                >
                  <option value="">— výchozí —</option>
                  {(type as unknown[]).map((v) => (
                    <option key={String(v)} value={String(v)}>
                      {String(v)}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          // string
          return (
            <div key={storeKey} class="space-y-1">
              <label class={labelClass}>{key}</label>
              <input
                type="text"
                class={inputClass}
                value={current}
                onInput$={(e, el) => actions.updateProp$(node2.id, storeKey, el.value)}
              />
            </div>
          );
        })}
      </>
    );
  });

  /** Editor textu pro slot. */
  const SlotTextEditor = component$<{ slotKey: string; label: string }>((sp) => {
    const n = store.nodes[store.selectedId!];
    if (!n) return null;
    const hasChildren = (n.slots[sp.slotKey]?.length ?? 0) > 0;
    if (hasChildren) return null; // slot obsazen children — text se nepoužije
    return (
      <div class="space-y-1">
        <label class={labelClass}>
          {sp.label === "default" ? "Text obsahu (Slot)" : `${sp.label} — text`}
        </label>
        <textarea
          class={[inputClass, "min-h-[4rem] resize-y"].join(" ")}
          value={n.slotText[sp.slotKey] ?? ""}
          onInput$={(e, el) => actions.updateSlotText$(n.id, sp.slotKey, el.value)}
        />
      </div>
    );
  });

  return (
    <div class="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div class="shrink-0 border-b border-separator-opaque px-4 py-3">
        <div class="text-headline font-semibold text-label">{meta.title}</div>
        <div class="text-caption-1 text-tertiary-label">{node.slug}</div>
      </div>

      {/* Editors */}
      <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {isCompound ? (
          <>
            {/* Root params (pokud existují) */}
            {(() => {
              const rootParams = ((tree["Root"] ?? {}) as ApiTreeNode).params;
              return rootParams && Object.keys(rootParams).length > 0 ? (
                <section class="space-y-3">
                  <div class="text-caption-1 font-semibold uppercase tracking-wider text-tertiary-label">
                    Root
                  </div>
                  <ParamEditors params={rootParams} />
                </section>
              ) : null;
            })()}

            {/* Slot text pro každou část compound */}
            {(() => {
              const rootMeta = (tree["Root"] ?? {}) as ApiTreeNode;
              const parts = Object.entries(rootMeta.children ?? {});
              const slotParts = parts.filter(([, pm]) => (pm as ApiTreeNode).slot);
              return slotParts.length > 0 ? (
                <section class="space-y-3">
                  <div class="text-caption-1 font-semibold uppercase tracking-wider text-tertiary-label">
                    Obsah slotů
                  </div>
                  {slotParts.map(([partKey]) => (
                    <SlotTextEditor key={partKey} slotKey={partKey.toLowerCase()} label={partKey} />
                  ))}
                </section>
              ) : null;
            })()}
          </>
        ) : (
          <>
            {/* Params primitive */}
            {(() => {
              const params = (tree as unknown as ApiTreeNode).params;
              return params && Object.keys(params).length > 0 ? (
                <section class="space-y-3">
                  <div class="text-caption-1 font-semibold uppercase tracking-wider text-tertiary-label">
                    Vlastnosti
                  </div>
                  <ParamEditors params={params} />
                </section>
              ) : null;
            })()}

            {/* Slot text (pokud má slot) */}
            {(tree as unknown as ApiTreeNode).slot && (
              <section class="space-y-3">
                <div class="text-caption-1 font-semibold uppercase tracking-wider text-tertiary-label">
                  Obsah slotu
                </div>
                <SlotTextEditor slotKey="default" label="default" />
              </section>
            )}
          </>
        )}

        {/* Žádné editovatelné vlastnosti */}
        {!isCompound &&
          !(tree as unknown as ApiTreeNode).params &&
          !(tree as unknown as ApiTreeNode).slot && (
            <p class="text-callout text-tertiary-label">
              Tato komponenta nemá editovatelné vlastnosti.
            </p>
          )}
      </div>
    </div>
  );
});

// ─── DsgnProvider ─────────────────────────────────────────────────────────────
/**
 * Poskytuje DsgnContext + DsgnActionsContext všem potomkům.
 * Obaluje obsah stránky — layout definuje route.
 */
export const DsgnProvider = component$(() => {
  const store = useStore<DsgnStore>({
    nodes: {},
    canvas: [],
    selectedId: null,
    _nextId: 1,
  });
  useContextProvider(DsgnContext, store);

  const addToCanvas$ = $((slug: string) => {
    const id = `n${store._nextId++}`;
    const slotDefs = SLOT_MAP[slug] ?? [];
    const slots: Record<string, NodeId[]> = {};
    slotDefs.forEach((s) => { slots[s.key] = []; });
    store.nodes[id] = { id, slug, slots, editedProps: {}, slotText: {} };
    store.canvas.push(id);
  });

  const addToSlot$ = $((parentId: NodeId, slotKey: string, slug: string) => {
    const id = `n${store._nextId++}`;
    const slotDefs = SLOT_MAP[slug] ?? [];
    const slots: Record<string, NodeId[]> = {};
    slotDefs.forEach((s) => { slots[s.key] = []; });
    store.nodes[id] = { id, slug, slots, editedProps: {}, slotText: {} };
    const parent = store.nodes[parentId];
    if (!parent) return;
    if (!parent.slots[slotKey]) parent.slots[slotKey] = [];
    parent.slots[slotKey].push(id);
  });

  const deleteNode$ = $((nodeId: NodeId) => {
    if (store.selectedId === nodeId) store.selectedId = null;
    const toDelete = new Set<NodeId>();
    const stack: NodeId[] = [nodeId];
    while (stack.length > 0) {
      const id = stack.pop()!;
      toDelete.add(id);
      const n = store.nodes[id];
      if (n) Object.values(n.slots).forEach((ch) => stack.push(...ch));
    }
    store.canvas = store.canvas.filter((id) => !toDelete.has(id));
    for (const n of Object.values(store.nodes)) {
      if (toDelete.has(n.id)) continue;
      for (const key of Object.keys(n.slots)) {
        n.slots[key] = n.slots[key].filter((id) => !toDelete.has(id));
      }
    }
    toDelete.forEach((id) => { delete store.nodes[id]; });
  });

  const selectNode$ = $((nodeId: NodeId | null) => {
    store.selectedId = nodeId;
  });

  const updateProp$ = $((nodeId: NodeId, key: string, value: string) => {
    const n = store.nodes[nodeId];
    if (n) n.editedProps[key] = value;
  });

  const updateSlotText$ = $((nodeId: NodeId, slotKey: string, text: string) => {
    const n = store.nodes[nodeId];
    if (n) n.slotText[slotKey] = text;
  });

  useContextProvider(DsgnActionsContext, {
    addToCanvas$,
    addToSlot$,
    deleteNode$,
    selectNode$,
    updateProp$,
    updateSlotText$,
  });

  return <Slot />;
});
