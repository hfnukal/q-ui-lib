const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");

function readMeta(componentDir) {
  const metaPath = path.join(componentDir, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, "utf8"));
}

function expandTransitiveComponents(componentsDir, seeds) {
  const queue = [...new Set(seeds)];
  const ordered = [];
  const seen = new Set();
  while (queue.length > 0) {
    const slug = queue.shift();
    if (!slug || seen.has(slug)) continue;
    const componentDir = path.join(componentsDir, slug);
    if (!fs.existsSync(componentDir)) {
      const err = new Error(`Component '${slug}' not found in source '${componentsDir}'.`);
      err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
      throw err;
    }
    seen.add(slug);
    ordered.push(slug);
    const meta = readMeta(componentDir);
    const deps = Array.isArray(meta?.dependencies) ? meta.dependencies : [];
    for (const dep of deps) {
      if (!seen.has(dep)) queue.push(dep);
    }
  }
  return ordered;
}

function collectNpmDependencies(componentsDir, slugs) {
  const dependencies = new Set();
  const devDependencies = new Set();
  for (const slug of slugs) {
    const meta = readMeta(path.join(componentsDir, slug));
    const deps = Array.isArray(meta?.npmDependencies) ? meta.npmDependencies : [];
    const devDeps = Array.isArray(meta?.npmDevDependencies) ? meta.npmDevDependencies : [];
    for (const pkg of deps) dependencies.add(pkg);
    for (const pkg of devDeps) devDependencies.add(pkg);
  }
  return {
    dependencies: [...dependencies].sort(),
    devDependencies: [...devDependencies].sort(),
  };
}

module.exports = {
  collectNpmDependencies,
  expandTransitiveComponents,
};
