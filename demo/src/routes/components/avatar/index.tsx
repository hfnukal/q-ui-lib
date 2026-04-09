import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Avatar } from "~/components/ui/avatar";

/** Inline SVG data URLs — spolehlivé v demu bez externích hostitelů (picsum často selže / redirect). */
const demoFace = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="${fill}"/><circle cx="64" cy="50" r="26" fill="#fff" fill-opacity="0.92"/><path d="M24 118c0-26 18-44 40-44s40 18 40 44" fill="#fff" fill-opacity="0.92"/></svg>`,
  )}`;

const SRC_COMPOUND = demoFace("#5b6efd");
const SRC_SM = demoFace("#0d9488");
const SRC_MD = demoFace("#d97706");
const SRC_LG = demoFace("#7c3aed");

const codeCompound = `import { Avatar } from "~/components/ui/avatar";

<Avatar.Root>
  <Avatar.Image src="…" alt="Náhled" />
  <Avatar.Fallback>QU</Avatar.Fallback>
</Avatar.Root>`;

const codeSizes = `import { Avatar } from "~/components/ui/avatar";

<div class="flex items-center gap-3">
  <Avatar.Root size="sm">
    <Avatar.Image src="…" alt="" />
    <Avatar.Fallback>S</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="md">
    <Avatar.Image src="…" alt="" />
    <Avatar.Fallback>M</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="lg">
    <Avatar.Image src="…" alt="" />
    <Avatar.Fallback>L</Avatar.Fallback>
  </Avatar.Root>
</div>`;

const codeFallbackOnly = `import { Avatar } from "~/components/ui/avatar";

<Avatar.Root>
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar.Root>`;

const codeBroken = `import { Avatar } from "~/components/ui/avatar";

<Avatar.Root>
  <Avatar.Image src="https://example.invalid/does-not-exist.jpg" alt="" />
  <Avatar.Fallback>!</Avatar.Fallback>
</Avatar.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Avatar</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Složené API jako u{" "}
          <a
            class="text-link underline-offset-2 hover:underline"
            href="https://qwikui.com/docs/styled/avatar"
            target="_blank"
            rel="noreferrer"
          >
            Qwik UI Styled Avatar
          </a>
          : <code class="text-caption-1">Avatar.Root</code>,{" "}
          <code class="text-caption-1">Avatar.Image</code>,{" "}
          <code class="text-caption-1">Avatar.Fallback</code>. Fallback používá tokeny z COLORS.md (
          <code class="text-caption-1">fill-tertiary</code>, <code class="text-caption-1">label</code>) pro dobrý kontrast.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Obrázek + fallback</h2>
        <CodeExample code={codeCompound}>
          <Avatar.Root>
            <Avatar.Image src={SRC_COMPOUND} alt="Ukázkový avatar (SVG)" />
            <Avatar.Fallback>QU</Avatar.Fallback>
          </Avatar.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikosti</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">size</code> na <code class="text-caption-1">Avatar.Root</code>:{" "}
          <code class="text-caption-1">sm</code>, <code class="text-caption-1">md</code> (výchozí),{" "}
          <code class="text-caption-1">lg</code>.
        </p>
        <CodeExample code={codeSizes}>
          <div class="flex flex-wrap items-center gap-4">
            <Avatar.Root size="sm">
              <Avatar.Image src={SRC_SM} alt="" />
              <Avatar.Fallback>S</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root size="md">
              <Avatar.Image src={SRC_MD} alt="" />
              <Avatar.Fallback>M</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root size="lg">
              <Avatar.Image src={SRC_LG} alt="" />
              <Avatar.Fallback>L</Avatar.Fallback>
            </Avatar.Root>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Jen fallback</h2>
        <p class="text-callout text-secondary-label">
          Bez <code class="text-caption-1">Avatar.Image</code> nebo bez <code class="text-caption-1">src</code> zůstane
          iniciála / placeholder.
        </p>
        <CodeExample code={codeFallbackOnly}>
          <Avatar.Root>
            <Avatar.Fallback>AB</Avatar.Fallback>
          </Avatar.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Chyba načtení obrázku</h2>
        <p class="text-callout text-secondary-label">
          Neplatná URL zobrazí znovu <code class="text-caption-1">Avatar.Fallback</code>.
        </p>
        <CodeExample code={codeBroken}>
          <Avatar.Root>
            <Avatar.Image src="https://example.invalid/does-not-exist.jpg" alt="" />
            <Avatar.Fallback>!</Avatar.Fallback>
          </Avatar.Root>
        </CodeExample>
      </section>
    </div>
  );
});
