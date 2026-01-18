---
name: lt-html-tests-runner
description: Run validation and Playwright checks for Lithuanian HTML practice tests in /mnt/c/Programming/Projects/Pets/eduardmikhailau.github.io. Use when the user says “run tests” or after adding/editing HTML files under tests/ (including tests/kids/). Use git diff to detect changed HTML tests, then run npm run test:html by default.
---

# Lt Html Tests Runner

## Overview

Run the repo's HTML test validation and Playwright suite after changes to test pages, using git diff to detect which tests changed.

## Workflow

1. Work from repo root: `/mnt/c/Programming/Projects/Pets/eduardmikhailau.github.io`.
2. Detect changed HTML test files via git:
   - `git diff --name-only`
   - `git diff --name-only --cached`
   - `git ls-files --others --exclude-standard`
   - Filter to `tests/**/*.html`.
3. If any HTML tests changed or the user explicitly asked to run tests, run:
   - `npm run test:html`
4. Report results: pass/fail summary and any failing file/errors.
5. Optional fast path (only if user requests a targeted run):
   - `node scripts/validate-html-tests.mjs`
   - `npx playwright test tests/all-tests.spec.js -g "<relative path>"`
