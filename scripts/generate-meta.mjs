/**
 * TS-Morph: generuje components/<name>/meta.generated.json z index.tsx
 * (viz META_GEN.md a REGISTRY.md §6–11).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Node, Project, SyntaxKind } from "ts-morph";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const componentsDir = path.join(repoRoot, "components");

/** @param {string} kebab */
function kebabToPascal(kebab) {
  return kebab
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/**
 * Úvodní JSDoc s @component (volitelně @title, @version).
 * @param {string} text
 * @returns {{ component: string | null, title: string | null, version: string | null }}
 */
function parseComponentDirectiveBlock(text) {
  const m = text.match(/^\s*\/\*\*([\s\S]*?)\*\//);
  if (!m || !m[1].includes("@component")) {
    return { component: null, title: null, version: null };
  }
  const body = m[1];
  /** @type {{ component: string | null, title: string | null, version: string | null }} */
  const out = { component: null, title: null, version: null };
  for (const raw of body.split("\n")) {
    const line = raw.replace(/^\s*\*\s?/, "").trim();
    if (!line.startsWith("@")) continue;
    if (line.startsWith("@component "))
      out.component = line.slice("@component ".length).trim();
    else if (line.startsWith("@title ")) out.title = line.slice("@title ".length).trim();
    else if (line.startsWith("@version ")) out.version = line.slice("@version ".length).trim();
  }
  return out;
}

/** @param {string | undefined} v */
function normalizeVersion(v) {
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}

/** @param {import('ts-morph').SourceFile} sf */
function getExportedVariableDeclarations(sf) {
  /** @type {import('ts-morph').VariableDeclaration[]} */
  const out = [];
  for (const vs of sf.getVariableStatements()) {
    if (!vs.hasModifier("export")) continue;
    for (const vd of vs.getDeclarations()) {
      out.push(vd);
    }
  }
  return out;
}

/** @param {import('ts-morph').Node | undefined} init */
function isComponentDollarCall(init) {
  if (!init || !Node.isCallExpression(init)) return false;
  return init.getExpression().getText() === "component$";
}

/** @param {import('ts-morph').Node | undefined} init */
function isCompoundObjectLiteral(init) {
  if (!Node.isObjectLiteralExpression(init)) return false;
  return init.getProperties().length > 0;
}

/**
 * @param {import('ts-morph').BodyableNode} body
 * @returns {boolean}
 */
function textHasSlot(body) {
  const t = body.getText();
  return t.includes("<Slot") || t.includes("<Slot ");
}

/**
 * @param {import('ts-morph').Type} type
 * @returns {unknown}
 */
/**
 * @param {import('ts-morph').Type} u
 */
function isNilLikeUnionMember(u) {
  try {
    if (u.isUndefined() || u.isVoid() || u.isNull()) return true;
  } catch {
    /* ignore */
  }
  const w = u.getText().replace(/\s+/g, " ").trim();
  return w === "undefined" || w === "void" || w === "null";
}

function serializePropType(type) {
  if (!type || type.isUndefined()) return "undefined";
  const rawText = type.getText();
  const norm = rawText.replace(/\s+/g, " ").trim();
  const primOpt = norm.match(/^(boolean|number|string)\s*\|\s*undefined$/);
  if (primOpt) return primOpt[1];
  if (/PropFunction\s*<|(^|\W)QRL\s*</.test(rawText)) return "function";

  if (type.isStringLiteral()) return [type.getLiteralValue()];
  if (type.isNumberLiteral()) return [type.getLiteralValue()];
  if (type.isUnion()) {
    const parts = type.getUnionTypes().filter((u) => !isNilLikeUnionMember(u));
    if (parts.length === 0) return "undefined";
    if (parts.length === 1) return serializePropType(parts[0]);
    const literals = [];
    for (const u of parts) {
      if (u.isStringLiteral()) literals.push(u.getLiteralValue());
      else if (u.isNumberLiteral()) literals.push(u.getLiteralValue());
      else {
        const t = u.getText();
        if (/PropFunction\s*<|(^|\W)QRL\s*</.test(t)) return "function";
        return rawText.length > 120 ? `${rawText.slice(0, 117)}...` : rawText;
      }
    }
    if (literals.length === parts.length) {
      const sorted = [...literals];
      if (sorted.every((x) => typeof x === "string")) sorted.sort();
      else if (sorted.every((x) => typeof x === "number")) sorted.sort((a, b) => a - b);
      return sorted;
    }
    return rawText.length > 120 ? `${rawText.slice(0, 117)}...` : rawText;
  }
  if (type.isString()) return "string";
  if (type.isNumber()) return "number";
  if (type.isBoolean()) return "boolean";
  if (rawText === "any") return "any";
  return rawText.length > 120 ? `${rawText.slice(0, 117)}...` : rawText;
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {import('ts-morph').TypeNode | undefined} typeNode
 * @param {Set<string>} [visiting]
 * @returns {import('ts-morph').PropertySignature[]}
 */
function getPropertySignaturesFromTypeNode(sf, typeNode, visiting = new Set()) {
  if (!typeNode) return [];
  if (Node.isTypeLiteral(typeNode)) {
    return typeNode.getDescendantsOfKind(SyntaxKind.PropertySignature);
  }
  if (Node.isIntersectionTypeNode(typeNode)) {
    /** @type {import('ts-morph').PropertySignature[]} */
    const out = [];
    const seen = new Set();
    for (const t of typeNode.getTypeNodes()) {
      for (const s of getPropertySignaturesFromTypeNode(sf, t, visiting)) {
        const n = s.getName();
        if (seen.has(n)) continue;
        seen.add(n);
        out.push(s);
      }
    }
    return out;
  }
  if (Node.isTypeReference(typeNode)) {
    const tn = typeNode.getTypeName();
    if (Node.isIdentifier(tn)) {
      const name = tn.getText();
      const skipRef = new Set(["PropsOf", "Omit", "Pick", "Partial", "Required", "Readonly", "Record", "Extract", "Exclude"]);
      if (skipRef.has(name)) return [];
      if (visiting.has(name)) return [];
      visiting.add(name);
      const intf = sf.getInterface(name);
      if (intf) {
        const sigs = intf.getDescendantsOfKind(SyntaxKind.PropertySignature);
        visiting.delete(name);
        return sigs;
      }
      const talias = sf.getTypeAlias(name);
      if (talias) {
        const inner = getPropertySignaturesFromTypeNode(sf, talias.getTypeNode(), visiting);
        visiting.delete(name);
        return inner;
      }
      visiting.delete(name);
    }
  }
  return [];
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {import('ts-morph').Node | undefined} typeArg0
 */
function paramsFromComponentTypeArg(sf, typeArg0) {
  if (!typeArg0) return null;
  /** @type {import('ts-morph').TypeNode} */
  let typeNode = /** @type {import('ts-morph').TypeNode} */ (typeArg0);
  if (Node.isTypeReference(typeArg0)) {
    typeNode = typeArg0;
  }
  const signatures = getPropertySignaturesFromTypeNode(sf, typeNode, new Set());
  if (signatures.length === 0) return null;
  /** @type {Record<string, unknown>} */
  const params = {};
  for (const sig of signatures) {
    const propName = sig.getName().replace(/['"]/g, "");
    if (!propName || propName.includes("[")) continue;
    try {
      params[propName] = serializePropType(sig.getType());
    } catch {
      params[propName] = sig.getType().getText();
    }
  }
  return Object.keys(params).length ? params : null;
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {string | undefined} identifierName
 * @returns {Record<string, unknown> | null}
 */
function paramsFromComponentIdentifier(sf, identifierName) {
  if (!identifierName) return null;
  const decl = sf.getVariableDeclaration(identifierName);
  if (!decl) return null;
  const init = decl.getInitializer();
  if (!isComponentDollarCall(init)) return null;
  const typeArgs = init.getTypeArguments();
  const first = typeArgs[0];
  return paramsFromComponentTypeArg(sf, first);
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {import('ts-morph').VariableDeclaration} varDecl
 * @returns {Record<string, unknown> | null}
 */
function paramsFromPrimitiveVariable(sf, varDecl) {
  const init = varDecl.getInitializer();
  if (!isComponentDollarCall(init)) return null;
  const typeArgs = init.getTypeArguments();
  return paramsFromComponentTypeArg(sf, typeArgs[0]);
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {string | undefined} identifierName
 */
function identifierDeclHasSlot(sf, identifierName) {
  if (!identifierName) return false;
  const decl = sf.getVariableDeclaration(identifierName);
  if (!decl) return false;
  const init = decl.getInitializer();
  if (!init) return false;

  if (Node.isArrowFunction(init)) {
    const b = init.getBody();
    return textHasSlot(b);
  }

  if (Node.isFunctionExpression(init)) {
    return textHasSlot(init.getBody());
  }

  if (isComponentDollarCall(init)) {
    const arg0 = init.getArguments()[0];
    if (Node.isArrowFunction(arg0) || Node.isFunctionExpression(arg0)) {
      return textHasSlot(arg0.getBody());
    }
  }

  return false;
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {import('ts-morph').ObjectLiteralExpression} obj
 */
function collectCompoundKeys(sf, obj) {
  /** @type {{ key: string, valueText: string }[]} */
  const entries = [];
  for (const p of obj.getProperties()) {
    if (Node.isPropertyAssignment(p)) {
      const key = p.getName().replace(/['"]/g, "");
      const init = p.getInitializer();
      let valueText = "";
      if (Node.isIdentifier(init)) valueText = init.getText();
      else valueText = init?.getText() ?? "";
      entries.push({ key, valueText });
    } else if (Node.isShorthandPropertyAssignment(p)) {
      const key = p.getName();
      entries.push({ key, valueText: key });
    }
  }
  return entries;
}

/**
 * Nejdelší jiný klíč P takový, že K = P + další PascalCase segment (aby např. Controller nešlo pod Control).
 * @param {string} key
 * @param {string[]} allKeys
 * @returns {string | null}
 */
function findNamingParent(key, allKeys) {
  let best = null;
  let bestLen = -1;
  for (const p of allKeys) {
    if (p === key || p === "Root") continue;
    if (p.length >= key.length) continue;
    if (!key.startsWith(p)) continue;
    const rest = key.slice(p.length);
    if (!rest || !/^[A-Z]/.test(rest)) continue;
    if (p.length > bestLen) {
      bestLen = p.length;
      best = p;
    }
  }
  return best;
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {{ key: string, valueText: string }[]} entries
 * @param {string[]} memberKeys klíče k uspořádání (bez Root)
 * @returns {Record<string, unknown>}
 */
function buildNestedByNaming(sf, entries, memberKeys) {
  /** @type {Map<string, { key: string, valueText: string }>} */
  const entryMap = new Map(entries.map((e) => [e.key, e]));
  /** @type {Map<string | null, string[]>} */
  const byParent = new Map();
  for (const k of memberKeys) {
    const parent = findNamingParent(k, memberKeys);
    const list = byParent.get(parent) ?? [];
    list.push(k);
    byParent.set(parent, list);
  }

  /**
   * @param {string} key
   * @returns {Record<string, unknown>}
   */
  function nodeForKey(key) {
    const e = entryMap.get(key);
    const slot = e ? identifierDeclHasSlot(sf, e.valueText) : false;
    const params = e ? paramsFromComponentIdentifier(sf, e.valueText) : null;
    const childKeys = byParent.get(key) ?? [];
    if (childKeys.length === 0) {
      /** @type {Record<string, unknown>} */
      const leaf = {};
      if (params) leaf.params = params;
      if (slot) leaf.slot = true;
      return leaf;
    }
    /** @type {Record<string, unknown>} */
    const children = {};
    for (const ck of childKeys) {
      children[ck] = nodeForKey(ck);
    }
    /** @type {Record<string, unknown>} */
    const node = {};
    if (params) node.params = params;
    if (slot) node.slot = true;
    node.children = children;
    return node;
  }

  /** @type {Record<string, unknown>} */
  const out = {};
  const top = byParent.get(null) ?? [];
  for (const k of top) {
    out[k] = nodeForKey(k);
  }
  return out;
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {import('ts-morph').ObjectLiteralExpression} objectLiteral
 */
function buildApiTree(sf, objectLiteral) {
  const entries = collectCompoundKeys(sf, objectLiteral);
  const hasRoot = entries.some((e) => e.key === "Root");

  /** @param {string[]} keys */
  const orderedMembers = (keys) =>
    entries.filter((e) => keys.includes(e.key)).map((e) => e.key);

  if (hasRoot) {
    const rootEntry = entries.find((e) => e.key === "Root");
    const rootSlot = identifierDeclHasSlot(sf, rootEntry?.valueText);
    const memberKeys = orderedMembers(entries.map((e) => e.key).filter((k) => k !== "Root"));
    const children = buildNestedByNaming(sf, entries, memberKeys);
    const rootParams = paramsFromComponentIdentifier(sf, rootEntry?.valueText);
    /** @type {Record<string, unknown>} */
    const rootNode = {};
    if (rootParams) rootNode.params = rootParams;
    if (rootSlot) rootNode.slot = true;
    rootNode.children = children;
    return {
      Root: rootNode,
    };
  }

  const memberKeys = orderedMembers(entries.map((e) => e.key));
  return buildNestedByNaming(sf, entries, memberKeys);
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {import('ts-morph').VariableDeclaration | undefined} varDecl
 * @param {import('ts-morph').CallExpression | undefined} componentCall
 */
function buildPrimitiveApiTree(sf, varDecl, componentCall) {
  let call = componentCall;
  if (!call && varDecl) {
    const init = varDecl.getInitializer();
    if (isComponentDollarCall(init)) call = init;
  }
  if (!call || !isComponentDollarCall(call)) return {};
  const params = paramsFromComponentTypeArg(sf, call.getTypeArguments()[0]);
  const arg0 = call.getArguments()[0];
  let slot = false;
  if (Node.isArrowFunction(arg0) || Node.isFunctionExpression(arg0)) {
    slot = textHasSlot(arg0.getBody());
  }
  /** @type {Record<string, unknown>} */
  const out = {};
  if (params) out.params = params;
  if (slot) out.slot = true;
  return out;
}

/** @param {import('ts-morph').SourceFile} sf */
function collectRelativeImportRoots(sf) {
  const deps = new Set();
  for (const imp of sf.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierValue();
    if (!spec.startsWith(".")) continue;
    const normalized = spec.replace(/^\.\.?\//, "");
    const first = normalized.split("/")[0];
    if (first) deps.add(first);
  }
  return [...deps].sort();
}

/** @param {string} spec module specifier */
function npmPackageRootFromSpecifier(spec) {
  if (spec.startsWith(".") || spec.startsWith("node:")) return null;
  if (spec.startsWith("@")) {
    const parts = spec.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : spec;
  }
  return spec.split("/")[0] || null;
}

function loadBaselineNpmPackageNames(repoRoot) {
  const p = path.join(repoRoot, "template", "package.json");
  /** @type {Set<string>} */
  const set = new Set();
  if (!fs.existsSync(p)) return set;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const key of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    const o = j[key];
    if (o && typeof o === "object") {
      for (const k of Object.keys(o)) set.add(k);
    }
  }
  return set;
}

/** npm imports minus packages already listed in template/package.json */
/** @param {import('ts-morph').SourceFile} sf */
function collectExtraNpmDependencies(sf, baseline) {
  const pkgs = new Set();
  for (const imp of sf.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierValue();
    const root = npmPackageRootFromSpecifier(spec);
    if (root && !baseline.has(root)) pkgs.add(root);
  }
  sf.forEachDescendant((node) => {
    if (node.getKind() !== SyntaxKind.ImportKeyword) return;
    const call = node.getParent();
    if (!Node.isCallExpression(call)) return;
    if (call.getExpression() !== node) return;
    const args = call.getArguments();
    if (args.length < 1) return;
    const lit = args[0];
    if (!Node.isStringLiteral(lit) && !Node.isNoSubstitutionTemplateLiteral(lit)) return;
    const spec = lit.getLiteralValue();
    const root = npmPackageRootFromSpecifier(spec);
    if (root && !baseline.has(root)) pkgs.add(root);
  });
  return [...pkgs].sort();
}

/**
 * @param {import('ts-morph').SourceFile} sf
 * @param {string} folderName
 * @returns {{ kind: 'primitive' | 'compound', title: string, apiTree: Record<string, unknown> } | null}
 */
function analyzeSourceFile(sf, folderName) {
  const expected = kebabToPascal(folderName);

  const defaultSym = sf.getDefaultExportSymbol();
  if (defaultSym) {
    const decls = defaultSym.getDeclarations();
    const d0 = decls[0];
    if (Node.isExportAssignment(d0)) {
      const expr = d0.getExpression();
      if (Node.isObjectLiteralExpression(expr)) {
        return {
          kind: "compound",
          title: expected,
          apiTree: buildApiTree(sf, expr),
        };
      }
      if (isComponentDollarCall(expr)) {
        return {
          kind: "primitive",
          title: expected,
          apiTree: buildPrimitiveApiTree(sf, undefined, expr),
        };
      }
    }
  }

  const exportedVars = getExportedVariableDeclarations(sf);
  const byExpected = exportedVars.find((v) => v.getName() === expected);
  if (byExpected) {
    const init = byExpected.getInitializer();
    if (isCompoundObjectLiteral(init)) {
      return {
        kind: "compound",
        title: expected,
        apiTree: buildApiTree(sf, init),
      };
    }
    if (isComponentDollarCall(init)) {
      return {
        kind: "primitive",
        title: expected,
        apiTree: buildPrimitiveApiTree(sf, byExpected, undefined),
      };
    }
  }

  for (const v of exportedVars) {
    const init = v.getInitializer();
    if (isCompoundObjectLiteral(init)) {
      return {
        kind: "compound",
        title: v.getName(),
        apiTree: buildApiTree(sf, init),
      };
    }
  }

  for (const v of exportedVars) {
    const init = v.getInitializer();
    if (isComponentDollarCall(init)) {
      return {
        kind: "primitive",
        title: v.getName(),
        apiTree: buildPrimitiveApiTree(sf, v, undefined),
      };
    }
  }

  return null;
}

/**
 * Rekurzivně najde všechny složky s index.tsx pod baseDir.
 * Nepokračuje dovnitř složky, která sama index.tsx obsahuje.
 * @param {string} baseDir
 * @returns {string[]}
 */
function findComponentDirs(baseDir) {
  /** @type {string[]} */
  const results = [];
  /** @param {string} dir */
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const hasIndex = entries.some((e) => e.isFile() && e.name === "index.tsx");
    if (hasIndex) {
      results.push(dir);
      return; // neprocházej dovnitř komponenty
    }
    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
    }
  }
  walk(baseDir);
  return results;
}

function main() {
  const tsConfigPath = path.join(repoRoot, "tsconfig.json");
  if (!fs.existsSync(tsConfigPath)) {
    console.error("Chybí tsconfig.json v kořeni repozitáře.");
    process.exit(1);
  }

  const project = new Project({
    tsConfigFilePath: tsConfigPath,
  });

  const componentDirs = findComponentDirs(componentsDir);
  let written = 0;
  let skipped = 0;
  const npmBaseline = loadBaselineNpmPackageNames(repoRoot);

  for (const componentDir of componentDirs) {
    const folderName = path.basename(componentDir);
    const indexTsx = path.join(componentDir, "index.tsx");
    // findComponentDirs zaručuje existenci index.tsx, ale pro jistotu:
    if (!fs.existsSync(indexTsx)) {
      skipped++;
      continue;
    }

    const sf = project.addSourceFileAtPath(indexTsx);
    const directives = parseComponentDirectiveBlock(sf.getFullText());
    const analyzed = analyzeSourceFile(sf, folderName);
    const versionFallback = normalizeVersion(directives.version) || "0.0.0";
    if (!analyzed) {
      console.warn(`[generate-meta] Nelze analyzovat export: ${path.relative(repoRoot, indexTsx)}`);
      const payload = {
        name: folderName,
        title: directives.title || kebabToPascal(folderName),
        version: versionFallback,
        kind: "unknown",
        registry: "base",
        dependencies: collectRelativeImportRoots(sf),
        npmDependencies: collectExtraNpmDependencies(sf, npmBaseline),
        apiTree: {},
      };
      fs.writeFileSync(
        path.join(componentDir, "meta.generated.json"),
        JSON.stringify(payload, null, 2) + "\n",
        "utf8"
      );
      written++;
      continue;
    }

    const payload = {
      name: folderName,
      title: directives.title || analyzed.title,
      version: versionFallback,
      kind: analyzed.kind,
      registry: "base",
      dependencies: collectRelativeImportRoots(sf),
      npmDependencies: collectExtraNpmDependencies(sf, npmBaseline),
      apiTree: analyzed.apiTree,
    };

    const outPath = path.join(componentDir, "meta.generated.json");
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
    written++;
  }

  console.log(`meta.generated.json: zapsáno ${written}, přeskočeno složek bez index.tsx: ${skipped}`);
}

main();
