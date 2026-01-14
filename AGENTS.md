# Agent Workflow (Lithuanian tests)

This repo is used to generate self-contained HTML practice tests for Lithuanian vocabulary.

## Input → Output workflow

1. **Input**: User provides screenshots (images) from a Lithuanian study book.
2. **Extraction**: Agent extracts all *active* Lithuanian words and phrases from the screenshots.
3. **Output**: Agent generates a self-contained HTML test page in `tests/` based on `template.html` and the rules in `docs/test_example_description.md`.

## Extraction rules (screenshots)

- Extract **Lithuanian items** (words + short phrases) that look like vocabulary/targets.
- Also extract the **Russian translation** when it is present.
- If the Russian translation is **not** present, automatically provide `ru` by translating from Lithuanian.
- De-duplicate items across screenshots.
- Keep diacritics exactly (e.g. `tėvas`, `sūnus`, `senelė`).
- Prefer producing a structured list like:
  - `id` (latin slug, stable)
  - `lt` (Lithuanian)
  - `ru` (Russian)
  - optional metadata when available (e.g. part of speech, gender)

If the screenshot text is ambiguous, ask the user to confirm the unclear items rather than guessing.

## Test generation rules

Source of truth:
- `template.html`
- `docs/test_example_description.md`

When generating a new test page:
- Create a **new HTML file** under `tests/` (e.g. `tests/<topic>.html`).
- The file must be **fully self-contained** (single HTML) and use **TailwindCSS via CDN** for UI.
- Implement logic in plain JS inside the HTML.
- UI must be **responsive** and work well on mobile.

### Must-follow behavior (common)

- Randomize test variants each run (question order and option order).
- Show whether the user answered correctly.
- If the user answered incorrectly, show the correct answer.
- At the end, show full analytics about progress.

### Per-word minimums

- For each word, include **2 flashcards** (`lt→ru` and `ru→lt`).
- For each word, create **at least 3 questions for each non-flashcard test type**.

### Notes

- Flashcards UX should follow the current `template.html` behavior:
  - Clicking **Know** immediately advances to the next card.
  - Clicking **Don’t know** reveals the translation and allows advancing.
- The **Next** button should live in a fixed bottom panel (mobile-safe).
- Gap fill and case practice should use **per-word predefined variants** with correct Lithuanian grammar forms (no generic templates).

## Implementation guidance

- Use `template.html` as the baseline and only replace:
  - Title/topic labels
  - `wordSet.words` (and any phrase sets if added)
  - Any templates needed to meet the required counts
- Keep code minimal and consistent with existing style.
