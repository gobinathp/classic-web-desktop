import { createContext, useContext, useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/** Plain text and React nodes only; no HTML parsing or network-backed translations. */
export const defaultMessages = {
  confirm: 'OK', cancel: 'Cancel', promptLabel: 'Value', requiredValue: 'Enter a value.', remove: (label: string) => 'Remove ' + label, rating: (value: number, max: number) => value + ' of ' + max + ' stars',
  desktop: 'Classic desktop', applications: 'Desktop applications', openWindows: 'Open windows',
  startApplications: 'Start applications', start: 'Start', workspace: 'Your workspace',
  dismissNotification: 'Dismiss notification', notifications: 'Notifications', actions: 'Actions',
  loading: 'Loading', breadcrumb: 'Breadcrumb', pagination: 'Pagination', previous: 'Previous', next: 'Next', noRecords: 'No records.',
  appError: 'This app could not render. Close and reopen its window to retry.',
  keyboardHint: 'Alt and arrow keys move this window. Add Shift to resize. Use the title bar buttons to close, minimize, or maximize.',
  close: (title: string) => `Close ${title}`, minimize: (title: string) => `Minimize ${title}`,
  maximize: (title: string) => `Maximize ${title}`, restore: (title: string) => `Restore ${title}`,
  dismiss: (title: string) => `Dismiss ${title}`,
  windowLimit: (limit: number) => `Window limit reached (${limit}). Close a window before opening another.`,
  windowCount: (count: number, limit: number) => `${count} of ${limit} windows open`,
  page: (page: number, count: number) => `Page ${page} of ${count}`,
  records: (count: number) => `${count} records`,
  percent: (value: number) => `${Math.round(value * 100)}%`,
};
export const defaultBehavior = {
  maxWindows: 8, windowCeiling: 32, minWidth: 260, minHeight: 160,
  defaultWidth: 480, defaultHeight: 340, cascadeOrigin: 24, cascadeStep: 28,
  keyboardStep: 16, keyboardEnabled: true, doubleClickMaximize: true,
  keepMinimized: false, keepInactiveTabs: false, keepCollapsed: false,
  pageSize: 20, maxPageSize: 100, maxSuggestions: 100, maxToasts: 3, maxSkeletonLines: 10, maxRating: 10, maxListBoxRows: 20,
};
export const defaultIcons = { rating: '★', app: '▣', start: '▦', minimize: '_', maximize: '□', restore: '❐', close: '×', empty: '▱', help: '?', menu: '▾', complete: '✓', sortAscending: '↑', sortDescending: '↓', sortNone: '↕' };
export interface DesktopConfiguration {
  messages: typeof defaultMessages;
  behavior: typeof defaultBehavior;
  icons: Record<keyof typeof defaultIcons, ReactNode>;
  branding: { watermark: ReactNode; footer: ReactNode };
  locale?: string;
}
export type ConfigurationOverrides = { [K in Exclude<keyof DesktopConfiguration, 'locale'>]?: Partial<DesktopConfiguration[K]> } & { locale?: string };
export type ThemeStyle = CSSProperties & { [token: `--cwd-${string}`]: string | number | undefined };
const defaults: DesktopConfiguration = {
  messages: defaultMessages, behavior: defaultBehavior, icons: defaultIcons,
  branding: { watermark: <><strong>classic<span>desktop</span></strong><small>A familiar place. A fresh foundation.</small></>, footer: 'Classic Web Desktop · React' },
};
const ConfigurationContext = /* @__PURE__ */ createContext(defaults);
export function useDesktopConfiguration() { return useContext(ConfigurationContext); }
/** Nested providers inherit their parent. Keep config objects stable to avoid needless updates. */
export function DesktopProvider({ config, theme, children, className = '' }: { config?: ConfigurationOverrides; theme?: ThemeStyle; children: ReactNode; className?: string }) {
  const parent = useDesktopConfiguration();
  const value = useMemo(() => ({
    ...parent, locale: config?.locale ?? parent.locale,
    messages: { ...parent.messages, ...config?.messages }, behavior: { ...parent.behavior, ...config?.behavior },
    icons: { ...parent.icons, ...config?.icons }, branding: { ...parent.branding, ...config?.branding },
  }), [parent, config]);
  return <ConfigurationContext.Provider value={value}><div className={`cwd-theme ${className}`} lang={value.locale} style={theme}>{children}</div></ConfigurationContext.Provider>;
}
/** Resource budgets must be finite positive integers. Invalid values use the documented default. */
export function positiveInteger(value: number, fallback: number) { return Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback; }
