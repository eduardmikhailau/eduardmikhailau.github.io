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

## Running

Open any file from `tests/` directly in a browser (no build step required).
