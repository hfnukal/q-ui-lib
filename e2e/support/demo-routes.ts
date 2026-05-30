import { DEFAULT_UI_LIB, ROUTE_BASE } from "./constants";

export type DemoUilib = typeof DEFAULT_UI_LIB | (string & {});

/**
 * Relativní cesta k demo stránce komponenty (pro `page.goto` s nastaveným baseURL).
 * Tvar: `/{routeBase}/components/{uilib}/{slug}/`
 */
export function componentDemoPath(opts: {
  slug: string;
  uilib?: DemoUilib;
}): string {
  const uilib = opts.uilib ?? DEFAULT_UI_LIB;
  const slug = opts.slug.replace(/^\/+|\/+$/g, "");
  return `${ROUTE_BASE}/components/${uilib}/${slug}/`;
}
