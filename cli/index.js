// cli/index.js
const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const execSync = require('child_process').execSync;

const { runSyncTemplate } = require('./sync-template');

const program = new Command();

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

// Helper to add components
function addComponents(targetApp, components) {
  const appRoot = path.resolve(targetApp);
  const uiDir = path.join(appRoot, 'src', 'components', 'ui');
  fs.ensureDirSync(uiDir);
  components.forEach((comp) => {
    const srcComp = path.resolve(__dirname, '..', 'components', comp);
    if (!fs.existsSync(srcComp)) {
      console.log(chalk.red(`Component ${comp} does not exist in library.`));
      return;
    }
    const destComp = path.join(uiDir, comp);
    fs.copySync(srcComp, destComp);
    console.log(chalk.green(`Added ${comp} to ${destComp}`));
  });
}

/** Copy listed components from library into target app (demo/src/components/ui/). */
function syncComponentsToApp(targetApp, components) {
  const appRoot = path.resolve(targetApp);
  const uiDir = path.join(appRoot, 'src', 'components', 'ui');
  fs.ensureDirSync(uiDir);
  components.forEach((comp) => {
    const srcComp = path.resolve(__dirname, '..', 'components', comp);
    if (!fs.existsSync(srcComp)) {
      console.log(chalk.red(`Component ${comp} does not exist in library.`));
      return;
    }
    const destComp = path.join(uiDir, comp);
    fs.copySync(srcComp, destComp);
    console.log(chalk.green(`Synced ${comp} to ${destComp}`));
  });
}

// Interactive update by meta.json version mismatch, or explicit sync when component names given
function updateComponents(targetApp, explicitComponents) {
  if (explicitComponents && explicitComponents.length > 0) {
    syncComponentsToApp(targetApp, explicitComponents);
    return;
  }

  const appRoot = path.resolve(targetApp);
  const uiDir = path.join(appRoot, 'src', 'components', 'ui');
  if (!fs.existsSync(uiDir)) {
    console.log(chalk.red('No UI components directory found in target app.'));
    process.exit(1);
  }
  const comps = fs.readdirSync(path.resolve(__dirname, '..', 'components'));
  comps.forEach((comp) => {
    const libMetaPath = path.join(__dirname, '..', 'components', comp, 'meta.json');
    const libMeta = JSON.parse(fs.readFileSync(libMetaPath, 'utf-8'));
    const appCompPath = path.join(uiDir, comp);
    const appMetaPath = path.join(appCompPath, 'meta.json');
    if (fs.existsSync(appMetaPath)) {
      const appMeta = JSON.parse(fs.readFileSync(appMetaPath, 'utf-8'));
      if (appMeta.version !== libMeta.version) {
        console.log(chalk.yellow(`Component ${comp} version mismatch:`));
        console.log(`  App: ${appMeta.version}  Library: ${libMeta.version}`);
        const rl = require('readline')
          .createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Update this component? (y/N): ', (ans) => {
          if (ans.toLowerCase() === 'y') {
            fs.copySync(path.join(__dirname, '..', 'components', comp), appCompPath);
            console.log(chalk.green(`Updated ${comp}`));
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
  .action(addComponents);

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
