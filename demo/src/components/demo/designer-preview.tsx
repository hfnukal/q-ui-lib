/**
 * Náhled komponenty v designéru — podle `meta.generated.json` (`kind`, `apiTree`, `slot`).
 * @see META_GEN.md — schéma apiTree
 */

import { component$, type FunctionComponent } from "@builder.io/qwik";

/** Qwik / headless díly v compound namespace */
type AnyPart = FunctionComponent<Record<string, unknown>>;

export type MetaGenerated = {
  name: string;
  title: string;
  kind: "primitive" | "compound" | "unknown";
  apiTree: Record<string, unknown>;
};

function extractSlug(path: string): string | undefined {
  const m = path.match(/[\\/]ui[\\/]([^\\/]+)[\\/]/);
  return m?.[1];
}

const metaBySlug: Record<string, MetaGenerated> = {};
for (const [path, mod] of Object.entries(
  import.meta.glob("../ui/*/meta.generated.json", {
    eager: true,
  }) as Record<string, { default?: MetaGenerated } | MetaGenerated>,
)) {
  const slug = extractSlug(path);
  if (!slug) {
    continue;
  }
  const raw = mod && typeof mod === "object" && "default" in mod && mod.default ? mod.default : (mod as MetaGenerated);
  metaBySlug[slug] = raw;
}

const moduleBySlug: Record<string, Record<string, unknown>> = {};
for (const [path, mod] of Object.entries(
  import.meta.glob("../ui/*/index.tsx", { eager: true }) as Record<string, Record<string, unknown>>,
)) {
  const slug = extractSlug(path);
  if (!slug) {
    continue;
  }
  moduleBySlug[slug] = mod;
}

