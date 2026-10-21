# Theme tokens

Set these CSS custom properties on `DesktopProvider` through its typed `theme` prop, or on your own CSS ancestor. Defaults preserve the classic theme. `--cwd-border` overrides border colors globally. `--cwd-font-family`, `--cwd-display-font`, `--cwd-statistic-font`, and `--cwd-font-size` control typography. Geometry: `--cwd-taskbar-height`, `--cwd-launcher-width`, `--cwd-shortcut-width`, `--cwd-dialog-width`, `--cwd-drawer-width`. Density: `--cwd-control-height`, `--cwd-space`, `--cwd-comfortable-control-height`, `--cwd-comfortable-space`, `--cwd-touch-control-height`.

The following surface tokens are optional. Multiple defaults indicate contextual states in the existing stylesheet. For spacing, borders, breakpoint rules, or any other CSS property, scope ordinary CSS overrides beneath your provider class; all `.cwd-*` selectors remain public styling hooks. Forced-colors system colors are retained for accessibility.

| Token | Default(s) |
| --- | --- |
| `--cwd-accordion-border-radius` | `3px` |
| `--cwd-accordion-summary-background` | `linear-gradient(#f7fafe,#e6eff8)` |
| `--cwd-accordion-summary-color` | `#345b7c` |
| `--cwd-active-titlebar-background` | `linear-gradient(#f5fbff,#c6ddf1)` |
| `--cwd-active-titlebar-h2-color` | `#112e50` |
| `--cwd-active-titlebar-h2-text-shadow` | `0 1px #fff` |
| `--cwd-alert-border-radius` | `3px` |
| `--cwd-avatar-background` | `linear-gradient(#f2f8fe,#d5e6f5)` |
| `--cwd-avatar-border-radius` | `4px` |
| `--cwd-avatar-color` | `#2e5d87` |
| `--cwd-badge-border-radius` | `3px` |
| `--cwd-breadcrumbs-aria-current-color` | `#2c4256` |
| `--cwd-breadcrumbs-button-color` | `#2b6394` |
| `--cwd-breadcrumbs-li-li-before-color` | `#92a7b9` |
| `--cwd-breadcrumbs-ol-color` | `#4f6d86` |
| `--cwd-button-background` | `linear-gradient(#fff,#dce7f2)` |
| `--cwd-button-border-radius` | `3px` |
| `--cwd-button-danger-background` | `linear-gradient(#fff8f6,#f3d5d1)` |
| `--cwd-button-danger-color` | `#923c35` |
| `--cwd-button-ghost-color` | `#315f87` |
| `--cwd-button-hover-not-disabled-background` | `#e7f3ff` |
| `--cwd-button-primary-background` | `linear-gradient(#386c9a,#285d8c)` |
| `--cwd-button-primary-color` | `#fff` |
| `--cwd-button-primary-hover-not-disabled-background` | `#326d9f` |
| `--cwd-button-primary-hover-not-disabled-color` | `#fff` |
| `--cwd-button-primary-text-shadow` | `0 1px #234e76` |
| `--cwd-card-background` | `#fff` |
| `--cwd-card-border-radius` | `4px` |
| `--cwd-card-footer-background` | `#f5f8fc` |
| `--cwd-card-h3-color` | `#284e70` |
| `--cwd-card-header-background` | `linear-gradient(#fff,#f5f8fc)` |
| `--cwd-card-header-p-color` | `#647b8f` |
| `--cwd-desktop-button-danger-color` | `#923c35` |
| `--cwd-desktop-button-ghost-color` | `#315f87` |
| `--cwd-desktop-button-primary-color` | `#fff` |
| `--cwd-drawer-border-radius` | `0` |
| `--cwd-dropdown-panel-button-color` | `#305373` |
| `--cwd-dropdown-panel-button-hover-background` | `#e5f0fa` |
| `--cwd-dropdown-panel-danger-text-color` | `#a33a35` |
| `--cwd-empty-state-background` | `#f8fbfe` |
| `--cwd-empty-state-border-radius` | `3px` |
| `--cwd-empty-state-h3-color` | `#345976` |
| `--cwd-empty-state-p-color` | `#486175` |
| `--cwd-empty-state-span-color` | `#7f9fb9` |
| `--cwd-field-help-color` | `#5d7387` |
| `--cwd-field-label-color` | `#35516b` |
| `--cwd-grid-caption-color` | `#4d647a` |
| `--cwd-grid-color` | `#182e42` |
| `--cwd-grid-tbody-tr-hover-background` | `#e5f0fb` |
| `--cwd-grid-tbody-tr-nth-child-even-background` | `#f4f8fc` |
| `--cwd-grid-th-background` | `linear-gradient(#f7f9fc,#e0e7ef)` |
| `--cwd-grid-th-button-span-color` | `#526f88` |
| `--cwd-icon-button-background` | `linear-gradient(#fff,#e5eef7)` |
| `--cwd-icon-button-border-radius` | `3px` |
| `--cwd-icon-button-color` | `#335b7d` |
| `--cwd-input-aria-invalid-true-background` | `#fffafa` |
| `--cwd-input-background` | `#fff` |
| `--cwd-input-border-radius` | `3px` |
| `--cwd-input-box-shadow` | `inset 0 1px 2px #183b5b08` |
| `--cwd-input-color` | `#253d52` |
| `--cwd-input-disabled-background` | `#edf1f5` |
| `--cwd-input-disabled-color` | `#687e90` |
| `--cwd-input-file-selector-button-background` | `linear-gradient(#fff,#dce8f3)` |
| `--cwd-input-file-selector-button-border-radius` | `2px` |
| `--cwd-input-file-selector-button-color` | `#284966` |
| `--cwd-input-placeholder-color` | `#6d7e8d` |
| `--cwd-invalid-field-help-color` | `#a43131` |
| `--cwd-launcher-background` | `#f6faff` |
| `--cwd-launcher-border-radius` | `5px 5px 0 0` |
| `--cwd-launcher-box-shadow` | `3px -2px 8px #102e5355` |
| `--cwd-launcher-footer-background` | `#e2edf8` |
| `--cwd-launcher-heading-background` | `linear-gradient(#5789ba,#27588c)` |
| `--cwd-launcher-heading-color` | `#fff` |
| `--cwd-launcher-nav-button-hover-background` | `#d7e8f8` |
| `--cwd-launcher-nav-span-color` | `#2e6a9e` |
| `--cwd-modal-backdrop-background` | `#16365066` |
| `--cwd-modal-background` | `#f9fbfe` |
| `--cwd-modal-body-p-color` | `#5c7388` |
| `--cwd-modal-border-radius` | `5px` |
| `--cwd-modal-box-shadow` | `0 9px 30px #102e5540` |
| `--cwd-modal-color` | `#243e55` |
| `--cwd-modal-footer-background` | `#edf4fa` |
| `--cwd-modal-header-background` | `linear-gradient(#e6f1fb,#cbdff1)` |
| `--cwd-notice-background` | `#fff9dc` |
| `--cwd-notice-box-shadow` | `1px 2px 5px #1234` |
| `--cwd-optional-modern-controls-color` | `#223b50` |
| `--cwd-original-classic-theme-no-external-fonts-background` | `#245b91` |
| `--cwd-pager-background` | `#eaf1f8` |
| `--cwd-pagination-background` | `#eef4fa` |
| `--cwd-pagination-border-radius` | `3px` |
| `--cwd-pagination-button-background` | `linear-gradient(#fff,#e0ebf5)` |
| `--cwd-pagination-button-border-radius` | `3px` |
| `--cwd-pagination-button-color` | `#2b5273` |
| `--cwd-panel-background` | `#fff` |
| `--cwd-panel-color` | `#182e42` |
| `--cwd-panel-h3-background` | `linear-gradient(#eff6fc,#cedfef)` |
| `--cwd-popover-content-background` | `#fff` |
| `--cwd-popover-content-border-radius` | `3px` |
| `--cwd-popover-content-box-shadow` | `1px 3px 8px #183c6325` |
| `--cwd-progress-progress-background` | `#e4ecf4` |
| `--cwd-progress-progress-border-radius` | `3px` |
| `--cwd-progress-progress-moz-progress-bar-background` | `#457eb2` |
| `--cwd-progress-progress-webkit-progress-bar-background` | `#e4ecf4` |
| `--cwd-progress-progress-webkit-progress-value-background` | `linear-gradient(#7da6cb,#4077a8)` |
| `--cwd-resize-background` | `repeating-linear-gradient(135deg,transparent 0 3px,#7694af 3px 4px)` |
| `--cwd-shortcuts-button-border-radius` | `3px` |
| `--cwd-shortcuts-button-color` | `#fff` |
| `--cwd-shortcuts-button-hover-background` | `#ffffff20` |
| `--cwd-shortcuts-button-span-first-child-color` | `#e6f3ff` |
| `--cwd-shortcuts-button-span-first-child-text-shadow` | `1px 2px #123e68` |
| `--cwd-shortcuts-button-text-shadow` | `1px 1px #173c65` |
| `--cwd-skeleton-span-background` | `#e2eaf3` |
| `--cwd-skeleton-span-border-radius` | `2px` |
| `--cwd-start-background` | `linear-gradient(#7ca578,#3b754d 50%,#2b5f40)` |
| `--cwd-start-border-radius` | `0 9px 9px 0` |
| `--cwd-start-text-shadow` | `1px 1px #21432d` |
| `--cwd-statistic-background` | `linear-gradient(#fff,#eef5fb)` |
| `--cwd-statistic-border-radius` | `3px` |
| `--cwd-statistic-small-color` | `#657a8d` |
| `--cwd-statistic-span-color` | `#5f7a91` |
| `--cwd-statistic-strong-color` | `#254e73` |
| `--cwd-stepper-aria-current-color` | `#245c8c` |
| `--cwd-stepper-aria-current-span-background` | `#326e9f` |
| `--cwd-stepper-aria-current-span-color` | `#fff` |
| `--cwd-stepper-li-color` | `#4d6579` |
| `--cwd-stepper-li-span-background` | `#edf3f8` |
| `--cwd-stepper-li-span-border-radius` | `50%` |
| `--cwd-stepper-step-complete-span-background` | `#e9f4ee` |
| `--cwd-stepper-step-complete-span-color` | `#356947` |
| `--cwd-surface-background` | `linear-gradient(125deg,#326da2 0%,#245b91 50%,#184672 100%)` |
| `--cwd-switch-input-checked-switch-track-background` | `#356fa6` |
| `--cwd-switch-track-after-background` | `white` |
| `--cwd-switch-track-after-border-radius` | `50%` |
| `--cwd-switch-track-background` | `#c4d1dd` |
| `--cwd-switch-track-border-radius` | `9px` |
| `--cwd-tab-list-background` | `linear-gradient(#f3f8fc,#e2edf7)` |
| `--cwd-tab-list-button-aria-selected-true-background` | `#fff` |
| `--cwd-tab-list-button-aria-selected-true-box-shadow` | `inset 0 2px #4d87b9` |
| `--cwd-tab-list-button-aria-selected-true-color` | `#214e78` |
| `--cwd-tab-list-button-background` | `#e4edf6` |
| `--cwd-tab-list-button-border-radius` | `4px 4px 0 0` |
| `--cwd-tab-list-button-color` | `#466681` |
| `--cwd-taskbar-background` | `linear-gradient(#668fba 0%,#36699e 12%,#275689 60%,#214a77)` |
| `--cwd-taskbar-color` | `#fff` |
| `--cwd-tasks-button-aria-pressed-true-background` | `#173f6b` |
| `--cwd-tasks-button-aria-pressed-true-box-shadow` | `inset 1px 1px 3px #122f51` |
| `--cwd-tasks-button-background` | `#386da5` |
| `--cwd-tasks-button-border-radius` | `3px` |
| `--cwd-tasks-button-color` | `#fff` |
| `--cwd-title-icon-color` | `#216998` |
| `--cwd-titlebar-h2-color` | `#344d65` |
| `--cwd-toast-box-shadow` | `0 2px 4px #1b3b5a10` |
| `--cwd-toolbar-background` | `linear-gradient(#f5f9fd,#dce7f2)` |
| `--cwd-tooltip-role-tooltip-background` | `#29465e` |
| `--cwd-tooltip-role-tooltip-border-radius` | `3px` |
| `--cwd-tooltip-role-tooltip-box-shadow` | `0 2px 5px #1c375a20` |
| `--cwd-tooltip-role-tooltip-color` | `#fff` |
| `--cwd-tree-button-color` | `#355e7f` |
| `--cwd-tree-button-hover-background` | `#edf5fc` |
| `--cwd-tree-summary-background` | `#f4f8fc` |
| `--cwd-watermark-color` | `#dbeeff` |
| `--cwd-window-actions-button-background` | `linear-gradient(#fff,#c0d7ef)` |
| `--cwd-window-actions-button-border-radius` | `3px` |
| `--cwd-window-actions-button-hover-background` | `#edf7ff` |
| `--cwd-window-actions-close-hover-background` | `#af3c39` |
| `--cwd-window-actions-close-hover-color` | `#fff` |
| `--cwd-window-active-box-shadow` | `0 0 0 1px #284e77,2px 4px 9px #102e5355` |
| `--cwd-window-background` | `#d6e3f1` |
| `--cwd-window-border-radius` | `5px 5px 2px 2px` |
| `--cwd-window-box-shadow` | `2px 3px 7px #0d294c45` |
| `--cwd-window-content-background` | `#fff` |
| `--cwd-window-content-border-radius` | `1px` |
