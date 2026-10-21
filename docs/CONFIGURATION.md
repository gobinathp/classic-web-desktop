# Configuration and customization — v0.3

Classic styling and low-memory behavior are defaults, not application requirements. Existing consumers need no provider. Wrap a workspace in `DesktopProvider` when you want shared overrides; nested providers inherit omitted settings. Keep configuration and app definitions stable with module constants or `useMemo`.

```tsx
import { DesktopProvider, Desktop } from '@gobinathp/classic-web-desktop';
import '@gobinathp/classic-web-desktop/styles.css';

<DesktopProvider
  config={{
    locale: 'en',
    branding: { watermark: <strong>My workspace</strong>, footer: 'My organization' },
    messages: { start: 'Apps', workspace: 'My tools', close: title => `Close ${title}` },
    icons: { start: '◈' },
    behavior: { maxWindows: 4, keyboardStep: 8, pageSize: 10, maxToasts: 2 },
  }}
  theme={{ '--cwd-surface-background': '#245447', '--cwd-taskbar-background': '#193d33' }}
>
  <Desktop apps={apps} taskbarPosition="top" shortcutsPosition="right" />
</DesktopProvider>
```

Give the provider's parent an explicit height (for example `height: 100dvh`). The provider itself fills its parent. It has no persistence, network requests, timers, or global mutable configuration. Separate roots can use independent providers. Configurations are trusted application code; do not accept arbitrary theme CSS, functions, or React nodes from untrusted users.

## Text, branding, icons and locale

`messages` accepts partial overrides of every member of exported `defaultMessages`. This includes accessible labels, render errors, keyboard instructions, pagination, counts, percentages, and empty results. Dynamic messages are functions; no string templates are interpreted as HTML. Omitted messages retain English defaults. Translate `keyboardHint` to match any keyboard policy changes. `locale` sets the wrapper's HTML language and DataGrid string sorting locale; pass a valid BCP 47 locale. It does not translate app content or install a translation package. Native input/date formats follow the browser and operating system.

`branding.watermark` and `branding.footer` accept React nodes, including `null` to hide branding. All default UI glyphs are replaceable through `icons`. Avatar accepts `children` to replace its default initials. Application titles, content, icons, data, authentication, and services remain host supplied. Demo names, records, links, note limits and sample app positions live only in `demo/`.

## Behavior defaults

| Configuration key | Default | Purpose |
| --- | --- | --- |
| maxWindows / windowCeiling | 8 / 32 | Default open-window budget and configurable upper budget |
| minWidth / minHeight | 260 / 160 | Minimum window dimensions, reduced for smaller containers |
| defaultWidth / defaultHeight | 480 / 340 | New window size unless an app overrides it |
| cascadeOrigin / cascadeStep | 24 / 28 | Initial placement offset and spacing in pixels |
| keyboardStep | 16 | Alt+arrow move / Alt+Shift+arrow resize distance |
| keyboardEnabled | true | Enable window management shortcuts |
| doubleClickMaximize | true | Title bar double-click behavior |
| keepMinimized | false | Retain minimized app content; app.keepAlive takes precedence |
| keepInactiveTabs | false | Retain hidden tab content |
| keepCollapsed | false | Retain collapsed accordion/tree content |
| pageSize / maxPageSize | 20 / 100 | Default and maximum mounted DataGrid rows |
| maxSuggestions | 100 | Maximum native datalist suggestions |
| maxToasts | 3 | Maximum mounted notifications, newest first selection |
| maxSkeletonLines | 10 | Maximum static placeholder lines |

Desktop `maxWindows` and each app's size/position/keepAlive override corresponding defaults. Rendering counts use finite positive integers; invalid rendering counts fall back to documented defaults. Window counts are clamped to at least one and the configured ceiling; non-finite window counts fall back to eight. Window geometry remains finite, positive, and inside the measured container. Raising rendering budgets or preserving hidden contents can increase RAM consumption; the library does not constrain caller-owned datasets or queues. Lowering window limits removes excess windows and their content.

DataGrid supports controlled **zero-based** `page` with `onPageChange`, and `sort` (`{key, direction: 1 | -1}` or `null`) with `onSortChange`. Omit these for internal state. Sorting is local and copies the full array; for server-side paging/sorting supply prepared data and use the separate, **one-based** controlled Pagination component. Existing table sort and page behavior is preserved by default.

Dialog/Drawer accept `className`, `style`, and `closeOnEscape` (default true). Drawer accepts `side="left"` or `"right"` (default). Desktop supports top/bottom taskbars and left/right/hidden shortcuts. Changing layout does not automatically rearrange existing app windows.

## Styling and remaining constants

See [theme tokens](THEME-TOKENS.md) for surface, text, border, radius, shadow, typography, density and key dimension controls. Other spacing and responsive rules are normal CSS: use a provider class and override `.cwd-*` selectors after importing library CSS. No inline stylesheet injection or CSS-in-JS runtime is required. Desktop window geometry is inline because dragging controls it; use geometry configuration rather than overriding its inline position.

Not every implementation constant should become configuration. ARIA roles, focus trapping, standard navigation keys, escaped rendering, cleanup, unique IDs, clipping to the viewport, and native browser behavior remain correctness/accessibility rules. Border widths, minor spacing and breakpoints remain overridable stylesheet defaults. This library does not promise automatic RTL mirroring, arbitrary taskbar orientations, or obsolete-browser compatibility.

Open **Customization** in the demo to change branding, a green classic palette, partial French translations, taskbar placement, row/toast limits, keyboard distance, and content preservation. The component gallery continues to show all existing components.

## v0.4 additions

See [v0.4 controls](CONTROLS-V04.md) for new labels, rating glyph, resource limits and styling tokens. All use the same scoped provider.
