/**
 * @component code-edit
 * @title CodeEdit
 * @version 1.0.0
 * @example Základní použití
 * Řízená komponenta — hodnota přichází přes `value`, změny jsou hlášeny přes `onValue$`.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { CodeEdit } from "~/components/ui/code-edit";
 * 
 * export default component$(() => {
 *   const code = useSignal("const hello = 'world';");
 * 
 *   return (
 *     <CodeEdit
 *       value={code.value}
 *       onValue$={(v) => { code.value = v; }}
 *     />
 *   );
 * });
 * ```
 *
 * @example TSX / TypeScript
 * Jazyk `tsx` — vhodné pro ukázky Qwik komponent a TypeScriptu. Další jazyky (`json`, `html`, `css`) nastav stejným způsobem přes prop `language`.
 * ```tsx
 * import { component$, useSignal, $ } from "@builder.io/qwik";
 * import { CodeEdit } from "~/components/ui/code-edit";
 * 
 * export default component$(() => {
 *   const tsxCode = useSignal("// ukázka");
 *   const set = $((v: string) => {
 *     tsxCode.value = v;
 *   });
 *   return (
 *     <CodeEdit language="tsx" value={tsxCode.value} onValue$={set} />
 *   );
 * });
 * ```
 *
 * @example readOnly
 * Prop `readOnly` — žádný `textarea`, pouze zvýrazněný výpis.
 * ```tsx
 * <CodeEdit
 *   readOnly
 *   language="json"
 *   value={JSON.stringify({ name: "q-ui-lib", version: "1.0.0" }, null, 2)}
 * />
 * ```
 
 
 
 
 
 
 */

import { component$, useSignal, sync$, $, type QRL } from "@builder.io/qwik";

// ─── Tokeniser ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function tok(color: string, text: string): string {
  return `<span style="color:${color}">${esc(text)}</span>`;
}

// VS Code Dark+ palette
const C = {
  kw:   "#569cd6", // blue   — keywords
  type: "#4ec9b0", // teal   — types / JSX tags
  str:  "#ce9178", // salmon — strings
  cmt:  "#6a9955", // green  — comments
  num:  "#b5cea8", // sage   — numbers
  attr: "#9cdcfe", // sky    — attributes / object keys
  fn:   "#dcdcaa", // wheat  — function names
};

const KW = new Set(
  ("const let var function return if else for while do switch case break " +
    "continue new delete typeof instanceof in of import export default from " +
    "class extends implements interface type enum namespace declare abstract " +
    "async await static public private protected readonly override as is " +
    "true false null undefined void never unknown any keyof infer this " +
    "super throw try catch finally yield debugger").split(" "),
);

const BUILTIN = new Set(
  ("string number boolean object symbol bigint Array Promise Record Partial " +
    "Required Readonly Pick Omit Exclude Extract NonNullable ReturnType " +
    "Event Element HTMLElement Node Document Window Error Date Map Set " +
    "WeakMap WeakSet RegExp Math JSON console Object Function").split(" "),
);

