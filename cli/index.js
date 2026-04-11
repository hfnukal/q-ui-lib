// cli/index.js
const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;

const { runSyncTemplate } = require('./sync-template');

const program = new Command();

const libRoot = path.resolve(__dirname, '..');
const utilitiesSrc = path.join(libRoot, 'components', 'utilities');
const UTILITIES_SLUG = 'utilities';

function readLibMeta(comp) {
  const metaPath = path.join(libRoot, 'components', comp, 'meta.generated.json');
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
    const compDir = path.join(libRoot, 'components', name);
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
  if (fs.existsSync(dest)) {
    console.log(chalk.yellow(`Target directory ${dest} already exists.`));
    process.exit(1);
  }
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
    const srcComp = path.resolve(__dirname, '..', 'components', comp);
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
function updateComponents(targetApp, explicitComponents) {
  if (explicitComponents && explicitComponents.length > 0) {
    copyComponents(targetApp, explicitComponents, 'Synced');
    generateDemoRoutes(targetApp, explicitComponents);
    return;
  }

  const appRoot = path.resolve(targetApp);
  const uiDir = path.join(appRoot, 'src', 'components', 'ui');
  if (!fs.existsSync(uiDir)) {
    console.log(chalk.red('No UI components directory found in target app.'));
    process.exit(1);
  }
  syncUtilitiesToApp(appRoot);
  const comps = fs.readdirSync(path.resolve(__dirname, '..', 'components'));
  comps.forEach((comp) => {
    const libMetaPath = path.join(__dirname, '..', 'components', comp, 'meta.generated.json');
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
              fs.copySync(path.join(__dirname, '..', 'components', c), dest);
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
    'Sync named components from the library into the app (e.g. demo), or run interactive version-based update when no names are given'
  )
  .action((target, components) => {
    const list = Array.isArray(components) ? components : [];
    updateComponents(target, list);
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
  .action((target, components) => {
    const slugs = Array.isArray(components) ? components : [];
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

const argv = process.argv.slice(2);
if (argv.length === 0) {
  program.outputHelp();
  process.exit(0);
}

program.parse(process.argv);
