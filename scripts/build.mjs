import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await rm('site', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await mkdir('site', { recursive: true });
const sharedConfig = extension => ({ name: 'shared-config', setup(build) { build.onResolve({ filter: /^\.\/config$/ }, () => ({ path: `./config.${extension}`, external: true })); } });
const common = { bundle: true, minify: true, target: ['es2020'], jsx: 'automatic', external: ['react', 'react/*'], legalComments: 'eof' };
for (const entry of ['index', 'desktop', 'components', 'config']) {
  await build({ ...common, entryPoints: [`src/${entry}.tsx`], format: 'esm', plugins: [sharedConfig('js')], outfile: `dist/${entry}.js` });
  await build({ ...common, entryPoints: [`src/${entry}.tsx`], format: 'cjs', plugins: [sharedConfig('cjs')], outfile: `dist/${entry}.cjs` });
}
for (const entry of ['styles', 'desktop', 'components']) {
  await build({ entryPoints: [`src/${entry}.css`], bundle: true, minify: true, outfile: `dist/${entry}.css` });
}
await build({ entryPoints: ['demo/main.tsx'], bundle: true, minify: true, target: ['es2020'], jsx: 'automatic', format: 'esm', outfile: 'site/app.js', define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'eof' });
await cp('demo/index.html', 'site/index.html');