function hlTsx(src: string): string {
  let html = "";
  let i = 0;
  while (i < src.length) {
    // Line comment
    if (src[i] === "/" && src[i + 1] === "/") {
      let j = i + 2;
      while (j < src.length && src[j] !== "\n") j++;
      html += tok(C.cmt, src.slice(i, j));
      i = j;
      continue;
    }
    // Block comment
    if (src[i] === "/" && src[i + 1] === "*") {
      let j = i + 2;
      while (j < src.length && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(j + 2, src.length);
      html += tok(C.cmt, src.slice(i, j));
      i = j;
      continue;
    }
    // Template literal
    if (src[i] === "`") {
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === "`") { j++; break; }
        j++;
      }
      html += tok(C.str, src.slice(i, j));
      i = j;
      continue;
    }
    // String
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i];
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === q || src[j] === "\n") { j++; break; }
        j++;
      }
      html += tok(C.str, src.slice(i, j));
      i = j;
      continue;
    }
    // JSX/HTML tag: <Tag or </Tag
    if (src[i] === "<" && i + 1 < src.length) {
      const after = src[i + 1] === "/" ? src[i + 2] : src[i + 1];
      if (after && /[A-Za-z]/.test(after)) {
        html += "&lt;";
        i++;
        if (src[i] === "/") { html += "/"; i++; }
        // Tag name
        let j = i;
        while (j < src.length && /[A-Za-z0-9._-]/.test(src[j])) j++;
        html += tok(C.type, src.slice(i, j));
        i = j;
        // Attributes until >
        while (i < src.length && src[i] !== ">") {
          if (src[i] === '"' || src[i] === "'") {
            const q = src[i];
            let k = i + 1;
            while (k < src.length && src[k] !== q) k++;
            k++;
            html += tok(C.str, src.slice(i, k));
            i = k;
          } else if (/[A-Za-z_]/.test(src[i])) {
            let k = i;
            while (k < src.length && /[A-Za-z0-9_$:-]/.test(src[k])) k++;
            const nx = src[k];
            const isAttr = nx === "=" || nx === " " || nx === ">" || nx === "/" || nx === "\n";
            html += isAttr ? tok(C.attr, src.slice(i, k)) : esc(src.slice(i, k));
            i = k;
          } else {
            html += esc(src[i]);
            i++;
          }
        }
        if (i < src.length) { html += "&gt;"; i++; }
        continue;
      }
    }
    // Number (leading digit only, avoids false positives on `-`)
    if (/\d/.test(src[i])) {
      let j = i;
      while (j < src.length && /[\d.eE_nxXa-fA-F]/.test(src[j])) j++;
      html += tok(C.num, src.slice(i, j));
      i = j;
      continue;
    }
    // Identifier / keyword / type / function call
    if (/[A-Za-z_$]/.test(src[i])) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_$]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (KW.has(word)) {
        html += tok(C.kw, word);
      } else if (BUILTIN.has(word) || /^[A-Z]/.test(word)) {
        html += tok(C.type, word);
      } else if (src[j] === "(") {
        html += tok(C.fn, word);
      } else {
        html += esc(word);
      }
      i = j;
      continue;
    }
    html += esc(src[i]);
    i++;
  }
  return html;
}

function hlJson(src: string): string {
  let html = "";
  let i = 0;
  while (i < src.length) {
    if (src[i] === '"') {
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === '"') { j++; break; }
        j++;
      }
      let k = j;
      while (k < src.length && (src[k] === " " || src[k] === "\t")) k++;
      html += tok(src[k] === ":" ? C.attr : C.str, src.slice(i, j));
      i = j;
      continue;
    }
    if (/\d/.test(src[i]) || (src[i] === "-" && /\d/.test(src[i + 1] ?? ""))) {
      let j = i;
      if (src[j] === "-") j++;
      while (j < src.length && /[\d.eE+-]/.test(src[j])) j++;
      html += tok(C.num, src.slice(i, j));
      i = j;
      continue;
    }
    if (/[a-z]/.test(src[i])) {
      let j = i;
      while (j < src.length && /[a-z]/.test(src[j])) j++;
      const w = src.slice(i, j);
      html += w === "true" || w === "false" || w === "null" ? tok(C.kw, w) : esc(w);
      i = j;
      continue;
    }
    html += esc(src[i]);
    i++;
  }
  return html;
}

