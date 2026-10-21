import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from './desktop';
import { Dialog, DropdownMenu, TextField } from './components';
import type { MenuItem, SelectOption } from './components';
import { positiveInteger, useDesktopConfiguration } from './config';
import { useFloating } from './floating';

export interface ListItem { id: string; label: string; description?: string; disabled?: boolean }
/** Host-owned data; only one page mounts. */
export function ListView({ label, items, value, onSelect, pageSize = 20 }: { label: string; items: readonly ListItem[]; value?: string; onSelect: (id: string) => void; pageSize?: number }) {
  const { messages: m, behavior: b } = useDesktopConfiguration();
  const [page, setPage] = useState(0), size = Math.min(positiveInteger(pageSize, 20), positiveInteger(b.maxPageSize, 100));
  const pages = Math.max(1, Math.ceil(items.length / size)), current = Math.min(page, pages - 1);
  return <section className="cwd-list-view" aria-label={label}><ul>{items.slice(current * size, (current + 1) * size).map(item => <li key={item.id}><button type="button" disabled={item.disabled} aria-current={item.id === value ? true : undefined} onClick={() => onSelect(item.id)}><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</button></li>)}</ul>{!items.length && <p>{m.noRecords}</p>}{pages > 1 && <div className="cwd-list-pager"><Button disabled={!current} onClick={() => setPage(current - 1)}>{m.previous}</Button><span aria-live="polite">{m.page(current + 1, pages)}</span><Button disabled={current === pages - 1} onClick={() => setPage(current + 1)}>{m.next}</Button></div>}</section>;
}
export interface PredefinedDialogProps {
  open: boolean; title: string; message: ReactNode; kind?: 'alert' | 'confirm' | 'prompt'; onClose: () => void; onConfirm: (value?: string) => void;
  confirmLabel?: string; cancelLabel?: string; inputLabel?: string; defaultValue?: string; required?: boolean;
}
export function PredefinedDialog({ open, ...props }: PredefinedDialogProps) { return open ? <Preset {...props} /> : null; }
function Preset({ title, message, kind = 'alert', onClose, onConfirm, confirmLabel, cancelLabel, inputLabel, defaultValue = '', required = false }: Omit<PredefinedDialogProps, 'open'>) {
  const { messages: m } = useDesktopConfiguration();
  const [value, setValue] = useState(defaultValue), [error, setError] = useState(false), id = useId();
  return <Dialog open title={title} onOpenChange={open => { if (!open) onClose(); }} footer={<>{kind !== 'alert' && <Button onClick={onClose}>{cancelLabel ?? m.cancel}</Button>}<Button type="submit" form={id} variant="primary">{confirmLabel ?? m.confirm}</Button></>}><form id={id} onSubmit={e => { e.preventDefault(); if (kind === 'prompt' && required && !value.trim()) { setError(true); e.currentTarget.querySelector('input')?.focus(); return; } onConfirm(kind === 'prompt' ? value : undefined); onClose(); }}>{message}{kind === 'prompt' && <TextField label={inputLabel ?? m.promptLabel} autoFocus value={value} onChange={e => { setValue(e.target.value); setError(false); }} error={error ? m.requiredValue : undefined} />}</form></Dialog>;
}
export function Splitter({ label, first, second, value, onChange, min = 15, max = 85, orientation = 'horizontal', style }: { label: string; first: ReactNode; second: ReactNode; value: number; onChange: (percent: number) => void; min?: number; max?: number; orientation?: 'horizontal' | 'vertical'; style?: CSSProperties }) {
  const root = useRef<HTMLDivElement>(null), drag = useRef<number | null>(null), id = useId();
  const low = Math.max(0, Math.min(100, Number.isFinite(min) ? min : 15)), high = Math.max(low, Math.min(100, Number.isFinite(max) ? max : 85));
  const clamp = (n: number) => Math.max(low, Math.min(high, n)), current = clamp(Number.isFinite(value) ? value : 50), horizontal = orientation === 'horizontal';
  const tracks = 'minmax(0,' + current + 'fr) var(--cwd-splitter-handle-size,8px) minmax(0,' + (100 - current) + 'fr)';
  return <div ref={root} className="cwd-splitter" data-orientation={orientation} style={{ ...style, gridTemplateColumns: horizontal ? tracks : undefined, gridTemplateRows: horizontal ? undefined : tracks }}><div id={id} className="cwd-split-pane">{first}</div><div role="separator" tabIndex={0} aria-label={label} aria-orientation={horizontal ? 'vertical' : 'horizontal'} aria-valuemin={low} aria-valuemax={high} aria-valuenow={current} aria-controls={id} className="cwd-split-handle" onKeyDown={e => {
    if (e.key === 'Escape' && drag.current !== null) { onChange(drag.current); drag.current = null; e.stopPropagation(); return; }
    const backwards = horizontal ? 'ArrowLeft' : 'ArrowUp', forwards = horizontal ? 'ArrowRight' : 'ArrowDown';
    if (![backwards, forwards, 'Home', 'End'].includes(e.key)) return;
    e.preventDefault(); e.stopPropagation(); onChange(e.key === 'Home' ? low : e.key === 'End' ? high : clamp(current + (e.key === backwards ? -1 : 1) * (e.shiftKey ? 10 : 1)));
  }} onPointerDown={e => { if (e.button !== 0) return; e.preventDefault(); e.stopPropagation(); e.currentTarget.focus(); drag.current = current; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (drag.current === null || !root.current) return; const r = root.current.getBoundingClientRect(), extent = horizontal ? r.width : r.height; if (extent) onChange(clamp(((horizontal ? e.clientX - r.left : e.clientY - r.top) / extent) * 100)); }} onPointerUp={e => { drag.current = null; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }} onPointerCancel={() => { if (drag.current !== null) onChange(drag.current); drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} /><div className="cwd-split-pane">{second}</div></div>;
}
export interface TimelineItem { id: string; title: string; time?: string; dateTime?: string; content?: ReactNode }
export function Timeline({ label, items }: { label: string; items: readonly TimelineItem[] }) { return <ol className="cwd-timeline" aria-label={label}>{items.map(item => <li key={item.id}><strong>{item.title}</strong>{item.time && <time dateTime={item.dateTime}>{item.time}</time>}{item.content}</li>)}</ol>; }
export function ButtonGroup({ label, items, value, onChange }: { label: string; items: readonly SelectOption[]; value: string; onChange: (value: string) => void }) {
  const root = useRef<HTMLDivElement>(null), enabled = items.filter(item => !item.disabled), focusValue = enabled.some(item => item.value === value) ? value : enabled[0]?.value;
  return <div ref={root} className="cwd-button-group" role="group" aria-label={label} onKeyDown={e => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return; const buttons = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []); if (!buttons.length) return; e.preventDefault(); e.stopPropagation(); const i = buttons.indexOf(document.activeElement as HTMLButtonElement), next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length; buttons[next].focus(); buttons[next].click(); }}>{items.map(item => <Button key={item.value} disabled={item.disabled} aria-pressed={value === item.value} tabIndex={item.value === focusValue ? 0 : -1} onClick={() => onChange(item.value)}>{item.label}</Button>)}</div>;
}
export function SplitButton({ label, menuLabel, onClick, items, disabled = false }: { label: string; menuLabel: string; onClick: () => void; items: readonly MenuItem[]; disabled?: boolean }) { return <div className="cwd-split-button"><Button disabled={disabled} onClick={onClick}>{label}</Button><DropdownMenu label={menuLabel} items={items} disabled={disabled} /></div>; }
export interface ChipItem { id: string; label: string; disabled?: boolean }
export function Chips({ label, items, selected = [], onSelectionChange, onRemove }: { label: string; items: readonly ChipItem[]; selected?: readonly string[]; onSelectionChange?: (ids: string[]) => void; onRemove?: (id: string) => void }) {
  const { messages: m, icons } = useDesktopConfiguration();
  return <ul className="cwd-chips" tabIndex={-1} aria-label={label}>{items.map(item => <li key={item.id}>{onSelectionChange ? <button type="button" disabled={item.disabled} aria-pressed={selected.includes(item.id)} onClick={() => onSelectionChange(selected.includes(item.id) ? selected.filter(id => id !== item.id) : [...selected, item.id])}>{item.label}</button> : <span>{item.label}</span>}{onRemove && <button type="button" disabled={item.disabled} aria-label={m.remove(item.label)} onClick={e => { const chip = e.currentTarget.closest('li'), list = chip?.parentElement; const next = chip?.nextElementSibling?.querySelector<HTMLButtonElement>('button:not(:disabled)') ?? chip?.previousElementSibling?.querySelector<HTMLButtonElement>('button:not(:disabled)'); (next ?? list)?.focus(); onRemove(item.id); }}>{icons.close}</button>}</li>)}</ul>;
}
export function ListBox({ label, options, value, onChange, multiple = false, size = 5, disabled = false }: { label: string; options: readonly SelectOption[]; value: readonly string[]; onChange: (values: string[]) => void; multiple?: boolean; size?: number; disabled?: boolean }) {
  const id = useId(), { behavior } = useDesktopConfiguration();
  return <div className="cwd-field"><label htmlFor={id}>{label}</label><select className="cwd-input cwd-listbox" id={id} multiple={multiple} size={Math.max(2, Math.min(positiveInteger(behavior.maxListBoxRows, 20), positiveInteger(size, 5)))} value={multiple ? [...value] : value[0] ?? ''} disabled={disabled} onChange={e => onChange(Array.from(e.target.selectedOptions, option => option.value))}>{options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select></div>;
}
export function AppBar({ title, leading, children, actions }: { title: string; leading?: ReactNode; children?: ReactNode; actions?: ReactNode }) { return <header className="cwd-appbar">{leading}<strong>{title}</strong>{children}<div className="cwd-appbar-actions">{actions}</div></header>; }
export function Rating({ label, value, onChange, max = 5, disabled = false, formatLabel }: { label: string; value: number; onChange: (value: number) => void; max?: number; disabled?: boolean; formatLabel?: (value: number, max: number) => string }) {
  const { messages: m, behavior, icons } = useDesktopConfiguration(), name = useId(), count = Math.min(positiveInteger(behavior.maxRating, 10), positiveInteger(max, 5));
  return <fieldset className="cwd-rating" disabled={disabled}><legend>{label}</legend>{Array.from({ length: count }, (_, i) => <label key={i}><input type="radio" name={name} checked={value === i + 1} onChange={() => onChange(i + 1)} aria-label={(formatLabel ?? m.rating)(i + 1, count)} /><span aria-hidden="true" data-filled={i < value}>{icons.rating}</span></label>)}</fieldset>;
}
export function Spinner({ label, size = 'medium' }: { label?: string; size?: 'small' | 'medium' }) { const { messages: m } = useDesktopConfiguration(); return <span className={'cwd-spinner cwd-spinner-' + size} role="status"><span className="cwd-spinner-ring" aria-hidden="true" /><span className="cwd-spinner-label">{label ?? m.loading}</span></span>; }
export function ContextMenu({ label, items, children }: { label: string; items: readonly MenuItem[]; children: ReactNode }) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null), root = useRef<HTMLDivElement>(null), anchor = useRef<HTMLSpanElement>(null), panel = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), opener = useRef<HTMLElement | null>(null), id = useId();
  useFloating(!!point, anchor, panel, point);
  const close = (restore: boolean) => { setPoint(null); if (restore) (opener.current?.isConnected ? opener.current : trigger.current)?.focus(); };
  useEffect(() => { if (!point) return; (panel.current?.querySelector<HTMLButtonElement>('button:not(:disabled)') ?? panel.current)?.focus(); const outside = (e: PointerEvent) => { if (!panel.current?.contains(e.target as Node) && !trigger.current?.contains(e.target as Node)) close(false); }; document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside); }, [point]);
  function open(x: number, y: number) { const r = root.current!.getBoundingClientRect(); opener.current = document.activeElement as HTMLElement; setPoint({ x: x - r.left, y: y - r.top }); }
  return <div ref={root} className="cwd-context" onContextMenu={e => { if ((e.target as HTMLElement).closest('input,textarea,[contenteditable=true]')) return; e.preventDefault(); open(e.clientX, e.clientY); }} onKeyDown={e => { if (e.key === 'ContextMenu' || e.shiftKey && e.key === 'F10') { e.preventDefault(); e.stopPropagation(); const r = (document.activeElement as HTMLElement).getBoundingClientRect(); open(r.left, r.bottom); } }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPoint(null); }}>{children}<button ref={trigger} type="button" className="cwd-button" aria-haspopup="menu" aria-expanded={!!point} aria-controls={id} onClick={e => { if (point) { close(true); return; } const r = e.currentTarget.getBoundingClientRect(); open(r.left, r.bottom); }}>{label}</button>{point && <span ref={anchor} className="cwd-context-anchor" style={{ left: point.x, top: point.y }}><div ref={panel} id={id} role="menu" tabIndex={-1} aria-label={label} className="cwd-dropdown-panel" onKeyDown={e => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
    if (e.key === 'Tab') { close(true); return; }
    const buttons = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []); if (!buttons.length) return;
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); buttons[e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length].focus(); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) [...buttons.slice(i + 1), ...buttons.slice(0, i + 1)].find(button => button.textContent?.toLocaleLowerCase().startsWith(e.key.toLocaleLowerCase()))?.focus();
  }}>{items.map(item => <button key={item.id} type="button" role="menuitem" tabIndex={-1} disabled={item.disabled} className={item.danger ? 'cwd-danger-text' : ''} onClick={() => { close(true); item.onSelect(); }}>{item.label}</button>)}</div></span>}</div>;
}
