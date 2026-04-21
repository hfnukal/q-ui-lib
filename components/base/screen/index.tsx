/**
 * @component screen
 * @title Screen
 * @version 1.0.0
 * @example Základ
 * Náhled je omezený výškou — komponenta sama je na celý viewport.
 * ```tsx
 * import { Screen } from "~/components/ui/screen";
 * 
 * <Screen class="bg-background max-h-[22rem]">
 *   <header class="shrink-0 border-b border-separator-opaque px-4 py-3">Header</header>
 *   <main class="min-h-0 flex-1">
 *     <p class="p-4">Main content</p>
 *   </main>
 * </Screen>
 * ```
 *
 * @example Skladba Layout
 * `Screen` + `Split` + `Stack` + `ScrollArea` + `Box` — v náhledu omez výšku (např. `class="h-[32rem]"`); dlouhý obsah + `keepScroll` na `ScrollArea.Pane`.
 * ```tsx
 * import { Box } from "~/components/ui/box";
 * import { ScrollArea } from "~/components/ui/scroll-area";
 * import { Screen } from "~/components/ui/screen";
 * import { Split } from "~/components/ui/split";
 * import { Stack } from "~/components/ui/stack";
 * 
 * <Screen class="h-[22rem]">
 *   <Split.Root direction="horizontal" class="min-h-0 flex-1">
 *     <Split.Panel size="200px">
 *       <Box padding="md" border rounded="lg" background="raised" class="h-full">
 *         Sidebar
 *       </Box>
 *     </Split.Panel>
 *     <Split.Panel>
 *       <Stack direction="column" gap={0} class="h-full min-h-0">
 *         <Box padding="md" border rounded="lg" background="overlay" class="shrink-0">
 *           Header
 *         </Box>
 *         <ScrollArea.Pane
 *           class="min-h-0 flex-1"
 *           viewportClass="p-4"
 *           direction="vertical"
 *           keepScroll
 *           keepScrollId="screen-layout-demo"
 *         >
 *           <Box padding="md" background="grouped" rounded="lg" class="space-y-3">
 *             <p>Hlavní obsah — odstavec 1.</p>
 *             <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
 *             <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
 *             <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
 *             <p>Duis aute irure dolor in reprehenderit in voluptate velit esse.</p>
 *             <p>Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</p>
 *             <p>Sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
 *             <p>Pellentesque habitant morbi tristique senectus et netus et malesuada.</p>
 *             <p>Fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae.</p>
 *             <p>Ultricies eget, tempor sit amet, ante. Donec eu libero sit amet.</p>
 *             <p>Quam blandit euismod. Risus condimentum orci, eget eleifend nibh.</p>
 *             <p>Poslední blok — měl by být po scrollu vidět až sem.</p>
 *           </Box>
 *         </ScrollArea.Pane>
 *       </Stack>
 *     </Split.Panel>
 *   </Split.Root>
 * </Screen>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type ScreenProps = PropsOf<"div">;

/**
 * Viewport root: full screen, no body scroll, column flex (LAYOUT.md).
 * Compose with {@link ScrollArea} for inner scroll.
 */
export const Screen = component$<ScreenProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex h-screen w-screen min-h-0 min-w-0 flex-col overflow-hidden";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});
