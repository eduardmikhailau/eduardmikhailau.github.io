const path = require("path");
const { test, expect } = require("playwright/test");

test("1.1-seima-maistas flows to summary without errors", async ({ page }) => {
  test.setTimeout(120000);

  const filePath = path.resolve(__dirname, "1.1-seima-maistas.html");
  const url = `file://${filePath}`;
  const issues = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      issues.push(`Console error: ${msg.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    issues.push(`Page error: ${error.message}`);
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

    const { type, correct, index } = await page.evaluate(() => {
      if (!session || !session.questions || session.currentQuestionIndex >= session.questions.length) {
        return { type: null, correct: null, index: -1 };
      }
      const q = session.questions[session.currentQuestionIndex];
      return { type: q.type, correct: q.correct, index: session.currentQuestionIndex };
    });

    if (!type) {
      issues.push("No current question detected.");
      break;
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
    return { total, rows };
  });

  expect(summary, "Summary screen should be visible").not.toBeNull();
  expect(summary.total, "Summary total should be present").not.toEqual("");
  expect(issues, issues.join("\n")).toEqual([]);
});
