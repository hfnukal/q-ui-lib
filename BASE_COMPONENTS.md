# Base Komponenty

## Konvence pojmenování a struktury podkomponent

### Jednoduché komponenty

- Jde o **jeden** významový celek bez vlastního kontextu mezi díly (např. tlačítko, statický odstavec layoutu).
- Export je **přímo** `component$`: např. `export const Button = component$(…)`.
- V dokumentaci a v příkladech stačí jeden název (`Button`), bez `.Root`.

### Složené komponenty (compound) s kontextem

- Používají **sdílený stav** (context) mezi částmi (otevření menu, výběr v selectu, postranní panel).
- **Veřejné API** je **namespace objekt** se jménem komponenty: `export const Menu = { Root, Trigger, List, … }`.
- **`Root`**:
  - drží **kontext** (`useContextProvider`) a obaluje strom, ve kterém mají díly smysl;
  - v Qwilu je téměř vždy implementován jako **`component$`** (kontext bez něj nejde rozumně poskytnout). Formulace „Root není instance `component$`“ se vztahuje k **tomu, že uživatel neimportuje samostatný symbol `Menu` jako komponentu**, ale vždy skládá `Menu.Root` + díly — **logický kořen** je objekt `Menu`, jeho vlastnosti jsou jednotlivé komponenty.
- **Podkomponenty** mají **PascalCase** názvy odpovídající roli: `Trigger`, `Panel`, `List`, `ListItem`, `Item`, `ItemIcon`, …
- **Konzistence s headlessem:** mapuješ-li na `@qwik-ui/headless`, drž se názvů z dokumentace headlessu (`Root`, `Trigger`, `Panel`, …), aby příklady z Qwik UI šly převést 1:1 se styly z této knihovny.

### Fiktivní příklad (dokumentační vzor)

```
Menu.Root              ← kontext, musí obalovat příbuzné díly
  Menu.Trigger         ← samostatná komponenta pod Root
  Menu.List            ← kontejner pro položky pod Root
    Menu.ListItem      ← položka menu vždy uvnitř List
  Menu.Item            ← položka použitelná i mimo List (např. přímo pod Root), pokud to API dovolí
    Menu.ItemIcon      ← ikona uvnitř Item
```

Význam prefixů:

- **`List` / `ListItem`** — hierarchie „seznam řádků“ uvnitř kontejneru.
- **`Item`** — obecná interaktivní položka; dokumentuj, zda smí být jen pod `List` nebo i jinde.

### Kontrola proti stavu repozitáře

- V kódu převažuje vzor **`export const Xxx = { Root, … }`** u `Popover`, `Dialog`, `Field`, `Sidebar`, …
- **`Button`** = jeden `component$` (jednoduchá komponenta).
- Některé moduly zatím exportují **zkratku** (např. jen `AccordionList` místo plného compound exportu `Accordion.*`) — při úpravách směřuj k výše uvedeným konvencím a aktualizuj strom níže i `meta.json`.

---

## `meta.json` u složených komponent

Každá složka `components/<název>/` by měla mít **`meta.json`** kromě `name`, `version`, `type` doplněný o:

| Pole | Účel |
| --- | --- |
| **`cssVariables`** | Pole názvů **CSS custom properties** (nebo tokenů z `COLORS.md`), které komponenta čte nebo na které odkazují její třídy (např. `--color-accent`, `--ring`). |
| **`composition`** | Popis **povoleného zanoření** podkomponent: textový strom, JSON strom, nebo pole pravidel „parent → child“. Měl by odpovídat veřejnému API (`Menu.List` jen pod `Menu.Root` atd.). |

Příklad tvaru (konkrétní názvy polí sjednoťte s `Q_UI_LIB.md` / verzí schématu):

```json
{
  "name": "popover",
  "version": "2.0.0",
  "type": "external",
  "cssVariables": ["--ring", "--color-surface-raised"],
  "composition": "Root → Trigger; Root → Panel [→ PanelArrow optional]"
}
```

**CLI (cíl):** příkaz typu `qui verify-meta [komponenta]` nebo rozšíření `add`/`update` má:

