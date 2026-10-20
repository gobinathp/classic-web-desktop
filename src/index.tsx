import { Component, memo, useCallback, useEffect, useId, useMemo, useReducer, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, Dispatch, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { fitRect, reducer, windowLimit } from './model';
import type { Action, Bounds, DesktopState, Rect, WindowState } from './model';
export type { Bounds, Rect } from './model';

export interface AppContext { close: () => void; minimize: () => void }
export interface DesktopApp {
  /** Unique, stable identifier. */
  id: string;
  title: string;
  icon?: ReactNode;
  render: (context: AppContext) => ReactNode;
  initialSize?: Partial<Bounds>;
  initialPosition?: { x: number; y: number };
  /** Keep minimized contents mounted. Default false to release memory. */
  keepAlive?: boolean;
}
export interface DesktopProps {
  apps: readonly DesktopApp[];
  initialOpen?: readonly string[];
  maxWindows?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
  /** Called without persisting any state internally. */
  onWindowsChange?: (windows: readonly WindowState[]) => void;
}
const EMPTY: readonly string[] = [];
const AppContent = memo(function AppContent({ app, context }: { app: DesktopApp; context: AppContext }) {
  return <>{app.render(context)}</>;
});
class AppBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert" className="cwd-error">This app could not render. Close and reopen its window to retry.</p> : this.props.children; }
}
function paint(el: HTMLElement, r: Rect) {
  el.style.left = `${r.x}px`; el.style.top = `${r.y}px`;
  el.style.width = `${r.width}px`; el.style.height = `${r.height}px`;
}
function DesktopWindow({ app, win, active, order, bounds, dispatch }: {
  app: DesktopApp; win: WindowState; active: boolean; order: number; bounds: Bounds; dispatch: Dispatch<Action>;
}) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const hintId = useId();
  const frame = useRef(0);
  const gesture = useRef<{ id: number; x: number; y: number; rect: Rect; next: Rect; resize: boolean; target: HTMLElement } | null>(null);
  const rect = win.maximized ? { x: 0, y: 0, ...bounds } : win.rect;
  const context = useMemo(() => ({ close: () => dispatch({ type: 'close', id: app.id }), minimize: () => dispatch({ type: 'minimize', id: app.id }) }), [app.id, dispatch]);
  useEffect(() => {
    if (active && ref.current && !ref.current.contains(document.activeElement)) ref.current.focus({ preventScroll: true });
  }, [active, win.minimized]);
  useEffect(() => () => { cancelAnimationFrame(frame.current); frame.current = 0; gesture.current = null; }, []);
  // Bounds/mode changes cancel an in-flight gesture instead of leaving stale geometry.
  useEffect(() => {
    cancelAnimationFrame(frame.current); frame.current = 0; gesture.current = null;
    if (ref.current) paint(ref.current, win.maximized ? { x: 0, y: 0, ...bounds } : win.rect);
  }, [bounds.width, bounds.height, win.rect, win.maximized, win.minimized]);
  function start(e: PointerEvent<HTMLElement>, resize: boolean) {
    if (e.button !== 0 || win.maximized || (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, rect: win.rect, next: win.rect, resize, target: e.currentTarget };
  }
  function move(e: PointerEvent<HTMLElement>) {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    g.next = fitRect(g.resize ? { ...g.rect, width: g.rect.width + dx, height: g.rect.height + dy } : { ...g.rect, x: g.rect.x + dx, y: g.rect.y + dy }, bounds);
    if (!frame.current) frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      if (ref.current && gesture.current) paint(ref.current, gesture.current.next);
    });
  }
  function finish(cancel = false) {
    const g = gesture.current;
    if (!g) return;
    cancelAnimationFrame(frame.current); frame.current = 0; gesture.current = null;
    if (g.target.hasPointerCapture(g.id)) g.target.releasePointerCapture(g.id);
    if (ref.current) paint(ref.current, cancel ? g.rect : g.next);
    if (!cancel) dispatch({ type: 'rect', id: app.id, rect: g.next, bounds });
  }
  function key(e: KeyboardEvent) {
    if (e.key === 'Escape' && gesture.current) { e.preventDefault(); finish(true); return; }
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'F4') { e.preventDefault(); context.close(); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) || win.maximized) return;
    e.preventDefault();
    const dx = e.key === 'ArrowLeft' ? -16 : e.key === 'ArrowRight' ? 16 : 0;
    const dy = e.key === 'ArrowUp' ? -16 : e.key === 'ArrowDown' ? 16 : 0;
    dispatch({ type: 'rect', id: app.id, bounds, rect: e.shiftKey ? { ...win.rect, width: win.rect.width + dx, height: win.rect.height + dy } : { ...win.rect, x: win.rect.x + dx, y: win.rect.y + dy } });
  }
  if (win.minimized && !app.keepAlive) return null;
  return <section ref={ref} role="dialog" aria-modal="false" aria-labelledby={titleId} aria-describedby={hintId} tabIndex={-1}
    hidden={win.minimized} className={`cwd-window${active ? ' cwd-active' : ''}`} data-window={app.id}
    style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height, zIndex: order + 1 }}
    onPointerDownCapture={() => dispatch({ type: 'focus', id: app.id })} onFocusCapture={() => dispatch({ type: 'focus', id: app.id })} onKeyDown={key}>
    <header className="cwd-titlebar" onPointerDown={e => start(e, false)} onPointerMove={move} onPointerUp={() => finish()} onPointerCancel={() => finish(true)} onLostPointerCapture={() => finish(true)}
      onDoubleClick={e => { if (!(e.target as HTMLElement).closest('button')) dispatch({ type: 'maximize', id: app.id }); }}>
      <span aria-hidden="true" className="cwd-title-icon">{app.icon ?? '▣'}</span><h2 id={titleId}>{app.title}</h2>
      <div className="cwd-window-actions">
        <button type="button" aria-label={`Minimize ${app.title}`} onClick={context.minimize}>_</button>
        <button type="button" aria-label={`${win.maximized ? 'Restore' : 'Maximize'} ${app.title}`} onClick={() => dispatch({ type: 'maximize', id: app.id })}>{win.maximized ? '❐' : '□'}</button>
        <button type="button" className="cwd-close" aria-label={`Close ${app.title}`} onClick={context.close}>×</button>
      </div>
    </header>
    <span id={hintId} className="cwd-sr">Alt and arrow keys move this window. Add Shift to resize. Use the title bar buttons to close, minimize, or maximize.</span>
    <div className="cwd-window-content"><AppBoundary><AppContent app={app} context={context} /></AppBoundary></div>
    {!win.maximized && <div className="cwd-resize" aria-hidden="true" onPointerDown={e => start(e, true)} onPointerMove={move} onPointerUp={() => finish()} onPointerCancel={() => finish(true)} onLostPointerCapture={() => finish(true)} />}
  </section>;
}

