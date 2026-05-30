/**
 * Nadpis `<h1>` na generované demo routě `…/components/base/<slug>/`
 * odpovídá PascalCase ze slug (např. `calendar-input` → `CalendarInput`).
 */
export function demoH1ForSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}
