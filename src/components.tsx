import { useFloating } from './floating';
import { useDesktopConfiguration, positiveInteger } from './config';
import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type FieldMeta = { label: string; hint?: string; error?: string };
function FieldShell({ id, label, hint, error, children }: FieldMeta & { id: string; children: ReactNode }) {
  return <div className={`cwd-field${error ? ' cwd-invalid' : ''}`}><label htmlFor={id}>{label}</label>{children}{(hint || error) && <span className="cwd-field-help" id={`${id}-help`}>{error || hint}</span>}</div>;
}
export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & FieldMeta;
/** Native input: text, email, password, number, date, time and search stay browser-owned. */
export function TextField({ label, hint, error, id, className = '', ...props }: TextFieldProps) {
  const uid = useId(), fieldId = id ?? uid;
  return <FieldShell id={fieldId} label={label} hint={hint} error={error}><input {...props} data-cwd-autofocus={props.autoFocus || undefined} id={fieldId} className={`cwd-input ${className}`} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], hint || error ? `${fieldId}-help` : ''].filter(Boolean).join(' ') || undefined} /></FieldShell>;
}
export function TextArea({ label, hint, error, id, className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldMeta) {
  const uid = useId(), fieldId = id ?? uid;
  return <FieldShell id={fieldId} label={label} hint={hint} error={error}><textarea {...props} data-cwd-autofocus={props.autoFocus || undefined} id={fieldId} className={`cwd-input ${className}`} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], hint || error ? `${fieldId}-help` : ''].filter(Boolean).join(' ') || undefined} /></FieldShell>;
}
export interface SelectOption { value: string; label: string; disabled?: boolean }
export function Select({ label, hint, error, id, options, className = '', ...props }: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & FieldMeta & { options: readonly SelectOption[] }) {
  const uid = useId(), fieldId = id ?? uid;
  return <FieldShell id={fieldId} label={label} hint={hint} error={error}><select {...props} data-cwd-autofocus={props.autoFocus || undefined} id={fieldId} className={`cwd-input ${className}`} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], hint || error ? `${fieldId}-help` : ''].filter(Boolean).join(' ') || undefined}>{options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select></FieldShell>;
}
/** Native datalist suggestions; free text is allowed, this is not a strict select. */
export function Autocomplete({ options, ...props }: Omit<TextFieldProps, 'list'> & { options: readonly string[] }) {
  const { behavior } = useDesktopConfiguration();
  const id = useId(); return <><TextField {...props} list={id} /><datalist id={id}>{options.slice(0, positiveInteger(behavior.maxSuggestions, 100)).map((option, i) => <option key={i} value={option} />)}</datalist></>;
}
type CheckProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string };
export function Checkbox({ label, className = '', ...props }: CheckProps) { return <label className={`cwd-check ${className}`}><input {...props} type="checkbox" /><span>{label}</span></label>; }
export function Switch({ label, className = '', ...props }: CheckProps) { return <label className={`cwd-switch ${className}`}><input {...props} type="checkbox" role="switch" /><span className="cwd-switch-track" aria-hidden="true" /><span>{label}</span></label>; }
export function RadioGroup({ label, options, value, onChange, disabled = false }: { label: string; options: readonly SelectOption[]; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const name = useId(); return <fieldset className="cwd-radio-group" disabled={disabled}><legend>{label}</legend>{options.map(option => <label className="cwd-check" key={option.value}><input type="radio" name={name} value={option.value} checked={value === option.value} disabled={option.disabled} onChange={() => onChange(option.value)} /><span>{option.label}</span></label>)}</fieldset>;
}
export function Slider({ label, ...props }: Omit<TextFieldProps, 'type'>) { return <TextField {...props} label={label} type="range" />; }
export function DatePicker(props: Omit<TextFieldProps, 'type'>) { return <TextField {...props} type="date" />; }
/** Selection only: does not read, preview, upload, or retain the selected files. */
export function FilePicker(props: Omit<TextFieldProps, 'type' | 'value' | 'defaultValue'>) { return <TextField {...props} type="file" />; }
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) { return <span className={`cwd-badge cwd-tone-${tone}`}>{children}</span>; }
export function Avatar({ name, size = 'medium', children }: { name: string; size?: 'small' | 'medium' | 'large'; children?: ReactNode }) { return <span className={`cwd-avatar cwd-avatar-${size}`} role="img" aria-label={name}>{children ?? (name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || '?')}</span>; }
export function Card({ title, description, children, footer }: { title: string; description?: string; children?: ReactNode; footer?: ReactNode }) { return <section className="cwd-card"><header><h3>{title}</h3>{description && <p>{description}</p>}</header>{children && <div className="cwd-card-body">{children}</div>}{footer && <footer>{footer}</footer>}</section>; }
export function Separator() { return <hr className="cwd-separator" />; }
export function Statistic({ label, value, detail }: { label: string; value: ReactNode; detail?: string }) { return <div className="cwd-statistic"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>; }
export function Progress({ label, value, max = 100 }: { label: string; value?: number; max?: number }) {
  const { messages } = useDesktopConfiguration();
  const id = useId(), safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  return <div className="cwd-progress"><label htmlFor={id}>{label}{value !== undefined && <span>{messages.percent(Math.min(safeMax, Math.max(0, Number.isFinite(value) ? value : 0)) / safeMax)}</span>}</label><progress id={id} max={safeMax} value={value === undefined ? undefined : Math.min(safeMax, Math.max(0, Number.isFinite(value) ? value : 0))} /></div>;
}
/** Intentionally static: no continuous shimmer or animation cost. */
export function Skeleton({ label, lines = 3 }: { label?: string; lines?: number }) { const { messages, behavior } = useDesktopConfiguration(); return <div className="cwd-skeleton" role="status" aria-label={label ?? messages.loading}>{Array.from({ length: Math.min(positiveInteger(behavior.maxSkeletonLines, 10), positiveInteger(lines, 3)) }, (_, i) => <span key={i} aria-hidden="true" />)}</div>; }
export function Alert({ title, children, tone = 'info', onDismiss }: { title: string; children?: ReactNode; tone?: Tone; onDismiss?: () => void }) { const { messages, icons } = useDesktopConfiguration(); return <div className={`cwd-alert cwd-tone-${tone}`} role={tone === 'danger' ? 'alert' : 'status'}><div><strong>{title}</strong>{children && <div>{children}</div>}</div>{onDismiss && <button type="button" className="cwd-icon-button" onClick={onDismiss} aria-label={messages.dismiss(title)}>{icons.close}</button>}</div>; }
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) { const { icons } = useDesktopConfiguration(); return <div className="cwd-empty-state"><span aria-hidden="true">{icons.empty}</span><h3>{title}</h3>{description && <p>{description}</p>}{action}</div>; }
export interface TabItem { id: string; label: string; content: ReactNode; disabled?: boolean }
/** Automatic activation; inactive panels unmount to keep the footprint bounded. */
export function Tabs({ items, label, defaultValue, value, onValueChange }: { items: readonly TabItem[]; label: string; defaultValue?: string; value?: string; onValueChange?: (id: string) => void }) {
  const { behavior } = useDesktopConfiguration();
  const uid = useId(), list = useRef<HTMLDivElement>(null), [internal, setInternal] = useState(defaultValue ?? items.find(i => !i.disabled)?.id);
  const selected = items.find(i => i.id === (value ?? internal) && !i.disabled)?.id ?? items.find(i => !i.disabled)?.id;
  function select(id: string) { setInternal(id); onValueChange?.(id); }
  return <div className="cwd-tabs"><div ref={list} className="cwd-tab-list" role="tablist" aria-label={label} onKeyDown={e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const buttons = Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[role=tab]:not(:disabled)') ?? []);
    if (!buttons.length) return;
    e.preventDefault(); const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (current + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus(); buttons[next].click();
  }}>{items.map((item, i) => <button type="button" role="tab" key={item.id} id={`${uid}-tab-${i}`} aria-controls={`${uid}-panel-${i}`} aria-selected={item.id === selected} tabIndex={item.id === selected ? 0 : -1} disabled={item.disabled} onClick={() => select(item.id)}>{item.label}</button>)}</div>{items.map((item, i) => <div key={item.id} role="tabpanel" tabIndex={0} id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-tab-${i}`} hidden={item.id !== selected} className="cwd-tab-panel">{item.id === selected || behavior.keepInactiveTabs ? item.content : null}</div>)}</div>;
}
export function Accordion({ items }: { items: readonly { id: string; title: string; content: ReactNode; defaultOpen?: boolean }[] }) {
  return <div className="cwd-accordion">{items.map(item => <Disclosure key={item.id} title={item.title} defaultOpen={item.defaultOpen}>{item.content}</Disclosure>)}</div>;
}
function Disclosure({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const { behavior } = useDesktopConfiguration();
  const [open, setOpen] = useState(defaultOpen);
  return <details open={open} onToggle={e => setOpen(e.currentTarget.open)}><summary>{title}</summary>{(open || behavior.keepCollapsed) && <div hidden={!open} className="cwd-disclosure-content">{children}</div>}</details>;
}
export function Breadcrumbs({ items, label }: { items: readonly { label: string; onSelect?: () => void }[]; label?: string }) { const { messages } = useDesktopConfiguration(); return <nav className="cwd-breadcrumbs" aria-label={label ?? messages.breadcrumb}><ol>{items.map((item, i) => <li key={i}>{i === items.length - 1 ? <span aria-current="page">{item.label}</span> : <button type="button" onClick={item.onSelect} disabled={!item.onSelect}>{item.label}</button>}</li>)}</ol></nav>; }
export function Pagination({ page, pageCount, onChange, label }: { page: number; pageCount: number; onChange: (page: number) => void; label?: string }) {
  const { messages } = useDesktopConfiguration();
  const count = Math.max(1, Math.floor(Number.isFinite(pageCount) ? pageCount : 1)), current = Math.max(1, Math.min(count, Number.isFinite(page) ? Math.floor(page) : 1));
  return <nav className="cwd-pagination" aria-label={label ?? messages.pagination}><button type="button" disabled={current === 1} onClick={() => onChange(current - 1)}>{messages.previous}</button><span aria-live="polite">{messages.page(current, count)}</span><button type="button" disabled={current === count} onClick={() => onChange(current + 1)}>{messages.next}</button></nav>;
}
export function Stepper({ steps, current }: { steps: readonly string[]; current: number }) { const { icons } = useDesktopConfiguration(); return <ol className="cwd-stepper">{steps.map((step, i) => <li key={i} aria-current={i === current ? 'step' : undefined} className={i < current ? 'cwd-step-complete' : ''}><span aria-hidden="true">{i < current ? icons.complete : i + 1}</span>{step}</li>)}</ol>; }
export interface TreeNode { id: string; label: string; children?: readonly TreeNode[] }
/** Native nested disclosure navigation, not an ARIA tree widget. Collapsed branches unmount. */
export function TreeView({ nodes, label, onSelect }: { nodes: readonly TreeNode[]; label: string; onSelect?: (id: string) => void }) { return <nav className="cwd-tree" aria-label={label}><ul>{nodes.map(node => <li key={node.id}>{node.children ? <Disclosure title={node.label}><TreeView nodes={node.children} label={node.label} onSelect={onSelect} /></Disclosure> : <button type="button" onClick={() => onSelect?.(node.id)}>{node.label}</button>}</li>)}</ul></nav>; }
export function Tooltip({ label, text }: { label: string; text: string }) {
  const { icons } = useDesktopConfiguration();
  const id = useId(), [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null), panel = useRef<HTMLSpanElement>(null), focused = useRef(false);
  useFloating(open, root, panel);
  return <span ref={root} className="cwd-tooltip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => { if (!focused.current) setOpen(false); }}><button type="button" className="cwd-icon-button" aria-label={label} aria-describedby={open ? id : undefined} onFocus={() => { focused.current = true; setOpen(true); }} onBlur={() => { focused.current = false; setOpen(false); }} onClick={() => setOpen(true)} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } }}>{icons.help}</button>{open && <span ref={panel} id={id} role="tooltip">{text}</span>}</span>;
}
export function Popover({ label, children }: { label: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null), button = useRef<HTMLButtonElement>(null), uid = useId(), [open, setOpen] = useState(false);
  useFloating(open, ref, panel);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  return <div className="cwd-popover" ref={ref} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }} onKeyDown={e => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); button.current?.focus(); } }}><button type="button" ref={button} aria-expanded={open} aria-controls={uid} onClick={() => setOpen(v => !v)}>{label}</button>{open && <div ref={panel} className="cwd-popover-content" id={uid} role="region" aria-label={label}>{children}</div>}</div>;
}
export interface MenuItem { id: string; label: string; onSelect: () => void; disabled?: boolean; danger?: boolean }
export function DropdownMenu({ label, items, disabled = false }: { label: string; items: readonly MenuItem[]; disabled?: boolean }) {
  const { icons } = useDesktopConfiguration();
  const [open, setOpen] = useState(false), root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null), uid = useId();
  useFloating(open, root, panel);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <div ref={root} className="cwd-dropdown" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}><button type="button" ref={trigger} disabled={disabled} aria-haspopup="menu" aria-expanded={open} aria-controls={uid} onClick={() => setOpen(v => !v)} onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); } }}>{label} <span aria-hidden="true">{icons.menu}</span></button>{open && <div ref={panel} id={uid} role="menu" aria-label={label} className="cwd-dropdown-panel" onKeyDown={e => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    const buttons = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    if (!buttons.length) return;
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault(); buttons[e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (current + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length].focus();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const ordered = [...buttons.slice(current + 1), ...buttons.slice(0, current + 1)];
      ordered.find(b => b.textContent?.toLowerCase().startsWith(e.key.toLowerCase()))?.focus();
    }
  }}>{items.map(item => <button type="button" role="menuitem" tabIndex={-1} key={item.id} disabled={item.disabled} className={item.danger ? 'cwd-danger-text' : ''} onClick={() => { close(); item.onSelect(); }}>{item.label}</button>)}</div>}</div>;
}
export interface DialogProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode; footer?: ReactNode; className?: string; style?: CSSProperties; closeOnEscape?: boolean; side?: 'left' | 'right' }
function ModalSurface({ onOpenChange, title, description, children, footer, drawer = false, className = '', style, closeOnEscape = true, side = 'right' }: Omit<DialogProps, 'open'> & { drawer?: boolean }) {
  const { messages, icons } = useDesktopConfiguration();
  const ref = useRef<HTMLDialogElement>(null), id = useId(), mounted = useRef(false);
  const opener = useRef<HTMLElement | null>(typeof document === 'undefined' ? null : document.activeElement as HTMLElement);
  useEffect(() => {
    const el = ref.current!; mounted.current = true; el.showModal();
    el.querySelector<HTMLElement>('[data-cwd-autofocus], [autofocus]')?.focus();
    return () => { mounted.current = false; if (el.open) el.close(); if (opener.current?.isConnected) opener.current.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className={`cwd-modal cwd-ui${drawer ? ' cwd-drawer' : ''} ${className}`} style={style} data-side={side} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined} onCancel={e => { e.preventDefault(); if (closeOnEscape) onOpenChange(false); }} onClose={() => { if (mounted.current && !ref.current?.open) onOpenChange(false); }} onKeyDown={e => {
    e.stopPropagation();
    if (e.key !== 'Tab') return;
    const controls = Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex],[contenteditable=true]') ?? []).filter(el => el.tabIndex >= 0 && !el.matches(':disabled') && el.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { e.preventDefault(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }} onPointerDown={e => e.stopPropagation()}><header><h2 id={`${id}-title`}>{title}</h2><button type="button" className="cwd-icon-button" aria-label={messages.close(title)} onClick={() => onOpenChange(false)}>{icons.close}</button></header><div className="cwd-modal-body">{description && <p id={`${id}-description`}>{description}</p>}{children}</div>{footer && <footer>{footer}</footer>}</dialog>;
}
/** Native dialog top layer: modal focus handling and background inertness are browser-owned. */
export function Dialog({ open, ...props }: DialogProps) { return open ? <ModalSurface {...props} /> : null; }
export function Drawer({ open, ...props }: DialogProps) { return open ? <ModalSurface {...props} drawer /> : null; }
export interface ToastItem { id: string; title: string; description?: string; tone?: Tone }
/** Controlled, explicit dismissal. No background timers. At most three notifications mount. */
export function ToastViewport({ items, onDismiss }: { items: readonly ToastItem[]; onDismiss: (id: string) => void }) { const { messages, behavior, icons } = useDesktopConfiguration(); return <section className="cwd-toasts cwd-ui" aria-label={messages.notifications} aria-live="polite" aria-relevant="additions text">{items.slice(-positiveInteger(behavior.maxToasts, 3)).map(item => <div className={`cwd-toast cwd-tone-${item.tone ?? 'info'}`} key={item.id}><div><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}</div><button type="button" className="cwd-icon-button" aria-label={messages.dismiss(item.title)} onClick={() => onDismiss(item.id)}>{icons.close}</button></div>)}</section>; }
export function ComponentTheme({ children, density = 'compact', style }: { children: ReactNode; density?: 'compact' | 'comfortable'; style?: CSSProperties }) { return <div className="cwd-ui" data-density={density} style={style}>{children}</div>; }
