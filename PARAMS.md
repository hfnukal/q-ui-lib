# Sjednocení parametrů podle `meta.generated.json`

Dokument vychází z průchodu všech souborů `components/**/meta.generated.json` (Node skript: rekurzivní čtení `apiTree`, u každého uzlu pole `params` — hodnoty typu pole čistých string/number literálů se berou jako „enum“ v metadatech).

**Rozsah:** pouze `components/` (soubory v `demo/` jsou kopie; tento report je pro knihovnu v `components/`).

**Poznámka:** Generátor serializuje jen čisté uniony literálů. Komponenty bez takových props v extrahovaném typu (např. část overlay komponent jen s `PropsOf<…>`) v tabulkách nefigurují.

---

## 1. `size` — cílová škála

**Doporučená jednotná řada (od největší po nejmenší):**

`xxl` → `xl` → `lg` → `md` → `sm` → `xs` → `xxs`

### 1.1 Současný stav (`size`)

| Komponenta | Cesta v `apiTree` | Hodnoty v meta |
|------------|-------------------|----------------|
| `avatar` | `Root.params.size` | `lg`, `md`, `sm` |
| `badge` | `params.size` | `md`, `sm` *(chybí větší stupeň než `md`)* |
| `button` | `params.size` | `lg`, `md`, `sm` |
| `item` | `Root.params.size` | `default`, `sm`, `xs` *(jiná sémantika — „default“ ≈ základní střední krok)* |
| `spinner` | `params.size` | `lg`, `md`, `sm` |

### 1.2 Rozdíly k vyřešení při sjednocení

- **Počet kroků:** dnes většinou 3 stupně (`lg`–`md`–`sm`); cíl má 7 tokenů — rozhodnout, které komponenty opravdu exponují celou škálu, a kde zůstane podmnožina (např. jen `sm`–`md`–`lg` u badge), ale **názvy** musí být z téže řady.
- **`item`:** místo `default` použít explicitní token (typicky `md`), aby byl stejný slovník jako jinde.
- **`badge`:** doplnit chybějící větší varianty nebo záměrně mapovat `md`/`sm` na podmnožinu nové škály (např. bez `xxl`–`xl`, ale stále pojmenované konzistentně).

### 1.3 Příbuzné „spacing / radius“ tokeny (adepti na stejnou škálu)

V `box` jsou samostatné props, které **sdílejí podobné stringy** jako u velikosti (`lg`, `md`, `sm`, `xs`, případně `none`):

| Prop | Hodnoty |
|------|---------|
| `padding` | `lg`, `md`, `none`, `sm`, `xs` |
| `margin` | `lg`, `md`, `none`, `sm`, `xs` |
| `rounded` | `lg`, `md`, `none`, `xl` *(zde `xl` = radius, ne „size“ — při sjednocování zvážit přejmenování na `xxl` nebo oddělit „radius scale“ od „size scale“)* |

Doporučení: buď **jedna sdílená type alias škála** pro spacing/size, nebo dvě pojmenované škály (`SizeScale`, `SpacingScale`, `RadiusScale`), aby `rounded.xl` nekolidovalo s `size.xl`.

---

## 2. `variant` — stejný název, různá sémantika

Parametr `variant` se opakuje, ale **hodnoty jsou doménové** — globální jednotný enum nedává smysl; smysl má **konvence pojmenování** a případně prefixy podle komponenty.

| Komponenta | Cesta | Hodnoty |
|------------|-------|---------|
| `badge` | `params.variant` | `default`, `destructive`, `outline`, `secondary` |
| `button` | `params.variant` | `danger`, `primary`, `secondary` |
| `card` | `Root.children.Media.params.variant` | `default`, `image` |
| `item` | `Root.params.variant` | `default`, `muted`, `outline` |
| `item` | `Root.children.Media.params.variant` | `avatar`, `default`, `icon`, `image` |
| `sidebar` | `…MenuButton.params.variant` | `default`, `outline` |

**Adept na „slabé“ sjednocení:** srovnat význam `secondary` vs `muted`, `danger` vs `destructive`, a zda `primary` má být u badge/tlačítek pojmenováno stejně.

---

## 3. Orientace a směr (adepti na jednotné API)

### 3.1 `horizontal` | `vertical`

| Komponenta | Parametr | Hodnoty |
|------------|----------|---------|
| `button-group` | `orientation` | `horizontal`, `vertical` |
| `toolbar` | `orientation` (Root + Separator) | `horizontal`, `vertical` |
| `resizable` | `PanelGroup.direction` | `horizontal`, `vertical` |
| `split` | `direction` | `horizontal`, `vertical` |
| `scroll-area` | `direction` (Viewport + Pane) | `both`, `horizontal`, `vertical` |

