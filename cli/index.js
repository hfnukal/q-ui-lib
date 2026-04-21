// cli/index.js
const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const os = require('os');
const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;

const { runSyncTemplate } = require('./sync-template');

const program = new Command();

const libRoot = path.resolve(__dirname, '..');
const baseDir = path.join(libRoot, 'components', 'base');
const utilitiesSrc = path.join(libRoot, 'components', 'utilities');
const UTILITIES_SLUG = 'utilities';

function readLibMeta(comp) {
  const metaPath = path.join(baseDir, comp, 'meta.generated.json');
  if (!fs.existsSync(metaPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

/**
 * BFS closure of `dependencies` from each component's meta (sibling UI folders).
 * `utilities` is omitted — synced via syncUtilitiesToApp.
 * @param {string[]} seeds kebab-case component folder names
 * @returns {string[]} stable BFS order, deduplicated
 */
function expandTransitiveComponentSlugs(seeds) {
  const ordered = [];
  const seen = new Set();
  const queue = [...seeds];
  while (queue.length) {
    const name = queue.shift();
    if (!name || seen.has(name)) continue;
    if (name === UTILITIES_SLUG) continue;
    const compDir = path.join(baseDir, name);
    if (!fs.existsSync(compDir)) {
      console.log(chalk.red(`Component ${name} does not exist in library.`));
      continue;
    }
    seen.add(name);
    ordered.push(name);
    const meta = readLibMeta(name);
    if (!meta || !Array.isArray(meta.dependencies)) continue;
    for (const d of meta.dependencies) {
      if (d === UTILITIES_SLUG) continue;
      if (!seen.has(d)) queue.push(d);
    }
  }
  return ordered;
}

function warnMissingNpmPackages(appRoot, expandedSlugs) {
  const pkgJsonPath = path.join(path.resolve(appRoot), 'package.json');
  /** @type {Set<string>} */
  const appPkgs = new Set();
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const j = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      for (const key of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
        const o = j[key];
        if (o && typeof o === 'object') {
          for (const k of Object.keys(o)) appPkgs.add(k);
        }
      }
    } catch {
      // ignore malformed package.json
    }
  }
  const required = new Set();
  for (const slug of expandedSlugs) {
    const meta = readLibMeta(slug);
    if (!meta || !Array.isArray(meta.npmDependencies)) continue;
    for (const p of meta.npmDependencies) {
      required.add(p);
    }
  }
  const missing = [...required].filter((p) => !appPkgs.has(p)).sort();
  if (missing.length === 0) return;
  console.log(
    chalk.yellow(
      'Missing npm packages for copied components (install in the target app):'
    )
  );
  console.log(chalk.yellow(`  npm install ${missing.join(' ')}`));
}

/**
 * Zkopíruje `components/utilities/` do `<cíl>/src/components/ui/utilities/`
 * (import `../utilities/…` ze sousední složky komponenty).
 */
function syncUtilitiesToApp(targetApp) {
  if (!fs.existsSync(utilitiesSrc)) {
    return;
  }
  const appRoot = path.resolve(targetApp);
  const dest = path.join(appRoot, 'src', 'components', 'ui', 'utilities');
  fs.ensureDirSync(path.dirname(dest));
  fs.copySync(utilitiesSrc, dest);
  console.log(chalk.green(`Synced library utilities to ${dest}`));
}

program
  .name('q-ui-lib')
  .description('Bootstrap Qwik apps from the template and sync UI components');

// Helper to copy template
function copyTemplate(target) {
  const src = path.resolve(__dirname, '..', 'template');
  const dest = path.resolve(target);
  // if (fs.existsSync(dest)) {
  //   console.log(chalk.yellow(`Target directory ${dest} already exists.`));
  //   process.exit(1);
  // }
  fs.copySync(src, dest);
  console.log(chalk.green(`Template copied to ${dest}`));
  syncUtilitiesToApp(dest);
  // Ask to run npm install
  const answer = require('readline')
    .createInterface({ input: process.stdin, output: process.stdout })
    .question('Run npm install now? (y/N): ', (ans) => {
      if (ans.toLowerCase() === 'y') {
        execSync('npm install', { cwd: dest, stdio: 'inherit' });
        console.log(chalk.green('Dependencies installed.'));
      }
      process.exit(0);
    });
}

/** Copy listed components from library into target app's src/components/ui/. */
function copyComponents(targetApp, components, verb = 'Added') {
  const appRoot = path.resolve(targetApp);
  const seedSet = new Set(components);
  const expanded = expandTransitiveComponentSlugs(components);
  const extra = expanded.filter((c) => !seedSet.has(c));
  if (extra.length > 0) {
    console.log(chalk.cyan(`Transitive UI dependencies included: ${extra.join(', ')}`));
  }
  syncUtilitiesToApp(appRoot);
  const uiDir = path.join(appRoot, 'src', 'components', 'ui');
  fs.ensureDirSync(uiDir);
  expanded.forEach((comp) => {
    const srcComp = path.join(baseDir, comp);
    if (!fs.existsSync(srcComp)) {
      console.log(chalk.red(`Component ${comp} does not exist in library.`));
      return;
    }
    const destComp = path.join(uiDir, comp);
    fs.copySync(srcComp, destComp);
    console.log(chalk.green(`${verb} ${comp} to ${destComp}`));
  });
  warnMissingNpmPackages(appRoot, expanded);
}

/**
 * Runs the demo route generator for the given slugs (or all) into targetApp.
 * Only runs when targetApp has src/routes/components/ — i.e. it's the demo app.
 * @param {string} targetApp
 * @param {string[]} slugs  empty = all components
 */
function generateDemoRoutes(targetApp, slugs) {
  const routesDir = path.join(path.resolve(targetApp), 'src', 'routes', 'components');
  if (!fs.existsSync(routesDir)) return;

  const script = path.resolve(__dirname, '..', 'scripts', 'generate-demo.mjs');
  if (!fs.existsSync(script)) {
    console.log(chalk.yellow('generate-demo.mjs not found, skipping demo route generation.'));
    return;
  }

  const extraArgs = ['--target', path.resolve(targetApp), ...slugs];
  const result = spawnSync(process.execPath, [script, ...extraArgs], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.log(chalk.yellow('Demo route generation failed (non-zero exit), continuing.'));
  }
}

// Interactive update by meta.generated.json version mismatch, or explicit sync when component names given
function updateComponents(targetApp, explicitComponents, opts = {}) {
  // Explicit list: sync those components directly
  if (explicitComponents && explicitComponents.length > 0) {
    copyComponents(targetApp, explicitComponents, 'Updated');
    generateDemoRoutes(targetApp, explicitComponents);
    return;
  }

  const appRoot = path.resolve(targetApp);
  const uiDir = path.join(appRoot, 'src', 'components', 'ui');
  if (!fs.existsSync(uiDir)) {
    console.log(chalk.red('No UI components directory found in target app.'));
    process.exit(1);
  }

  // --all: update every installed component that exists in the library
  if (opts.all) {
    const installed = fs.readdirSync(uiDir).filter((name) => {
      if (name === UTILITIES_SLUG) return false;
      return fs.existsSync(path.join(baseDir, name));
    });
    if (installed.length === 0) {
      console.log(chalk.yellow('No library components found in target app.'));
      return;
    }
    console.log(chalk.cyan(`Updating ${installed.length} component(s): ${installed.join(', ')}`));
    copyComponents(targetApp, installed, 'Updated');
    generateDemoRoutes(targetApp, installed);
    return;
  }

  // Interactive: prompt for each version-mismatched component
  syncUtilitiesToApp(appRoot);
  const comps = fs.readdirSync(baseDir);
  comps.forEach((comp) => {
    const libMetaPath = path.join(baseDir, comp, 'meta.generated.json');
    if (!fs.existsSync(libMetaPath)) {
      return;
    }
    const libMeta = JSON.parse(fs.readFileSync(libMetaPath, 'utf-8'));
    const appCompPath = path.join(uiDir, comp);
    const appMetaPath = path.join(appCompPath, 'meta.generated.json');
    if (fs.existsSync(appMetaPath)) {
      const appMeta = JSON.parse(fs.readFileSync(appMetaPath, 'utf-8'));
      if (appMeta.version !== libMeta.version) {
        console.log(chalk.yellow(`Component ${comp} version mismatch:`));
        console.log(`  App: ${appMeta.version}  Library: ${libMeta.version}`);
        const rl = require('readline')
          .createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Update this component? (y/N): ', (ans) => {
          if (ans.toLowerCase() === 'y') {
            const expanded = expandTransitiveComponentSlugs([comp]);
            const extra = expanded.filter((c) => c !== comp);
            if (extra.length > 0) {
              console.log(chalk.cyan(`Transitive UI dependencies included: ${extra.join(', ')}`));
            }
            for (const c of expanded) {
              const dest = path.join(uiDir, c);
              fs.copySync(path.join(baseDir, c), dest);
              console.log(chalk.green(`Updated ${c}`));
            }
            warnMissingNpmPackages(appRoot, expanded);
            generateDemoRoutes(targetApp, [comp]);
          }
          rl.close();
        });
      }
    }
  });
}

