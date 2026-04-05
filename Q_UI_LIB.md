Vlastní Qwik UI knihovna – implementace s Gitea

Tento dokument popisuje, jak vytvořit samostatnou knihovnu komponent pro Qwik, uloženou v Gitea, s možností šablony projektu a CLI pro přidávání a aktualizaci komponent.

⸻

1. Struktura Gitea repozitářů

gitea/
├── my-app.git            # hlavní aplikace
└── q-ui-lib.git        # knihovna komponent + template + CLI

q-ui-lib.git obsahuje:

q-ui-lib/
├── template/            # základní Qwik + Tailwind šablona
│   ├── src/
│   ├── tailwind.config.js
│   └── package.json
├── components/          # modulární komponenty
│   ├── button/
│   │   ├── index.tsx
│   │   └── meta.json
│   ├── slider/
│   └── accordion/
├── cli/                 # skripty pro init, add, update
└── package.json         # závislosti a CLI definice


⸻

2. Metadata komponenty

Každá komponenta má soubor meta.json:

{
  "name": "slider",
  "version": "1.0.0",
  "type": "external"
}

Slouží k verzování a správě aktualizací.

⸻

3. Inicializace nové aplikace

git clone gitea.example.com/q-ui-lib.git
cd q-ui-lib
npx ./cli init ../my-app

	•	Zkopíruje template/ do my-app/
	•	Nainstaluje základní závislosti (Qwik, Tailwind)
	•	Připraveno pro Tailwind a Qwik reaktivitu

⸻

4. Přidání komponent

cd ../my-app
npx ../q-ui-lib/cli add button slider

	•	CLI zkopíruje jen vybrané komponenty
	•	Aktualizuje tailwind.config.js, aby Tailwind skenoval komponenty

⸻

5. Aktualizace komponent
	•	V q-ui-lib opravíš komponentu, bumpneš verzi v meta.json.
	•	V aplikaci spustíš:

npx ../q-ui-lib/cli update

	•	CLI porovná verze, nabídne diff nebo přepsání
	•	Bundle aplikace obsahuje nové komponenty bez ručního kopírování

⸻

6. Příklad struktury komponenty

// components/slider/index.tsx
import { component$ } from '@builder.io/qwik';

export const Slider = component$((props: { value?: number; onChange$?: (v: number) => void }) => {
  return (
    <input
      type="range"
      value={props.value ?? 0}
      onInput$={(e) => props.onChange$?.((e.target as HTMLInputElement).valueAsNumber)}
      class="w-full h-2 bg-primary rounded"
    />
  );
});


⸻

7. Tailwind konfigurace v aplikaci

// my-app/tailwind.config.js
import preset from '@my-org/tailwind-preset';

export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../q-ui-lib/components/**/*.{ts,tsx}'
  ]
};


⸻

8. Použití komponenty v aplikaci

// my-app/src/components/demo.tsx
import { Slider } from './components/ui/slider';

export const Demo = component$(() => {
  return <Slider value={50} onChange$={(v) => console.log(v)} />;
});

	•	Použité komponenty jsou jen ty, které jsi přidal
	•	Tailwind automaticky aplikuje styly
	•	Qwik optimizer zachovává reaktivitu

⸻

9. Doporučený workflow
	1.	Vytvořit komponentu v q-ui-lib
	2.	Přidat do aplikace: npx q-ui-lib add <component>
	3.	Používat v aplikaci
	4.	Bugfix → bump verze → npx q-ui-lib update
	5.	Tailwind + Qwik optimalizace fungují automaticky

⸻

10. Výhody
	•	Oddělené repozitáře → centrální správa komponent
	•	Selektivní import → bundle obsahuje jen použité komponenty
	•	Template → nové projekty začínají z jednotné šablony
	•	Verzování a aktualizace → bezpečný update komponent
	•	Tailwind a Qwik kompatibilita → reaktivita a stylování bez komplikací

