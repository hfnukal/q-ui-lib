/**
 * @component layout-shell
 * @title LayoutShell
 * @version 0.0.1
 * @example Basic layout
 * Basic layout example
 * ```tsx
 * import { LayoutShell } from "~/components/ui/qui-test-layout/layout-shell";
 *
 * <LayoutShell.Root>
 *   <LayoutShell.Header>Admin</LayoutShell.Header>
 *   <LayoutShell.Content>
 *     <LayoutShell.Sidebar>Filters</LayoutShell.Sidebar>
 *     <LayoutShell.Main>Page content</LayoutShell.Main>
 *   </LayoutShell.Content>
 * </LayoutShell.Root>
 * ```
 */
import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Box } from "../../base/box";
import { Split } from "../../base/split";

export const LayoutShellRoot = component$<PropsOf<"div">>((props) => {
  const { class: className, ...rest } = props;
  return (
    <Box
      {...rest}
      class={["grid min-h-[280px] grid-rows-[auto_1fr] rounded-lg border", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Slot />
    </Box>
  );
});

export const LayoutShellHeader = component$<PropsOf<"div">>((props) => {
  const { class: className, ...rest } = props;
  return (
    <Box
      {...rest}
      class={["border-b px-4 py-3 text-sm font-semibold", className].filter(Boolean).join(" ")}
    >
      <Slot />
    </Box>
  );
});

export const LayoutShellContent = component$<PropsOf<"div">>((props) => {
  const { class: className, ...rest } = props;
  return (
    <Split.Root
      {...rest}
      direction="horizontal"
      class={["min-h-0", className].filter(Boolean).join(" ")}
    >
      <Slot />
    </Split.Root>
  );
});

export const LayoutShellSidebar = component$<PropsOf<"div">>((props) => {
  const { class: className, ...rest } = props;
  return (
    <Split.Panel size="220px" class="min-h-0 min-w-0">
      <Box {...rest} class={["h-full border-r p-4 text-sm", className].filter(Boolean).join(" ")}>
        <Slot />
      </Box>
    </Split.Panel>
  );
});

export const LayoutShellMain = component$<PropsOf<"div">>((props) => {
  const { class: className, ...rest } = props;
  return (
    <Split.Panel class="min-h-0 min-w-0">
      <Box {...rest} class={["h-full p-4", className].filter(Boolean).join(" ")}>
        <Slot />
      </Box>
    </Split.Panel>
  );
});

export const LayoutShell = {
  Root: LayoutShellRoot,
  Header: LayoutShellHeader,
  Content: LayoutShellContent,
  Sidebar: LayoutShellSidebar,
  Main: LayoutShellMain,
};
