/** Contents of `meta.generated.json` next to `index.tsx` (see `npm run generate:meta`). */
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