function hlHtml(src: string): string {
  let html = "";
  let i = 0;
  while (i < src.length) {
    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i + 4);
      const j = end === -1 ? src.length : end + 3;
      html += tok(C.cmt, src.slice(i, j));
      i = j;
      continue;
    }
    if (src[i] === "<" && /[A-Za-z/!]/.test(src[i + 1] ?? "")) {
      html += "&lt;";
      i++;
      if (src[i] === "/") { html += "/"; i++; }
      let j = i;
      while (j < src.length && /[A-Za-z0-9]/.test(src[j])) j++;
      html += tok(C.type, src.slice(i, j));
      i = j;
      while (i < src.length && src[i] !== ">") {
        if (src[i] === '"' || src[i] === "'") {
          const q = src[i];
          let k = i + 1;
          while (k < src.length && src[k] !== q) k++;
          k++;
          html += tok(C.str, src.slice(i, k));
          i = k;
        } else if (/[A-Za-z_]/.test(src[i])) {
          let k = i;
          while (k < src.length && /[A-Za-z0-9_:-]/.test(src[k])) k++;
          html += tok(C.attr, src.slice(i, k));
          i = k;
        } else {
          html += esc(src[i]);
          i++;
        }
      }
      if (i < src.length) { html += "&gt;"; i++; }
      continue;
    }
    html += esc(src[i]);
    i++;
  }
  return html;
}

function hlCss(src: string): string {
  let html = "";
  let i = 0;
  while (i < src.length) {
    if (src[i] === "/" && src[i + 1] === "*") {
      let j = i + 2;
      while (j < src.length && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(j + 2, src.length);
      html += tok(C.cmt, src.slice(i, j));
      i = j;
      continue;
    }
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i];
      let j = i + 1;
      while (j < src.length && src[j] !== q) j++;
      j++;
      html += tok(C.str, src.slice(i, j));
      i = j;
      continue;
    }
    if (src[i] === "#" && /[0-9a-fA-F]/.test(src[i + 1] ?? "")) {
      let j = i;
      while (j < src.length && /[#0-9a-fA-F]/.test(src[j])) j++;
      html += tok(C.num, src.slice(i, j));
      i = j;
      continue;
    }
    if (/[a-zA-Z-]/.test(src[i]) && src[i] !== "-") {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9_-]/.test(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < src.length && (src[k] === " " || src[k] === "\t")) k++;
      html += src[k] === ":" ? tok(C.attr, word) : tok(C.type, word);
      i = j;
      continue;
    }
    if (/\d/.test(src[i])) {
      let j = i;
      while (j < src.length && /[\d.%a-z]/.test(src[j])) j++;
      html += tok(C.num, src.slice(i, j));
      i = j;
      continue;
    }
    html += esc(src[i]);
    i++;
  }
  return html;
}

export function highlight(code: string, lang: string): string {
  switch (lang) {
    case "tsx": case "ts": case "js": case "jsx": return hlTsx(code);
    case "json": return hlJson(code);
    case "html": return hlHtml(code);
    case "css":  return hlCss(code);
    default:     return esc(code);
  }
}

// ─── Shared editor styles ─────────────────────────────────────────────────────

const MONO =
  "ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace";
const SHARED_STYLE =
  `font-family:${MONO};font-size:13px;line-height:1.6;` +
  `padding:1rem 1.25rem;tab-size:2;white-space:pre;` +
  `word-wrap:normal;overflow-wrap:normal;margin:0;box-sizing:border-box;`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type CodeEditLanguage = "tsx" | "ts" | "js" | "jsx" | "json" | "html" | "css" | "text";