program
  .command('init <target>')
  .description('Initialize a new Qwik app from the template')
  .action(copyTemplate);

program
  .command('add <target> <components...>')
  .description('Add specified components to an existing Qwik app')
  .action((target, components) => copyComponents(target, components));

program
  .command('update <target> [components...]')
  .description(
    'Update components. Named: sync those components. --all: update all installed. No args: interactive version-based update.'
  )
  .option('--all', 'Update all components installed in the target app without prompting')
  .action((target, components, opts) => {
    const list = Array.isArray(components) ? components : [];
    updateComponents(target, list, opts);
  });

program
  .command('generate')
  .description('Generate meta.generated.json for all components (runs scripts/generate-meta.mjs)')
  .action(() => {
    const script = path.resolve(__dirname, '..', 'scripts', 'generate-meta.mjs');
    const result = spawnSync(process.execPath, [script], { stdio: 'inherit' });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  });

program
  .command('generate-demo <target> [components...]')
  .description('Generate demo routes from component JSDoc into <target>/src/routes/components/')
  .option('--installed', 'Generate only for components installed in <target>/src/components/ui/')
  .action((target, components, opts) => {
    let slugs = Array.isArray(components) ? components : [];
    if (opts.installed && slugs.length === 0) {
      const uiDir = path.join(path.resolve(target), 'src', 'components', 'ui');
      if (!fs.existsSync(uiDir)) {
        console.log(chalk.red(`No src/components/ui/ found in ${target}`));
        process.exit(1);
      }
      slugs = fs.readdirSync(uiDir).filter((name) => {
        if (name === UTILITIES_SLUG) return false;
        return fs.existsSync(path.join(baseDir, name));
      });
      if (slugs.length === 0) {
        console.log(chalk.yellow('No installed library components found.'));
        return;
      }
      console.log(chalk.cyan(`Generating demos for ${slugs.length} installed component(s): ${slugs.join(', ')}`));
    }
    generateDemoRoutes(target, slugs);
  });

