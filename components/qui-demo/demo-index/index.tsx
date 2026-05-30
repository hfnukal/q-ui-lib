import { $, component$, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { Badge } from "../../base/badge";
import { Button } from "../../base/button";
import { Card } from "../../base/card";
import { Input } from "../../base/input";
import { Switch } from "../../base/switch";
import { hexToHslString, hslStringToHex } from "../demo-utils/color-utils";
import { DEFAULT_VALUES, TOKEN_GROUPS } from "../demo-utils/theme-tokens";

export default component$(() => {
  const values = useSignal<Record<string, string>>({ ...DEFAULT_VALUES });
  const copied = useSignal(false);
  const switchOn = useSignal(false);

  // Apply the tokens to <html> on every change
  useTask$(({ track }) => {
    const vals = track(() => values.value);
    if (typeof document === "undefined") return;
    for (const [name, val] of Object.entries(vals)) {
      document.documentElement.style.setProperty(name, val);
    }
  });

  // Cleanup — remove the inline styles when leaving the page
  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      for (const name of Object.keys(DEFAULT_VALUES)) {
        document.documentElement.style.removeProperty(name);
      }
    });
  });

  const reset = $(() => {
    values.value = { ...DEFAULT_VALUES };
    for (const name of Object.keys(DEFAULT_VALUES)) {
      document.documentElement.style.removeProperty(name);
    }
  });

  const copyCss = $(() => {
    const lines = Object.entries(values.value)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");
    navigator.clipboard.writeText(`:root {\n${lines}\n}`);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  });

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-title-2 font-bold text-label">Theme Editor</h1>
          <p class="mt-1 text-callout text-secondary-label">
            Edit the CSS tokens and watch the result instantly. Copy the CSS block into your{" "}
            <code class="text-caption-1">global.css</code>.
          </p>
        </div>
        <div class="flex gap-2">
          <Button variant="secondary" onClick$={reset}>
            Reset
          </Button>
          <Button onClick$={copyCss}>{copied.value ? "Copied!" : "Copy CSS"}</Button>
        </div>
      </div>

      <div class="flex flex-col gap-8 lg:flex-row">
        {/* Editor */}
        <div class="min-w-0 flex-1 space-y-8">
          {TOKEN_GROUPS.map((group) => (
            <section key={group.label}>
              <h2 class="mb-3 text-headline font-semibold text-label">{group.label}</h2>
              <div class="overflow-hidden rounded-xl border border-separator-opaque">
                {group.tokens.map((token, i) => {
                  const val = values.value[token.name] ?? token.default;
                  return (
                    <div
                      key={token.name}
                      class={[
                        "flex items-center gap-3 px-4 py-2.5",
                        i !== 0 ? "border-t border-separator-opaque" : "",
                      ].join(" ")}
                    >
                      {/* Color swatch — clicking opens the native picker */}
                      <label class="relative h-7 w-7 shrink-0 cursor-pointer overflow-hidden rounded-md border border-separator-opaque shadow-sm">
                        <span
                          class="absolute inset-0"
                          style={{ background: `hsl(${val})` }}
                          aria-hidden="true"
                        />
                        <input
                          type="color"
                          class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          value={hslStringToHex(val)}
                          onInput$={(e) => {
                            const hex = (e.target as HTMLInputElement).value;
                            values.value = {
                              ...values.value,
                              [token.name]: hexToHslString(hex),
                            };
                          }}
                        />
                      </label>

                      {/* Token name */}
                      <code class="w-52 shrink-0 text-caption-1 text-secondary-label">
                        {token.name}
                      </code>

                      {/* HSL input */}
                      <Input
                        class="h-8 flex-1 font-mono text-caption-1"
                        value={val}
                        onInput$={(e) => {
                          values.value = {
                            ...values.value,
                            [token.name]: (e.target as HTMLInputElement).value,
                          };
                        }}
                        aria-label={`Value of token ${token.name}`}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Preview panel */}
        <div class="w-full shrink-0 space-y-4 lg:sticky lg:top-6 lg:w-72 lg:self-start">
          <h2 class="text-headline font-semibold text-label">Preview</h2>

          <Card.Root>
            <Card.Header>
              <Card.Title>Component preview</Card.Title>
              <Card.Description>They react live to token changes.</Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
              {/* Buttons */}
              <div class="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
              </div>

              {/* Badges */}
              <div class="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>

              {/* Input */}
              <Input placeholder="Sample input…" />

              {/* Switch */}
              <div class="flex items-center gap-3">
                <Switch bind:pressed={switchOn} aria-label="Sample switch" />
                <span class="text-callout text-label">
                  {switchOn.value ? "On" : "Off"}
                </span>
              </div>
            </Card.Content>
          </Card.Root>

          {/* Color palette swatch */}
          <div class="overflow-hidden rounded-xl border border-separator-opaque">
            <div class="px-4 py-3 text-caption-1 font-medium text-secondary-label">
              Color palette
            </div>
            <div class="grid grid-cols-6 gap-0">
              {[
                "--system-blue",
                "--system-green",
                "--system-red",
                "--system-orange",
                "--system-purple",
                "--system-yellow",
                "--system-cyan",
                "--system-teal",
                "--system-mint",
                "--system-indigo",
                "--system-pink",
                "--system-brown",
              ].map((t) => (
                <div
                  key={t}
                  class="aspect-square"
                  style={{ background: `hsl(${values.value[t] ?? DEFAULT_VALUES[t]})` }}
                  title={t}
                />
              ))}
            </div>
          </div>

          {/* Grays */}
          <div class="overflow-hidden rounded-xl border border-separator-opaque">
            <div class="px-4 py-3 text-caption-1 font-medium text-secondary-label">
              Gray scale
            </div>
            <div class="flex">
              {[
                "--system-gray",
                "--system-gray-2",
                "--system-gray-3",
                "--system-gray-4",
                "--system-gray-5",
                "--system-gray-6",
              ].map((t) => (
                <div
                  key={t}
                  class="flex-1 py-4"
                  style={{ background: `hsl(${values.value[t] ?? DEFAULT_VALUES[t]})` }}
                  title={t}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
