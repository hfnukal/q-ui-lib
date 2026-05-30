/**
 * @component complex-dashboard
 * @title ComplexDashboard
 * @version 0.0.1
 * @example Dashboard with composed components
 * Dashboard example, showcase
 * ```tsx
 * import { ComplexDashboard } from "~/components/ui/qui-test-complex/complex-dashboard";
 *
 * <ComplexDashboard title="Project overview" items={["Build #142", "2 new tasks", "1 failing test"]} />
 * ```
 */
import { $, component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Badge } from "../../base/badge";
import { Avatar } from "../../base/avatar";
import { Box } from "../../base/box";
import { Button } from "../../base/button";
import { Card } from "../../base/card";
import { Carousel } from "../../base/carousel";
import { Chart } from "../../base/chart";
import { CheckboxField } from "../../base/checkbox";
import {
  Combobox,
} from "../../base/combobox";
import { Dialog } from "../../base/dialog";
import { Field } from "../../base/field";
import { InputGroup } from "../../base/input-group";
import { Input } from "../../base/input";
import { Item } from "../../base/item";
import { Menu, MenuItem } from "../../base/menu";
import { Popover } from "../../base/popover";
import { ProgressBar } from "../../base/progress";
import { RadioGroup } from "../../base/radio-group";
import { Select } from "../../base/select";
import { Sonner, useSonner } from "../../base/sonner";
import { Spinner } from "../../base/spinner";
import { Stack } from "../../base/stack";
import { Switch } from "../../base/switch";
import { Table } from "../../base/table";
import { Tabs } from "../../base/tabs";
import { Textarea } from "../../base/textarea";
import { Toolbar } from "../../base/toolbar";
import { Accordion } from "../../base/accordion";
import { LayoutShell } from "../../qui-test-layout/layout-shell";
import { SimpleBanner } from "../../qui-test-simple/simple-banner";

const dashboardTabsListClass =
  "flex w-full items-center justify-start gap-0 rounded-none border-0 border-b border-separator bg-transparent p-0 text-secondary-label shadow-none";

const dashboardTabsTriggerClass =
  "inline-flex items-center justify-center relative rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-2 font-medium whitespace-nowrap text-callout text-secondary-label ring-offset-background transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=selected]:border-accent data-[state=selected]:text-label data-[state=selected]:bg-transparent data-[state=selected]:shadow-none";

const dashboardTabsPanelClass =
  "text-body text-secondary-label ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-4";

export interface ComplexDashboardProps {
  title: string;
  items: string[];
}

const DashboardToastActions = component$(() => {
  const { toast } = useSonner();
  return (
    <Toolbar.Root aria-label="Dashboard actions">
      <Toolbar.Group aria-label="Quick actions">
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Dashboard updated",
              description: "Data is synchronized with the API.",
              type: "success",
            })
          }
        >
          Notify
        </Toolbar.Button>
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Loading report",
              description: "The export is being prepared in the background.",
              type: "loading",
            })
          }
        >
          Loading
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  );
});

interface ToastButtonProps {
  title: string;
  description: string;
  variant?: "contained" | "outline" | "text" | "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  class?: string;
}

const ToastButton = component$<ToastButtonProps>((props) => {
  const { toast } = useSonner();
  return (
    <Button
      variant={props.variant}
      size={props.size}
      class={props.class}
      onClick$={() =>
        toast({
          title: props.title,
          description: props.description,
          type: "success",
        })
      }
    >
      <Slot />
    </Button>
  );
});

