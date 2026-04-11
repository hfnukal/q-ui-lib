# KNOWN_ISSUES.md


# Komponenty ./components/*

## MenuCheckboxItem

Nezobrazuje checkbox

## MenuRadioItem demo priklad

Prvni priklad ukazuje samostatny Item. Upravit aby zobrazoval nekolik Itemu RadioGroup. Pridat RadioGroup k MenuRadioItem.

## Overlay

Priklad nefunguje. Zkontrolovat jestli je chyba v prikladu nebo v samotne komponente.

## Popover

Pokud zobrazim <Popover.PanelArrow /> a je dost prostoru pod, sipka je spravne. Pokud scrolluji a panel se presune nad trigger, sipka zustane a je nespravne, je potreba pri presunu sipku presunout.
Sipka je o nekolik bodu posunuta, priblizit k okraji popupu.

## Progress

Demo priklad: Upravit prvni pripad a pridat kod, ktery bude menit pozici a simulovat nacitani.

Komponent: Pridat animaci aby pri zmene hodnoty ukazatel plynule presel na cilovy stav, ted se presouva skokove.


## RadioGroup

Nefunguje jako RadioGroup, kazda polozka funguje jako checkbox.

## Resizible

Nezobrazuje se handle u vodorovneho zobrazeni.

Pri hover zvetsit handle. Plocha pro posun je prilis tenka a spatne se trefuje.

## Screen

V demo prikladu Skladba podle LAYOUT.md nefunguje spravne ScrollArea, nelze scrollovat az na konec. Zmenit nadpis na Skladba Layout

## Select

Pri item-aligned volbe se ma pri zobrazeni nabidky selectu zobrazit aktualne vybrana hodnota na stejnem miste jako je trigger. Pri prvnim zobrazeni se seznam zobrazi pod, po hover se presune na misto. Je potreba vyresit aby se zobrazil rychle a rovnou na spravnem miste.

## ScrollArea

Pri refreshi stranky se vrati na zacatek. Pridat volbu keepScroll. Pokud bude zapnuta, scroll zustane na stejnem miste i po refreshi


## Sidebar

Pri zmenseni se maji zobrazit pouze ikony. Pokud nejsou definovane, Zobrazit zkraceny nazev jako hranaty avatar s radiusem.
V demo prikladu chybi priklad MenuAction

Hover barva je stejna jako barva pozadi. Upravit aby byla jina. Pri najeti na selected prvek, prvek zmizi diku hover. Udelat hover jako zesvetleni aktualni barvy, ne prebarvit.

## Slider

Pridat moznost zmenit 
 - velikost tahla
 - barvu listy tahla

## Switch

Demo priklad Výchozí hodnota a disabled pridat label se nezobrazuje.

## Tabs

Pridat ramecek kolem obsahu tab
Pridat variantu line jako je u https://ui.shadcn.com/docs/components/radix/tabs

## Textarea

Pridat moznost dissableResize, ktera zakaze systemove zvetseni.

## Tooltip

Stejne jako u popup, pri zobrazeni sipky a scrool do mista, kde se prepne poloha se nezmeni sipka.

## Combobox

Zobraz nabidku pro focus na hodnotu. Lze ovlivnit boolean parametrem showOnFocus.
Zrus volbu align
Zvetsi popup na stejnou sirku jako ma input
U popus zrus horni zaobleni aby lepe navazoval na input

## Accordion

Jednotlive headery ted maji gap, bez mezere napojene oddelene jednou linkou. Pri rozbaleni neoodelovat header z contentem, je to jeden taxt jako kapitola a odstavec.