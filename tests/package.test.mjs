import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import * as esmRoot from '../dist/index.js';
import * as esmDesktop from '../dist/desktop.js';
import * as esmComponents from '../dist/components.js';
const require = createRequire(import.meta.url);
for (const [format, root, desktop, components] of [
  ['ESM', esmRoot, esmDesktop, esmComponents],
  ['CommonJS', require('../dist/index.cjs'), require('../dist/desktop.cjs'), require('../dist/components.cjs')],
]) {
  test(`${format}: root provider shares configuration with subpath components`, () => {
    const html = render(h(root.DesktopProvider, { config: { messages: { actions: 'Aktionen', previous: 'Zurück', next: 'Weiter' }, behavior: { maxToasts: 1, maxSuggestions: 2, maxSkeletonLines: 2 } } },
      h(desktop.Toolbar, null, 'Tools'),
      h(components.Pagination, { page: 1, pageCount: 3, onChange() {} }),
      h(components.ToastViewport, { items: [{ id: 'old', title: 'Old notice' }, { id: 'new', title: 'New notice' }], onDismiss() {} }),
      h(components.Autocomplete, { label: 'Pick', options: ['One', 'Two', 'Three'] }),
      h(components.Skeleton, { lines: 8 }),
      h(root.DesktopProvider, { config: { messages: { next: 'Suivant' } } }, h(components.Pagination, { page: 1, pageCount: 3, onChange() {} })),
    ));
    assert.match(html, /aria-label="Aktionen"/);
    assert.match(html, /Zurück/); assert.match(html, /Weiter/); assert.match(html, /Suivant/);
    assert.doesNotMatch(html, /Old notice|value="Three"/); assert.match(html, /New notice/);
    assert.equal((html.match(/aria-hidden="true"/g) ?? []).length, 2);
  });
  test(`${format}: controlled grid state, custom page size and escaped text`, () => {
    const html = render(h(root.DesktopProvider, { config: { behavior: { pageSize: 1 }, messages: { next: '<script>bad()</script>' } } },
      h(desktop.DataGrid, { rows: [{ id: 'one' }, { id: 'two' }], columns: [{ key: 'id', title: 'ID', render: r => r.id }], rowKey: r => r.id, caption: 'Data', page: 1 }),
    ));
    assert.match(html, /<td>two<\/td>/); assert.doesNotMatch(html, /<td>one<\/td>|<script>/); assert.match(html, /&lt;script&gt;/);
  });
}
