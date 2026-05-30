/**
 * @component html-tags-mix
 * @title HtmlTagsMix
 * @version 0.0.1
 * @example Combination of various HTML tags
 * Combination of various HTML tags
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
        <h1 class="text-lg font-bold">Accordion in various HTML tags</h1>

        <div class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion inside div</Accordion.Trigger>
            <Accordion.Content>Content for wrapper div.</Accordion.Content>
          </Accordion.Root>
        </div>

        <div class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion after replacing p with div</Accordion.Trigger>
            <Accordion.Content>Content for wrapper div (originally p).</Accordion.Content>
          </Accordion.Root>
        </div>

        <ul class="list-disc pl-5">
          <li class="rounded bg-slate-50 p-2 text-sm">
            <Accordion.Root>
              <Accordion.Trigger>Accordion inside li</Accordion.Trigger>
              <Accordion.Content>Content for wrapper li.</Accordion.Content>
            </Accordion.Root>
          </li>
        </ul>

        <div class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion after replacing span with div</Accordion.Trigger>
            <Accordion.Content>Content for wrapper div (originally span).</Accordion.Content>
          </Accordion.Root>
        </div>

        <section class="rounded bg-slate-50 p-2 text-sm">
          <Accordion.Root>
            <Accordion.Trigger>Accordion inside section</Accordion.Trigger>
            <Accordion.Content>Content for wrapper section.</Accordion.Content>
          </Accordion.Root>
        </section>

        <footer class="text-xs text-slate-600">Component footer section.</footer>
      </Stack>
    </Box>
  );
});
