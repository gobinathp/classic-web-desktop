# v0.4 controls

Twelve additional controls, with no additional runtime dependencies. These are lightweight implementations with the scope below, not feature parity with any commercial suite.

Open **Start → New in v0.4** in the demo. Collections, Actions, and Layout & dialogs demonstrate every new control and show local results. Existing components remain in Component studio.

## Imports

```tsx
import { Splitter, ListView, PredefinedDialog } from '@gobinathp/classic-web-desktop/controls';
import { ComponentTheme } from '@gobinathp/classic-web-desktop/components';
import '@gobinathp/classic-web-desktop/styles.css';
```

All twelve are also exported from the root package. `/controls` is a separate ESM/CommonJS entry and shares the configuration context with the root and other subpaths. It includes the existing primitives it uses. For separate styles, import `desktop.css`, `components.css`, then `controls.css`; the combined `styles.css` includes all three. Components use a surrounding `ComponentTheme` for typography. `DesktopProvider` supplies optional messages, icons, behavior and theme overrides.

## API and behavior

| Export | Required props | Optional props and behavior |
| --- | --- | --- |
| ListView | label, items, onSelect | value; pageSize defaults to 20 and is bounded by behavior.maxPageSize. Items: id, label, description?, disabled?. Only one page mounts; selection is host-controlled. Uses a list of native buttons, not listbox semantics. |
| PredefinedDialog | open, title, message, onClose, onConfirm | kind: alert (default), confirm or prompt; confirmLabel, cancelLabel, inputLabel, defaultValue, required. Required prompt rejects empty/whitespace text. Enter submits; Escape/cancel only call onClose. Confirm calls onConfirm(value for prompt, undefined otherwise), then onClose. Closed dialogs release local prompt state. |
| Splitter | label, first, second, value, onChange | value is the first pane's percentage of available pane space; min=15, max=85; orientation=horizontal or vertical; style. Controlled two-pane layout. Drag or use arrows (1 percentage point), Shift+arrows (10), Home/End. Escape cancels an active drag. Values are finite and clamped. Both panes stay mounted; host controls pane content. |
| Timeline | label, items | Items: id, title, time?, dateTime?, content?. Semantic ordered list with optional time elements. Static display, no scheduler or data fetching. |
| ButtonGroup | label, items, value, onChange | Items: value, label, disabled?. Single selected action, aria-pressed; arrows/Home/End focus and activate enabled buttons. One enabled button is in the Tab order. |
| SplitButton | label, menuLabel, onClick, items | disabled disables both actions. Main button invokes onClick; separate dropdown invokes the selected MenuItem.onSelect. menuLabel is required for a clear accessible name. |
| Chips | label, items | selected, onSelectionChange, onRemove. Items: id, label, disabled?. Supports static tags, multiple selected tags and removable tags; removing a tag moves focus to a neighboring enabled control or the list. Host owns removal and selection state. |
| ListBox | label, options, value, onChange | multiple=false, size=5, disabled=false. value/onChange use arrays in both modes; single mode uses the first value. Native select keyboard behavior. Options: value, label, disabled?. Visible size is bounded by behavior.maxListBoxRows, but ALL supplied options mount. Supply a bounded dataset. |
| ContextMenu | label, items, children | Right-click within the wrapper, Shift+F10/ContextMenu key on a focused child, or the visible action button. Native editing menus remain available in inputs/textareas/contenteditable. Arrows/Home/End/initial-letter navigation skip disabled items; Escape restores focus, outside click and Tab dismiss. Uses existing bounded inline overlay placement. |
| AppBar | title | leading, children, actions. Wrapping header layout; host supplies navigation and action handlers. Not a desktop taskbar replacement. |
| Rating | label, value, onChange | max=5, disabled=false, formatLabel. Integer star choices use native radio buttons and arrow-key navigation. max is bounded by behavior.maxRating (default 10); value=0 means no selection. No fractional stars or review backend. |
| Spinner | none | label defaults to messages.loading; size=small or medium. Visible status label and CSS ring. No timer; unmount when idle. Reduced motion displays a static ring and label. |

All text is rendered through React escaping. ReactNode content and callbacks are trusted host code. No uploads, remote calls, persistence, clipboard access or automatic destructive operations are introduced. For asynchronous confirmations, the host handles pending/error state; this simple preset closes after its synchronous callback returns.

## Configuration and styling

New messages: `confirm`, `cancel`, `promptLabel`, `requiredValue`, `remove(label)`, `rating(value,max)`. New icon: `icons.rating`. New resource defaults: `maxRating=10`, `maxListBoxRows=20`. ListView reuses `maxPageSize`; counts outside the supported range are normalized. Native ListBox keyboard modifiers follow the user's browser/OS.

New CSS tokens (all optional): `--cwd-list-background`, `--cwd-selected-background`, `--cwd-splitter-height`, `--cwd-splitter-handle-size`, `--cwd-splitter-handle-background`, `--cwd-focus`, `--cwd-accent`, `--cwd-chip-radius`, `--cwd-chip-background`, `--cwd-appbar-background`, `--cwd-rating-empty`, `--cwd-rating-filled`, `--cwd-spinner-track`, `--cwd-spinner-duration`. Existing border and floating-overlay tokens also apply. Structural and minor spacing overrides remain possible through `.cwd-*` selectors.

## Performance and limits

The existing desktop-only and components-only entries do not import these controls. ListView uses bounded pagination; ListBox, Timeline, Chips, ButtonGroup and menus mount supplied items, so bound host arrays for older computers. Closed dialogs and inactive demo tabs unmount. Splitter pointer changes invoke onChange while dragging; keep expensive pane children memoized if needed. Overlay observers/listeners exist only while an overlay is open and disconnect on close. Spinner animation exists only while mounted and stops under reduced-motion preference.

The complete library grew with twelve new controls, so the full-root JS budget is now 14,000 gzip bytes and combined CSS budget is 8,000. Desktop-only budgets are unchanged; the new controls entry has its own 9,000-byte JS budget including reused primitives and 2,000-byte CSS budget. These are transfer budgets, not RAM guarantees.