const HeaderToolbarMenus = component$<{ title: string }>((props) => {
  const { toast } = useSonner();
  const showSidebar = useSignal(true);
  const showGrid = useSignal(false);
  const density = useSignal("comfortable");
  return (
    <Toolbar.Root aria-label="Dashboard header toolbar" class="w-full">
      <div class="text-callout text-label">{props.title}</div>
      <Toolbar.Spacer />
      <Toolbar.Group aria-label="Navigation">
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Switched to overview",
              description: "The Overview view is active.",
              type: "info",
            })
          }
        >
          Overview
        </Toolbar.Button>
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Switched to reports",
              description: "Opening the reports section.",
              type: "info",
            })
          }
        >
          Reports
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group aria-label="Menu sm">

        <Menu.Root menuKey="menu-sm">
          <Menu.Trigger class="size-7">
            ⋮
          </Menu.Trigger>
          <Menu.Panel>
              <Menu.Item
              onSelect$={() => {
                void toast({
                  title: "Mini menu",
                  description: "Selected an action from the compact menu.",
                  type: "info",
                });
              }}
            >
              Mini action
            </Menu.Item>
          </Menu.Panel>
        </Menu.Root>
      </Toolbar.Group>
      <Toolbar.Group aria-label="Menu md">

        <Menu.Root menuKey="menu-m">
          <Menu.Trigger>Menu M</Menu.Trigger>
          <Menu.Panel>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu M",
                  description: "Selected item 1.",
                  type: "info",
                });
              }}
            >
              <MenuItem.Root>
                <MenuItem.Start>📄</MenuItem.Start>
                <MenuItem.Label>Item 1</MenuItem.Label>
                <MenuItem.End>⌘1</MenuItem.End>
              </MenuItem.Root>
            </Menu.Item>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu M",
                  description: "Selected item 2.",
                  type: "info",
                });
              }}
            >
              <MenuItem.Root>
                <MenuItem.Start>⚙️</MenuItem.Start>
                <MenuItem.Label>Item 2</MenuItem.Label>
                <MenuItem.End>⌘2</MenuItem.End>
              </MenuItem.Root>
            </Menu.Item>

            <Menu.Separator />
            <Menu.SubMenu>
              <Menu.SubTrigger>
                <span>Advanced</span>
                <span aria-hidden="true">›</span>
              </Menu.SubTrigger>
              <Menu.Panel>
                <Menu.Item
                  onClick$={$(() => {
                    alert("Audit log");
                    void toast({
                      title: "Advanced",
                      description: "Opened the audit log.",
                      type: "info",
                    });
                  })}
                >
                  Audit log
                </Menu.Item>
                <Menu.Item
                  onClick$={$(() => {
                    alert("Integrations");
                    void toast({
                      title: "Advanced",
                      description: "Opened integrations.",
                      type: "info",
                    });
                  })}
                >
                  Integrations
                </Menu.Item>
              </Menu.Panel>
            </Menu.SubMenu>

          </Menu.Panel>
        </Menu.Root>

        <Menu.Root menuKey="menu-m-alias" gutter={4}>
          <Menu.Trigger>Menu M (alias)</Menu.Trigger>
          <Menu.Panel>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu alias",
                  description: "Selected item A.",
                  type: "info",
                });
              }}
            >
              Item A
            </Menu.Item>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu alias",
                  description: "Selected item B.",
                  type: "info",
                });
              }}
            >
              Item B
            </Menu.Item>
            <Menu.Separator />
            <Menu.SubMenu>
              <Menu.SubTrigger>
                <span>Advanced</span>
                <span aria-hidden="true">›</span>
              </Menu.SubTrigger>
              <Menu.Panel>
                <Menu.Item
                  onSelect$={$(() => {
                    void toast({
                      title: "Menu alias",
                      description: "Opened the audit log (submenu).",
                      type: "info",
                    });
                  })}
                >
                  Audit log
                </Menu.Item>
                <Menu.Item
                  onSelect$={$(() => {
                    void toast({
                      title: "Menu alias",
                      description: "Opened integrations (submenu).",
                      type: "info",
                    });
                  })}
                >
                  Integrations
                </Menu.Item>
              </Menu.Panel>
            </Menu.SubMenu>

            <Menu.SubMenu>
              <Menu.SubTrigger>
                <span>Advanced 2</span>
                <span aria-hidden="true">›</span>
              </Menu.SubTrigger>
              <Menu.Panel>
                <Menu.Item
                  onSelect$={() => {
                    alert("Audit log");
                    void toast({
                      title: "Menu alias",
                      description: "Opened the audit log (submenu).",
                      type: "info",
                    });
                  }}
                >
                  Audit log
                </Menu.Item>
                <Menu.Item
                  onSelect$={$(() => {
                    alert("Integrations");
                    void toast({
                      title: "Menu alias",
                      description: "Opened integrations (submenu).",
                      type: "info",
                    });
                  })}
                >
                  Integrations
                </Menu.Item>
              </Menu.Panel>
            </Menu.SubMenu>
          </Menu.Panel>
        </Menu.Root>


        <Menu.Root menuKey="menu-m-alias" gutter={4}>
          <Menu.Trigger>Menu M (alias)</Menu.Trigger>
          <Menu.Panel>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu alias",
                  description: "Selected item A.",
                  type: "info",
                });
              }}
            >
              Item A
            </Menu.Item>
            <Menu.Root floating="right-start" gutter={4}>
              <Menu.Trigger>Menu M (alias)</Menu.Trigger>
              <Menu.Panel>
                <Menu.Item
                  onClick$={() => {
                    void toast({
                      title: "Menu alias",
                      description: "Selected item A.",
                      type: "info",
                    });
                  }}
                >
                  Item A
                </Menu.Item>
              </Menu.Panel>
            </Menu.Root>
          </Menu.Panel>
        </Menu.Root>

      </Toolbar.Group>
      <Toolbar.Group aria-label="Menu lg">
        <Menu.Root menuKey="menu-lg">
          <Menu.Trigger class="px-4 py-2 text-sm">Menu L</Menu.Trigger>
          <Menu.Panel>
            <Menu.CheckBoxItem
              bind:value={showSidebar}
              onClick$={() => {
                void toast({
                  title: "Menu L",
                  description: `Sidebar ${showSidebar.value ? "disabled" : "enabled"}.`,
                  type: "info",
                });
              }}
            >
              <MenuItem.Label>Show sidebar</MenuItem.Label>
              <MenuItem.End>⌘B</MenuItem.End>
            </Menu.CheckBoxItem>
            <Menu.CheckBoxItem
              bind:value={showGrid}
              onClick$={() => {
                void toast({
                  title: "Menu L",
                  description: `Grid ${showGrid.value ? "disabled" : "enabled"}.`,
                  type: "info",
                });
              }}
            >
              <MenuItem.Label>Show grid</MenuItem.Label>
              <MenuItem.End>⌘G</MenuItem.End>
            </Menu.CheckBoxItem>
            <Menu.Separator />
            <Menu.RadioGroup bind:value={density}>
              <Menu.RadioButton
                value="comfortable"
                onClick$={() => {
                  void toast({
                    title: "Display density",
                    description: "Set to Comfortable.",
                    type: "info",
                  });
                }}
              >
                <MenuItem.Label>Comfortable</MenuItem.Label>
              </Menu.RadioButton>
              <Menu.RadioButton
                value="compact"
                onClick$={() => {
                  void toast({
                    title: "Display density",
                    description: "Set to Compact.",
                    type: "info",
                  });
                }}
              >
                <MenuItem.Label>Compact</MenuItem.Label>
              </Menu.RadioButton>
            </Menu.RadioGroup>
          </Menu.Panel>
        </Menu.Root>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group aria-label="Export">
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Export started",
              description: "The CSV export has been queued.",
              type: "loading",
            })
          }
        >
          Export CSV
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  );
});

