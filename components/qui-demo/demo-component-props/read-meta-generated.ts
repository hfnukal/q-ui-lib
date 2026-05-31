import type { MetaGenerated } from "./meta-generated.types";
import registry from "./meta-registry.generated.json";

type MetaRegistry = Record<string, MetaGenerated>;

/**
 * Edge-safe lookup of prebuilt metadata (see `scripts/generate-meta-registry.mjs`).
 * `relativePath` e.g. `src/components/ui/base/button/index.tsx`.
 */
export function readMetaGeneratedForUiIndex(
  relativePath: string,
): MetaGenerated | null {
  const normalized = relativePath.trim().replace(/\\/g, "/");
  if (!normalized || normalized.includes("..")) return null;
  if (!normalized.endsWith("index.tsx")) return null;
  return (registry as MetaRegistry)[normalized] ?? null;
}

export type { MetaGenerated } from "./meta-generated.types";
