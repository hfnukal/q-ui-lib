/**
 * @component html-tags-mix
 * @title HtmlTagsMix
 * @version 0.0.1
 * @example Kombinace ruznych HTML tagu
 * ```tsx
 * import { HtmlTagsMix } from "~/components/ui/qui-test-html-tags/html-tags-mix";
 *
 * <HtmlTagsMix />
 * ```
 */
import { component$ } from "@builder.io/qwik";
import { Accordion } from "../../base/accordion";
import { Box } from "../../base/box";
import { Stack } from "../../base/stack";

export const HtmlTagsMix = component$(() => {
  return (
    <Box class="rounded-md border p-4">
      <Stack gap={3}>
        <h1 class="text-lg font-bold">Accordion v ruznych HTML tazich</h1>

        <div class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion uvnitr div</Accordion.Trigger>
            <Accordion.Content>Obsah pro wrapper div.</Accordion.Content>
          </Accordion.Root>
        </div>

        <div class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion po nahrazeni p za div</Accordion.Trigger>
            <Accordion.Content>Obsah pro wrapper div (puvodne p).</Accordion.Content>
          </Accordion.Root>
        </div>

        <ul class="list-disc pl-5">
          <li class="rounded bg-slate-50 p-2 text-sm">
            <Accordion.Root>
              <Accordion.Trigger>Accordion uvnitr li</Accordion.Trigger>
              <Accordion.Content>Obsah pro wrapper li.</Accordion.Content>
            </Accordion.Root>
          </li>
        </ul>

        <div class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion po nahrazeni span za div</Accordion.Trigger>
            <Accordion.Content>Obsah pro wrapper div (puvodne span).</Accordion.Content>
          </Accordion.Root>
        </div>

        <section class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion uvnitr section</Accordion.Trigger>
            <Accordion.Content>Obsah pro wrapper section.</Accordion.Content>
          </Accordion.Root>
        </section>

        <footer class="text-xs text-slate-600">Footer sekce komponenty.</footer>
      </Stack>
    </Box>
  );
});