program
  .command('sync-template <target>')
  .description(
    'Sync template files into an existing app: show diff and confirm each change, or use --yes to overwrite all'
  )
  .option('-y, --yes', 'Apply every template file without prompting; lists paths first')
  .action(async (target, opts) => {
    try {
      await runSyncTemplate(target, opts);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

// ─── Registry helpers ─────────────────────────────────────────────────────────

const registryJsonPath = path.join(libRoot, 'components', 'registry.json');

function readRegistry() {
  if (!fs.existsSync(registryJsonPath)) return {};
  try { return JSON.parse(fs.readFileSync(registryJsonPath, 'utf8')); } catch { return {}; }
}

function writeRegistry(data) {
  fs.writeFileSync(registryJsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/**
 * git clone <url> into a unique temp dir; returns { tempDir, cleanup }.
 * @param {string} url
 */
function cloneToTemp(url) {
  const tempDir = path.join(os.tmpdir(), `qui-registry-${Date.now()}`);
  console.log(chalk.cyan(`Cloning ${url} …`));
  try {
    execSync(`git clone --depth 1 ${JSON.stringify(url)} ${JSON.stringify(tempDir)}`, { stdio: 'pipe' });
  } catch (e) {
    console.error(chalk.red(`git clone failed: ${e.message}`));
    process.exit(1);
  }
  const cleanup = () => { try { fs.removeSync(tempDir); } catch {} };
  return { tempDir, cleanup };
}

/**
 * Collect all file paths relative to baseDir recursively.
 * @param {string} baseDir
 * @returns {Set<string>}
 */
function collectRelativePaths(baseDir) {
  const result = new Set();
  if (!fs.existsSync(baseDir)) return result;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); }
      else { result.add(path.relative(baseDir, full)); }
    }
  }
  walk(baseDir);
  return result;
}

/**
 * Sync remote set (from tempDir) into local components/<owner>/<set>/.
 * Deletes files removed from remote, copies new/updated files.
 * @param {string} tempDir
 * @param {string} owner
 * @param {string} set
 * @returns {{ added: string[], updated: string[], deleted: string[] }}
 */
function syncSetFromTemp(tempDir, owner, set) {
  const remotePath = path.join(tempDir, 'components', owner, set);
  const localPath  = path.join(libRoot, 'components', owner, set);

  if (!fs.existsSync(remotePath)) {
    console.error(chalk.red(`Remote does not contain components/${owner}/${set}/`));
    process.exit(1);
  }

  const remoteFiles = collectRelativePaths(remotePath);
  const localFiles  = collectRelativePaths(localPath);

  const added = [], updated = [], deleted = [];

  // Delete files present locally but gone from remote
  for (const f of localFiles) {
    if (!remoteFiles.has(f)) {
      fs.removeSync(path.join(localPath, f));
      deleted.push(f);
    }
  }

  // Copy all remote files (add + update)
  for (const f of remoteFiles) {
    const dest = path.join(localPath, f);
    const src  = path.join(remotePath, f);
    const isNew = !localFiles.has(f);
    fs.ensureDirSync(path.dirname(dest));
    fs.copyFileSync(src, dest);
    (isNew ? added : updated).push(f);
  }

  return { added, updated, deleted };
}

// ─── Registry commands ────────────────────────────────────────────────────────

const registryCmd = program.command('registry').description('Manage external component sets');

registryCmd
  .command('add <git-url> <owner> <set>')
  .description('Install an external set from a Git repo into components/<owner>/<set>/')
  .action((url, owner, set) => {
    const { tempDir, cleanup } = cloneToTemp(url);
    try {
      const { added, updated, deleted } = syncSetFromTemp(tempDir, owner, set);
      const sha = execSync(`git -C ${JSON.stringify(tempDir)} rev-parse HEAD`, { encoding: 'utf8' }).trim();

      const reg = readRegistry();
      reg[`${owner}/${set}`] = { url, syncedAt: sha };
      writeRegistry(reg);

      console.log(chalk.green(`Added ${added.length} files, updated ${updated.length}.`));
      if (deleted.length) console.log(chalk.yellow(`Deleted: ${deleted.join(', ')}`));
      console.log(chalk.green(`Registry entry written for ${owner}/${set} @ ${sha.slice(0, 8)}`));
    } finally {
      cleanup();
    }
  });

registryCmd
  .command('sync [owner-set]')
  .description('Sync registered external sets (all, or one owner/set)')
  .action((ownerSet) => {
    const reg = readRegistry();
    const keys = Object.keys(reg).filter(k => !ownerSet || k === ownerSet);
    if (keys.length === 0) {
      console.log(chalk.yellow(ownerSet ? `No registry entry for ${ownerSet}` : 'No external sets registered.'));
      return;
    }
    for (const key of keys) {
      const { url } = reg[key];
      const [owner, set] = key.split('/');
      console.log(chalk.cyan(`\nSyncing ${key} from ${url} …`));
      const { tempDir, cleanup } = cloneToTemp(url);
      try {
        const { added, updated, deleted } = syncSetFromTemp(tempDir, owner, set);
        const sha = execSync(`git -C ${JSON.stringify(tempDir)} rev-parse HEAD`, { encoding: 'utf8' }).trim();
        reg[key].syncedAt = sha;
        if (added.length)   console.log(chalk.green(`  Added:   ${added.join(', ')}`));
        if (updated.length) console.log(chalk.green(`  Updated: ${updated.join(', ')}`));
        if (deleted.length) console.log(chalk.yellow(`  Deleted: ${deleted.join(', ')}`));
        console.log(chalk.green(`  Synced ${key} @ ${sha.slice(0, 8)}`));
      } finally {
        cleanup();
      }
    }
    writeRegistry(reg);
  });

// ─── qui add — 3-level component ID support ───────────────────────────────────

/**
 * Parse a component ID: "owner/set/slug" or "owner/set/slug:alias" or flat "slug".
 * @param {string} id
 * @returns {{ owner: string|null, set: string|null, slug: string, alias: string, dir: string }|null}
 */
function parseComponentId(id) {
  const [idPart, alias] = id.split(':');
  const parts = idPart.split('/');
  if (parts.length === 3) {
    const [owner, set, slug] = parts;
    const dir = path.join(libRoot, 'components', owner, set, slug);
    return { owner, set, slug, alias: alias || slug, dir };
  }
  if (parts.length === 1) {
    // flat legacy slug
    const slug = parts[0];
    const dir = path.join(libRoot, 'components', slug);
    return { owner: null, set: null, slug, alias: alias || slug, dir };
  }
  return null;
}

/**
 * Transitively collect component dirs for a 3-level component ID.
 * Dependencies must exist under components/<owner>/<set>/ — error otherwise.
 * @param {{ owner:string, set:string, slug:string, dir:string }} entry
 * @returns {Array<{ slug: string, srcDir: string, destName: string }>}
 */
function expandTransitive3Level(entry) {
  const { owner, set } = entry;
  const setDir = path.join(libRoot, 'components', owner, set);
  const ordered = [];
  const seen = new Set();
  const queue = [entry];

  while (queue.length) {
    const item = queue.shift();
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);

    if (!fs.existsSync(item.dir)) {
      console.error(chalk.red(`Dependency "${item.slug}" not found under components/${owner}/${set}/ — set is malformed.`));
      process.exit(1);
    }

    ordered.push(item);

    const metaPath = path.join(item.dir, 'meta.generated.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    for (const dep of (meta.dependencies || [])) {
      if (!seen.has(dep)) {
        queue.push({ owner, set, slug: dep, alias: dep, dir: path.join(setDir, dep) });
      }
    }
  }
  return ordered;
}

