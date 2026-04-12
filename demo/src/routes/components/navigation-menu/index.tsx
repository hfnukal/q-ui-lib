import { component$ } from "@builder.io/qwik";
import { NavigationMenu } from "~/components/ui/navigation-menu";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">NavigationMenu</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní složení</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Item value</code> je potřeba u dvojice <code class="text-caption-1">Trigger</code> + <code class="text-caption-1">Content</code>. Přímé odkazy použij <code class="text-caption-1">Link</code>.</Desc>
          <TabExample>
            <NavigationMenu.Root class="justify-start">
              <NavigationMenu.List>
                <NavigationMenu.Item value="produkty">
                  <NavigationMenu.Trigger>Produkty</NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <ul class="grid min-w-[200px] gap-1 p-1">
                      <li>
                        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
                          Knihovna
                        </a>
                      </li>
                      <li>
                        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
                          Šablony
                        </a>
                      </li>
                    </ul>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link href="#">Ceník</NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </TabExample>
          <TabCode>{`import { NavigationMenu } from "~/components/ui/navigation-menu";

<NavigationMenu.Root class="justify-start">
  <NavigationMenu.List>
    <NavigationMenu.Item value="produkty">
      <NavigationMenu.Trigger>Produkty</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <ul class="grid min-w-[200px] gap-1 p-1">
          <li>
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
              Knihovna
            </a>
          </li>
          <li>
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
              Šablony
            </a>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#">Ceník</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Oddělovač v liště</h2>
        <CodeExample>
          <Desc>Oddělovač mezi položkami vodorovné lišty — <code class="text-caption-1">NavigationMenu.Separator</code>.</Desc>
          <TabExample>
            <NavigationMenu.Root>
              <NavigationMenu.List>
                <NavigationMenu.Item value="dokumentace">
                  <NavigationMenu.Trigger>Dokumentace</NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <p class="px-2 py-1 text-caption-1 text-secondary-label">Začínáme</p>
                    <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
                      Úvod
                    </a>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Separator />
                <NavigationMenu.Item>
                  <NavigationMenu.Link href="#">Blog</NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </TabExample>
          <TabCode>{`import { NavigationMenu } from "~/components/ui/navigation-menu";

<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item value="dokumentace">
      <NavigationMenu.Trigger>Dokumentace</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <p class="px-2 py-1 text-caption-1 text-secondary-label">Začínáme</p>
        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
          Úvod
        </a>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Separator />
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#">Blog</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní vzhled a barvy</h2>
        <CodeExample>
          <Desc>Hlavní řádek: „Více“ s <code class="text-caption-1">contentAlign="start"</code> (panel pod levým okrajem triggeru). Pod tím další lišty — **kompaktní** velikost vs. **větší**, palety **teal** / **oranžová** / **fialová** (tokeny z COLORS).</Desc>
          <TabExample>
            <div class="flex flex-col gap-6 overflow-visible">
              <div class="flex flex-wrap items-center gap-3 rounded-xl border border-system-indigo/30 bg-system-indigo/10 px-3 py-2 shadow-sm">
                <div class="flex items-center gap-2">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-system-indigo/25 text-callout font-semibold text-system-indigo">
                    Q
                  </span>
                  <div class="flex flex-col gap-0.5">
                    <span class="text-caption-1 font-medium text-label">Nástroje</span>
                    <span class="inline-flex w-max items-center rounded-full bg-system-green/20 px-2 py-px text-caption-2 text-system-green">
                      beta
                    </span>
                  </div>
                </div>
                <NavigationMenu.Root class="min-w-0 flex-1 justify-end overflow-visible">
                  <NavigationMenu.List>
                    <NavigationMenu.Item value="vice-hlavni">
                      <NavigationMenu.Trigger class="rounded-lg text-system-indigo hover:bg-system-indigo/20 focus-visible:ring-system-indigo data-[state=open]:bg-system-indigo/25">
                        Více
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content
                        contentAlign="start"
                        class="!mt-2 !overflow-y-auto w-[min(100vw-1.5rem,22rem)] max-h-[min(70vh,32rem)] rounded-xl border border-system-teal/35 bg-grouped-surface p-0 shadow-xl ring-offset-grouped-background"
                      >
                        <div class="border-b border-separator-opaque px-3 py-2">
                          <div class="flex items-center justify-between gap-2">
                            <p class="text-caption-1 font-medium text-label">Rychlé akce</p>
                            <span class="rounded-md bg-system-orange/15 px-1.5 py-0.5 text-caption-2 text-system-orange">3 nové</span>
                          </div>
                          <p class="mt-1 text-caption-2 text-secondary-label">Popup se zarovnává `start` — levý okraj pod levým okrajem „Více“.</p>
                        </div>
                        <div class="grid gap-2 p-3 sm:grid-cols-2">
                          <a
                            class="rounded-lg border border-separator bg-surface-raised p-3 text-callout text-label transition hover:border-system-teal/50 hover:bg-fill-secondary/30"
                            href="#"
                          >
                            <span class="block font-medium">Průvodce</span>
                            <span class="mt-1 block text-caption-2 text-secondary-label">Interaktivní úvod</span>
                          </a>
                          <a
                            class="rounded-lg border border-separator bg-surface-raised p-3 text-callout text-label transition hover:border-system-teal/50 hover:bg-fill-secondary/30"
                            href="#"
                          >
                            <span class="block font-medium">Šablony</span>
                            <span class="mt-1 block text-caption-2 text-secondary-label">Začni z příkladu</span>
                          </a>
                        </div>
                        <div class="h-px bg-separator-opaque" role="presentation" />
                        <ul class="p-2">
                          <li>
                            <a class="block rounded-md px-2 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                              Dokumentace
                            </a>
                          </li>
                          <li>
                            <a class="block rounded-md px-2 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                              Podpora
                            </a>
                          </li>
                        </ul>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                    <NavigationMenu.Separator />
                    <NavigationMenu.Item>
                      <NavigationMenu.Link class="rounded-lg text-system-indigo no-underline hover:bg-system-indigo/20" href="#">
                        Přehled
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </div>

              <div class="space-y-3">
                <p class="text-caption-1 font-medium text-label">Další lišty — velikosti a barvy</p>
                <div class="flex flex-col gap-4 overflow-visible">
                  <div>
                    <p class="mb-1.5 text-caption-2 text-tertiary-label">Kompaktní (menší trigger i panel)</p>
                    <div class="inline-flex max-w-full overflow-visible rounded-md border border-separator-opaque bg-surface-raised px-1.5 py-1">
                      <NavigationMenu.Root class="justify-start">
                        <NavigationMenu.List>
                          <NavigationMenu.Item value="vice-kompakt">
                            <NavigationMenu.Trigger class="h-8 rounded-md px-2 text-caption-1 text-secondary-label hover:bg-fill-secondary/40">
                              Více
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content contentAlign="start" class="!mt-1.5 min-w-[10rem] max-w-[16rem] p-1.5 text-caption-2">
                              <a class="block rounded px-2 py-1.5 text-label hover:bg-surface-overlay" href="#">
                                Položka A
                              </a>
                              <a class="block rounded px-2 py-1.5 text-label hover:bg-surface-overlay" href="#">
                                Položka B
                              </a>
                            </NavigationMenu.Content>
                          </NavigationMenu.Item>
                        </NavigationMenu.List>
                      </NavigationMenu.Root>
                    </div>
                  </div>

                  <div>
                    <p class="mb-1.5 text-caption-2 text-tertiary-label">Teal — větší panel</p>
                    <div class="overflow-visible rounded-xl border border-system-teal/40 bg-system-teal/10 px-2 py-1.5 shadow-sm">
                      <NavigationMenu.Root class="justify-start">
                        <NavigationMenu.List>
                          <NavigationMenu.Item value="vice-teal">
                            <NavigationMenu.Trigger class="rounded-lg px-3 py-1.5 text-callout font-medium text-system-teal hover:bg-system-teal/20 data-[state=open]:bg-system-teal/25">
                              Více
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content
                              contentAlign="start"
                              class="!mt-2 min-w-[14rem] rounded-lg border border-system-teal/30 bg-grouped-surface p-2 shadow-lg"
                            >
                              <a class="block rounded-md px-3 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                                Úvod
                              </a>
                              <a class="block rounded-md px-3 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                                API
                              </a>
                            </NavigationMenu.Content>
                          </NavigationMenu.Item>
                        </NavigationMenu.List>
                      </NavigationMenu.Root>
                    </div>
                  </div>

                  <div>
                    <p class="mb-1.5 text-caption-2 text-tertiary-label">Oranžová akcentní lišta</p>
                    <div class="overflow-visible rounded-xl border border-system-orange/35 bg-system-orange/10 px-2 py-1.5">
                      <NavigationMenu.Root class="justify-start">
                        <NavigationMenu.List>
                          <NavigationMenu.Item value="vice-orange">
                            <NavigationMenu.Trigger class="rounded-lg px-3 py-1.5 text-callout font-medium text-system-orange hover:bg-system-orange/20 data-[state=open]:bg-system-orange/25">
                              Další
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content contentAlign="start" class="!mt-2 min-w-[13rem] rounded-lg border border-system-orange/25 bg-surface-raised p-2 shadow-md">
                              <a class="block rounded-md px-3 py-2 text-callout hover:bg-fill-secondary/30" href="#">
                                Nastavení
                              </a>
                              <a class="block rounded-md px-3 py-2 text-callout hover:bg-fill-secondary/30" href="#">
                                Odhlásit
                              </a>
                            </NavigationMenu.Content>
                          </NavigationMenu.Item>
                        </NavigationMenu.List>
                      </NavigationMenu.Root>
                    </div>
                  </div>

                  <div>
                    <p class="mb-1.5 text-caption-2 text-tertiary-label">Fialová / větší typografie</p>
                    <div class="overflow-visible rounded-xl border border-system-purple/35 bg-system-purple/10 px-3 py-2">
                      <NavigationMenu.Root class="justify-start">
                        <NavigationMenu.List>
                          <NavigationMenu.Item value="vice-purple">
                            <NavigationMenu.Trigger class="min-h-10 rounded-lg px-4 py-2 text-body font-medium text-system-purple hover:bg-system-purple/15 data-[state=open]:bg-system-purple/20">
                              Více
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content contentAlign="start" class="!mt-2 min-w-[15rem] rounded-xl border border-system-purple/25 bg-grouped-surface p-3 text-body shadow-lg">
                              <a class="block rounded-lg px-3 py-2.5 hover:bg-fill-secondary/35" href="#">
                                Profil
                              </a>
                              <a class="block rounded-lg px-3 py-2.5 hover:bg-fill-secondary/35" href="#">
                                Účet
                              </a>
                            </NavigationMenu.Content>
                          </NavigationMenu.Item>
                        </NavigationMenu.List>
                      </NavigationMenu.Root>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabExample>
          <TabCode>{`import { NavigationMenu } from "~/components/ui/navigation-menu";

<div class="flex flex-col gap-6 overflow-visible">
  <div class="flex flex-wrap items-center gap-3 rounded-xl border border-system-indigo/30 bg-system-indigo/10 px-3 py-2 shadow-sm">
    <div class="flex items-center gap-2">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-system-indigo/25 text-callout font-semibold text-system-indigo">
        Q
      </span>
      <div class="flex flex-col gap-0.5">
        <span class="text-caption-1 font-medium text-label">Nástroje</span>
        <span class="inline-flex w-max items-center rounded-full bg-system-green/20 px-2 py-px text-caption-2 text-system-green">
          beta
        </span>
      </div>
    </div>
    <NavigationMenu.Root class="min-w-0 flex-1 justify-end overflow-visible">
      <NavigationMenu.List>
        <NavigationMenu.Item value="vice-hlavni">
          <NavigationMenu.Trigger class="rounded-lg text-system-indigo hover:bg-system-indigo/20 focus-visible:ring-system-indigo data-[state=open]:bg-system-indigo/25">
            Více
          </NavigationMenu.Trigger>
          <NavigationMenu.Content
            contentAlign="start"
            class="!mt-2 !overflow-y-auto w-[min(100vw-1.5rem,22rem)] max-h-[min(70vh,32rem)] rounded-xl border border-system-teal/35 bg-grouped-surface p-0 shadow-xl ring-offset-grouped-background"
          >
            <div class="border-b border-separator-opaque px-3 py-2">
              <div class="flex items-center justify-between gap-2">
                <p class="text-caption-1 font-medium text-label">Rychlé akce</p>
                <span class="rounded-md bg-system-orange/15 px-1.5 py-0.5 text-caption-2 text-system-orange">3 nové</span>
              </div>
              <p class="mt-1 text-caption-2 text-secondary-label">Popup se zarovnává \`start\` — levý okraj pod levým okrajem „Více“.</p>
            </div>
            <div class="grid gap-2 p-3 sm:grid-cols-2">
              <a
                class="rounded-lg border border-separator bg-surface-raised p-3 text-callout text-label transition hover:border-system-teal/50 hover:bg-fill-secondary/30"
                href="#"
              >
                <span class="block font-medium">Průvodce</span>
                <span class="mt-1 block text-caption-2 text-secondary-label">Interaktivní úvod</span>
              </a>
              <a
                class="rounded-lg border border-separator bg-surface-raised p-3 text-callout text-label transition hover:border-system-teal/50 hover:bg-fill-secondary/30"
                href="#"
              >
                <span class="block font-medium">Šablony</span>
                <span class="mt-1 block text-caption-2 text-secondary-label">Začni z příkladu</span>
              </a>
            </div>
            <div class="h-px bg-separator-opaque" role="presentation" />
            <ul class="p-2">
              <li>
                <a class="block rounded-md px-2 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                  Dokumentace
                </a>
              </li>
              <li>
                <a class="block rounded-md px-2 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                  Podpora
                </a>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Separator />
        <NavigationMenu.Item>
          <NavigationMenu.Link class="rounded-lg text-system-indigo no-underline hover:bg-system-indigo/20" href="#">
            Přehled
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </div>

  <div class="space-y-3">
    <p class="text-caption-1 font-medium text-label">Další lišty — velikosti a barvy</p>
    <div class="flex flex-col gap-4 overflow-visible">
      <div>
        <p class="mb-1.5 text-caption-2 text-tertiary-label">Kompaktní (menší trigger i panel)</p>
        <div class="inline-flex max-w-full overflow-visible rounded-md border border-separator-opaque bg-surface-raised px-1.5 py-1">
          <NavigationMenu.Root class="justify-start">
            <NavigationMenu.List>
              <NavigationMenu.Item value="vice-kompakt">
                <NavigationMenu.Trigger class="h-8 rounded-md px-2 text-caption-1 text-secondary-label hover:bg-fill-secondary/40">
                  Více
                </NavigationMenu.Trigger>
                <NavigationMenu.Content contentAlign="start" class="!mt-1.5 min-w-[10rem] max-w-[16rem] p-1.5 text-caption-2">
                  <a class="block rounded px-2 py-1.5 text-label hover:bg-surface-overlay" href="#">
                    Položka A
                  </a>
                  <a class="block rounded px-2 py-1.5 text-label hover:bg-surface-overlay" href="#">
                    Položka B
                  </a>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>
      </div>

      <div>
        <p class="mb-1.5 text-caption-2 text-tertiary-label">Teal — větší panel</p>
        <div class="overflow-visible rounded-xl border border-system-teal/40 bg-system-teal/10 px-2 py-1.5 shadow-sm">
          <NavigationMenu.Root class="justify-start">
            <NavigationMenu.List>
              <NavigationMenu.Item value="vice-teal">
                <NavigationMenu.Trigger class="rounded-lg px-3 py-1.5 text-callout font-medium text-system-teal hover:bg-system-teal/20 data-[state=open]:bg-system-teal/25">
                  Více
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  contentAlign="start"
                  class="!mt-2 min-w-[14rem] rounded-lg border border-system-teal/30 bg-grouped-surface p-2 shadow-lg"
                >
                  <a class="block rounded-md px-3 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                    Úvod
                  </a>
                  <a class="block rounded-md px-3 py-2 text-callout text-label hover:bg-fill-secondary/40" href="#">
                    API
                  </a>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>
      </div>

      <div>
        <p class="mb-1.5 text-caption-2 text-tertiary-label">Oranžová akcentní lišta</p>
        <div class="overflow-visible rounded-xl border border-system-orange/35 bg-system-orange/10 px-2 py-1.5">
          <NavigationMenu.Root class="justify-start">
            <NavigationMenu.List>
              <NavigationMenu.Item value="vice-orange">
                <NavigationMenu.Trigger class="rounded-lg px-3 py-1.5 text-callout font-medium text-system-orange hover:bg-system-orange/20 data-[state=open]:bg-system-orange/25">
                  Další
                </NavigationMenu.Trigger>
                <NavigationMenu.Content contentAlign="start" class="!mt-2 min-w-[13rem] rounded-lg border border-system-orange/25 bg-surface-raised p-2 shadow-md">
                  <a class="block rounded-md px-3 py-2 text-callout hover:bg-fill-secondary/30" href="#">
                    Nastavení
                  </a>
                  <a class="block rounded-md px-3 py-2 text-callout hover:bg-fill-secondary/30" href="#">
                    Odhlásit
                  </a>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>
      </div>

      <div>
        <p class="mb-1.5 text-caption-2 text-tertiary-label">Fialová / větší typografie</p>
        <div class="overflow-visible rounded-xl border border-system-purple/35 bg-system-purple/10 px-3 py-2">
          <NavigationMenu.Root class="justify-start">
            <NavigationMenu.List>
              <NavigationMenu.Item value="vice-purple">
                <NavigationMenu.Trigger class="min-h-10 rounded-lg px-4 py-2 text-body font-medium text-system-purple hover:bg-system-purple/15 data-[state=open]:bg-system-purple/20">
                  Více
                </NavigationMenu.Trigger>
                <NavigationMenu.Content contentAlign="start" class="!mt-2 min-w-[15rem] rounded-xl border border-system-purple/25 bg-grouped-surface p-3 text-body shadow-lg">
                  <a class="block rounded-lg px-3 py-2.5 hover:bg-fill-secondary/35" href="#">
                    Profil
                  </a>
                  <a class="block rounded-lg px-3 py-2.5 hover:bg-fill-secondary/35" href="#">
                    Účet
                  </a>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>
      </div>
    </div>
  </div>
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianty contentAlign</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">start</code> — pod levým okrajem triggeru; <code class="text-caption-1">end</code> — pod pravým okrajem (vhodné pro tlačítko vpravo); <code class="text-caption-1">center</code> — pod středem; <code class="text-caption-1">inlineEnd</code> — flyout **napravo** od triggeru (vodorovně).</Desc>
          <TabExample>
            <div class="flex flex-col gap-8 overflow-visible">
              <div>
                <p class="mb-2 text-caption-1 text-secondary-label">start</p>
                <NavigationMenu.Root class="justify-start">
                  <NavigationMenu.List>
                    <NavigationMenu.Item value="s">
                      <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
                      <NavigationMenu.Content contentAlign="start">
                        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </div>
              <div>
                <p class="mb-2 text-caption-1 text-secondary-label">end</p>
                <NavigationMenu.Root class="flex w-full justify-end">
                  <NavigationMenu.List>
                    <NavigationMenu.Item value="e">
                      <NavigationMenu.Trigger>Více</NavigationMenu.Trigger>
                      <NavigationMenu.Content contentAlign="end">
                        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </div>
              <div>
                <p class="mb-2 text-caption-1 text-secondary-label">center</p>
                <NavigationMenu.Root class="flex w-full justify-center">
                  <NavigationMenu.List>
                    <NavigationMenu.Item value="c">
                      <NavigationMenu.Trigger>Uprostřed</NavigationMenu.Trigger>
                      <NavigationMenu.Content contentAlign="center">
                        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </div>
              <div>
                <p class="mb-2 text-caption-1 text-secondary-label">inlineEnd (vpravo od triggeru)</p>
                <NavigationMenu.Root class="justify-start">
                  <NavigationMenu.List>
                    <NavigationMenu.Item value="i">
                      <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
                      <NavigationMenu.Content contentAlign="inlineEnd" class="min-w-[12rem]">
                        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </NavigationMenu.Root>
              </div>
            </div>
          </TabExample>
          <TabCode>{`import { NavigationMenu } from "~/components/ui/navigation-menu";

<div class="flex flex-col gap-8 overflow-visible">
  <div>
    <p class="mb-2 text-caption-1 text-secondary-label">start</p>
    <NavigationMenu.Root class="justify-start">
      <NavigationMenu.List>
        <NavigationMenu.Item value="s">
          <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
          <NavigationMenu.Content contentAlign="start">
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </div>
  <div>
    <p class="mb-2 text-caption-1 text-secondary-label">end</p>
    <NavigationMenu.Root class="flex w-full justify-end">
      <NavigationMenu.List>
        <NavigationMenu.Item value="e">
          <NavigationMenu.Trigger>Více</NavigationMenu.Trigger>
          <NavigationMenu.Content contentAlign="end">
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </div>
  <div>
    <p class="mb-2 text-caption-1 text-secondary-label">center</p>
    <NavigationMenu.Root class="flex w-full justify-center">
      <NavigationMenu.List>
        <NavigationMenu.Item value="c">
          <NavigationMenu.Trigger>Uprostřed</NavigationMenu.Trigger>
          <NavigationMenu.Content contentAlign="center">
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </div>
  <div>
    <p class="mb-2 text-caption-1 text-secondary-label">inlineEnd (vpravo od triggeru)</p>
    <NavigationMenu.Root class="justify-start">
      <NavigationMenu.List>
        <NavigationMenu.Item value="i">
          <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
          <NavigationMenu.Content contentAlign="inlineEnd" class="min-w-[12rem]">
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">Odkaz</a>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </div>
</div>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