**Sjednocení:** zvolit jedno jméno (`orientation` *nebo* `direction`) napříč komponentami, kde je význam stejný; `scroll-area` má navíc `both`.

### 3.2 `column` | `row` (layout)

| Komponenta | Parametr | Hodnoty |
|------------|----------|---------|
| `stack` | `direction` | `column`, `row` |

**Sjednocení s 3.1:** buď přejmenovat na `horizontal`/`vertical` s mapováním v implementaci, nebo dokumentovat dvě konvence („flow layout“ vs „axis layout“) a držet je záměrně oddělené.

---

## 4. `align` — více významů (opatrně sjednocovat)

| Komponenta | Hodnoty | Kontext |
|------------|---------|---------|
| `combobox` / `select` | `center`, `end`, `start` | zarovnání popoveru (Floating UI) |
| `input-group` | `end`, `start` | addon zarovnání |
| `stack` | `baseline`, `center`, `end`, `start`, `stretch` | flex `align-items` |

**Závěr:** stejný název prop `align`, ale **není to jeden enum** — sjednocení by mělo být buď přejmenováním (`alignPopover`, `alignItems`, …), nebo sdíleným základním typem jen pro společnou podmnožinu `start` | `center` | `end`.

---

## 5. `justify` (pouze `stack`)

`around`, `between`, `center`, `end`, `evenly`, `start` — typicky `justify-content`. Žádný jiný komponent v meta nemá stejný prop; případní adepti v budoucnu: `flex` / `grid` layout komponenty.

---

## 6. `side` — různá sémantika

| Komponenta | Hodnoty | Význam |
|------------|---------|--------|
| `sidebar` | `left`, `right` | fyzická strana viewportu |
| `resizable` | `end`, `start` | logická strana panelu |

**Sjednocení:** buď přejít na **logické** `start`/`end` všude (s RTL), nebo držet `left`/`right` jen u sidebaru a nepřejmenovávat `resizable`.

---

## 7. `position` — různé domény

| Komponenta | Hodnoty |
|------------|---------|
| `select` | `item-aligned`, `popper` |
| `sonner` | `bottom-left`, `bottom-right`, `top-left`, `top-right` |

Není vhodné slučovat do jednoho enumu; maximálně společné pojmenování souborů typů (`PopoverPosition` vs `ToastPosition`).

---

## 8. Ostatní enumy v meta (referenčně)

| Parametr | Kde | Poznámka |
|----------|-----|----------|
| `gap` | `grid`, `stack` | čísla `0`–`8` (kromě 7?) — už konzistentní mezi dvěma komponentami |
| `weekStartsOn` | `calendar` | `0` \| `1` — jednotné |
| `type` | `chart` | typ grafu (Chart.js) |
| `type` | `file-input` | jen `file` |
| `type` | `toolbar` Button | `button`, `reset`, `submit` |
| `role` | `toolbar` Root | `menubar`, `toolbar` |
| `as` | `item` | velký seznam HTML tagů — specifické pro polymorfismus |
| `background` | `box` | sémantické barvy plochy |

---

## 9. Shrnutí priorit pro sjednocení

1. **`size`** (+ aliasy u `item`, rozšíření u `badge`) podle řady `xxl` … `xxs`.
2. **`padding` / `margin` / (volitelně) `rounded`** — zarovnat tokeny s touže škálou nebo explicitně rozdělit typy.
3. **`orientation` vs `direction`** pro horizontální/vertikální osu napříč `button-group`, `toolbar`, `resizable`, `split`, `scroll-area`; rozhodnutí o `stack` (`row`/`column`).
4. **`align`** — nerozšiřovat jeden globální enum; raději rozdělit názvy props nebo namespace typů.
5. **`variant`** — sjednotit jen slovník na úrovni design systému (danger/destructive, atd.), ne jeden TS union pro všechny komponenty.

---

## 10. Jak report znovu vygenerovat

Z kořene repozitáře lze použít stejnou logiku jako při analýze: načíst každý `components/**/meta.generated.json`, projít strom `apiTree`, u každého uzlu s `params` shromáždit hodnoty, které jsou polem string/number literálů.

Po úpravách props ve zdrojích spusťte `npm run generate:meta` (viz [META_GEN.md](./META_GEN.md)), aby se meta přegenerovalo z TypeScriptu.