/**
 * Copy a 3-level component (and transitive deps) into an app.
 * @param {string} targetApp
 * @param {string} id  e.g. "shanny/eshop/cart" or "shanny/eshop/cart:myCart"
 * @param {'abort'|'skip'|'force'} conflictMode
 */
function copyComponentById(targetApp, id, conflictMode) {
  const parsed = parseComponentId(id);
  if (!parsed) {
    console.error(chalk.red(`Invalid component ID: ${id}. Use "owner/set/slug" or "slug".`));
    process.exit(1);
  }

  // Flat slug → delegate to existing logic
  if (!parsed.owner) {
    copyComponents(targetApp, [parsed.slug]);
    return;
  }

  const appRoot = path.resolve(targetApp);
  const uiDir = path.join(appRoot, 'src', 'components', 'ui');
  fs.ensureDirSync(uiDir);

  const items = expandTransitive3Level(parsed);
  const extra = items.filter(i => i.slug !== parsed.slug);
  if (extra.length) console.log(chalk.cyan(`Transitive dependencies: ${extra.map(i => i.slug).join(', ')}`));

  for (const item of items) {
    const destName = item.slug === parsed.slug ? parsed.alias : item.slug;
    const dest = path.join(uiDir, destName);

    if (fs.existsSync(dest)) {
      if (conflictMode === 'abort') {
        console.error(chalk.red(`Conflict: ${dest} already exists. Use --skip or --force.`));
        process.exit(1);
      }
      if (conflictMode === 'skip') {
        console.log(chalk.yellow(`Skipped (exists): ${destName}`));
        continue;
      }
      // force: overwrite
    }

    fs.copySync(item.dir, dest);
    console.log(chalk.green(`Copied ${item.owner}/${item.set}/${item.slug} → ${destName}`));
  }

  syncUtilitiesToApp(appRoot);
  warnMissingNpmPackages(appRoot, items.map(i => i.slug));
}

