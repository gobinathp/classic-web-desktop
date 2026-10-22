import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await rm('site', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await mkdir('site', { recursive: true });
const sharedConfig = extension => ({ name: 'shared-config', setup(build) { build.onResolve({ filter: /^\.\/config$/ }, () => ({ path: `./config.${extension}`, external: true })); } });
const common = { bundle: true, minify: true, target: ['es2020'], jsx: 'automatic', external: ['react', 'react/*'], legalComments: 'eof' };
for (const entry of ['index', 'desktop', 'components', 'config', 'controls', 'research', 'structures']) {
  await build({ ...common, entryPoints: [`src/${entry}.tsx`], format: 'esm', plugins: [sharedConfig('js')], outfile: `dist/${entry}.js` });
  await build({ ...common, entryPoints: [`src/${entry}.tsx`], format: 'cjs', plugins: [sharedConfig('cjs')], outfile: `dist/${entry}.cjs` });
}
for (const entry of ['styles', 'desktop', 'components', 'controls', 'research', 'structures']) {
  await build({ entryPoints: [`src/${entry}.css`], bundle: true, minify: true, outfile: `dist/${entry}.css` });
}
await build({ entryPoints: ['demo/main.tsx'], bundle: true, minify: true, target: ['es2020'], jsx: 'automatic', format: 'esm', outfile: 'site/app.js', define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'eof' });
await cp('demo/index.html', 'site/index.html');
await build({ entryPoints: ['demo/gallery.tsx'], bundle: true, minify: true, target: ['es2020'], jsx: 'automatic', format: 'esm', outfile: 'site/gallery.js', define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'eof' });
const { readFile, writeFile } = await import('node:fs/promises');
await writeFile('site/gallery.html', (await readFile('demo/index.html', 'utf8')).replaceAll('./app.', './gallery.').replace('AlignMe — Your personal growth desktop', 'Classic Web Desktop — Component gallery'));

await build({ entryPoints: ['demo/phytotb.tsx'], loader: { '.pdb': 'text' }, bundle: true, minify: true, target: ['es2020'], jsx: 'automatic', format: 'esm', outfile: 'site/phytotb.js', define: { 'process.env.NODE_ENV': '\"production\"' }, legalComments: 'eof' });
await writeFile('site/phytotb.html', (await readFile('demo/index.html', 'utf8')).replaceAll('./app.', './phytotb.').replace('AlignMe — Your personal growth desktop', 'HDT-PhytoTB — Research desktop POC').replace('AlignMe: a local goal, habit and daily planning demo built with Classic Web Desktop.', 'HDT-PhytoTB: a research interface proof of concept using synthetic data.'));

await build({ entryPoints: ['src/structure/renderer.ts'], bundle: true, splitting: true, minify: true, format: 'esm', target: ['es2020'], outdir: 'dist/structure', chunkNames: 'chunks/[name]-[hash]', legalComments: 'eof' });
await cp('src/structure/renderer.html', 'dist/structure/renderer.html');

await cp('node_modules/3dmol/LICENSE', 'dist/structure/3dmol-LICENSE.txt');
await cp('node_modules/smiles-drawer/LICENSE.md', 'dist/structure/smiles-drawer-LICENSE.txt');
await cp('node_modules/chroma-js/LICENSE', 'dist/structure/chroma-js-LICENSE.txt');
await cp('dist/structure', 'site/structure', { recursive: true });
