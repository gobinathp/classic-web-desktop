# AlignMe desktop demo

The main demo is an application built with the library: a personal goals, habits and daily planning workspace. It uses the classic desktop window manager, shared configuration and existing controls. It is an interactive frontend example, not a deployed AlignMe backend or a complete implementation of the product roadmap.

- `/` opens AlignMe with Overview and Today windows.
- `/gallery.html` retains the component studio, v0.4 control demos and customization examples.
- Local preview: `npm run build && npm run preview`.

## Working flows

| App | What works |
| --- | --- |
| My overview | Live counts of active goals, today's completed actions and habits checked today; average manually reported goal progress |
| Goals | Create and edit goals, measurable outcomes, life areas, target dates and progress; search and filter by life area |
| Today | Add a goal-linked or personal action; check/uncheck completion; remove actions |
| Habits | Add a habit; toggle any day in the last seven days; check-ins feed the weekly review |
| Weekly review | Derived check-in chart and completion totals; editable session reflection |
| Planning assistant | Clearly labelled deterministic planning templates; add a suggested action to Today |
| Preferences | Change the workspace display name; review demo scope and open the separate component gallery |

## State and scope

Sample records are fictional and seeded relative to the browser's current local date. Historical check-ins and initial progress are illustrative, not personal analytics. Goal progress is manually reported; checking a task does not automatically change its goal's percentage. Charts and dashboard totals derive from the current session's data.

Saved changes are owned above the desktop windows. Closing or minimizing a window can unmount its contents without losing saved goals, tasks, habits, preferences or reflection. Unsaved form drafts and view filters are local to their window. Reloading or navigating to the gallery resets AlignMe. No localStorage, cookies, cloud synchronization, sign-in, billing, team permissions, external assets, AI API, or network-backed services are used. The planning assistant is not generative AI.

For bounded demonstration data, the UI supports 30 goals, 50 actions and 12 habits; text fields have length limits. These are demo choices and do not change library limits. The demo has no background polling or timers. The AlignMe and gallery bundles are built separately, so opening AlignMe does not load the gallery's React bundle.

Production work would require authenticated persistence, authorization, server-side validation, synchronization, and carefully scoped AI integration. None of those are implied by this preview. Pricing tiers, organizational dashboards, recruiter APIs, SWOT workflows and a full OKR model are outside this demo's scope.

## Validation

Browser tests exercise goal creation and editing, blank-form rejection, linked tasks, minimized/closed window state retention, habits, review totals, reflections, template actions, preferences, reload reset, accessibility scans across all seven apps and mobile window containment. The existing gallery regression suite now runs at `/gallery.html`. Desktop window contents are keyboard-focusable so read-only dashboards can be scrolled without a mouse.