// ─── qui clone ────────────────────────────────────────────────────────────────

program
  .command('clone <src-id> <dest-id>')
  .description('Copy a component inside the library workspace (e.g. base/button → owner/myapp/button)')
  .action((srcId, destId) => {
    const srcParts = srcId.split('/');
    const destParts = destId.split('/');

    if (destParts.length < 3) {
      console.error(chalk.red('dest must be "owner/set/slug".'));
      process.exit(1);
    }

    const srcDir = path.join(libRoot, 'components', ...srcParts);
    if (!fs.existsSync(srcDir)) {
      console.error(chalk.red(`Source not found: components/${srcId}`));
      process.exit(1);
    }

    const destDir = path.join(libRoot, 'components', ...destParts);
    if (fs.existsSync(destDir)) {
      console.error(chalk.red(`Destination already exists: components/${destId}`));
      process.exit(1);
    }

    fs.copySync(srcDir, destDir);

    // Update @component directive to match new slug
    const newSlug = destParts[destParts.length - 1];
    const indexPath = path.join(destDir, 'index.tsx');
    if (fs.existsSync(indexPath)) {
      const src = fs.readFileSync(indexPath, 'utf8');
      const updated = src.replace(/(@component\s+)\S+/, `$1${newSlug}`);
      if (updated !== src) fs.writeFileSync(indexPath, updated, 'utf8');
    }

    console.log(chalk.green(`Cloned components/${srcId} → components/${destId}`));
    console.log(chalk.cyan(`Next: edit components/${destId}/index.tsx, then npm run generate:meta`));
  });

// ─── Updated add command with conflict flags ──────────────────────────────────

// Remove the previously registered 'add' command and re-register with options
program.commands = program.commands.filter(c => c.name() !== 'add');

program
  .command('add <target> <components...>')
  .description('Add components to an app. Supports flat slugs or "owner/set/slug[:alias]" IDs.')
  .option('--skip',  'Skip files that already exist in the target (default for 3-level: --abort)')
  .option('--force', 'Overwrite existing files without prompting')
  .action((target, components, opts) => {
    const conflictMode = opts.force ? 'force' : opts.skip ? 'skip' : 'abort';
    const has3Level = components.some(c => c.split(':')[0].split('/').length === 3);
    if (has3Level) {
      for (const id of components) copyComponentById(target, id, conflictMode);
    } else {
      copyComponents(target, components);
    }
  });

// ─────────────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
if (argv.length === 0) {
  program.outputHelp();
  process.exit(0);
}

program.parse(process.argv);
