# Performance and memory

## Design decisions

1. React is externalized. No runtime windowing, styling, icon, or animation dependencies.
2. App content is memoized; keep `apps` definitions stable to retain that benefit.
3. Pointer events keep temporary geometry in refs. A single pending animation frame applies CSS geometry; app content does not rerender on every pointer move.
4. Default cap: eight open windows (hard configuration ceiling: 32). Minimized content unmounts unless `keepAlive` is explicitly requested.
5. Listeners, resize observers, and pending animation frames are removed on teardown. No timers or background polling.
6. Table pagination renders 20 rows by default, at most 100. Dataset allocation remains the application's responsibility.
7. Native fonts and CSS shapes avoid image/font decoding overhead. No blur or animation layers.

## Size budgets

`npm run check:size` fails above 12,000 gzip bytes for library JS, 6,000 for CSS, or 110,000 for full-demo JS. These are transfer-size budgets, not heap limits. Both ESM and CommonJS are provided but consumers normally load only one.

## How to measure a real host

Build a production app, close unrelated tabs/extensions, record browser/version/hardware, and use DevTools Performance/Memory. Measure a blank host first, then one window, then eight windows. Capture heap snapshots after opening/closing a representative app 50 times and after garbage collection. Inspect retained listeners, detached nodes, app data and timers. Repeat with `keepAlive` to understand its cost.

Use CPU throttling to investigate sluggish interactions, but do not present it as a substitute for testing real old hardware. Supply representative data; the demo's 240 rows are not a large-dataset benchmark. Test zoom, resized containers, keyboard-only controls and touch inputs.

This release has no verified minimum RAM specification and no claim that it supports obsolete, unpatched browsers. The validation report records actual checks rather than estimates.
