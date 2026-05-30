const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function listRelativeFiles(rootDir, prefix = "") {
  if (!fs.existsSync(rootDir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(rootDir)) {
    const full = path.join(rootDir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (fs.statSync(full).isDirectory()) {
      files.push(...listRelativeFiles(full, rel));
    } else {
      files.push(rel);
    }
  }
  return files.sort();
}

function filesEqual(pathA, pathB) {
  if (!fs.existsSync(pathA) || !fs.existsSync(pathB)) return false;
  const a = fs.readFileSync(pathA);
  const b = fs.readFileSync(pathB);
  return a.equals(b);
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function compareDependencyLists(localList, remoteList) {
  const local = sortedUnique(Array.isArray(localList) ? localList : []);
  const remote = sortedUnique(Array.isArray(remoteList) ? remoteList : []);
  const added = remote.filter((value) => !local.includes(value));
  const removed = local.filter((value) => !remote.includes(value));
  return { added, removed, changed: added.length > 0 || removed.length > 0 };
}

function compareComponentMetadata(localMeta, remoteMeta) {
  const componentDeps = compareDependencyLists(localMeta?.dependencies, remoteMeta?.dependencies);
  const npmDeps = compareDependencyLists(localMeta?.npmDependencies, remoteMeta?.npmDependencies);
  return {
    component: componentDeps,
    npm: npmDeps,
    changed: componentDeps.changed || npmDeps.changed,
  };
}

function compareComponentDirectories(localDir, remoteDir) {
  const localExists = fs.existsSync(localDir);
  const remoteExists = fs.existsSync(remoteDir);
  const localFiles = new Set(localExists ? listRelativeFiles(localDir) : []);
  const remoteFiles = new Set(remoteExists ? listRelativeFiles(remoteDir) : []);
  const files = [];

  for (const rel of sortedUnique([...localFiles, ...remoteFiles])) {
    const inLocal = localFiles.has(rel);
    const inRemote = remoteFiles.has(rel);
    if (!inLocal && inRemote) {
      files.push({ path: rel, changeType: "create" });
      continue;
    }
    if (inLocal && !inRemote) {
      files.push({ path: rel, changeType: "delete" });
      continue;
    }
    if (!filesEqual(path.join(localDir, rel), path.join(remoteDir, rel))) {
      files.push({ path: rel, changeType: "modify" });
    }
  }

  return { localExists, remoteExists, files };
}

function resolveComponentAction({ localExists, remoteExists, files, dependenciesChanged }) {
  if (!localExists && remoteExists) return "add";
  if (localExists && !remoteExists) return "remove";
  if (files.length > 0 || dependenciesChanged) return "update";
  return "noop";
}

function renderUnifiedDiff(leftPath, rightPath) {
  const result = spawnSync("git", ["diff", "--no-index", "--", leftPath, rightPath], {
    encoding: "utf8",
  });
  if (result.status === 0) return "";
  return (result.stdout || result.stderr || "").trim();
}

function renderComponentDiff(localDir, remoteDir, componentKey) {
  const { localExists, remoteExists, files } = compareComponentDirectories(localDir, remoteDir);
  if (files.length === 0) return [];
  const lines = [`--- ${componentKey} (local)`, `+++ ${componentKey} (remote)`];
  if (!localExists || !remoteExists) {
    for (const file of files) {
      lines.push(`${file.changeType}: ${file.path}`);
    }
    return lines;
  }
  const diff = renderUnifiedDiff(localDir, remoteDir);
  if (diff) lines.push(diff);
  return lines;
}

function formatDependencyChanges(dependencyDiff) {
  const parts = [];
  if (dependencyDiff.component.added.length > 0) {
    parts.push(`+components: ${dependencyDiff.component.added.join(", ")}`);
  }
  if (dependencyDiff.component.removed.length > 0) {
    parts.push(`-components: ${dependencyDiff.component.removed.join(", ")}`);
  }
  if (dependencyDiff.npm.added.length > 0) {
    parts.push(`+npm: ${dependencyDiff.npm.added.join(", ")}`);
  }
  if (dependencyDiff.npm.removed.length > 0) {
    parts.push(`-npm: ${dependencyDiff.npm.removed.join(", ")}`);
  }
  return parts;
}

module.exports = {
  compareComponentDirectories,
  compareComponentMetadata,
  compareDependencyLists,
  formatDependencyChanges,
  listRelativeFiles,
  renderComponentDiff,
  resolveComponentAction,
};