export interface CodeEditProps {
  /** Source code value */
  value?: string;
  /** Called with the updated value on every edit */
  onValue$?: QRL<(value: string) => void>;
  /** Syntax highlight language (default: tsx) */
  language?: CodeEditLanguage;
  /** Placeholder shown on an empty editor */
  placeholder?: string;
  /** Read-only display mode — no editing, textarea omitted */
  readOnly?: boolean;
  /** Visible row count that sets the minimum height (default: 8) */
  rows?: number;
  /** Extra Tailwind classes on the wrapper element */
  class?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Textarea-like code editor with built-in syntax highlighting.
 * Uses an overlay technique: transparent `<textarea>` on top of a highlighted `<pre>`.
 * Tab key inserts two spaces instead of moving focus.
 * Supports tsx / ts / js / jsx / json / html / css / text.
 */
export const CodeEdit = component$<CodeEditProps>((props) => {
  const { language = "tsx", readOnly = false, rows = 8 } = props;
  const inner = useSignal(props.value ?? "");
  const preRef = useSignal<Element>();

  // Trailing \n prevents the last line from being visually clipped in the pre
  const hlHtml = highlight(inner.value, language) + "\n";

  // Height: rows × 1.6 line-height × 13px font + 2 × 1rem padding
  const minH = `${Math.round(rows * 1.6 * 13 + 32)}px`;

  // Read-only: simple pre, no overlay needed
  if (readOnly) {
    return (
      <div
        class={[
          "relative overflow-hidden rounded-xl border border-separator-opaque bg-slate-950 shadow-sm",
          props.class,
        ].filter(Boolean).join(" ")}
      >
        <div class="absolute right-2 top-2 select-none rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
          {language}
        </div>
        <pre
          style={SHARED_STYLE + "color:#d4d4d4;overflow:auto;"}
          aria-label="Code"
        >
          <code dangerouslySetInnerHTML={hlHtml} />
        </pre>
      </div>
    );
  }

  return (
    <div
      class={[
        "relative overflow-hidden rounded-xl border border-separator-opaque bg-slate-950 shadow-sm",
        props.class,
      ].filter(Boolean).join(" ")}
      style={{ minHeight: minH }}
    >
      {/* Language badge */}
      <div class="absolute right-2 top-2 z-10 select-none rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
        {language}
      </div>

      {/* Highlighted layer — synced scroll, pointer-events off */}
      <pre
        ref={preRef}
        aria-hidden="true"
        style={
          SHARED_STYLE +
          "color:#d4d4d4;position:absolute;inset:0;overflow:auto;pointer-events:none;"
        }
      >
        <code dangerouslySetInnerHTML={hlHtml} />
      </pre>

      {/* Editable textarea — sits on top, transparent text, caret visible */}
      <textarea
        style={
          SHARED_STYLE +
          "color:transparent;caret-color:#d4d4d4;" +
          "background:transparent;resize:none;outline:none;border:none;" +
          "position:absolute;inset:0;overflow:auto;width:100%;height:100%;"
        }
        value={inner.value}
        placeholder={props.placeholder}
        spellcheck={false}
        autocomplete="off"
        aria-label="Code editor"
        onInput$={(_, el) => {
          inner.value = el.value;
          if (props.onValue$) props.onValue$(el.value);
          // Sync highlighted layer scroll
          if (preRef.value) {
            (preRef.value as HTMLElement).scrollTop = el.scrollTop;
            (preRef.value as HTMLElement).scrollLeft = el.scrollLeft;
          }
        }}
        onScroll$={(_, el) => {
          if (preRef.value) {
            (preRef.value as HTMLElement).scrollTop = el.scrollTop;
            (preRef.value as HTMLElement).scrollLeft = el.scrollLeft;
          }
        }}
        onKeyDown$={[
          // Tab → insert 2 spaces synchronously (e.preventDefault must be sync)
          sync$((e: KeyboardEvent, el: HTMLTextAreaElement) => {
            if (e.key !== "Tab") return;
            e.preventDefault();
            const s = el.selectionStart;
            const end = el.selectionEnd;
            el.value = el.value.slice(0, s) + "  " + el.value.slice(end);
            el.selectionStart = el.selectionEnd = s + 2;
          }),
          // Update signal after DOM mutation
          $((e: KeyboardEvent, el: HTMLTextAreaElement) => {
            if (e.key !== "Tab") return;
            inner.value = el.value;
            if (props.onValue$) props.onValue$(el.value);
          }),
        ]}
      />
    </div>
  );
});
