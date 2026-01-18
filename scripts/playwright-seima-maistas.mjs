import path from "path";
import { chromium } from "playwright";

const filePath = path.resolve("tests/kids/1.1-seima-maistas.html");
const url = `file://${filePath}`;

const issues = [];
const consoleMessages = [];

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (msg) => {
    const entry = `${msg.type()}: ${msg.text()}`;
    consoleMessages.push(entry);
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
      await page.locator("#answer-block button", { hasText: "Know" }).click();
      await waitForProgress(index);
      continue;
    }

    if (type === "gapFillInput") {
      await page.locator("#answer-block input[type=\"text\"]").fill(correct);
      await page.locator("#answer-block button", { hasText: "Check answer" }).click();
      await page.waitForSelector("#next-panel:not(.hidden)");
      await page.click("#next-button");
      await waitForProgress(index);
      continue;
    }

    if (type === "multipleChoice" || type === "gapFill") {
      await page.locator("#answer-block button", { hasText: correct }).first().click();
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

  await browser.close();

  return { issues, consoleMessages, summary };
};

run()
  .then((result) => {
    const { summary, issues: foundIssues } = result;
    if (summary) {
      console.log("Summary:");
      console.log(summary.total);
    } else {
      console.log("Summary: not reached.");
    }

    if (foundIssues.length) {
      console.log("Issues:");
      foundIssues.forEach((item) => console.log(`- ${item}`));
      process.exitCode = 1;
    } else {
      console.log("Issues: none detected.");
    }
  })
  .catch((error) => {
    console.error("Runner failed:", error);
    process.exitCode = 1;
  });
