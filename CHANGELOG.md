# Changelog

## 0.4.0 — 2026-10-21

- Add twelve controls: ListView, PredefinedDialog, Splitter, Timeline, ButtonGroup, SplitButton, Chips, ListBox, ContextMenu, AppBar, Rating, Spinner.
- Add modular `/controls` ESM/CommonJS entry and CSS, scoped labels/icons/budgets, and classic styling.
- Add New in v0.4 demo with interactive collections, actions, layout and dialog scenarios.
- Add keyboard, pointer, accessibility, reduced-motion, narrow-layout and packaged-import tests.
- Keep desktop-only dependencies isolated; expand full-root size budgets to account for the new controls.


## 0.3.1 — 2026-10-21

- Keep menus, popovers and help tooltips inside clipping ancestors, reposition on resize/scroll/window movement, and scroll oversized panels.
- Fix tooltip click/focus interaction; retain hover, keyboard focus and Escape support.
- Preserve taskbar opening order independently of window stacking order.
- Reject empty/whitespace workspace preview names, including Enter submission.
- Search demo projects by name, owner and status; reset paging on search.
- Use native Explorer disclosure arrows and show sample-action feedback.
- Add browser regressions for all seven reported review issues.


## 0.3.0 — 2026-10-20

- Add scoped DesktopProvider with partial translations, branding, icons, locale and configurable rendering budgets.
- Expose window geometry, keyboard distance, lifecycle retention and layout options.
- Add controlled DataGrid page/sort and modal styling, Escape policy and drawer side.
- Add theme tokens and a live customization sample; preserve classic defaults and low-memory behavior.
- Share configuration across root/subpath ESM and CommonJS imports; include its cost in bundle budgets.
- Add configuration, escaping, package interoperability and customized desktop regression tests.


## 0.2.0 — 2026-10-20

- Expand to 38 component exports: native form controls, tabs, disclosure navigation, cards, status displays, dialogs, drawers, menus, popovers, tooltips, and bounded notifications.
- Add separate desktop/components JavaScript and CSS entry points; retain the root API and stylesheet.
- Add primary/danger/ghost and small/loading button states, IconButton, and opt-in DataGrid sorting.
- Introduce Component studio with five interactive categories and compact/comfortable control density.
- Refine title bars, contrast, typography, and active controls while retaining the classic blue desktop appearance.
- Add keyboard/modal/notification/sorting tests and automated accessibility checks; retain the original window-lifecycle checks.
- Expand package metadata, component API documentation, release instructions, issue/PR templates, and roadmap.
- No additional runtime dependencies. Accessibility tooling is development-only.

## 0.1.0 — 2026-10-20

Initial desktop shell, classic theme, six sample applications, basic components, typed APIs, memory-conscious window lifecycle, MIT license, and CI/Pages/npm release workflows.
