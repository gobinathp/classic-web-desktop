import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
const budgets = { 'dist/research.js': 5000, 'dist/research.css': 1500, 'site/phytotb.js': 110000, 'dist/index.js': 14000, 'dist/desktop.js': 7000, 'dist/components.js': 8000, 'dist/styles.css': 8000, 'dist/desktop.css': 3500, 'dist/components.css': 4500, 'dist/controls.js': 9000, 'dist/controls.css': 2000, 'site/app.js': 110000, 'site/gallery.js': 110000 };
console.log('JS budgets include the shared configuration module, excluding React.');
let failed = false;
for (const [file, budget] of Object.entries(budgets)) {
  const contents = file.startsWith('dist/') && file.endsWith('.js')
    ? (await build({ entryPoints: [file], bundle: true, write: false, format: 'esm', minify: true, external: ['react', 'react/*'] })).outputFiles[0].contents
    : await readFile(file); const gzip = gzipSync(contents).length;
  console.log(`${file}: ${contents.length} bytes raw; ${gzip} bytes gzip (budget ${budget})`);
  if (gzip > budget) failed = true;
}
if (failed) process.exitCode = 1;

const minimal = await build({ stdin: { contents: "export { Button } from './dist/index.js'", resolveDir: process.cwd() }, bundle: true, write: false, format: 'esm', minify: true, external: ['react', 'react/*'] });
const minimalGzip = gzipSync(minimal.outputFiles[0].contents).length;
console.log(`Button-only tree-shaken JS: ${minimalGzip} bytes gzip (budget 1000, excluding React/CSS)`);
if (minimalGzip > 1000) process.exitCode = 1;
