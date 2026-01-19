const path = require("path");
const { test, expect } = require("playwright/test");

test.use({ ignoreHTTPSErrors: true });

test("1.1-seima-maistas flows to summary without errors", async ({ page }) => {
  test.setTimeout(120000);

  const filePath = path.resolve(__dirname, "1.1-seima-maistas.html");
  const url = `file://${filePath}`;
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

  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto(url, { waitUntil: "load" });
  await page.click("#start-button");

  await page.waitForFunction(() => {
    return typeof session !== "undefined" && session && Array.isArray(session.questions);
  });

  const waitForProgress = async (previousIndex) => {
    await page.waitForFunction((index) => {
      const summary = document.getElementById("summary-screen");
      if (summary && !summary.classList.contains("hidden")) {
        return true;
      }
      return typeof session !== "undefined" && session && session.currentQuestionIndex > index;
    }, previousIndex);
  };

  const maxSteps = 500;
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
});
