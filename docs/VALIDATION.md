# Validation — v0.4.3 — 2026-10-22

Local production build, Node 24.19.0, npm 11.9.0, headless Chromium 153.0.8010.0.

| Check | Result |
| --- | --- |
| TypeScript strict check and declaration emission | Passed |
| Window-state and structure-input tests | 10 passed |
| Packaged ESM/CommonJS configuration and escaping tests | 10 passed |
| Browser integration tests | 26 passed |
| Automated accessibility | No violations reported for selected WCAG 2 A/AA and 2.1 A/AA rules in five Component studio categories and the sample modal |
| Window lifecycle | Drag/resize/maximize, keyboard controls, viewport clamping, 30 open/close cycles returning DOM count to baseline |
| Modern controls | Keyboard tabs, form validation semantics, switch state, inactive content cleanup, modal focus wrap/restoration, menu navigation, popover Escape, capped notifications, collapsed trees and sortable tables |
| Network and page errors in tested lifecycle | No external requests or page errors observed |
| Input safety | HTML-like scratchpad input remained text; no injected image or execution sentinel |
| npm audit | 0 known vulnerabilities reported across the resolved tree at check time |
| Package inspection | ESM/CommonJS/declarations/CSS and package metadata present |

## Transfer sizes (gzip)

| Build | JavaScript | CSS | Combined |
| --- | ---: | ---: | ---: |
| Full root entry | 12,583 bytes | 7,324 bytes | 19,907 bytes |
| Desktop only | 5,585 bytes | 3,210 bytes | 8,795 bytes |
| Components only | 5,895 bytes | 4,010 bytes | 9,905 bytes |

React is excluded from library measurements; the shared configuration module is included. A Button-only ESM consumer is 412 bytes gzip excluding React/CSS. AlignMe demo JS including React and ReactDOM is 80,612 bytes gzip; the separately loaded component gallery is 88,489 bytes gzip. Demo CSS is additional. npm tarball includes alternate formats and declarations, so its size is larger than a consumer's selected browser bundle.

Customization verified: branding and token changes, top taskbar/right shortcuts, translated labels, five-row pages, eight-pixel keyboard movement and retained minimized input state. Packaged import tests verify nested-provider inheritance and resource budgets.

## Limits

These are download measurements, not RAM guarantees. DOM counts do not prove absence of retained-heap leaks. No physical old-PC, retained-heap, screen-reader, Firefox/Safari, or real touch-device audit has been completed. Automated accessibility checks cover the tested views, not every possible composition and not complete WCAG conformance. Known-vulnerability auditing is not a penetration test.

The regular local Playwright browser download was unavailable; an extracted Chromium package was used via CHROMIUM_EXECUTABLE_PATH. GitHub CI uses Playwright's standard install. GitHub workflow and hosting success must be checked after publication. npm is not published yet.

Visual review regressions: overlay bounding boxes inside window content, tooltip hover/click/Escape, empty and whitespace-only workspace rejection, Enter submission, stable taskbar order, owner search, native Archive marker and visible sample action feedback.

## v0.4 verification

All twelve new controls exercised in four additional browser scenarios: paginated selection, native multi-select, tag selection/removal, action-group navigation, split-button actions, context menu mouse/keyboard/touch fallback, rating keys, reduced-motion Spinner, Splitter pointer/keyboard sizing in both orientations, three predefined dialog modes with prompt validation, AppBar action feedback and Timeline semantics. Additional axe checks cover all three new demo categories and prompt dialog. A 360px viewport checks context-menu containment. Packaged ESM and CommonJS tests verify the twelve exports and shared translation/resource limits.

The controls entry including reused primitives is 6,236 gzip bytes of JS, plus 1,312 bytes of optional CSS (base styles additionally required). No new runtime dependencies were added. All 46 tests pass locally: ten model/input, ten package and twenty-six browser tests.

## AlignMe verification

Three browser scenarios cover goal creation/editing and validation, linked tasks, state retention across window teardown, habit check-ins, weekly totals, reflection, template planner actions, preferences and reload reset. Automated axe scans cover all seven apps. A 390px viewport checks window containment and dialog dismissal. Desktop and mobile screenshots were visually reviewed. No external requests or page errors were observed in the tested AlignMe workflow.

## HDT-PhytoTB verification

Three browser scenarios verify catalogue filtering, record inspection and graph focus, shared compound selection, keyboard graph selection, missing expression-cell provenance, notebook state across close/reopen, JSON download with synthetic marker, reload reset, all six app views with axe A/AA scans, and 390px viewport containment. Desktop and mobile screenshots were visually reviewed. Two additional ESM/CommonJS package tests check bounded research output, escaped labels, absent graph endpoints and missing-versus-zero values. No external requests or page errors occurred in the tested research workflow.

Optional research entry: 1,525 bytes gzip JS plus 545 bytes CSS, excluding React. POC JS including React: 81,254 bytes gzip. Existing root/library and AlignMe bundles are unchanged. These are transfer sizes, not RAM measurements.

## Structure viewers verification

SMILES-based ethanol and caffeine 2D SVG depictions, supplied ethanol SDF and sourced 1CRN PDB WebGL rendering all passed. Tests verify 3D rotation changes rendered pixels, representation/zoom/reset actions, missing coordinates, parser failure, a simulated unavailable-WebGL path, lazy engine requests, cleanup across unload/minimise, 390px containment and axe checks. Screenshots of the mobile molecule and desktop protein viewers were visually reviewed. ESM/CommonJS imports render on the server without loading browser engines. Input tests cover byte/character ceilings, format preflight and finite bounded limits.

Structure wrapper: 2,169 gzip bytes JS plus 456 CSS. Optional engine chunks total 229,418 gzip bytes, downloaded on demand, plus a small renderer entry. Research demo initial JS is 95,864 gzip bytes including embedded 1CRN data; core and AlignMe sizes are unchanged. Local rendering used Chromium software WebGL; no hardware-GPU or retained-heap benchmark is claimed. npm audit with optional dependencies omitted reported zero known vulnerabilities at check time.
