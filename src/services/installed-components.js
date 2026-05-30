const fs = require("node:fs");
const path = require("node:path");

function readMeta(componentDir) {
  const metaPath = path.join(componentDir, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return null;
  }
}

function collectComponentSlugs(currentDir, prefix = "") {
  if (!fs.existsSync(currentDir)) return [];
  const slugs = [];
  for (const entry of fs.readdirSync(currentDir)) {
    const entryPath = path.join(currentDir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    const slug = prefix ? `${prefix}/${entry}` : entry;
    if (fs.existsSync(path.join(entryPath, "meta.generated.json"))) {
      slugs.push(slug);
    }
    slugs.push(...collectComponentSlugs(entryPath, slug));
  }
  return slugs;
}

function listSubdirs(parentDir) {
  if (!fs.existsSync(parentDir)) return [];
  return fs
    .readdirSync(parentDir)
    .filter((name) => fs.statSync(path.join(parentDir, name)).isDirectory());
}

function toComponentKey(uilib, slug) {
  return `${uilib}/${slug}`;
}

function listInstalledComponents(targetDir) {
  const installed = [];
  for (const uilib of listSubdirs(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    for (const slug of collectComponentSlugs(uilibDir)) {
      const dir = path.join(uilibDir, slug);
      installed.push({
        key: toComponentKey(uilib, slug),
        uilib,
        slug,
        dir,
        meta: readMeta(dir),
      });
    }
  }
  return installed;
}

function resolveInstalledComponentSpec(installed, orderedUilibs, spec, preferredUilib) {
  const value = String(spec || "").trim();
  if (!value) return null;
  const byKey = new Map(installed.map((component) => [component.key, component]));
  if (byKey.has(value)) return byKey.get(value);

  if (value.includes("/")) {
    const [uilib, ...rest] = value.split("/");
    const slug = rest.join("/");
    if (!uilib || !slug) return null;
    return byKey.get(toComponentKey(uilib, slug)) || null;
  }

  const candidates = [];
  if (preferredUilib) candidates.push(preferredUilib);
  for (const uilib of orderedUilibs) {
    if (!candidates.includes(uilib)) candidates.push(uilib);
  }

  const directMatch = installed.find(
    (component) => candidates.includes(component.uilib) && component.slug === value
  );
  if (directMatch) return directMatch;

  for (const uilib of candidates) {
    for (const component of installed) {
      if (component.uilib !== uilib) continue;
      const name = typeof component.meta?.name === "string" ? component.meta.name.trim() : "";
      const registry =
        typeof component.meta?.registry === "string" ? component.meta.registry.trim() : "";
      const leaf = component.slug.split("/").pop();
      const aliases = new Set([leaf, name].filter(Boolean));
      if (registry) {
        aliases.add(`${registry}/${leaf}`);
        if (name) aliases.add(`${registry}/${name}`);
      }
      if (aliases.has(value)) {
        return component;
      }
    }
  }
  return null;
}

module.exports = {
  listInstalledComponents,
  listSubdirs,
  resolveInstalledComponentSpec,
  toComponentKey,
};