/** Desktop owns window state only; app data and authentication remain with the host. */
export function Desktop({ apps, initialOpen = EMPTY, maxWindows = 8, label = 'Classic desktop', className = '', style, onWindowsChange }: DesktopProps) {
  const root = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const launcher = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [bounds, setBounds] = useState<Bounds>({ width: 800, height: 560 });
  const [state, dispatch] = useReducer(reducer, { windows: [], active: null } as DesktopState);
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const initialized = useRef(false);
  const limit = windowLimit(maxWindows);
  const appMap = useMemo(() => {
    const map = new Map<string, DesktopApp>();
    for (const app of apps) {
      if (!app.id || map.has(app.id)) throw new Error('Desktop apps require nonempty, unique IDs.');
      map.set(app.id, app);
    }
    return map;
  }, [apps]);
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const measure = () => {
      const next = { width: el.clientWidth, height: el.clientHeight };
      if (!next.width || !next.height) return;
      setBounds(previous => previous.width === next.width && previous.height === next.height ? previous : next);
      dispatch({ type: 'bounds', bounds: next });
      if (!initialized.current) {
        initialized.current = true;
        for (const id of initialOpen) {
          const app = appMap.get(id);
          if (app) dispatch({ type: 'open', id, bounds: next, limit, size: app.initialSize, position: app.initialPosition });
        }
      }
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure); observer.observe(el); return () => observer.disconnect();
    }
    window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure);
    // Initial windows are intentionally read once, at mount.
  }, []);
  useEffect(() => { dispatch({ type: 'sync', ids: [...appMap.keys()], limit }); }, [appMap, limit]);
  useEffect(() => { onWindowsChange?.(state.windows); }, [state.windows, onWindowsChange]);
  const open = useCallback((app: DesktopApp) => {
    if (state.windows.length >= limit && !state.windows.some(w => w.id === app.id)) {
      setNotice(`Window limit reached (${limit}). Close a window before opening another.`);
    } else { setNotice(''); dispatch({ type: 'open', id: app.id, bounds, limit, size: app.initialSize, position: app.initialPosition }); }
    setMenu(false);
  }, [state.windows, limit, bounds]);
  useEffect(() => {
    if (!menu) return;
    launcher.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const outside = (e: globalThis.PointerEvent) => {
      if (!launcher.current?.contains(e.target as Node) && !startButton.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, [menu]);
  // Return focus to a stable control when the final active window disappears.
  const previousActive = useRef<string | null>(null);
  useEffect(() => {
    if (previousActive.current && !state.active && (document.activeElement === document.body || root.current?.contains(document.activeElement))) startButton.current?.focus();
    previousActive.current = state.active;
  }, [state.active]);
  return <div ref={root} className={`cwd-desktop ${className}`} style={style} role="region" aria-label={label}>
    <div className="cwd-surface" ref={surface}>
      <nav className="cwd-shortcuts" aria-label="Desktop applications">
        {apps.map(app => <button type="button" key={app.id} onClick={() => open(app)}><span aria-hidden="true">{app.icon ?? '▣'}</span><span>{app.title}</span></button>)}
      </nav>
      <div className="cwd-watermark" aria-hidden="true"><strong>classic<span>desktop</span></strong><small>A familiar place. A fresh foundation.</small></div>
      {state.windows.map((win, order) => { const app = appMap.get(win.id); return app ? <DesktopWindow key={win.id} app={app} win={win} active={state.active === win.id} order={order} bounds={bounds} dispatch={dispatch} /> : null; })}
      {notice && <div className="cwd-notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
    </div>
    <footer className="cwd-taskbar">
      <button type="button" ref={startButton} className="cwd-start" aria-expanded={menu} aria-controls={menuId} onClick={() => setMenu(value => !value)}><span aria-hidden="true">▦</span> <strong>Start</strong></button>
      <nav className="cwd-tasks" aria-label="Open windows">{state.windows.map(win => <button type="button" key={win.id} aria-pressed={state.active === win.id && !win.minimized} onClick={() => dispatch({ type: state.active === win.id && !win.minimized ? 'minimize' : 'focus', id: win.id })}>{appMap.get(win.id)?.title}</button>)}</nav>
      <span className="cwd-tray" aria-label={`${state.windows.length} of ${limit} windows open`}>{state.windows.length} / {limit}</span>
    </footer>
    {menu && <div id={menuId} ref={launcher} className="cwd-launcher" onKeyDown={e => {
      if (e.key === 'Escape') { setMenu(false); startButton.current?.focus(); }
    }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget) && e.relatedTarget !== startButton.current) setMenu(false); }}>
      <div className="cwd-launcher-heading">Your workspace</div><nav aria-label="Start applications">{apps.map(app => <button type="button" key={app.id} onClick={() => open(app)}><span aria-hidden="true">{app.icon ?? '▣'}</span>{app.title}</button>)}</nav>
      <div className="cwd-launcher-footer">Classic Web Desktop · React</div>
    </div>}
  </div>;
}

