# Registry System – TS-Morph Meta Generator Implementation

## 1. Overview

This document describes a system for generating component metadata (`meta.generated.json`) from TypeScript source code using **ts-morph**.  
The system is designed for a Qwik-based component registry with support for:

- Primitive components
- Compound components
- Multi-repository registry system
- AST-based metadata generation
- Slot-aware UI structure extraction

---

## 2. Project Structure

```
registry/
  base/                 # core primitives (default registry)
  extended/            # optional internal extensions

repos/
  base/                # default local registry (always present)
  myrepo/              # git-based registries (added via CLI)
  another-repo/
```

Each repository contains:

```
components/
  button/
    index.tsx
```

---

## 3. Repository System

### 3.1 Base repository

- Always present
- Located at:
  ```
  repos/base
  ```

- Contains primitive components:
  - button
  - input
  - icon
  - etc.

---

### 3.2 External repositories

External registries are added via CLI:

```
cli repo add myrepo <git-url>
```

### Behavior:

1. Clone git repository into:
   ```
   repos/myrepo
   ```

2. Register repository in registry index:
   ```
   registry/repositories.json
   ```

Example:

```json
{
  "base": {
    "path": "repos/base",
    "source": "local"
  },
  "myrepo": {
    "path": "repos/myrepo",
    "source": "git",
    "url": "https://github.com/org/myrepo.git"
  }
}
```

---

## 4. Component Kind Detection

Component kind is derived from default export structure:

### 4.1 Primitive component

```ts
export default component$(() => {
  return <button />;
});
```

➡ kind = `"primitive"`

---

### 4.2 Compound component

```ts
export default {
  Root: component$(() => <Slot />),
  Trigger: component$(() => <button />),
  List: component$(() => <Slot />)
};
```

➡ kind = `"compound"`

---

## 5. API Tree Model

Metadata uses structured `apiTree` instead of string-based composition.

### Example:

```json
{
  "name": "Menu",
  "kind": "compound",
  "apiTree": {
    "Root": {
      "slot": true,
      "children": {
        "Trigger": {},
        "List": {
          "slot": true,
          "children": {
            "ListItem": {}
          }
        }
      }
    }
  }
}
```

---

## 6. TS-Morph Extraction Pipeline

### 6.1 File scanning

```ts
const sourceFiles = project.getSourceFiles("components/**/*.tsx");
```

---

### 6.2 Find default export

```ts
const defaultExport = sourceFile.getDefaultExportSymbol();
```

---

### 6.3 Determine kind

```ts
const decl = defaultExport.getDeclarations()[0];

if (Node.isObjectLiteralExpression(decl.getInitializer?.())) {
  kind = "compound";
} else {
  kind = "primitive";
}
```

---

## 7. Compound Detection Rules

A component is `compound` if:

- default export is an object literal
- object keys represent component parts
- values are `component$`

Example detection:

```ts
const isCompound =
  Node.isObjectLiteralExpression(initializer) &&
  initializer.getProperties().length > 0;
```

---

## 8. Slot Detection

A node is marked as `slot: true` if:

- component body contains `<Slot />`

### Detection:

```ts
const hasSlot = sourceFile
  .getDescendants()
  .some(d => d.getText().includes("<Slot"));
```

---

## 9. API Tree Generation Algorithm

### Step 1: Extract component map

For compound:

```ts
{
  Root,
  Trigger,
  List
}
```

---

### Step 2: Build hierarchy

Default rule:

- Root is always root node
- children defined by naming or explicit nesting

---

### Step 3: Detect nesting

Heuristics:

- JSX children usage
- explicit composition patterns
- meta inference from Slot presence

---

### Step 4: Build structure

Output:

```ts
apiTree[nodeName] = {
  slot,
  children
}
```

---

## 10. CLI System

### 10.1 Add repository

```
cli repo add myrepo <git-url>
```

Behavior:

- clone repo into `repos/myrepo`
- validate structure
- register in repositories.json

---

### 10.2 Sync repositories

```
cli repo sync
```

- pulls latest changes
- rebuilds registry graph

---

### 10.3 Generate metadata

```
cli generate
```

Pipeline:

1. Load repositories
2. Scan all `components/**/index.tsx`
3. Parse AST via ts-morph
4. Detect:
   - kind (primitive/compound)
   - slot usage
   - dependencies
5. Generate `meta.generated.json`

---

## 11. Output Metadata Schema

```json
{
  "name": "Menu",
  "kind": "compound",
  "registry": "base",
  "dependencies": ["button"],

  "apiTree": {
    "Root": {
      "slot": true,
      "children": {
        "Trigger": {},
        "List": {
          "slot": true,
          "children": {
            "ListItem": {}
          }
        }
      }
    }
  }
}
```

---

## 12. Dependency Resolution

Dependencies are extracted from imports:

```ts
import { Button } from "../button";
```

Normalized into:

```
base/button
myrepo/button
```

---

## 13. Key Design Principles

- TS source is the single source of truth
- metadata is generated, not edited manually
- compound components are structurally detected
- repositories are modular and git-based
- API tree defines UI editor structure

---

## 14. Summary

This system provides:

- deterministic AST-based metadata generation
- multi-repository registry system
- compound vs primitive detection
- UI editor ready component schema
- scalable registry architecture for Qwik UI systems