import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const budgets = { 'dist/index.js': 12000, 'dist/styles.css': 6000, 'site/app.js': 110000 };
let failed = false;
for (const [file, budget] of Object.entries(budgets)) {
  const contents = await readFile(file); const gzip = gzipSync(contents).length;
  console.log(`${file}: ${contents.length} bytes raw; ${gzip} bytes gzip (budget ${budget})`);
  if (gzip > budget) failed = true;
}
if (failed) process.exitCode = 1;
