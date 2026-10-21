# Performance and memory

## Design decisions

1. React is externalized. No runtime windowing, styling, icon, or animation dependencies.
2. App content is memoized; keep `apps` definitions stable to retain that benefit.
3. Pointer events keep temporary geometry in refs. A single pending animation frame applies CSS geometry; app content does not rerender on every pointer move.
4. Default cap: eight open windows (configurable ceiling: 32 by default). Minimized content unmounts unless `keepAlive` is explicitly requested.
5. Listeners, resize observers, and pending animation frames are removed on teardown. No timers or background polling.
6. Table pagination renders 20 rows by default, at most 100 by default. Dataset allocation remains the application's responsibility.
7. Native fonts and CSS shapes avoid image/font decoding overhead. No blur or animation layers.

## Size budgets

`npm run check:size` fails above 12,000 gzip bytes for library JS, 7,000 for combined CSS, or 110,000 for full-demo JS. These are transfer-size budgets, not heap limits. Both ESM and CommonJS are provided but consumers normally load only one.

## How to measure a real host

Build a production app, close unrelated tabs/extensions, record browser/version/hardware, and use DevTools Performance/Memory. Measure a blank host first, then one window, then eight windows. Capture heap snapshots after opening/closing a representative app 50 times and after garbage collection. Inspect retained listeners, detached nodes, app data and timers. Repeat with `keepAlive` to understand its cost.

Use CPU throttling to investigate sluggish interactions, but do not present it as a substitute for testing real old hardware. Supply representative data; the demo's 240 rows are not a large-dataset benchmark. Test zoom, resized containers, keyboard-only controls and touch inputs.

This release has no verified minimum RAM specification and no claim that it supports obsolete, unpatched browsers. The validation report records actual checks rather than estimates.

## v0.2 modular controls

The desktop and modern controls each have their own JS and CSS entry points. Root imports remain tree-shakeable with a modern ESM bundler; the size check verifies a Button-only consumer stays below 1 KB gzip, excluding React and CSS. Desktop-only JS has a separate 7 KB gzip ceiling (including shared configuration), and desktop CSS a 3.5 KB ceiling.

Inactive tabs and collapsed disclosure branches unmount their contents. Closed modal dialogs/drawers unmount. ToastViewport mounts only the last three entries; the demo also bounds its caller-owned queue. Native datalist suggestions cap at 100, and static skeletons cap at 10 lines. File selection does not decode or preview files. Optional table sorting copies and sorts the supplied array; use server-side preparation for large data.

`DesktopProvider` configures budgets and lifecycle; `ComponentTheme` controls local density; it does not allocate a global store or persist preferences. The enlarged component catalog adds no runtime dependency. Development-only axe tooling checks a representative showcase; it is not shipped in the library.

## v0.3 configurable budgets

All rendering budgets above are defaults exposed through `DesktopProvider`. Preserving hidden content or raising caps has an explicit memory tradeoff. Transfer checks bundle the shared configuration dependency into each measured JS entry, preventing under-reporting from externalizing it. Theme customization raised the CSS budget by 500 bytes (combined) while adding no runtime dependency. See [configuration](CONFIGURATION.md).
