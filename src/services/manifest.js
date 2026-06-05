const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");
const { validateConfig } = require("./config");
const {
  hasRootIndex,
  orderedRepoNames,
  toComponentKey,
} = require("./component-catalog");
const { isUilibPackSpec } = require("./uilib-pack");

const MANIFEST_SCHEMA_VERSION = "qui-manifest/v1";
const SECTION_KEYWORDS = new Set(["components", "templates", "routes"]);

function throwManifestError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
  throw err;
}

function readManifestFile(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    throwManifestError(`Manifest not found: ${manifestPath}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    throwManifestError("Manifest is not valid JSON.");
  }
  validateManifest(parsed);
  return parsed;
}

function validateManifest(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throwManifestError("Manifest must be an object.");
  }
  if (manifest.schemaVersion && manifest.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
    throwManifestError(`schemaVersion must be '${MANIFEST_SCHEMA_VERSION}'.`);
  }
  if (!manifest.config || typeof manifest.config !== "object") {
    throwManifestError("Manifest must include a config object (qui.config.json contents).");
  }
  validateConfig(manifest.config);
  if (manifest.components !== undefined) {
    if (!Array.isArray(manifest.components)) {
      throwManifestError("components must be an array when present.");
    }
    for (const item of manifest.components) {
      if (typeof item !== "string" || item.length === 0) {
        throwManifestError("components entries must be non-empty strings.");
      }
    }
  }
  if (manifest.templatePath !== undefined) {
    if (typeof manifest.templatePath !== "string" || manifest.templatePath.length === 0) {
      throwManifestError("templatePath must be a non-empty string when present.");
    }
    if (path.isAbsolute(manifest.templatePath)) {
      throwManifestError("templatePath must be relative.");
    }
  }
  for (const key of ["templates", "routes"]) {
    if (manifest[key] !== undefined) {
      if (!Array.isArray(manifest[key])) {
        throwManifestError(`${key} must be an array when present.`);
      }
      for (const item of manifest[key]) {
        if (typeof item !== "string" || item.length === 0) {
          throwManifestError(`${key} entries must be non-empty strings.`);
        }
      }
    }
  }
}

function listInstalledComponentSpecs(targetDir) {
  const specs = [];
  if (!fs.existsSync(targetDir)) return specs;
  for (const uilib of fs.readdirSync(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    if (!fs.statSync(uilibDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(uilibDir)) {
      const componentDir = path.join(uilibDir, slug);
      if (!fs.statSync(componentDir).isDirectory()) continue;
      if (hasRootIndex(componentDir)) {
        specs.push(toComponentKey(uilib, slug));
      }
    }
  }
  return specs.sort();
}

function filterComponentSpecs(allSpecs, filters) {
  if (!filters || filters.length === 0) return allSpecs;
  const wanted = new Set();
  for (const filter of filters) {
    const trimmed = String(filter).trim();
    if (!trimmed || SECTION_KEYWORDS.has(trimmed.toLowerCase()) || isUilibPackSpec(trimmed)) {
      continue;
    }
    if (trimmed.endsWith("/")) {
      const uilib = trimmed.slice(0, -1);
      for (const spec of allSpecs) {
        if (spec === uilib || spec.startsWith(`${uilib}/`)) wanted.add(spec);
      }
      continue;
    }
    if (trimmed.includes("/")) {
      wanted.add(trimmed);
      continue;
    }
    const matches = allSpecs.filter((spec) => spec.endsWith(`/${trimmed}`) || spec === trimmed);
    if (matches.length === 0) wanted.add(trimmed);
    else matches.forEach((m) => wanted.add(m));
  }
  return allSpecs.filter((spec) => wanted.has(spec));
}

function reposForManifest(config, componentSpecs, templateSpecs, routeSpecs) {
  const repoNames = new Set();
  for (const repoName of orderedRepoNames(config)) {
    const repo = config.repos[repoName];
    const uilibs = new Set(repo.uilibs || []);
    const usedByComponents = componentSpecs.some((spec) => {
      const uilib = spec.includes("/") ? spec.split("/")[0] : repo.uilibs[0];
      return uilibs.has(uilib);
    });
    const usedByPacks = [...templateSpecs, ...routeSpecs].some((spec) => spec.startsWith(`${repoName}/`));
    if (usedByComponents || usedByPacks) repoNames.add(repoName);
  }
  if (repoNames.size === 0) {
    return config.repos;
  }
  const trimmed = {};
  for (const repoName of repoNames) {
    trimmed[repoName] = config.repos[repoName];
  }
  return trimmed;
}

function parseExportSections(positionals) {
  const hasSectionKeywords = positionals.some((p) =>
    SECTION_KEYWORDS.has(String(p).trim().toLowerCase())
  );
  const sections = {
    components: !hasSectionKeywords,
    templates: !hasSectionKeywords,
    routes: !hasSectionKeywords,
  };
  const componentFilters = [];
  const templateSpecs = [];
  const routeSpecs = [];

  let activeSection = null;
  for (const positional of positionals) {
    const lower = String(positional).trim().toLowerCase();
    if (SECTION_KEYWORDS.has(lower)) {
      sections.components = false;
      sections.templates = false;
      sections.routes = false;
      sections[lower] = true;
      activeSection = lower;
      continue;
    }
    if (isUilibPackSpec(positional)) {
      if (activeSection === "routes") routeSpecs.push(positional);
      else if (activeSection === "templates") templateSpecs.push(positional);
      else if (activeSection === "components") {
        componentFilters.push(positional);
      } else {
        routeSpecs.push(positional);
      }
      continue;
    }
    componentFilters.push(positional);
  }

  return { sections, componentFilters, templateSpecs, routeSpecs };
}

function buildManifest({
  config,
  componentSpecs,
  templateSpecs,
  routeSpecs,
  sections,
}) {
  const trimmedConfig = {
    ...config,
    repos: reposForManifest(config, componentSpecs, templateSpecs, routeSpecs),
  };
  const manifest = {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    config: trimmedConfig,
  };
  if (sections.components) manifest.components = componentSpecs;
  if (sections.templates) manifest.templates = templateSpecs;
  if (sections.routes) manifest.routes = routeSpecs;
  return manifest;
}

function writeManifestFile(manifestPath, manifest) {
  validateManifest(manifest);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

module.exports = {
  MANIFEST_SCHEMA_VERSION,
  buildManifest,
  filterComponentSpecs,
  listInstalledComponentSpecs,
  parseExportSections,
  readManifestFile,
  validateManifest,
  writeManifestFile,
};
