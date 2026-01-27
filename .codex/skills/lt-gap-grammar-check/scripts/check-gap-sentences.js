#!/usr/bin/env node
const fs = require('fs');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: check-gap-sentences.js <tests/*.html> [more files]');
  process.exit(1);
}

const suspiciousPlaces = [
  'Bokšte ant stalo',
  'Bažnyčioje ant stalo',
  'Bare ant stalo',
  'Sporto klube ant stalo',
  'Prie šviesoforo ant stalo'
];

const badLtPatterns = [
  /mėgsta\s+mėgsta/i,
  /myli\s+myli/i,
  /mėgsta\s+neturi/i,
  /myli\s+neturi/i
];

const badRuPatterns = [
  /любит\s+любит/i,
  /любит\s+не\s+имеет/i
];

const questionLtStarts = /^(Kuri|Kuris|Kurie|Kurios|Kokie|Kokios|Koks|Kokia|Kas|Kur|Kada)\b/;
const questionRuStarts = /^(Какая|Какой|Какие|Кто|Что|Где|Когда)\b/;

function extractGap(html) {
  const m = html.match(/const gapFillVariants = ([\s\S]*?);/);
  if (!m) return null;
  return Function(`return ${m[1]}`)();
}

let totalIssues = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const gap = extractGap(html);
  if (!gap) {
    console.log(`${file}: No gapFillVariants found`);
    continue;
  }

  let fileIssues = 0;
  console.log(`\n=== ${file} ===`);

  for (const [key, variants] of Object.entries(gap)) {
    variants.forEach((v, idx) => {
      const issues = [];
      const lt = v.sentence || '';
      const ru = v.translationRu || '';

      if (!lt.includes('___')) issues.push('LT missing gap');
      if (!ru) issues.push('RU missing');

      for (const re of badLtPatterns) if (re.test(lt)) issues.push('LT duplicate/contradicting verb');
      for (const re of badRuPatterns) if (re.test(ru)) issues.push('RU duplicate/contradicting verb');

      if (questionLtStarts.test(lt.trim()) && !lt.trim().endsWith('?')) issues.push('LT question missing ?');
      if (questionRuStarts.test(ru.trim()) && !ru.trim().endsWith('?')) issues.push('RU question missing ?');

      if (lt.includes('?.') || ru.includes('?.')) issues.push('Punctuation "?."');
      if (lt.includes('..') || ru.includes('..')) issues.push('Double period');

      for (const phrase of suspiciousPlaces) {
        if (lt.includes(phrase)) issues.push('Sense-check: odd location');
      }

      if (issues.length) {
        fileIssues += issues.length;
        console.log(`- ${key}[${idx + 1}]`);
        console.log(`  LT: ${lt}`);
        console.log(`  RU: ${ru}`);
        console.log(`  Issues: ${issues.join('; ')}`);
      }
    });
  }

  console.log(`${file}: ${fileIssues} potential issues`);
  totalIssues += fileIssues;
}

console.log(`\nTotal potential issues: ${totalIssues}`);
process.exit(totalIssues ? 2 : 0);
