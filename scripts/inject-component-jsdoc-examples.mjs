/**
 * Jednorázově doplní do úvodního JSDoc v components/<slug>/index.tsx blok @example + odkaz na demo route.
 * Přeskakuje soubory, kde už @example v úvodním bloku je.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = path.join(repoRoot, "components");

const TAG_RE = /^\s*\/\*\*[\s\S]*?@component\s+[\w-]+[\s\S]*?\*\/\s*\n?/;

/** @param {string} kebab */
function kebabToPascal(kebab) {
  return kebab
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/**
 * @param {string} body
 * @returns {boolean}
 */
function hasExampleInBody(body) {
  return body.split("\n").some((line) => {
    const t = line.replace(/^\s*\*\s?/, "").trim();
    return t.startsWith("@example");
  });
}

const SKIP_COMPOUND = new Set(["TabsGroup", "AccordionList"]);

/**
 * @param {string} src
 * @param {string} slug
 */
function pickCompoundName(src, slug) {
  const re = /^export const (\w+) = \{\s*$/gm;
  const names = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    names.push(m[1]);
  }
  const filtered = names.filter((n) => !SKIP_COMPOUND.has(n));
  const pascal = kebabToPascal(slug);
  const exact = filtered.find((n) => n === pascal);
  if (exact) return exact;
  if (slug === "tabs" && filtered.includes("Tab")) return "Tab";
  return filtered[0] ?? null;
}

/**
 * @param {string} src
 * @param {string} slug
 */
function pickPrimitiveName(src, slug) {
  const pascal = kebabToPascal(slug);
  if (new RegExp(`^export const ${pascal} = component\\$`, "m").test(src)) {
    return pascal;
  }
  if (slug === "chart" && /export const Chart =/.test(src)) {
    return "Chart";
  }
  const m = src.match(/^export const (\w+) = component\$/m);
  return m?.[1] ?? pascal;
}

/**
 * @param {string} src
 * @param {string} slug
 * @returns {{ kind: "compound" | "primitive"; name: string }}
 */
function resolveExport(src, slug) {
  if (slug === "menu") {
    return { kind: "compound", name: "Menu" };
  }
  const compound = pickCompoundName(src, slug);
  if (compound) {
    return { kind: "compound", name: compound };
  }
  return { kind: "primitive", name: pickPrimitiveName(src, slug) };
}

/**
 * @param {string} slug
 * @param {{ kind: "compound" | "primitive"; name: string }} exp
 */
function buildExampleTail(slug, exp) {
  const importPath = `~/components/ui/${slug}`;
  const demoRoute = `/components/${slug}`;
  const demoFile = `demo/src/routes/components/${slug}/index.tsx`;

  /** @type {Record<string, string>} */
  const customTsx = {
    "file-input": `import { FileInput } from "${importPath}";

<FileInput.DropArea>
  <FileInput.Input />
</FileInput.DropArea>`,
    "scroll-area": `import { ScrollArea } from "${importPath}";

<ScrollArea.Root class="h-48 rounded-md border border-separator-opaque">
  <ScrollArea.Viewport direction="vertical">…</ScrollArea.Viewport>
</ScrollArea.Root>`,
    sidebar: `import { Sidebar } from "${importPath}";

<Sidebar.Provider>
  <Sidebar.Root>…</Sidebar.Root>
  <Sidebar.Inset>…</Sidebar.Inset>
</Sidebar.Provider>`,
    sonner: `// V kořenovém layoutu:
import { Sonner } from "${importPath}";

<Sonner.Toaster>
  …
</Sonner.Toaster>

// Na stránce:
import { useSonner } from "${importPath}";

const { toast } = useSonner();
// toast({ title: "Hotovo" });`,
    resizable: `import { Resizable } from "${importPath}";

<Resizable.PanelGroup direction="horizontal" class="h-48 rounded-lg border border-separator-opaque/40">
  <Resizable.Panel side="start" minSize={20}>…</Resizable.Panel>
  <Resizable.Handle withHandle />
  <Resizable.Panel side="end" minSize={20}>…</Resizable.Panel>
</Resizable.PanelGroup>`,
    menu: `import { Menu } from "${importPath}";

<Menu.Root>
  <Menu.Trigger>Otevřít</Menu.Trigger>
  <Menu.Popover>
    <Menu.Item>Položka</Menu.Item>
  </Menu.Popover>
</Menu.Root>`,
  };

  let tsx;
  if (customTsx[slug]) {
    tsx = customTsx[slug];
  } else if (exp.kind === "primitive") {
    tsx = `import { ${exp.name} } from "${importPath}";

<${exp.name}>…</${exp.name}>`;
  } else {
    tsx = `import { ${exp.name} } from "${importPath}";

<${exp.name}.Root>
  …
</${exp.name}.Root>`;
  }

  const lines = [
    " * @example",
    " * ```tsx",
    ...tsx.split("\n").map((line) => ` * ${line}`),
    " * ```",
    ` * Ukázka v demo aplikaci: route \`${demoRoute}\` (zdroj \`${demoFile}\`).`,
  ];
  return lines.join("\n");
}

function main() {
  let n = 0;
  let skipped = 0;
  for (const d of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const slug = d.name;
    const indexTsx = path.join(componentsDir, slug, "index.tsx");
    if (!fs.existsSync(indexTsx)) continue;

    const src = fs.readFileSync(indexTsx, "utf8");
    const m = src.match(/^\s*\/\*\*([\s\S]*?)\*\//);
    if (!m || !m[1].includes("@component")) {
      skipped++;
      continue;
    }
    const body = m[1];
    if (hasExampleInBody(body)) {
      skipped++;
      continue;
    }

    const parsed = body.match(/@component\s+(\S+)/);
    const titleMatch = body.match(/@title\s+([^\n*]+)/);
    const versionMatch = body.match(/@version\s+(\S+)/);
    const component = parsed?.[1]?.trim() ?? slug;
    const title = titleMatch?.[1]?.trim() ?? kebabToPascal(slug);
    const version = versionMatch?.[1]?.trim() ?? "1.0.0";

    const exp = resolveExport(src, slug);
    const exampleTail = buildExampleTail(slug, exp);
    const block = `/**\n * @component ${component}\n * @title ${title}\n * @version ${version}\n${exampleTail}\n */\n\n`;

    const next = TAG_RE.test(src) ? src.replace(TAG_RE, block) : block + src.replace(/^\uFEFF?/, "");
    fs.writeFileSync(indexTsx, next, "utf8");
    n++;
  }
  console.log(`inject-component-jsdoc-examples: doplněno ${n} souborů, přeskočeno ${skipped}`);
}

main();
