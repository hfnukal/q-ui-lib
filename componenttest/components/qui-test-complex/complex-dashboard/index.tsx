/**
 * @component complex-dashboard
 * @title ComplexDashboard
 * @version 0.0.1
 * @example Dashboard s navazanymi komponentami
 * ```tsx
 * import { ComplexDashboard } from "~/components/ui/qui-test-complex/complex-dashboard";
 *
 * <ComplexDashboard title="Prehled projektu" items={["Build #142", "2 nove tasky", "1 failing test"]} />
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
    <Toolbar.Root aria-label="Akce dashboardu">
      <Toolbar.Group aria-label="Rychlé akce">
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Dashboard aktualizován",
              description: "Data jsou synchronizovaná s API.",
              type: "success",
            })
          }
        >
          Notify
        </Toolbar.Button>
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Načítání reportu",
              description: "Export se připravuje na pozadí.",
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
  variant?: "default" | "secondary";
  size?: "sm" | "default";
  class?: string;
  children: string;
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
    <Toolbar.Root aria-label="Header toolbar dashboardu" class="w-full">
      <div class="text-callout text-label">{props.title}</div>
      <Toolbar.Spacer />
      <Toolbar.Group aria-label="Navigace">
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Přepnuto na přehled",
              description: "Zobrazení Overview je aktivní.",
              type: "info",
            })
          }
        >
          Přehled
        </Toolbar.Button>
        <Toolbar.Button
          onClick$={() =>
            toast({
              title: "Přepnuto na reporty",
              description: "Otevírá se sekce reportů.",
              type: "info",
            })
          }
        >
          Reporty
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group aria-label="Menu sm">

        <Menu.Root menuKey="menu-sm">
          <Menu.Trigger variant="icon" class="size-7">
            ⋮
          </Menu.Trigger>
          <Menu.Panel>
            <Menu.Item
              onSelect$={() => {
                void toast({
                  title: "Mini menu",
                  description: "Zvolena akce z kompaktního menu.",
                  type: "info",
                });
              }}
            >
              Mini akce
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
                  description: "Zvolena položka 1.",
                  type: "info",
                });
              }}
            >
              <MenuItem.Root>
                <MenuItem.Start>📄</MenuItem.Start>
                <MenuItem.Label>Položka 1</MenuItem.Label>
                <MenuItem.End>⌘1</MenuItem.End>
              </MenuItem.Root>
            </Menu.Item>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu M",
                  description: "Zvolena položka 2.",
                  type: "info",
                });
              }}
            >
              <MenuItem.Root>
                <MenuItem.Start>⚙️</MenuItem.Start>
                <MenuItem.Label>Položka 2</MenuItem.Label>
                <MenuItem.End>⌘2</MenuItem.End>
              </MenuItem.Root>
            </Menu.Item>

            <Menu.Separator />
            <Menu.SubMenu>
              <Menu.SubTrigger>
                <span>Pokročilé</span>
                <span aria-hidden="true">›</span>
              </Menu.SubTrigger>
              <Menu.Panel>
                <Menu.Item
                  onClick$={$(() => {
                    alert("Audit log");
                    void toast({
                      title: "Pokročilé",
                      description: "Otevřen audit log.",
                      type: "info",
                    });
                  })}
                >
                  Audit log
                </Menu.Item>
                <Menu.Item
                  onClick$={$(() => {
                    alert("Integrace");
                    void toast({
                      title: "Pokročilé",
                      description: "Otevřeny integrace.",
                      type: "info",
                    });
                  })}
                >
                  Integrace
                </Menu.Item>
              </Menu.Panel>
            </Menu.SubMenu>

          </Menu.Panel>
        </Menu.Root>

        <Menu.Root menuKey="menu-m-alias">
          <Menu.Trigger>Menu M (alias)</Menu.Trigger>
          <Menu.Panel gutter={4}>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu alias",
                  description: "Zvolena položka A.",
                  type: "info",
                });
              }}
            >
              Položka A
            </Menu.Item>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu alias",
                  description: "Zvolena položka B.",
                  type: "info",
                });
              }}
            >
              Položka B
            </Menu.Item>
            <Menu.Separator />
            <Menu.SubMenu>
              <Menu.SubTrigger>
                <span>Pokročilé</span>
                <span aria-hidden="true">›</span>
              </Menu.SubTrigger>
              <Menu.Panel>
                <Menu.Item
                  onSelect$={$(() => {
                    void toast({
                      title: "Menu alias",
                      description: "Otevřen audit log (submenu).",
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
                      description: "Otevřeny integrace (submenu).",
                      type: "info",
                    });
                  })}
                >
                  Integrace
                </Menu.Item>
              </Menu.Panel>
            </Menu.SubMenu>

            <Menu.SubMenu>
              <Menu.SubTrigger>
                <span>Pokročilé 2</span>
                <span aria-hidden="true">›</span>
              </Menu.SubTrigger>
              <Menu.Panel>
                <Menu.Item
                  onSelect$={() => {
                    alert("Audit log");
                    void toast({
                      title: "Menu alias",
                      description: "Otevřen audit log (submenu).",
                      type: "info",
                    });
                  }}
                >
                  Audit log
                </Menu.Item>
                <Menu.Item
                  onSelect$={$(() => {
                    alert("Integrace");
                    void toast({
                      title: "Menu alias",
                      description: "Otevřeny integrace (submenu).",
                      type: "info",
                    });
                  })}
                >
                  Integrace
                </Menu.Item>
              </Menu.Panel>
            </Menu.SubMenu>
          </Menu.Panel>
        </Menu.Root>


        <Menu.Root menuKey="menu-m-alias">
          <Menu.Trigger>Menu M (alias)</Menu.Trigger>
          <Menu.Panel gutter={4}>
            <Menu.Item
              onClick$={() => {
                void toast({
                  title: "Menu alias",
                  description: "Zvolena položka A.",
                  type: "info",
                });
              }}
            >
              Položka A
            </Menu.Item>
            <Menu.Root>
              <Menu.Trigger>Menu M (alias)</Menu.Trigger>
              <Menu.Panel gutter={4} floating="right-start">
                <Menu.Item
                  onClick$={() => {
                    void toast({
                      title: "Menu alias",
                      description: "Zvolena položka A.",
                      type: "info",
                    });
                  }}
                >
                  Položka A
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
              closeOnSelect={false}
              onClick$={() => {
                void toast({
                  title: "Menu L",
                  description: `Sidebar ${showSidebar.value ? "vypnut" : "zapnut"}.`,
                  type: "info",
                });
              }}
            >
              <MenuItem.Label>Zobrazit sidebar</MenuItem.Label>
              <MenuItem.End>⌘B</MenuItem.End>
            </Menu.CheckBoxItem>
            <Menu.CheckBoxItem
              bind:value={showGrid}
              closeOnSelect={false}
              onClick$={() => {
                void toast({
                  title: "Menu L",
                  description: `Grid ${showGrid.value ? "vypnut" : "zapnut"}.`,
                  type: "info",
                });
              }}
            >
              <MenuItem.Label>Zobrazit grid</MenuItem.Label>
              <MenuItem.End>⌘G</MenuItem.End>
            </Menu.CheckBoxItem>
            <Menu.Separator />
            <Menu.RadioGroup bind:value={density}>
              <Menu.RadioButton
                value="comfortable"
                onClick$={() => {
                  void toast({
                    title: "Hustota zobrazení",
                    description: "Nastaveno na Comfortable.",
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
                    title: "Hustota zobrazení",
                    description: "Nastaveno na Compact.",
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
              title: "Export zahájen",
              description: "CSV export byl zařazen do fronty.",
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
              <SimpleBanner tone="info" headline="Systémové info">
                Data jsou obnovena každých 30 sekund.
              </SimpleBanner>

              <DashboardToastActions />

              <Card.Root as="div">
                <Card.Header>
                  <Card.Title>Rychlé filtry</Card.Title>
                  <Card.Description>Ukázka skládání Field + InputGroup + Button.</Card.Description>
                </Card.Header>
                <Card.Content class="space-y-3">
                  <Field.Root as="div" size="sm">
                    <Field.Description id="dashboard-search-help">
                      Filtrování podle názvu úkolu
                    </Field.Description>
                    <InputGroup.Root as="div" size="sm" aria-label="Filtrování úkolů">
                      <InputGroup.Input
                        placeholder="Hledat položku..."
                        aria-describedby="dashboard-search-help"
                        variant="sm"
                      />
                      <ToastButton
                        variant="secondary"
                        size="sm"
                        title="Filtr aplikován"
                        description="Dashboard byl přefiltrován podle zadaného dotazu."
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
                  <Card.Title>Menu a Popover</Card.Title>
                  <Card.Description>Menu + Popover + Dialog v jednom místě.</Card.Description>
                </Card.Header>
                <Card.Content class="flex flex-wrap gap-2">
                  <Menu.Root>
                    <Menu.Trigger>Menu</Menu.Trigger>
                    <Menu.Panel>
                      <Menu.Item
                        onClick$={() => {
                          void toast({
                            title: "Menu",
                            description: "Otevřen profil.",
                            type: "info",
                          });
                        }}
                      >
                        Profil
                      </Menu.Item>
                      <Menu.Item
                        onClick$={() => {
                          void toast({
                            title: "Menu",
                            description: "Otevřeno nastavení.",
                            type: "info",
                          });
                        }}
                      >
                        Nastavení
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item
                        onClick$={() => {
                          void toast({
                            title: "Menu",
                            description: "Probíhá odhlášení uživatele.",
                            type: "loading",
                          });
                        }}
                      >
                        Odhlásit
                      </Menu.Item>
                    </Menu.Panel>
                  </Menu.Root>

                  <Popover.Root floating="bottom-start">
                    <Popover.Trigger>Popover</Popover.Trigger>
                    <Popover.Panel>
                      <div class="p-3 text-sm text-secondary-label">Obsah popoveru pro test skládání.</div>
                    </Popover.Panel>
                  </Popover.Root>

                  <Dialog.Root>
                    <Dialog.Trigger>Dialog</Dialog.Trigger>
                    <Dialog.Panel>
                      <Dialog.Header>
                        <Dialog.Title>Test dialogu</Dialog.Title>
                        <Dialog.Description>Komponenty fungují i uvnitř modalu.</Dialog.Description>
                      </Dialog.Header>
                      <Dialog.Content>
                        <p class="text-sm text-secondary-label">Toto je testovací obsah dialogu.</p>
                      </Dialog.Content>
                      <Dialog.Footer>
                        <Dialog.Close class="rounded-md border border-separator-opaque px-3 py-1.5">
                          Zavřít
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
              <SimpleBanner tone="success" headline="Stav nasazení">
                Poslední release proběhl úspěšně.
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
                      <Card.Title>Souhrn dashboardu</Card.Title>
                      <Card.Action>
                        <Badge variant="secondary">LIVE</Badge>
                      </Card.Action>
                      <Card.Description>Kombinace Card + Item + Progress + Spinner + Chart.</Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-3">
                      <ProgressBar value={animatedProgress.value} />
                      <div class="flex items-center gap-2 text-sm text-secondary-label">
                        <Spinner variant="activity" size="sm" />
                        Zpracování datového feedu...
                      </div>
                      <Chart
                        type="bar"
                        class="max-w-xl"
                        data={{
                          labels: ["Po", "Út", "St", "Čt", "Pá"],
                          datasets: [
                            {
                              label: "Počet událostí",
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
                            <Item.Description>Automaticky načtený status dashboardu.</Item.Description>
                          </Item.Content>
                          <Item.Actions>
                            <ToastButton
                              variant="secondary"
                              size="sm"
                              title="Otevřen detail"
                              description={`Detail položky ${item} byl otevřen.`}
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
                        title="Data obnovena"
                        description="Metriky byly znovu načtené."
                      >
                        Obnovit data
                      </ToastButton>
                    </Card.Footer>
                  </Card.Root>
                </Tabs.Panel>

                <Tabs.Panel key="chart" tabId="chart" class={dashboardTabsPanelClass}>
                  <Card.Root as="div">
                    <Card.Header>
                      <Card.Title>Přehled grafů</Card.Title>
                      <Card.Description>Více typů: line, bar, doughnut.</Card.Description>
                    </Card.Header>
                    <Card.Content class="grid gap-4 md:grid-cols-2">
                      <Chart
                        type="line"
                        class="max-w-xl"
                        data={{
                          labels: ["Po", "Út", "St", "Čt", "Pá"],
                          datasets: [
                            {
                              label: "Návštěvy",
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
                              label: "Tržby",
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
                          labels: ["Hotovo", "Probíhá", "Čeká"],
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
                      <Card.Title>Formulářové prvky</Card.Title>
                      <Card.Description>
                        Input, Textarea, Checkbox, RadioGroup, Switch, Combobox, Select a FieldGroup.
                      </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-3">
                      <Input placeholder="Název projektu" />
                      <Textarea rows={3} placeholder="Poznámka k nasazení..." />
                      <CheckboxField label="Povolit notifikace e-mailem" />
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
                          placeholder="Vyber týmy…"
                        >
                          <Combobox.Label>Tým</Combobox.Label>
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
                            <Combobox.Empty>Žádný tým nenalezen.</Combobox.Empty>
                          </Combobox.Popover>
                        </Combobox.Root>
                        <Select.Root>
                          <Select.Label>Prostředí</Select.Label>
                          <Select.Trigger>
                            <Select.DisplayValue placeholder="Vyber prostředí" />
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
                          FieldGroup: notifikace a release preference
                        </legend>
                        <Field.Root as="div">
                          <InputGroup.Root as="div">
                            <InputGroup.Input placeholder="Slack channel (např. #releases)" />
                            <Button variant="secondary" size="sm">
                              Ověřit
                            </Button>
                          </InputGroup.Root>
                          <Field.Description>
                            Skupina více navazujících polí a akcí v jednom bloku.
                          </Field.Description>
                        </Field.Root>
                        <div class="flex flex-wrap gap-4">
                          <CheckboxField label="Posílat denní souhrn" />
                          <CheckboxField label="Posílat alerty při chybě" />
                        </div>
                      </fieldset>
                      <Field.Root as="div">
                        <ToastButton
                          title="Formulář uložen"
                          description="Nastavení dashboardu byla uložena."
                          class="w-full"
                        >
                          Uložit formulář
                        </ToastButton>
                        <Field.Description>
                          Submit tlačítko uloží konfiguraci formuláře a zobrazí potvrzovací toast.
                        </Field.Description>
                      </Field.Root>
                    </Card.Content>
                  </Card.Root>
                </Tabs.Panel>

                <Tabs.Panel key="table" tabId="table" class={dashboardTabsPanelClass}>
                  <Card.Root as="div">
                    <Card.Header>
                      <Card.Title>Tabulka metrik</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <Table.Root>
                        <Table.Header>
                          <Table.Row>
                            <Table.Head>Metrika</Table.Head>
                            <Table.Head>Stav</Table.Head>
                            <Table.Head class="text-right">Hodnota</Table.Head>
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
                      <Card.Title>Další base komponenty</Card.Title>
                      <Card.Description>Avatar, Accordion a kombinace dalších prvků.</Card.Description>
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
                        <Accordion.Trigger>Integrace komponent</Accordion.Trigger>
                        <Accordion.Content>
                          <div class="space-y-3 pt-2">
                            <p class="text-sm text-secondary-label">
                              Accordion funguje i se složitým obsahem (Carousel + Card + Button).
                            </p>
                            <Carousel.Root class="max-w-xl" rewind>
                              <Carousel.Title>Accordion carousel</Carousel.Title>
                              <div class="relative px-10">
                                <Carousel.Scroller>
                                  <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                                    <Card.Root as="div" class="w-full">
                                      <Card.Header>
                                        <Card.Title>Slide 1</Card.Title>
                                        <Card.Description>Kombinace card + toast action.</Card.Description>
                                      </Card.Header>
                                      <Card.Content class="space-y-2">
                                        <p class="text-sm text-secondary-label">
                                          Testujeme, že uvnitř accordion panelu funguje i komplexní layout.
                                        </p>
                                        <ToastButton
                                          size="sm"
                                          title="Carousel akce"
                                          description="Slide 1 triggernul toast z Accordion obsahu."
                                        >
                                          Akce slide 1
                                        </ToastButton>
                                      </Card.Content>
                                    </Card.Root>
                                  </Carousel.Slide>
                                  <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                                    <Card.Root as="div" class="w-full">
                                      <Card.Header>
                                        <Card.Title>Slide 2</Card.Title>
                                        <Card.Description>Nested komponenty bez kolizí.</Card.Description>
                                      </Card.Header>
                                      <Card.Content class="space-y-2">
                                        <ProgressBar value={54} />
                                        <div class="flex items-center gap-2 text-sm text-secondary-label">
                                          <Spinner variant="activity" size="sm" />
                                          Synchronizace metrik ve druhém snímku.
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
                        <Accordion.Trigger>A11y kontrola</Accordion.Trigger>
                        <Accordion.Content>
                          Fokus management a keyboard navigace jsou použitelné i v showcase dashboardu.
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
