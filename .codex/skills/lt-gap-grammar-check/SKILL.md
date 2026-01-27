---
name: lt-gap-grammar-check
description: Check Lithuanian/Russian gap-fill sentences in Lithuanian HTML tests for grammar, sense, and mismatch issues. Use when creating or editing tests/*.html or tests/kids/*.html so the gapFillVariants and translations are reviewed and corrected.
---

# Lt Gap Grammar Check

## Overview
Scan gap-fill sentences in Lithuanian practice tests for grammar, sense, and LT/RU mismatch errors. Use this after creating or updating any test HTML file.

## Workflow

### 1) Identify changed test files
Use git to find updated HTML tests (including kids):

- `git diff --name-only | rg "^tests/.*\.html$"`
- `git diff --name-only --cached | rg "^tests/.*\.html$"`

### 2) Run the automated scan
For each changed HTML test, run:

- `node /home/lenovo/.codex/skills/lt-gap-grammar-check/scripts/check-gap-sentences.js <path>`

This flags common issues (duplicate verbs, missing question marks, odd location phrases, punctuation glitches). Treat these as **potential** issues that still require manual confirmation.

### 3) Manual review checklist (required)
For every gap sentence and its RU translation:

- **Grammar match**: LT case (vardininkas/galininkas/kilmininkas) matches RU case.
- **Sense**: Sentence is natural (no “odd place + ant stalo” artifacts).
- **No verb collisions**: Avoid “mėgsta neturi”, “myli neturi”, “любит не имеет”, etc.
- **Questions**: If LT starts with *Kuri/Kuris/Kokie/Kaip/Kada/Kur*, ensure both LT and RU end with `?`.
- **Options**: Options stay in the same case as the answer.

### 4) Fix, then re-check
Update sentences/translations in the HTML, bump `testVersion`, then re-run the scan.

## Resources

### scripts/
- `check-gap-sentences.js` — quick scan for common grammar/sense/mismatch issues in `gapFillVariants`.
