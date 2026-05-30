const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const readline = require("node:readline/promises");
const { EXIT_CODES } = require("../constants");

function isInteractiveTerminal() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

function userRejected(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USER_REJECTED_PLAN;
  return err;
}

function nonInteractiveAskError(hint) {
  const err = new Error(
    `${hint} Use --yes, --auto, or --force in non-interactive environments.`
  );
  err.exitCode = EXIT_CODES.USER_REJECTED_PLAN;
  return err;
}

async function promptText(message, defaultValue = "") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const suffix = defaultValue ? ` [${defaultValue}]` : "";
    const raw = await rl.question(`${message}${suffix}: `);
    const trimmed = String(raw || "").trim();
    return trimmed || defaultValue;
  } finally {
    await rl.close();
  }
}

async function confirmYesNo(message, defaultYes = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const suffix = defaultYes ? "[Y/n]" : "[y/N]";
    const raw = await rl.question(`${message} ${suffix} `);
    const t = String(raw || "").trim().toLowerCase();
    if (!t) return defaultYes;
    return t === "y" || t === "yes";
  } finally {
    await rl.close();
  }
}

/**
 * @param {string} message
 * @param {() => void | Promise<void>} [onDiff]
 * @returns {Promise<'yes'|'no'>}
 */
async function promptUpdateConfirm(message, onDiff) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    for (;;) {
      const msg =
        `${message}\n` +
        `  [y] yes overwrite  [n] no  [d] diff\n` +
        `Choice (default n): `;
      const raw = await rl.question(msg);
      const c = String(raw || "").trim().toLowerCase().charAt(0);
      if (c === "y") return "yes";
      if (c === "n" || !c) return "no";
      if (c === "d" && onDiff) {
        await onDiff();
        continue;
      }
    }
  } finally {
    await rl.close();
  }
}

/**
 * Unified diff: current project file vs incoming template (what overwrite would apply).
 * @param {string} existingPath
 * @param {string} templatePath
 * @param {string} relPath
 */
function printTemplateConflictDiff(existingPath, templatePath, relPath) {
  const r = spawnSync("diff", ["-u", existingPath, templatePath], {
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });
  if (r.error) {
    console.log(`(system "diff" not available: ${r.error.message})\n`);
    printTemplateConflictFallback(existingPath, templatePath, relPath);
    return;
  }
  if (r.status === 0) {
    console.log("(no difference reported by diff — files may match)\n");
    return;
  }
  if (r.status === 1) {
    const out = r.stdout || "";
    process.stdout.write(out.endsWith("\n") ? out : `${out}\n`);
    return;
  }
  if (r.stderr) process.stderr.write(r.stderr);
  printTemplateConflictFallback(existingPath, templatePath, relPath);
}

