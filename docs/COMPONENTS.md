# Component catalog — v0.4

All content is trusted React content. Text props render through React escaping. Components do not fetch, upload, store, or authenticate data. Import the corresponding CSS explicitly. Types are exported alongside components.

## Desktop and actions (desktop entry)

| Component | Main props | Notes |
| --- | --- | --- |
| Desktop | apps, initialOpen, maxWindows, label, style | Bounded window lifecycle; see README |
| Button | standard button props; variant, size, loading | variants: default/primary/danger/ghost; loading disables |
| IconButton | label, children, Button props | Requires an accessible label |
| Panel | title, children | Titled section |
| Toolbar | label, children | Action group; ordinary Tab order |
| DataGrid<T> | rows, columns, rowKey, caption, pageSize | Opt-in sortValue per column; paginated semantic table |

## Forms (components entry)

Use `ComponentTheme` around standalone controls. TextField/TextArea/Select link their visible label and hint/error IDs automatically. Standard native props such as required, disabled, name, value/defaultValue and onChange are supported. Inputs have browser-native behavior, not a form-validation or network layer.

| Component | Main props | Behavior |
| --- | --- | --- |
| TextField | label, hint?, error?, native input props | Text/email/password/number/search/etc. |
| TextArea | label, hint?, error?, native textarea props | Resizable multiline input |
| Select | label, options, native select props | Options have value, label, disabled? |
| Autocomplete | TextField props, options: string[] | Native datalist, first 100 suggestions by default, accepts free text |
| Checkbox | label, native checkbox props | Controlled or uncontrolled |
| Switch | label, native checkbox props | Checkbox with switch semantics |
| RadioGroup | label, options, value, onChange, disabled? | Controlled native group |
| Slider | label, min, max, step, value/onChange | Native range input |
| DatePicker | label, min, max, value/onChange | Native date input; appearance varies by browser |
| FilePicker | label, accept, multiple, onChange | Selection only; no file reading, validation, upload or preview |

`error` is supplied by the host; it is not a validator. File `accept` is a picker hint, not a security check. Enforce upload rules on your server. For text controls inside Dialog/Drawer, `autoFocus` is applied after the native modal opens.

## Navigation

| Component | Main props | Behavior |
| --- | --- | --- |
| Tabs | label, items, value?/defaultValue?, onValueChange? | items: id,label,content,disabled?; arrows/Home/End, automatic activation |
| Accordion | items | id,title,content,defaultOpen?; multiple sections may open |
| Breadcrumbs | items, label? | label/onSelect? per item; final item is current page |
| Pagination | page, pageCount, onChange, label? | One-based controlled page number |
| Stepper | steps: string[], current | Zero-based current step; informational |
| TreeView | label, nodes, onSelect? | Native nested disclosures and buttons, not an ARIA tree widget |

Tabs unmount inactive panel content. Accordions and trees unmount collapsed children. Keep valuable state in the host. The remaining descriptors/data still exist in the caller; DOM limits do not free caller-owned data. Use unique stable IDs for tab items, tree siblings, and accordion items. Tree nodes have id,label,children?; avoid cyclic or unbounded trees.

## Display and feedback

| Component | Main props | Behavior |
| --- | --- | --- |
| Badge | tone?, children | neutral/info/success/warning/danger |
| Avatar | name, size? | Initials only; no image requests |
| Card | title, description?, children?, footer? | Content container |
| Separator | none | Semantic horizontal rule |
| Statistic | label, value, detail? | Static metric; no data polling |
| Progress | label, value?, max? | Native progress; omit value for indeterminate |
| Skeleton | label?, lines? | Static placeholder; capped at 10 lines |
| Alert | title, children?, tone?, onDismiss? | danger announces as alert; other tones as status |
| EmptyState | title, description?, action? | Empty-data guidance |

## Overlays and notifications

| Component | Main props | Behavior |
| --- | --- | --- |
| Tooltip | label, text | Help button; hover/focus, Escape; text only |
| Popover | label, children | Inline disclosure panel; Tab navigation, outside click/Escape |
| DropdownMenu | label, items | id,label,onSelect,disabled?,danger?; arrows/Home/End/initial-letter matching |
| Dialog | open, onOpenChange, title, description?, children, footer? | Native modal with background inertness |
| Drawer | same as Dialog | Native modal anchored to the right |
| ToastViewport | items, onDismiss | Last three entries by default; explicit dismiss, no timer |
| ComponentTheme | children, density?, style? | compact or comfortable density; no persistence |

Dialog and Drawer require `HTMLDialogElement.showModal()` and unmount when closed. Open state is controlled by the host. Background interaction is disabled by the browser while open, and focus returns to the opener on close. Escape requests `onOpenChange(false)`; the host must update its state. Dialog/Drawer are modal, while desktop windows remain nonmodal.

Tooltip/Popover/DropdownMenu are inline, not portaled. They measure clipping ancestors and the viewport, flip vertically, constrain width and scroll when available height is limited. Hidden or fully clipped triggers still require the host to provide visible space. Set `--cwd-floating-max-width` to override the default 280px cap. They are not arbitrary-position context menus. ToastViewport is in normal document flow; the host chooses its placement. Toast items have id,title,description?,tone?. Its configurable rendering cap (default three) does not constrain your external queue; keep your queue bounded too.

## Example

```tsx
import { useState } from 'react';
import { ComponentTheme, Dialog, TextField, Switch } from '@gobinathp/classic-web-desktop/components';
import { Button } from '@gobinathp/classic-web-desktop/desktop';
import '@gobinathp/classic-web-desktop/styles.css';

export function Preferences() {
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState(true);
  return <ComponentTheme>
    <Button onClick={() => setOpen(true)}>Preferences</Button>
    <Dialog open={open} onOpenChange={setOpen} title="Preferences">
      <TextField label="Display name" defaultValue="Gobinath" autoFocus />
      <Switch label="Notifications" checked={notify} onChange={e => setNotify(e.target.checked)} />
    </Dialog>
  </ComponentTheme>;
}
```

Shared labels, icons, budgets and lifecycle defaults are configurable through `DesktopProvider`. See [configuration](CONFIGURATION.md) for controlled DataGrid state and modal/layout additions.

## Twelve v0.4 controls

See [v0.4 control APIs and demos](CONTROLS-V04.md) for ListView, PredefinedDialog, Splitter, Timeline, ButtonGroup, SplitButton, Chips, ListBox, ContextMenu, AppBar, Rating and Spinner.