export const ComplexDashboard = component$<ComplexDashboardProps>((props) => {
  const { toast } = useSonner();
  const selectedTeams = useSignal<string[]>(["platform"]);
  const animatedProgress = useSignal(20);

  useVisibleTask$(({ cleanup }) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tick = () => {
      if (cancelled) {
        return;
      }
      animatedProgress.value = animatedProgress.value >= 100 ? 0 : animatedProgress.value + 5;
      timeoutId = setTimeout(tick, 500);
    };

    timeoutId = setTimeout(tick, 500);

    cleanup(() => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
  });

  return (
    <Sonner.Toaster position="bottom-right">
      <LayoutShell.Root>
        <LayoutShell.Header>
          <div class="flex w-full items-center justify-between gap-3">
            <HeaderToolbarMenus title={props.title} />
          </div>
        </LayoutShell.Header>
        <LayoutShell.Content>
          <LayoutShell.Sidebar>
            <Stack gap={3}>
              <SimpleBanner tone="info" headline="System info">
                Data is refreshed every 30 seconds.
              </SimpleBanner>

              <DashboardToastActions />

              <Card.Root as="div">
                <Card.Header>
                  <Card.Title>Quick filters</Card.Title>
                  <Card.Description>Example of composing Field + InputGroup + Button.</Card.Description>
                </Card.Header>
                <Card.Content class="space-y-3">
                  <Field.Root as="div">
                    <Field.Description id="dashboard-search-help">
                      Filter by task name
                    </Field.Description>
                    <InputGroup.Root as="div" aria-label="Filter tasks">
                      <InputGroup.Input
                        placeholder="Search item..."
                        aria-describedby="dashboard-search-help"
                      />
                      <ToastButton
                        variant="secondary"
                        size="sm"
                        title="Filter applied"
                        description="The dashboard was filtered by the entered query."
                        class="inline-flex items-center gap-1"
                      >
                        🔍
                      </ToastButton>
                    </InputGroup.Root>
                  </Field.Root>
                </Card.Content>
              </Card.Root>

              <Card.Root as="div">
                <Card.Header>
                  <Card.Title>Menu and Popover</Card.Title>
                  <Card.Description>Menu + Popover + Dialog in one place.</Card.Description>
                </Card.Header>
                <Card.Content class="flex flex-wrap gap-2">
                  <Menu.Root>
                    <Menu.Trigger>Menu</Menu.Trigger>
                    <Menu.Panel>
                      <Menu.Item
                        onClick$={() => {
                          void toast({
                            title: "Menu",
                            description: "Opened profile.",
                            type: "info",
                          });
                        }}
                      >
                        Profile
                      </Menu.Item>
                      <Menu.Item
                        onClick$={() => {
                          void toast({
                            title: "Menu",
                            description: "Opened settings.",
                            type: "info",
                          });
                        }}
                      >
                        Settings
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item
                        onClick$={() => {
                          void toast({
                            title: "Menu",
                            description: "Signing the user out.",
                            type: "loading",
                          });
                        }}
                      >
                        Sign out
                      </Menu.Item>
                    </Menu.Panel>
                  </Menu.Root>

                  <Popover.Root floating="bottom-start">
                    <Popover.Trigger>Popover</Popover.Trigger>
                    <Popover.Panel>
                      <div class="p-3 text-sm text-secondary-label">Popover content for the composition test.</div>
                    </Popover.Panel>
                  </Popover.Root>

                  <Dialog.Root>
                    <Dialog.Trigger>Dialog</Dialog.Trigger>
                    <Dialog.Panel>
                      <Dialog.Header>
                        <Dialog.Title>Dialog test</Dialog.Title>
                        <Dialog.Description>Components work inside a modal too.</Dialog.Description>
                      </Dialog.Header>
                      <Dialog.Content>
                        <p class="text-sm text-secondary-label">This is test dialog content.</p>
                      </Dialog.Content>
                      <Dialog.Footer>
                        <Dialog.Close class="rounded-md border border-separator-opaque px-3 py-1.5">
                          Close
                        </Dialog.Close>
                      </Dialog.Footer>
                    </Dialog.Panel>
                  </Dialog.Root>
                </Card.Content>
              </Card.Root>
            </Stack>
          </LayoutShell.Sidebar>

          <LayoutShell.Main>
            <Stack gap={4}>
              <SimpleBanner tone="success" headline="Deployment status">
                The last release completed successfully.
              </SimpleBanner>

              <Tabs.Root variant="line" selectedTabId="overview">
                <Tabs.List class={dashboardTabsListClass}>
                  <Tabs.Tab key="overview" tabId="overview" class={dashboardTabsTriggerClass}>
                    Overview
                  </Tabs.Tab>
                  <Tabs.Tab key="chart" tabId="chart" class={dashboardTabsTriggerClass}>
                    Charts
                  </Tabs.Tab>
                  <Tabs.Tab key="forms" tabId="forms" class={dashboardTabsTriggerClass}>
                    Forms
                  </Tabs.Tab>
                  <Tabs.Tab key="table" tabId="table" class={dashboardTabsTriggerClass}>
                    Table
                  </Tabs.Tab>
                  <Tabs.Tab key="extras" tabId="extras" class={dashboardTabsTriggerClass}>
                    Extras
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel key="overview" tabId="overview" class={dashboardTabsPanelClass}>
                  <Card.Root as="div">
                    <Card.Header>
                      <Card.Title>Dashboard summary</Card.Title>
                      <Card.Action>
                        <Badge variant="secondary">LIVE</Badge>
                      </Card.Action>
                      <Card.Description>Combination of Card + Item + Progress + Spinner + Chart.</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-3">
                      <ProgressBar value={animatedProgress.value} />
                      <div class="flex items-center gap-2 text-sm text-secondary-label">
                        <Spinner variant="activity" size="sm" />
                        Processing data feed...
                      </div>
                      <Chart
                        type="bar"
                        class="max-w-xl"
                        data={{
                          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                          datasets: [
                            {
                              label: "Event count",
                              data: [18, 24, 21, 27, 31],
                              backgroundColor: "hsl(var(--accent) / 0.75)",
                            },
                          ],
                        }}
                      />
                      {props.items.map((item) => (
                        <Item.Root key={item} as="div" variant="outline" size="sm">
                          <Item.Content>
                            <Item.Title>{item}</Item.Title>
                            <Item.Description>Automatically loaded dashboard status.</Item.Description>
                          </Item.Content>
                          <Item.Actions>
                            <ToastButton
                              variant="secondary"
                              size="sm"
                              title="Detail opened"
                              description={`The detail of item ${item} was opened.`}
                            >
                              Detail
                            </ToastButton>
                          </Item.Actions>
                        </Item.Root>
                      ))}
                    </Card.Content>
                    <Card.Footer class="justify-end">
                      <ToastButton
                        size="sm"
                        title="Data refreshed"
                        description="The metrics were reloaded."
                      >
                        Refresh data
                      </ToastButton>
                    </Card.Footer>
                  </Card.Root>
                </Tabs.Panel>

                <Tabs.Panel key="chart" tabId="chart" class={dashboardTabsPanelClass}>
                  <Card.Root as="div">
                    <Card.Header>
                      <Card.Title>Charts overview</Card.Title>
                      <Card.Description>Multiple types: line, bar, doughnut.</Card.Description>
                    </Card.Header>
                    <Card.Content class="grid gap-4 md:grid-cols-2">
                      <Chart
                        type="line"
                        class="max-w-xl"
                        data={{
                          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                          datasets: [
                            {
                              label: "Visits",
                              data: [12, 19, 15, 25, 22],
                              borderColor: "hsl(var(--accent))",
                              backgroundColor: "hsl(var(--accent) / 0.2)",
                              fill: true,
                            },
                          ],
                        }}
                      />
                      <Chart
                        type="bar"
                        class="max-w-xl"
                        data={{
                          labels: ["Q1", "Q2", "Q3", "Q4"],
                          datasets: [
                            {
                              label: "Revenue",
                              data: [48, 62, 55, 71],
                              backgroundColor: "hsl(var(--system-blue) / 0.7)",
                            },
                          ],
                        }}
                      />
                      <Chart
                        type="doughnut"
                        class="max-w-sm"
                        data={{
                          labels: ["Done", "In progress", "Waiting"],
                          datasets: [
                            {
                              data: [62, 23, 15],
                              backgroundColor: [
                                "hsl(var(--system-green))",
                                "hsl(var(--system-orange))",
                                "hsl(var(--fill-secondary))",
                              ],
                            },
                          ],
                        }}
                      />
                    </Card.Content>
                  </Card.Root>
                </Tabs.Panel>

                <Tabs.Panel key="forms" tabId="forms" class={dashboardTabsPanelClass}>
                  <Card.Root as="div">
                    <Card.Header>
                      <Card.Title>Form elements</Card.Title>
                      <Card.Description>
                        Input, Textarea, Checkbox, RadioGroup, Switch, Combobox, Select and FieldGroup.
                      </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-3">
                      <Input placeholder="Project name" />
                      <Textarea rows={3} placeholder="Deployment note..." />
                      <CheckboxField label="Enable email notifications" />
                      <RadioGroup.Root>
                        <RadioGroup.Item name="plan" value="basic" label="Basic" />
                        <RadioGroup.Item name="plan" value="pro" label="Pro" />
                      </RadioGroup.Root>
                      <div class="flex items-center justify-between rounded-md border border-separator-opaque p-2">
                        <span class="text-sm text-label">Realtime mode</span>
                        <Switch aria-label="Realtime mode" />
                      </div>
                      <div class="grid gap-3 md:grid-cols-2">
                        <Combobox.Root
                          multiple
                          bind:value={selectedTeams}
                          filter
                          placeholder="Select teams…"
                        >
                          <Combobox.Label>Team</Combobox.Label>
                          <Combobox.Control>
                            <Combobox.Input />
                            <Combobox.Trigger>▼</Combobox.Trigger>
                          </Combobox.Control>
                          <Combobox.Popover>
                            <Combobox.Item value="platform">
                              <Combobox.ItemLabel>Platform Team</Combobox.ItemLabel>
                              <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                            </Combobox.Item>
                            <Combobox.Item value="design">
                              <Combobox.ItemLabel>Design System</Combobox.ItemLabel>
                              <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                            </Combobox.Item>
                            <Combobox.Item value="ops">
                              <Combobox.ItemLabel>Ops</Combobox.ItemLabel>
                              <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                            </Combobox.Item>
                            <Combobox.Empty>No team found.</Combobox.Empty>
                          </Combobox.Popover>
                        </Combobox.Root>
                        <Select.Root>
                          <Select.Label>Environment</Select.Label>
                          <Select.Trigger>
                            <Select.DisplayValue placeholder="Select environment" />
                          </Select.Trigger>
                          <Select.Popover>
                            <Select.Item value="dev">
                              <Select.ItemLabel>Development</Select.ItemLabel>
                              <Select.ItemIndicator>✓</Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item value="stage">
                              <Select.ItemLabel>Staging</Select.ItemLabel>
                              <Select.ItemIndicator>✓</Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item value="prod">
                              <Select.ItemLabel>Production</Select.ItemLabel>
                              <Select.ItemIndicator>✓</Select.ItemIndicator>
                            </Select.Item>
                          </Select.Popover>
                        </Select.Root>
                      </div>
                      <fieldset class="space-y-3 rounded-md border border-separator-opaque p-3">
                        <legend class="px-1 text-xs font-medium text-secondary-label">
                          FieldGroup: notifications and release preferences
                        </legend>
                        <Field.Root as="div">
                          <InputGroup.Root as="div">
                            <InputGroup.Input placeholder="Slack channel (e.g. #releases)" />
                            <Button variant="secondary" size="sm">
                              Verify
                            </Button>
                          </InputGroup.Root>
                          <Field.Description>
                            A group of multiple related fields and actions in a single block.
                          </Field.Description>
                        </Field.Root>
                        <div class="flex flex-wrap gap-4">
                          <CheckboxField label="Send daily summary" />
                          <CheckboxField label="Send alerts on error" />
                        </div>
                      </fieldset>
                      <Field.Root as="div">
                        <ToastButton
                          title="Form saved"
                          description="The dashboard settings were saved."
                          class="w-full"
                        >
                          Save form
                        </ToastButton>
                        <Field.Description>
                          The submit button saves the form configuration and shows a confirmation toast.
                        </Field.Description>
                      </Field.Root>
                    </Card.Content>
                  </Card.Root>
                </Tabs.Panel>

                <Tabs.Panel key="table" tabId="table" class={dashboardTabsPanelClass}>
                  <Card.Root as="div">
                    <Card.Header>
                      <Card.Title>Metrics table</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <Table.Root>
                        <Table.Header>
                          <Table.Row>
                            <Table.Head>Metric</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head class="text-right">Value</Table.Head>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>Build pipeline</Table.Cell>
                            <Table.Cell>OK</Table.Cell>
                            <Table.Cell class="text-right">98%</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Test coverage</Table.Cell>
                            <Table.Cell>WARN</Table.Cell>
                            <Table.Cell class="text-right">74%</Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </Card.Content>
                  </Card.Root>
                </Tabs.Panel>

                <Tabs.Panel key="extras" tabId="extras" class={dashboardTabsPanelClass}>
                  <Card.Root as="div">
                    <Card.Header>
                      <Card.Title>More base components</Card.Title>
                      <Card.Description>Avatar, Accordion and a combination of other elements.</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                      <div class="flex items-center gap-3">
                        <Avatar.Root size="sm">
                          <Avatar.Fallback>Q</Avatar.Fallback>
                        </Avatar.Root>
                        <Avatar.Root size="md">
                          <Avatar.Fallback>UI</Avatar.Fallback>
                        </Avatar.Root>
                        <Avatar.Root size="lg">
                          <Avatar.Fallback>LIB</Avatar.Fallback>
                        </Avatar.Root>
                      </div>
                      <Accordion.Root>
                        <Accordion.Trigger>Component integration</Accordion.Trigger>
                        <Accordion.Content>
                          <div class="space-y-3 pt-2">
                            <p class="text-sm text-secondary-label">
                              The Accordion works with complex content too (Carousel + Card + Button).
                            </p>
                            <Carousel.Root class="max-w-xl" rewind>
                              <Carousel.Title>Accordion carousel</Carousel.Title>
                              <div class="relative px-10">
                                <Carousel.Scroller>
                                  <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                                    <Card.Root as="div" class="w-full">
                                      <Card.Header>
                                        <Card.Title>Slide 1</Card.Title>
                                        <Card.Description>Combination of card + toast action.</Card.Description>
                                      </Card.Header>
                                      <Card.Content class="space-y-2">
                                        <p class="text-sm text-secondary-label">
                                          We are testing that a complex layout works inside an accordion panel too.
                                        </p>
                                        <ToastButton
                                          size="sm"
                                          title="Carousel action"
                                          description="Slide 1 triggered a toast from Accordion content."
                                        >
                                          Slide 1 action
                                        </ToastButton>
                                      </Card.Content>
                                    </Card.Root>
                                  </Carousel.Slide>
                                  <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                                    <Card.Root as="div" class="w-full">
                                      <Card.Header>
                                        <Card.Title>Slide 2</Card.Title>
                                        <Card.Description>Nested components without collisions.</Card.Description>
                                      </Card.Header>
                                      <Card.Content class="space-y-2">
                                        <ProgressBar value={54} />
                                        <div class="flex items-center gap-2 text-sm text-secondary-label">
                                          <Spinner variant="activity" size="sm" />
                                          Synchronizing metrics in the second slide.
                                        </div>
                                      </Card.Content>
                                    </Card.Root>
                                  </Carousel.Slide>
                                </Carousel.Scroller>
                                <Carousel.Previous class="absolute left-0 top-1/2 -translate-y-1/2">
                                  ‹
                                </Carousel.Previous>
                                <Carousel.Next class="absolute right-0 top-1/2 -translate-y-1/2">
                                  ›
                                </Carousel.Next>
                              </div>
                              <Carousel.Pagination>
                                <Carousel.Bullet />
                                <Carousel.Bullet />
                              </Carousel.Pagination>
                            </Carousel.Root>
                          </div>
                        </Accordion.Content>
                        <Accordion.Trigger>A11y check</Accordion.Trigger>
                        <Accordion.Content>
                          Focus management and keyboard navigation are usable in the showcase dashboard too.
                        </Accordion.Content>
                      </Accordion.Root>
                    </Card.Content>
                  </Card.Root>
                </Tabs.Panel>
              </Tabs.Root>

              <Box padding="md" background="overlay" border rounded="lg" class="text-sm">
                Test compose: LayoutShell + Toolbar + Tabs + Chart + Menu + Dialog + Popover + Sonner + Form + Card + Progress + Spinner + Table.
              </Box>
            </Stack>
          </LayoutShell.Main>
        </LayoutShell.Content>
      </LayoutShell.Root>
    </Sonner.Toaster>
  );
});