function normalizeTextLineEndings(s) {
  return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/** @param {Buffer} buf */
function bufferLooksBinary(buf) {
  return buf.includes(0);
}

/**
 * True if replacing existing with incoming would not change meaningful content:
 * identical bytes, or identical UTF-8 text after newline normalization (e.g. CRLF vs LF).
 * Used to skip conflict prompts when a raw byte compare already failed.
 *
 * @param {string} existingPath
 * @param {string} incomingPath
 */
function filesAreEquivalentForReplace(existingPath, incomingPath) {
  let bufA;
  let bufB;
  try {
    bufA = fs.readFileSync(existingPath);
    bufB = fs.readFileSync(incomingPath);
  } catch {
    return false;
  }
  if (bufA.equals(bufB)) return true;
  if (bufferLooksBinary(bufA) || bufferLooksBinary(bufB)) return false;
  try {
    const sA = normalizeTextLineEndings(bufA.toString("utf8"));
    const sB = normalizeTextLineEndings(bufB.toString("utf8"));
    return sA === sB;
  } catch {
    return false;
  }
}

function printTemplateConflictFallback(existingPath, templatePath, relPath) {
  let current;
  let incoming;
  try {
    current = fs.readFileSync(existingPath, "utf8");
  } catch (e) {
    current = `(read failed: ${/** @type {Error} */ (e).message})`;
  }
  try {
    incoming = fs.readFileSync(templatePath, "utf8");
  } catch (e) {
    incoming = `(read failed: ${/** @type {Error} */ (e).message})`;
  }
  console.log(`--- current file (${relPath}) ---\n${current}`);
  console.log(`--- template file (${relPath}) ---\n${incoming}\n`);
}

/**
 * @param {string} relPath
 * @param {string} existingPath project file that would be replaced on overwrite
 * @param {string} templatePath incoming template file
 * @param {{ title?: string }} [options]
 * @returns {Promise<'overwrite'|'postfix'|'skip'>}
 */
async function promptTemplateConflict(relPath, existingPath, templatePath, options = {}) {
  const title = options.title || `Template conflict: ${relPath}`;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    for (;;) {
      const msg =
        `${title}\n` +
        `  [o] overwrite  [p] save as *-template*  [s] skip  [d] diff\n` +
        `Choice (default p): `;
      const raw = await rl.question(msg);
      const c = String(raw || "").trim().toLowerCase().charAt(0);
      if (c === "o") return "overwrite";
      if (c === "s") return "skip";
      if (c === "d") {
        printTemplateConflictDiff(existingPath, templatePath, relPath);
        continue;
      }
      return "postfix";
    }
  } finally {
    await rl.close();
  }
}

/**
 * @param {string} message
 * @param {{ label: string, value: string }[]} options
 */
async function promptSelectOne(message, options) {
  if (options.length === 0) {
    const err = new Error("No options available for selection.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    process.stdout.write(`${message}\n`);
    for (let i = 0; i < options.length; i += 1) {
      process.stdout.write(`  ${i + 1}) ${options[i].label}\n`);
    }
    for (;;) {
      const raw = await rl.question(`Select [1-${options.length}]: `);
      const trimmed = String(raw || "").trim();
      const asNumber = Number.parseInt(trimmed, 10);
      if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= options.length) {
        return options[asNumber - 1].value;
      }
      if (trimmed) {
        const byValue = options.find((o) => o.value === trimmed);
        if (byValue) return byValue.value;
      }
    }
  } finally {
    await rl.close();
  }
}

/**
 * @param {string} message
 * @param {{ label: string, value: string }[]} options
 * @param {{ beforeQuestion?: () => void }} [promptOptions]
 * @returns {Promise<string[]>}
 */
async function promptSelectMany(message, options, promptOptions = {}) {
  if (options.length === 0) {
    const err = new Error("No uilibs available for selection.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    process.stdout.write(`${message}\n`);
    for (let i = 0; i < options.length; i += 1) {
      process.stdout.write(`  ${i + 1}) ${options[i].label}\n`);
    }
    process.stdout.write("\n");
    if (promptOptions.beforeQuestion) {
      promptOptions.beforeQuestion();
    }
    for (;;) {
      const raw = await rl.question("Select uilibs (comma-separated, or 'all'): ");
      const trimmed = String(raw || "").trim().toLowerCase();
      if (trimmed === "all") {
        return options.map((o) => o.value);
      }
      const parts = String(raw || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      if (parts.length === 0) continue;

      const selected = [];
      for (const part of parts) {
        const asNumber = Number.parseInt(part, 10);
        if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= options.length) {
          selected.push(options[asNumber - 1].value);
          continue;
        }
        const byValue = options.find((o) => o.value === part);
        if (byValue) {
          selected.push(byValue.value);
          continue;
        }
        process.stdout.write(`Unknown selection '${part}'. Try again.\n`);
        selected.length = 0;
        break;
      }
      if (selected.length > 0) {
        return [...new Set(selected)];
      }
    }
  } finally {
    await rl.close();
  }
}

module.exports = {
  confirmYesNo,
  filesAreEquivalentForReplace,
  isInteractiveTerminal,
  nonInteractiveAskError,
  printTemplateConflictDiff,
  promptSelectMany,
  promptSelectOne,
  promptTemplateConflict,
  promptText,
  promptUpdateConfirm,
  userRejected,
};