function slugToPascal(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function primitiveHasSlot(apiTree: unknown): boolean {
  return (
    typeof apiTree === "object" &&
    apiTree !== null &&
    "slot" in apiTree &&
    (apiTree as { slot?: boolean }).slot === true
  );
}

function getPrimitiveExport(mod: Record<string, unknown>, meta: MetaGenerated, slug: string) {
  const byTitle = mod[meta.title];
  if (typeof byTitle === "function") {
    return byTitle;
  }
  const byPascal = mod[slugToPascal(slug)];
  if (typeof byPascal === "function") {
    return byPascal;
  }
  return null;
}

function getCompoundNamespace(mod: Record<string, unknown>, meta: MetaGenerated): Record<string, unknown> | null {
  const t = mod[meta.title];
  if (t && typeof t === "object" && t !== null && "Root" in t) {
    return t as Record<string, unknown>;
  }
  if (meta.title === "Tabs" && mod.Tab) {
    return mod.Tab as Record<string, unknown>;
  }
  for (const key of Object.keys(mod)) {
    const v = mod[key];
    if (v && typeof v === "object" && v !== null && "Root" in v) {
      return v as Record<string, unknown>;
    }
  }
  return null;
}

type TabNs = {
  Root: AnyPart;
  List: AnyPart;
  Tab: AnyPart;
  Panel: AnyPart;
};

/** Minimalní strom podle apiTree (Root + List / Tab / Panel) — viz `tabs/meta.generated.json`. */
function renderTabsPreview(ns: Record<string, unknown>) {
  const T = ns as unknown as TabNs;
  return (
    <T.Root selectedTabId="d1" behavior="manual" class="w-full max-w-xl">
      <T.List>
        <T.Tab key="d1">Panel 1</T.Tab>
        <T.Tab key="d2">Panel 2</T.Tab>
      </T.List>
      <T.Panel key="d1">
        <span class="text-body text-secondary-label">Slot · Panel (apiTree)</span>
      </T.Panel>
      <T.Panel key="d2">
        <span class="text-body text-secondary-label">Druhý panel</span>
      </T.Panel>
    </T.Root>
  );
}

/** Card — Root.slot + děti z apiTree (Header, Title, Content mají slot). */
function renderCardPreview(ns: Record<string, unknown>) {
  const C = ns as {
    Root: AnyPart;
    Header: AnyPart;
    Title: AnyPart;
    Description: AnyPart;
    Content: AnyPart;
  };
  return (
    <C.Root class="w-full max-w-md">
      <C.Header>
        <C.Title>Slot · Title</C.Title>
        <C.Description>Slot · Description</C.Description>
      </C.Header>
      <C.Content>
        <span class="text-body text-secondary-label">Slot · Content (apiTree)</span>
      </C.Content>
    </C.Root>
  );
}

function renderDialogPreview(ns: Record<string, unknown>) {
  const D = ns as {
    Root: AnyPart;
    Trigger: AnyPart;
    Panel: AnyPart;
    Close: AnyPart;
    Header: AnyPart;
    Title: AnyPart;
    Description: AnyPart;
    Content: AnyPart;
  };
  return (
    <D.Root>
      <D.Trigger>Otevřít náhled (apiTree)</D.Trigger>
      <D.Panel>
        <D.Close class="absolute right-4 top-4 z-10" />
        <D.Header>
          <D.Title>Slot · Title</D.Title>
          <D.Description>Slot · Description</D.Description>
        </D.Header>
        <D.Content>
          <p class="text-callout text-secondary-label">Slot · Content</p>
        </D.Content>
      </D.Panel>
    </D.Root>
  );
}

function renderCompoundFallback(
  ns: Record<string, unknown>,
  meta: MetaGenerated,
) {
  const Root = ns.Root as AnyPart;
  const api = meta.apiTree as {
    Root?: { slot?: boolean; children?: Record<string, unknown> };
  };
  const rootSpec = api.Root;
  const slotRoot = rootSpec && typeof rootSpec === "object" && rootSpec.slot === true;
  const partKeys =
    rootSpec && typeof rootSpec === "object" && rootSpec.children && typeof rootSpec.children === "object"
      ? Object.keys(rootSpec.children as Record<string, unknown>)
      : [];

  return (
    <Root class="w-full min-w-0 max-w-xl rounded-md border border-dashed border-separator-opaque/50 p-3">
      {slotRoot ? (
        <span class="text-callout text-secondary-label">Slot · Root</span>
      ) : null}
      <p class="mt-2 text-caption-2 text-tertiary-label">
        apiTree: {partKeys.length ? partKeys.join(" · ") : "—"}
      </p>
    </Root>
  );
}

export const DesignerCanvasPreview = component$((props: { slug: string }) => {
  const meta = metaBySlug[props.slug];
  const mod = moduleBySlug[props.slug];

  if (!meta || !mod) {
    return (
      <span class="text-caption-2 text-tertiary-label">
        Chybí meta nebo modul · {props.slug}
      </span>
    );
  }

  if (meta.kind === "primitive") {
    const P = getPrimitiveExport(mod, meta, props.slug) as AnyPart;
    if (!P) {
      return <span class="text-caption-2 text-tertiary-label">Bez exportu · {meta.title}</span>;
    }
    if (primitiveHasSlot(meta.apiTree)) {
      return (
        <P>
          <span class="text-callout text-secondary-label">Slot · {meta.title}</span>
        </P>
      );
    }
    return <P />;
  }

  if (meta.kind === "compound") {
    const ns = getCompoundNamespace(mod, meta);
    if (!ns || typeof ns.Root !== "function") {
      return <span class="text-caption-2 text-tertiary-label">Bez compound Root · {meta.title}</span>;
    }

    switch (props.slug) {
      case "tabs":
        return renderTabsPreview(ns);
      case "card":
        return renderCardPreview(ns);
      case "dialog":
        return renderDialogPreview(ns);
      default:
        return renderCompoundFallback(ns, meta);
    }
  }

  return (
    <span class="text-caption-2 text-tertiary-label">
      Neznámý kind · {meta.kind}
    </span>
  );
});
