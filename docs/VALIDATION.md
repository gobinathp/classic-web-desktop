# Validation — v0.2.0 — 2026-10-20

Local production build, Node 24.19.0, npm 11.9.0, headless Chromium 153.0.8010.0.

| Check | Result |
| --- | --- |
| TypeScript strict check and declaration emission | Passed |
| Window-state tests | 6 passed |
| Browser integration tests | 10 passed |
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
| Full root entry | 7,975 bytes | 5,345 bytes | 13,320 bytes |
| Desktop only | 4,458 bytes | 2,638 bytes | 7,096 bytes |
| Components only | 4,063 bytes | 3,333 bytes | 7,396 bytes |

React is excluded from library measurements. A Button-only ESM consumer is 372 bytes gzip excluding React/CSS. Full demo JS including React and ReactDOM is 81,502 bytes gzip; demo CSS is additional. npm tarball includes alternate formats and declarations, so its size is larger than a consumer's selected browser bundle.

## Limits

These are download measurements, not RAM guarantees. DOM counts do not prove absence of retained-heap leaks. No physical old-PC, retained-heap, screen-reader, Firefox/Safari, or real touch-device audit has been completed. Automated accessibility checks cover the tested views, not every possible composition and not complete WCAG conformance. Known-vulnerability auditing is not a penetration test.

The regular local Playwright browser download was unavailable; an extracted Chromium package was used via CHROMIUM_EXECUTABLE_PATH. GitHub CI uses Playwright's standard install. GitHub workflow and hosting success must be checked after publication. npm is not published yet.
