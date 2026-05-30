export type ThemeToken = { name: string; default: string };
export type TokenGroup = { label: string; tokens: ThemeToken[] };

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    label: "Text & Accent",
    tokens: [
      { name: "--label",            default: "0 0% 0%" },
      { name: "--secondary-label",  default: "240 2% 25%" },
      { name: "--tertiary-label",   default: "240 2% 42%" },
      { name: "--quaternary-label", default: "240 2% 52%" },
      { name: "--placeholder",      default: "240 2% 52%" },
      { name: "--link",             default: "211 100% 50%" },
      { name: "--accent",           default: "211 100% 50%" },
      { name: "--ring",             default: "211 100% 50%" },
    ],
  },
  {
    label: "Surfaces — flat",
    tokens: [
      { name: "--background",      default: "0 0% 100%" },
      { name: "--surface-raised",  default: "240 5% 96%" },
      { name: "--surface-overlay", default: "0 0% 100%" },
    ],
  },
  {
    label: "Surfaces — grouped",
    tokens: [
      { name: "--grouped-background",    default: "240 6% 96%" },
      { name: "--grouped-surface",       default: "0 0% 100%" },
      { name: "--grouped-surface-inset", default: "240 5% 93%" },
    ],
  },
  {
    label: "Fills",
    tokens: [
      { name: "--fill",            default: "240 6% 50%" },
      { name: "--fill-secondary",  default: "240 5% 92%" },
      { name: "--fill-tertiary",   default: "240 4% 65%" },
      { name: "--fill-quaternary", default: "240 4% 35%" },
    ],
  },
  {
    label: "Separators",
    tokens: [
      { name: "--separator",        default: "240 6% 50%" },
      { name: "--separator-opaque", default: "240 5% 82%" },
    ],
  },
  {
    label: "System colors",
    tokens: [
      { name: "--system-blue",   default: "211 100% 50%" },
      { name: "--system-brown",  default: "28 35% 48%" },
      { name: "--system-cyan",   default: "199 94% 43%" },
      { name: "--system-green",  default: "135 59% 42%" },
      { name: "--system-indigo", default: "241 61% 52%" },
      { name: "--system-mint",   default: "168 72% 38%" },
      { name: "--system-orange", default: "28 100% 50%" },
      { name: "--system-pink",   default: "349 100% 59%" },
      { name: "--system-purple", default: "292 55% 48%" },
      { name: "--system-red",    default: "3 100% 50%" },
      { name: "--system-teal",   default: "184 100% 35%" },
      { name: "--system-yellow", default: "48 100% 50%" },
    ],
  },
  {
    label: "Gray scale",
    tokens: [
      { name: "--system-gray",   default: "240 2% 50%" },
      { name: "--system-gray-2", default: "240 2% 55%" },
      { name: "--system-gray-3", default: "240 2% 60%" },
      { name: "--system-gray-4", default: "240 2% 65%" },
      { name: "--system-gray-5", default: "240 2% 70%" },
      { name: "--system-gray-6", default: "240 3% 75%" },
    ],
  },
];

export const DEFAULT_VALUES: Record<string, string> = Object.fromEntries(
  TOKEN_GROUPS.flatMap((g) => g.tokens.map((t) => [t.name, t.default])),
);
