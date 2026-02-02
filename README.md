# Lithuanian vocabulary tests (LT ↔ RU)

This repo is used to generate **self-contained HTML practice tests** for learning Lithuanian vocabulary with **Russian translations**.

## Workflow

1. You provide screenshots from a Lithuanian study book.
2. The agent extracts all **active Lithuanian words/phrases** (and **Russian translations** when present).
3. The agent generates a new self-contained test page in `tests/` based on:
   - `template.html`
   - `docs/test_example_description.md`

## Repo layout

- `template.html` — reference template (TailwindCSS via CDN + vanilla JS logic).
- `docs/test_example_description.md` — test types + rules (randomization, feedback, analytics, per-word minimums).
- `tests/` — generated test pages (each file is a single HTML).
- `AGENTS.md` — agent instructions for extraction + generation.

## Creating a new test

- Copy `template.html` → `tests/<topic>.html`.
- Replace `wordSet.topic` and `wordSet.words` with extracted vocabulary.
- Keep the page fully self-contained:
  - TailwindCSS via CDN
  - All logic in inline JS
- Ensure the behavior rules from `docs/test_example_description.md` are met:
  - Randomize questions and options on each run
  - Show correctness and the correct answer on mistakes
  - Show final analytics
  - Per-word minimums (including 2 flashcards per word)
- For gap fill, hardcode `gapFillVariants` options in the correct Lithuanian form for each question (no helper-based generation).

## Running

Open any file from `tests/` directly in a browser (no build step required).
GitHub Pages: https://eduardmikhailau.github.io/ (tests under `tests/`).

## Tests (GitHub Pages)

- [1.1 Veiksmai ir laikas](https://eduardmikhailau.github.io/tests/1.1-veiksmai-laikas.html)
- [1.2 Kalendorius ir kelionės](https://eduardmikhailau.github.io/tests/1.2-kalendorius-keliones.html)
- [1.3 Miestas: paslaugos ir bendruomenė](https://eduardmikhailau.github.io/tests/1.3-miestas-paslaugos-bendruomene.html)
- [1.4 Miestas: laisvalaikis ir žmonės](https://eduardmikhailau.github.io/tests/1.4-miestas-laisvalaikis-zmones.html)
- [1.5 Profesijos: kultūra ir sportas](https://eduardmikhailau.github.io/tests/1.5-profesijos-kultura-sportas.html)
- [1.6 Profesijos: švietimas ir medicina](https://eduardmikhailau.github.io/tests/1.6-profesijos-svietimas-medicina.html)
- [1.7 Profesijos: paslaugos ir transportas](https://eduardmikhailau.github.io/tests/1.7-profesijos-paslaugos-transportas.html)
- [1.8 Profesijos: valstybė ir verslas](https://eduardmikhailau.github.io/tests/1.8-profesijos-valstybe-verslas.html)
- [2.1 Šeima ir giminės](https://eduardmikhailau.github.io/tests/2.1-seima-ir-gimines.html)
- [2.2 Veiksmažodžiai](https://eduardmikhailau.github.io/tests/2.2-veiksmazodziai.html)
- [2.3 Būdvardžiai: išvaizda ir dydis](https://eduardmikhailau.github.io/tests/2.3-budvardziai-isvaizda-dydis.html)
- [2.4 Būdvardžiai: nuotaikos ir vertinimai](https://eduardmikhailau.github.io/tests/2.4-budvardziai-nuotaikos-vertinimai.html)
- [3.1 Klausimai](https://eduardmikhailau.github.io/tests/3.1-klausimai.html)
- [4.1 Valgymas: veiksmažodžiai](https://eduardmikhailau.github.io/tests/4.1-valgymas-veiksmazodziai.html)
- [4.2 Pieno produktai ir gėrimai](https://eduardmikhailau.github.io/tests/4.2-pieno-produktai-gerimai.html)
- [4.3 Mėsa, žuvis ir grybai](https://eduardmikhailau.github.io/tests/4.3-mesa-zuvis-grybai.html)
- [4.4 Duona ir saldumynai](https://eduardmikhailau.github.io/tests/4.4-duona-saldumynai.html)
- [4.4.1 Duona ir saldumynai (įnagininkas)](https://eduardmikhailau.github.io/tests/4.4.1-duona-saldumynai-inagininkas.html)
- [4.5 Vaisiai ir uogos](https://eduardmikhailau.github.io/tests/4.5-vaisiai-uogos.html)
- [4.5.1 Vaisiai ir uogos (įnagininkas)](https://eduardmikhailau.github.io/tests/4.5.1-vaisiai-uogos-inagininkas.html)
- [4.6 Daržovės ir riešutai](https://eduardmikhailau.github.io/tests/4.6-darzoves-riesutai.html)
- [4.6.1 Daržovės ir riešutai (įnagininkas)](https://eduardmikhailau.github.io/tests/4.6.1-darzoves-riesutai-inagininkas.html)
- [4.7 Kitos maisto prekės](https://eduardmikhailau.github.io/tests/4.7-kitos-maisto-prekes.html)
- [4.8 Prieskoniai](https://eduardmikhailau.github.io/tests/4.8-prieskoniai.html)

## Kids tests (GitHub Pages)

- [1.1 Šeima ir maistas](https://eduardmikhailau.github.io/tests/kids/1.1-seima-maistas.html)
- [1.2 Maisto prekių parduotuvės](https://eduardmikhailau.github.io/tests/kids/1.2-maisto-prekiu-parduotuves.html)
- [1.3 Kūčios](https://eduardmikhailau.github.io/tests/kids/1.3-kucios.html)
- [1.4 Vietos ir patalpos](https://eduardmikhailau.github.io/tests/kids/1.4-vietos-patalpos.html)
