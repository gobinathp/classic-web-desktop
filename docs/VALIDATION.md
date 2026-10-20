# Validation — 2026-10-20

Local production build, Node 24.19.0, npm 11.9.0.

| Check | Result |
| --- | --- |
| TypeScript strict check and declaration emission | Passed |
| Window-state tests | 6 passed: cap, focus/restore, close/minimize, maximize, finite geometry, viewport fit and app removal |
| Browser integration tests | 4 passed on headless Chromium 153.0.8010.0 |
| Desktop and narrow viewport screenshots | Inspected at 1280×800 and 360×640 |
| Open/close stress check | 30 Notepad cycles returned DOM element count to baseline |
| Network and page errors during tested lifecycle | No external requests or page errors observed |
| Input safety | HTML-like scratchpad input stayed text, no image node or test sentinel execution |
| npm audit | 0 reported vulnerabilities across the resolved dependency tree at check time |
| npm pack dry run | Passed; package includes built JS, declarations, CSS, README, security policy, license |

## Transfer sizes

- ESM library JS: 11,301 bytes raw / **4,134 bytes gzip**.
- Library CSS: 7,315 bytes raw / **2,363 bytes gzip**.
- Combined library JS + CSS: **6,497 bytes gzip**, excluding React.
- Demo JS including React and ReactDOM: 241,807 bytes raw / **75,104 bytes gzip**. Demo CSS is additional.

## Coverage and limitations

Browser checks cover open/close/minimize/restore, pointer drag and resize, keyboard move/resize, maximize, viewport clamping, pagination, launcher focus/Escape, and repeated lifecycle cleanup at the DOM level. The default Playwright browser download was unavailable in this environment, so a locally extracted Chromium package was used through `CHROMIUM_EXECUTABLE_PATH`; CI uses Playwright's regular Chromium install.

DOM returning to baseline is not proof of zero memory leaks. No retained-heap analysis, physical old-PC benchmark, Firefox/Safari run, screen-reader audit, touch-device test, or penetration test has been completed. Supported-browser intentions should not be mistaken for completed testing. Dependency auditing finds known advisories, not every defect.

Security boundaries and host obligations are documented in SECURITY.md. No npm publication is claimed. GitHub workflow and Pages success must be checked separately after source publication.