export function Button({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button type={type} className={`cwd-button ${className}`} {...props} />; }
export function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="cwd-panel"><h3>{title}</h3><div>{children}</div></section>; }
export function Toolbar({ children, label = 'Actions' }: { children: ReactNode; label?: string }) { return <div className="cwd-toolbar" role="group" aria-label={label}>{children}</div>; }
export interface GridColumn<T> { key: string; title: string; render: (row: T) => ReactNode }
/** Paginated semantic table. Only one page of rows is mounted. Input data stays host-owned. */
export function DataGrid<T>({ rows, columns, rowKey, pageSize = 20, caption }: { rows: readonly T[]; columns: readonly GridColumn<T>[]; rowKey: (row: T) => string; pageSize?: number; caption: string }) {
  const [page, setPage] = useState(0);
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.min(100, Math.floor(pageSize))) : 20;
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pages - 1);
  return <div className="cwd-grid"><div className="cwd-table-scroll"><table><caption>{caption}</caption><thead><tr>{columns.map(col => <th scope="col" key={col.key}>{col.title}</th>)}</tr></thead><tbody>{rows.slice(current * size, (current + 1) * size).map(row => <tr key={rowKey(row)}>{columns.map(col => <td key={col.key}>{col.render(row)}</td>)}</tr>)}</tbody></table>{rows.length === 0 && <p className="cwd-empty">No records.</p>}</div><div className="cwd-pager"><Button disabled={!current} onClick={() => setPage(current - 1)}>Previous</Button><span aria-live="polite">Page {current + 1} of {pages} · {rows.length} records</span><Button disabled={current === pages - 1} onClick={() => setPage(current + 1)}>Next</Button></div></div>;
}
