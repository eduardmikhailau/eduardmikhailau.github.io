import fs from "fs";
import path from "path";

const testsRoot = path.resolve("tests");

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

const countMatches = (text, pattern) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const validateFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const errors = [];

  const wordSetStart = content.indexOf("const wordSet");
  const gapFillStart = content.indexOf("const gapFillVariants");
  const uiStart = content.indexOf("const ui");

  if (wordSetStart === -1) {
    errors.push("Missing 'const wordSet' declaration.");
  }
  if (gapFillStart === -1) {
    errors.push("Missing 'const gapFillVariants' declaration.");
  }
  if (uiStart === -1) {
    errors.push("Missing 'const ui' declaration.");
  }

  const wordSetCount = countMatches(content, /const\s+wordSet/g);
  const gapFillCount = countMatches(content, /const\s+gapFillVariants/g);
  if (wordSetCount > 1) {
    errors.push("Multiple 'const wordSet' declarations found.");
  }
  if (gapFillCount > 1) {
    errors.push("Multiple 'const gapFillVariants' declarations found.");
  }

  if (wordSetStart !== -1 && gapFillStart !== -1) {
    const wordSetEnd = content.indexOf("};", wordSetStart);
    if (wordSetEnd === -1) {
      errors.push("Missing wordSet closing '};'.");
    } else if (wordSetEnd > gapFillStart) {
      errors.push("wordSet closes after gapFillVariants start.");
    } else {
      const between = content.slice(wordSetEnd + 2, gapFillStart).trim();
      if (between.length) {
        errors.push("Unexpected content between wordSet and gapFillVariants.");
      }
    }
  }

  if (gapFillStart !== -1 && uiStart !== -1) {
    const gapFillEnd = content.indexOf("};", gapFillStart);
    if (gapFillEnd === -1) {
      errors.push("Missing gapFillVariants closing '};'.");
    } else if (gapFillEnd > uiStart) {
      errors.push("gapFillVariants closes after ui start.");
    } else {
      const between = content.slice(gapFillEnd + 2, uiStart).trim();
      if (between.length) {
        errors.push("Unexpected content between gapFillVariants and ui.");
      }
    }
  }

  return errors;
};

const collectHtmlFiles = (inputs) => {
  if (!inputs.length) {
    return listHtmlFiles(testsRoot);
  }

  const collected = [];
  for (const input of inputs) {
    const resolved = path.resolve(input);
    if (!fs.existsSync(resolved)) {
      console.error(`Path not found: ${input}`);
      continue;
    }

    const stats = fs.statSync(resolved);
    if (stats.isDirectory()) {
      collected.push(...listHtmlFiles(resolved));
      continue;
    }

    if (stats.isFile()) {
      if (resolved.endsWith(".html")) {
        collected.push(resolved);
      } else {
        console.error(`Skipping non-HTML file: ${input}`);
      }
    }
  }

  return Array.from(new Set(collected));
};

const htmlFiles = collectHtmlFiles(process.argv.slice(2));
if (!htmlFiles.length) {
  const message = process.argv.length > 2
    ? "No HTML tests found for provided paths."
    : "No HTML tests found under tests/.";
  console.error(message);
  process.exit(1);
}

let hasErrors = false;
for (const filePath of htmlFiles) {
  const errors = validateFile(filePath);
  if (errors.length) {
    hasErrors = true;
    console.error(`Validation failed for ${filePath}:`);
    errors.forEach((error) => console.error(`- ${error}`));
  }
}

if (!hasErrors) {
  console.log(`Validation passed for ${htmlFiles.length} HTML tests.`);
}

process.exitCode = hasErrors ? 1 : 0;