1. porovnat **`composition`** s importy / použitím v `index.tsx` (statická analýza, případně AST);
2. **`cssVariables`** zkontrolovat proti výskytům v souborech komponenty (regex / seznam tokenů z `global.css`);
3. při nesouladu **vypsat varování** nebo nabídnout **doplnění** šablony v `meta.json`.

Dokud skript neexistuje, platí ruční udržba metadat při změně API.

---

## Inventář struktur (rozpracované / orientační)

- Screen
  - `<Slot>`

- ScrollArea
  - `<Slot>`

- Box
  - `<Slot>`

- Stack
  - `<Slot>`

- Grid
  - `<Slot>`

- Split
  - .Root
    - .Group
      - .Panel
        - `<Slot>`
      - .Panel
        - `<Slot>`

- Resizable
  - .Root
    - .Group
      - .Panel
        - `<Slot>`
      - .Handle
      - .Panel
        - `<Slot>`

- Button
  - `<Slot>`

- ButtonGroup
  - Button

- Separator

- Spiner

- Card
  - .Header
    - .Title
      - `<Slot>`
    - .Description
      - `<Slot>`
    - .Action
      - `<Slot>`
  - .Content
    - `<Slot>`
  - .Media
    - `<Slot>`
      - Image
  - .Footer
    - `<Slot>`
      - Button

- Carousel
  - .Title
    - `<Slot>`
  - .Scroller
    - .Slide
      - `<Slot>`
        - Card
  - .Previous
    - `<Slot>`
  - .Next
    - `<Slot>`
  - .Stepper
    - `<Slot>`

- Chart

- Pagination

- Progress

- Overlay
  - `<Slot>`

- KbdShortcut

- Label
  - `<Slot>`

- Input

- InputGroup
  - .Start
    - `<Slot>`
  - .Input
    - `<Slot>`
      - Input
  - .End
    - `<Slot>`

- Textarea
  - `<Slot>`

- FileInput
  - .DropArea
    - `<Slot>`
      - .Input
      - .Addon

- Checkbox

- Switch

- Slider

- Field
  - `<Slot>`
    - Label
    - Input
    - .Error
    - .Description

- ToggleGroup
  - .Content
    - `<Slot>`

- Accordion
  - .Root
    - .Header
      - `<Slot>`
        - .Trigger
          - `<Slot>`
    - .Content
      - `<Slot>`

- AspectRatio
  - `<Slot>`

- Badge
  - `<Slot>`

- Avatar
  - .Root
    - .Image
      - `<Slot>`
    - .Text
      - `<Slot>`

- Popover
  - .Trigger
    - `<Slot>`
  - .PanelArrow
    - `<Slot>`
  - .Panel
    - `<Slot>`

- Hower
  - .Trigger
    - `<Slot>`
  - .PanelArrow
    - `<Slot>`
  - .Panel
    - `<Slot>`

- Tooltip
  - .Trigger
    - `<Slot>`
  - .PanelArrow
    - `<Slot>`
  - .Panel
    - `<Slot>`


- Combobox
  - .Root
    - .Control
      - .Input
      - .Trigger
    - .Popover
      - .Item (value)
        - `<Slot>`
      - .Empty
        - `<Slot>`
    


- Select
  - Label
  - ItemList
    - .Label
    - .Value
    - .Content


- MenuItem
  - .Start
  - .Label
  - .End
  - KbdShortcut

- ItemList

- MenuCheckBoxItem
  - .Label
  - KbdShortcut

- RadioGroup

- MenuRadioItem
  - .Label
  - KbdShortcut

- Menu
  - .Root
  - ItemList
    - MenuItem
  - .Sub
    - Menu
  - .SubArrow
  - .Label
  - Separator

- Sheet
  - .Trigger
  - .Panel

- Dialog
  - .Trigger
  - .Overlay
  - Panel
    - Title
    - Description
    - .Close

- Toolbar
  - Separator

- Tabs
  - .List
    - .Tab
  - .Panel

- Tabs
  - .Tab
    - .Title
    - .Panel

- Calendar
  - .PrevButton
  - .NextButton
  - .Caption
  - .Weekdays
  - .Grid

- Table
  - .Header
    - .Head
  - .Body
    - .Row
      - .Cell

- Sidebar
  - .Rail
  - .Header
  - .Content

- Sooner
  