import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Node,
  Project,
  type CallExpression,
  type ObjectLiteralExpression,
  type SourceFile,
  type TypeNode,
} from "ts-morph";

export type UiPropInfo = {
  name: string;
  type: string;
  optional: boolean;
  docs?: string;
};

export type UiComponentExport = {
  name: string;
  props: UiPropInfo[];
  /**
   * true = props jsou jen lokální rozšíření (bez `PropsOf<…>`, `QwikIntrinsicElements`, …).
   */
  propsAreExtendedOnly?: boolean;
};

export type UiFileScan = {
  relativePath: string;
  components: UiComponentExport[];
};

function demoRootDir(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
}

function listUiIndexFiles(uiRoot: string): string[] {
  if (!fs.existsSync(uiRoot)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(uiRoot, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const indexPath = path.join(uiRoot, name.name, "index.tsx");
    if (fs.existsSync(indexPath)) out.push(indexPath);
  }
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

function isComponentDollarCall(call: CallExpression): boolean {
  const expr = call.getExpression();
  return Node.isIdentifier(expr) && expr.getText() === "component$";
}

function propsTypeNodeFromComponentCall(
  call: CallExpression,
): TypeNode | undefined {
  const typeArgs = call.getTypeArguments();
  if (typeArgs.length > 0) return typeArgs[0];
  const args = call.getArguments();
  const fn = args[0];
  if (
    fn &&
    (Node.isArrowFunction(fn) || Node.isFunctionExpression(fn))
  ) {
    return fn.getParameters()[0]?.getTypeNode();
  }
  return undefined;
}

function jsDocLine(node: import("ts-morph").PropertySignature): string | undefined {
  const docs = node.getJsDocs();
  if (docs.length === 0) return undefined;
  const c = docs[0].getComment();
  if (c == null) return undefined;
  const text = typeof c === "string" ? c : docs[0].getDescription();
  if (!text) return undefined;
  return text.split(/\r?\n/)[0]?.trim();
}

function propsFromTypeNode(typeNode: TypeNode | undefined): UiPropInfo[] {
  if (!typeNode) return [];
  const t = typeNode.getType();
  const syms = t.getProperties();
  if (syms.length === 0) {
    return [
      {
        name: "props",
        type: typeNode.getText(),
        optional: false,
      },
    ];
  }
  return syms.map((sym) => {
    const dec = sym.getValueDeclaration() ?? sym.getDeclarations()[0];
    let optional = false;
    let typeStr = "unknown";
    let docs: string | undefined;
    if (dec && Node.isPropertySignature(dec)) {
      optional = dec.hasQuestionToken();
      typeStr = dec.getTypeNode()?.getText() ?? dec.getType().getText(dec);
      docs = jsDocLine(dec);
    } else if (dec) {
      typeStr = dec.getType().getText(dec);
    } else {
      typeStr = sym.getDeclarations()[0]?.getType().getText() ?? "unknown";
    }
    const row: UiPropInfo = {
      name: sym.getName(),
      type: typeStr,
      optional,
    };
    if (docs) row.docs = docs;
    return row;
  });
}

function findComponentCallsInExpression(root: Node): CallExpression[] {
  const calls: CallExpression[] = [];
  root.forEachDescendant((n) => {
    if (Node.isCallExpression(n) && isComponentDollarCall(n)) {
      calls.push(n);
    }
    return undefined;
  });
  return calls;
}

const FC_TYPE_NAMES = new Set(["FunctionComponent", "Component", "FC"]);

function getSimpleReferenceName(typeNode: TypeNode): string | undefined {
  if (!Node.isTypeReference(typeNode)) return undefined;
  const text = typeNode.getTypeName().getText();
  return text.includes(".") ? text.split(".").pop()! : text;
}

function isLikelyNamespaceExport(
  init: Node | undefined,
): init is ObjectLiteralExpression {
  if (!init || !Node.isObjectLiteralExpression(init)) return false;
  const assignments = init.getProperties().filter(Node.isPropertyAssignment);
  if (assignments.length === 0) return false;
  return assignments.every((p) => {
    const v = p.getInitializer();
    return Node.isIdentifier(v);
  });
}

/** SheetRoot → "Sheet.Root" když existuje `export const Sheet = { Root: SheetRoot, … }`. */
function buildNamespaceChildDisplayNames(sf: SourceFile): Map<string, string> {
  const map = new Map<string, string>();
  for (const stmt of sf.getVariableStatements()) {
    if (!stmt.isExported()) continue;
    for (const decl of stmt.getDeclarations()) {
      const init = decl.getInitializer();
      if (!isLikelyNamespaceExport(init)) continue;
      const exportName = decl.getName();
      for (const p of init.getProperties().filter(Node.isPropertyAssignment)) {
        const v = p.getInitializer();
        if (Node.isIdentifier(v)) {
          map.set(v.getText(), `${exportName}.${p.getName()}`);
        }
      }
    }
  }
  return map;
}

function getFunctionComponentPropsTypeNode(
  decl: import("ts-morph").VariableDeclaration,
): TypeNode | undefined {
  const typeNode = decl.getTypeNode();
  if (!typeNode || !Node.isTypeReference(typeNode)) return undefined;
  const name = getSimpleReferenceName(typeNode);
  if (!name || !FC_TYPE_NAMES.has(name)) return undefined;
  const args = typeNode.getTypeArguments();
  return args[0];
}

function isBasePropsTypeOperand(part: TypeNode): boolean {
  const text = part.getText();
  if (text.includes("QwikIntrinsicElements")) return true;
  if (!Node.isTypeReference(part)) return false;
  const simple = getSimpleReferenceName(part);
  return simple === "PropsOf";
}

function getExpandedPropertyNames(part: TypeNode): string[] {
  try {
    const t = part.getType();
    return t.getProperties().map((s) => s.getName());
  } catch {
    return [];
  }
}

function unwrapTypeAliasChain(
  sf: SourceFile,
  typeNode: TypeNode,
  visited = new Set<string>(),
): TypeNode {
  if (!Node.isTypeReference(typeNode)) return typeNode;
  const simple = getSimpleReferenceName(typeNode);
  if (!simple || visited.has(simple)) return typeNode;
  const alias = sf.getTypeAliases().find((a) => a.getName() === simple);
  if (!alias) return typeNode;
  visited.add(simple);
  const body = alias.getTypeNode();
  if (!body) return typeNode;
  return unwrapTypeAliasChain(sf, body, visited);
}

/**
 * Z průniku typů vezme jen vlastnosti z lokálních literálů `{ … }`, které nejsou v „základních“
 * operandech (`PropsOf`, `QwikIntrinsicElements`, rozšířené referenční typy z knihoven).
 */
function extendedPropsOnlyFromTypeNode(
  sf: SourceFile,
  typeNode: TypeNode,
): UiPropInfo[] {
  const unwrapped = unwrapTypeAliasChain(sf, typeNode);

  if (Node.isIntersectionTypeNode(unwrapped)) {
    const baseKeys = new Set<string>();
    const candidateRows: UiPropInfo[] = [];

    for (const part of unwrapped.getTypeNodes()) {
      if (isBasePropsTypeOperand(part)) {
        for (const n of getExpandedPropertyNames(part)) {
          baseKeys.add(n);
        }
        continue;
      }

      if (Node.isTypeLiteral(part)) {
        candidateRows.push(...propsFromTypeNode(part));
        continue;
      }

      if (Node.isTypeReference(part)) {
        if (isBasePropsTypeOperand(part)) {
          for (const n of getExpandedPropertyNames(part)) {
            baseKeys.add(n);
          }
          continue;
        }
        const sub = extendedPropsOnlyFromTypeNode(sf, part);
        if (sub.length > 0) {
          candidateRows.push(...sub);
        } else {
          for (const n of getExpandedPropertyNames(part)) {
            baseKeys.add(n);
          }
        }
      }
    }

    return candidateRows.filter((p) => !baseKeys.has(p.name));
  }

  if (isBasePropsTypeOperand(unwrapped)) {
    return [];
  }

  if (Node.isTypeLiteral(unwrapped)) {
    return propsFromTypeNode(unwrapped);
  }

  return [];
}

function componentExportFromVariable(
  name: string,
  call: CallExpression,
  sf: SourceFile,
): UiComponentExport {
  const typeNode = propsTypeNodeFromComponentCall(call);
  if (!typeNode) {
    return { name, props: [] };
  }
  const unwrapped = unwrapTypeAliasChain(sf, typeNode);
  if (Node.isIntersectionTypeNode(unwrapped)) {
    return {
      name,
      props: extendedPropsOnlyFromTypeNode(sf, unwrapped),
      propsAreExtendedOnly: true,
    };
  }
  return {
    name,
    props: propsFromTypeNode(typeNode),
    propsAreExtendedOnly: false,
  };
}

/** Exporty `component$(…)`, `FunctionComponent<…>` a podkomponent namespace objektů. */
export function extractUiComponentsFromSourceFile(
  sf: SourceFile,
): UiComponentExport[] {
  const namespaceNames = buildNamespaceChildDisplayNames(sf);
  const components: UiComponentExport[] = [];
  const exports = sf.getExportedDeclarations();

  exports.forEach((decls, exportName) => {
    for (const decl of decls) {
      if (!Node.isVariableDeclaration(decl)) continue;
      const init = decl.getInitializer();
      if (!init) continue;

      if (isLikelyNamespaceExport(init)) {
        continue;
      }

      const varName = decl.getName();
      const displayName = namespaceNames.get(varName) ?? exportName;

      let call: CallExpression | undefined;
      if (Node.isCallExpression(init) && isComponentDollarCall(init)) {
        call = init;
      } else if (Node.isParenthesizedExpression(init)) {
        const inner = init.getExpression();
        if (Node.isCallExpression(inner) && isComponentDollarCall(inner)) {
          call = inner;
        }
      }

      if (call) {
        components.push(componentExportFromVariable(displayName, call, sf));
        continue;
      }

      const innerCalls = findComponentCallsInExpression(init);
      if (innerCalls.length === 1) {
        components.push(
          componentExportFromVariable(displayName, innerCalls[0], sf),
        );
        continue;
      }

      const fcPropsType = getFunctionComponentPropsTypeNode(decl);
      if (fcPropsType) {
        components.push({
          name: displayName,
          props: extendedPropsOnlyFromTypeNode(sf, fcPropsType),
          propsAreExtendedOnly: true,
        });
      }
    }
  });

  components.sort((a, b) => a.name.localeCompare(b.name));
  return components;
}

function isPathInsideRoot(resolvedFile: string, root: string): boolean {
  const rel = path.relative(root, resolvedFile);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

/**
 * Introspekce jednoho .tsx souboru pod kořenem dema.
 * `relativePath` používá `/` (např. `src/components/ui/button/index.tsx`).
 */
export function scanSingleUiFile(relativePath: string): UiFileScan | null {
  const root = demoRootDir();
  const normalized = path
    .normalize(relativePath.trim())
    .replace(/\\/g, "/");
  if (!normalized || normalized.includes("..")) return null;
  if (!normalized.endsWith(".tsx")) return null;

  const fullPath = path.resolve(root, normalized);
  if (!isPathInsideRoot(fullPath, path.resolve(root))) return null;
  if (!fs.existsSync(fullPath)) return null;

  const tsConfig = path.join(root, "tsconfig.json");
  const project = new Project({
    tsConfigFilePath: tsConfig,
    skipAddingFilesFromTsConfig: true,
  });
  project.addSourceFileAtPath(fullPath);
  const sf = project.getSourceFileOrThrow(fullPath);

  return {
    relativePath: path.relative(root, fullPath).split(path.sep).join("/"),
    components: extractUiComponentsFromSourceFile(sf),
  };
}

/** Obsah `meta.generated.json` vedle `index.tsx` (viz `npm run generate:meta`). */
export type MetaGenerated = {
  name: string;
  title: string;
  version: string;
  kind: string;
  registry?: string;
  dependencies?: string[];
  npmDependencies?: string[];
  apiTree: Record<string, unknown>;
};

/**
 * Načte `meta.generated.json` ve stejné složce jako `index.tsx` komponenty v demu.
 * `relativePath` ve stejném tvaru jako u {@link scanSingleUiFile} (např. `src/components/ui/button/index.tsx`).
 */
export function readMetaGeneratedForUiIndex(
  relativePath: string,
): MetaGenerated | null {
  const root = demoRootDir();
  const normalized = path
    .normalize(relativePath.trim())
    .replace(/\\/g, "/");

  console.log("normalized", normalized, 'root', root);
  if (!normalized || normalized.includes("..")) return null;
  if (!normalized.endsWith("index.tsx")) return null;

  const indexFull = path.resolve(root, normalized);
  console.log("indexFull", indexFull, 'root', root);
  if (!isPathInsideRoot(indexFull, path.resolve(root))) return null;
  if (!fs.existsSync(indexFull)) return null;

  const metaFull = path.join(path.dirname(indexFull), "meta.generated.json");
  if (!isPathInsideRoot(metaFull, path.resolve(root))) return null;
  if (!fs.existsSync(metaFull)) return null;

  try {
    const raw = fs.readFileSync(metaFull, "utf8");
    return JSON.parse(raw) as MetaGenerated;
  } catch {
    return null;
  }
}

/** Relativní cesty k `index.tsx` v podadresářích `src/components/ui` (řazeno). */
export function listUiComponentRelativePaths(): string[] {
  const root = demoRootDir();
  const uiRoot = path.join(root, "src/components/ui");
  return listUiIndexFiles(uiRoot).map((fp) =>
    path.relative(root, fp).split(path.sep).join("/"),
  );
}

export function scanUiComponents(): UiFileScan[] {
  const root = demoRootDir();
  const uiRoot = path.join(root, "src/components/ui");
  const files = listUiIndexFiles(uiRoot);
  const tsConfig = path.join(root, "tsconfig.json");

  const project = new Project({
    tsConfigFilePath: tsConfig,
    skipAddingFilesFromTsConfig: true,
  });

  for (const fp of files) {
    project.addSourceFileAtPath(fp);
  }

  const result: UiFileScan[] = [];

  for (const fp of files) {
    const sf = project.getSourceFileOrThrow(fp);
    result.push({
      relativePath: path.relative(root, fp).split(path.sep).join("/"),
      components: extractUiComponentsFromSourceFile(sf),
    });
  }

  return result;
}
