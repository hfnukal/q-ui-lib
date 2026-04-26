/** @type {import('tailwindcss').Config} */
/**
 * Sémantické barvy a typografie podle COLORS.md (Apple HIG / UIKit → web).
 * Hodnoty: space-separated HSL v :root / .dark (viz src/global.css).
 */
const hsl = (cssVar) => `hsl(var(${cssVar}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        label: hsl("--label"),
        "secondary-label": hsl("--secondary-label"),
        "tertiary-label": hsl("--tertiary-label"),
        "quaternary-label": hsl("--quaternary-label"),
        placeholder: hsl("--placeholder"),
        link: hsl("--link"),

        background: hsl("--background"),
        "surface-raised": hsl("--surface-raised"),
        "surface-overlay": hsl("--surface-overlay"),

        "grouped-background": hsl("--grouped-background"),
        "grouped-surface": hsl("--grouped-surface"),
        "grouped-surface-inset": hsl("--grouped-surface-inset"),

        fill: hsl("--fill"),
        "fill-secondary": hsl("--fill-secondary"),
        "fill-tertiary": hsl("--fill-tertiary"),
        "fill-quaternary": hsl("--fill-quaternary"),

        separator: hsl("--separator"),
        "separator-opaque": hsl("--separator-opaque"),

        accent: hsl("--accent"),
        ring: hsl("--ring"),

        "system-blue": hsl("--system-blue"),
        "system-brown": hsl("--system-brown"),
        "system-cyan": hsl("--system-cyan"),
        "system-green": hsl("--system-green"),
        "system-indigo": hsl("--system-indigo"),
        "system-mint": hsl("--system-mint"),
        "system-orange": hsl("--system-orange"),
        "system-pink": hsl("--system-pink"),
        "system-purple": hsl("--system-purple"),
        "system-red": hsl("--system-red"),
        "system-teal": hsl("--system-teal"),
        "system-yellow": hsl("--system-yellow"),

        "system-gray": hsl("--system-gray"),
        "system-gray-2": hsl("--system-gray-2"),
        "system-gray-3": hsl("--system-gray-3"),
        "system-gray-4": hsl("--system-gray-4"),
        "system-gray-5": hsl("--system-gray-5"),
        "system-gray-6": hsl("--system-gray-6"),
      },

      fontSize: {
        "extra-large-title-2": [
          "2.75rem",
          { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.02em" },
        ],
        "extra-large-title": [
          "2.5rem",
          { lineHeight: "1.07", fontWeight: "700", letterSpacing: "-0.02em" },
        ],
        "large-title": [
          "2.125rem",
          { lineHeight: "1.12", fontWeight: "700", letterSpacing: "-0.02em" },
        ],
        "title-1": [
          "1.75rem",
          { lineHeight: "1.14", fontWeight: "400", letterSpacing: "-0.02em" },
        ],
        "title-2": [
          "1.375rem",
          { lineHeight: "1.18", fontWeight: "400", letterSpacing: "-0.02em" },
        ],
        "title-3": [
          "1.25rem",
          { lineHeight: "1.2", fontWeight: "400", letterSpacing: "-0.02em" },
        ],
        headline: [
          "1.0625rem",
          { lineHeight: "1.29", fontWeight: "600", letterSpacing: "-0.01em" },
        ],
        body: ["1.0625rem", { lineHeight: "1.35", fontWeight: "400" }],
        callout: ["1rem", { lineHeight: "1.38", fontWeight: "400" }],
        subheadline: [
          "0.9375rem",
          { lineHeight: "1.43", fontWeight: "400", letterSpacing: "-0.01em" },
        ],
        footnote: [
          "0.8125rem",
          { lineHeight: "1.38", fontWeight: "400", letterSpacing: "-0.01em" },
        ],
        "caption-1": [
          "0.75rem",
          { lineHeight: "1.33", fontWeight: "400", letterSpacing: "-0.01em" },
        ],
        "caption-2": [
          "0.6875rem",
          { lineHeight: "1.27", fontWeight: "400", letterSpacing: "-0.01em" },
        ],
      },
    },
  },
  plugins: [],
};
