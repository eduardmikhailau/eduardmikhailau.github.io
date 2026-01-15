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
