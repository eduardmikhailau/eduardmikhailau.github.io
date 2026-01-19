const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { test, expect } = require("playwright/test");

const testsRoot = path.resolve(__dirname);

test.use({ ignoreHTTPSErrors: true });

const listHtmlFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listHtmlFiles(fullPath);
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      return [fullPath];
    }
    return [];
  });
};

const runPracticeTest = async (page, filePath) => {
  const url = pathToFileURL(filePath).href;
  const issues = [];
  let savedPrompt = "";
  let savedAnswer = "";

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      issues.push(`Console error: ${msg.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    issues.push(`Page error: ${error.message}`);
  });

  const assertNoIssues = (stage) => {
    if (issues.length) {
      throw new Error(`${stage} failed for ${filePath}:\n${issues.join("\n")}`);
    }
  };

  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(50);
  assertNoIssues("Page load");
  await page.click("#start-button");
  await page.waitForTimeout(50);
  assertNoIssues("Start click");

  try {
    await page.waitForFunction(
      () => typeof session !== "undefined" && session && Array.isArray(session.questions),
      undefined,
      { timeout: 10000 }
    );
  } catch (error) {
    assertNoIssues("Session init");
    throw new Error(`Session not initialized for ${filePath}.`, { cause: error });
  }

  const waitForProgress = async (previousIndex) => {
    await page.waitForFunction((index) => {
      const summary = document.getElementById("summary-screen");
      if (summary && !summary.classList.contains("hidden")) {
        return true;
      }
      return typeof session !== "undefined" && session && session.currentQuestionIndex > index;
    }, previousIndex);
  };

  const questionCount = await page.evaluate(() => session.questions.length);
  const maxSteps = Math.max(questionCount + 10, 50);

  for (let step = 0; step < maxSteps; step += 1) {
    const summaryVisible = await page.evaluate(() => {
      const summary = document.getElementById("summary-screen");
      return summary && !summary.classList.contains("hidden");
    });

    if (summaryVisible) {
      break;
    }

    const { type, correct, index, prompt, answer } = await page.evaluate(() => {
      if (!session || !session.questions || session.currentQuestionIndex >= session.questions.length) {
        return { type: null, correct: null, index: -1, prompt: "", answer: "" };
      }
      const q = session.questions[session.currentQuestionIndex];
      return {
        type: q.type,
        correct: q.correct,
        index: session.currentQuestionIndex,
        prompt: q.prompt || "",
        answer: q.correct ?? q.answer ?? ""
      };
    });

    if (!type) {
      issues.push("No current question detected.");
      break;
    }

    if (!savedPrompt && prompt) {
      await page.click("#save-question");
      savedPrompt = prompt;
      savedAnswer = answer || "";
    }

    if (type === "flashcards") {
      await page.getByRole("button", { name: "Know", exact: true }).click();
      await waitForProgress(index);
      continue;
    }

    if (type === "gapFillInput") {
      await page.locator('#answer-block input[type="text"]').fill(correct);
      await page.getByRole("button", { name: "Check answer", exact: true }).click();
      await page.waitForSelector("#next-panel:not(.hidden)");
      await page.click("#next-button");
      await waitForProgress(index);
      continue;
    }

    if (type === "multipleChoice" || type === "gapFill") {
      await page.getByRole("button", { name: correct, exact: true }).click();
      await page.waitForSelector("#next-panel:not(.hidden)");
      await page.click("#next-button");
      await waitForProgress(index);
      continue;
    }

    issues.push(`Unknown question type: ${type}`);
    break;
  }

  const summary = await page.evaluate(() => {
    const summaryEl = document.getElementById("summary-screen");
    if (!summaryEl || summaryEl.classList.contains("hidden")) {
      return null;
    }
    const total = document.getElementById("summary-total")?.textContent || "";
    const rows = Array.from(document.querySelectorAll("#summary-table > div")).map((row) => row.textContent || "");
    const savedItems = Array.from(document.querySelectorAll("#saved-questions-list > div")).map(
      (row) => row.textContent || ""
    );
    const savedEmptyHidden = document.getElementById("saved-questions-empty")?.classList.contains("hidden") || false;
    return { total, rows, savedItems, savedEmptyHidden };
  });

  expect(summary, "Summary screen should be visible").not.toBeNull();
  expect(summary.total, "Summary total should be present").not.toEqual("");
  expect(issues, issues.join("\n")).toEqual([]);
  expect(summary.savedItems.length, "Saved questions should render").toBeGreaterThan(0);
  expect(summary.savedEmptyHidden, "Saved empty state should be hidden").toBe(true);
  if (savedPrompt) {
    expect(summary.savedItems.join(" ")).toContain(savedPrompt);
  }
  if (savedAnswer) {
    expect(summary.savedItems.join(" ")).toContain(savedAnswer);
  }
};

const htmlFiles = listHtmlFiles(testsRoot);

test("html tests are present", () => {
  expect(htmlFiles.length).toBeGreaterThan(0);
});

for (const filePath of htmlFiles) {
  const relativePath = path.relative(process.cwd(), filePath);
  test(`practice test works: ${relativePath}`, async ({ page }) => {
    test.setTimeout(120000);
    await runPracticeTest(page, filePath);
  });
}
