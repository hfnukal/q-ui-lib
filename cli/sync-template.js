const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execFileSync } = require('child_process');
const readline = require('readline/promises');

/** Directory names skipped at any depth when walking the template tree */
const IGNORED_DIR_NAMES = new Set(['node_modules', 'dist', 'tmp', '.git']);
const IGNORED_FILE_NAMES = new Set(['.DS_Store']);

function listTemplateFiles(dir, base, acc) {
  if (base === undefined) {
    base = dir;
    acc = [];
  }
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    if (IGNORED_FILE_NAMES.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (IGNORED_DIR_NAMES.has(ent.name)) continue;
      listTemplateFiles(full, base, acc);
    } else {
      acc.push(path.relative(base, full));
    }
  }
  return acc;
}

function displayRel(rel) {
  return rel.split(path.sep).join('/');
}

function buffersEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.equals(b);
}

function unifiedDiff(targetPath, templatePath, isNew) {
  const oldPath = isNew ? '/dev/null' : targetPath;
  try {
    return execFileSync('diff', ['-u', oldPath, templatePath], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (e) {
    if (e.status === 1 && typeof e.stdout === 'string') {
      return e.stdout;
    }
    if (e.code === 'ENOENT') {
      return chalk.red('`diff` command not found; install diffutils or use a Unix-like environment.\n');
    }
    throw e;
  }
}

function collectChanges(templateRoot, targetRoot) {
  const relPaths = listTemplateFiles(templateRoot);
  const changes = [];
  for (const rel of relPaths) {
    const templatePath = path.join(templateRoot, rel);
    const targetPath = path.join(targetRoot, rel);
    const templateBuf = fs.readFileSync(templatePath);
    if (!fs.existsSync(targetPath)) {
      changes.push({ rel, type: 'new', templatePath, targetPath });
      continue;
    }
    const targetBuf = fs.readFileSync(targetPath);
    if (!buffersEqual(templateBuf, targetBuf)) {
      changes.push({ rel, type: 'modified', templatePath, targetPath });
    }
  }
  return changes;
}

function applyChange({ templatePath, targetPath }) {
  fs.ensureDirSync(path.dirname(targetPath));
  fs.copyFileSync(templatePath, targetPath);
}

/**
 * @param {string} target
 * @param {{ yes?: boolean }} options
 */
async function runSyncTemplate(target, options) {
  const templateRoot = path.resolve(__dirname, '..', 'template');
  const targetRoot = path.resolve(target);

  if (!fs.existsSync(templateRoot)) {
    console.error(chalk.red(`Template directory not found: ${templateRoot}`));
    process.exit(1);
  }
  if (!fs.existsSync(targetRoot)) {
    console.error(chalk.red(`Target directory does not exist: ${targetRoot}`));
    console.error(chalk.dim('Use `init` to create a new app from the template.'));
    process.exit(1);
  }

  const changes = collectChanges(templateRoot, targetRoot);
  if (changes.length === 0) {
    console.log(chalk.green('All template files already match the target app.'));
    return;
  }

  if (options.yes) {
    console.log(chalk.cyan('Applying template (--yes): the following files will be created or overwritten:\n'));
    for (const c of changes) {
      const tag = c.type === 'new' ? chalk.green('[new]') : chalk.yellow('[update]');
      console.log(`  ${tag} ${displayRel(c.rel)}`);
    }
    console.log('');
    for (const c of changes) {
      applyChange(c);
    }
    console.log(chalk.green(`Done. ${changes.length} file(s) updated.`));
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let applyAll = false;
  let applied = 0;

  try {
    for (const c of changes) {
      if (applyAll) {
        applyChange(c);
        applied++;
        continue;
      }

      const header =
        c.type === 'new'
          ? chalk.green(`New file: ${displayRel(c.rel)}`)
          : chalk.yellow(`Modified: ${displayRel(c.rel)}`);
      console.log(`\n${header}\n`);
      const diffText = unifiedDiff(c.targetPath, c.templatePath, c.type === 'new');
      process.stdout.write(diffText);
      if (!diffText.endsWith('\n')) process.stdout.write('\n');

      const ans = (await rl.question(chalk.cyan('Apply this change? [y]es / [n]o / [a]ll remaining / [q]uit: ')))
        .trim()
        .toLowerCase();

      if (ans === 'q' || ans === 'quit') {
        console.log(chalk.dim('Stopped. Earlier confirmations were already applied.'));
        break;
      }
      if (ans === 'a' || ans === 'all') {
        applyAll = true;
        applyChange(c);
        applied++;
        continue;
      }
      if (ans === 'y' || ans === 'yes') {
        applyChange(c);
        applied++;
        continue;
      }
      console.log(chalk.dim('Skipped.'));
    }
  } finally {
    await rl.close();
  }

  console.log(chalk.green(`\nFinished. ${applied} file(s) updated.`));
}

module.exports = { runSyncTemplate, listTemplateFiles, collectChanges };
