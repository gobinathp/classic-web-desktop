import type { ReactNode, CSSProperties } from 'react';

const bound = (n: number, fallback: number) => Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
export interface MatrixAxis { id: string; label: string }
export interface NumericHeatmapProps {
  label: string; rows: readonly MatrixAxis[]; columns: readonly MatrixAxis[];
  values: readonly (readonly (number | null)[])[]; min?: number; max?: number;
  maxRows?: number; maxColumns?: number; missingLabel?: string;
  formatValue?: (value: number) => string; onCellSelect?: (rowId: string, columnId: string) => void;
  limitLabel?: (rows: number, totalRows: number, columns: number, totalColumns: number) => string;
}
/** Values remain readable without color; null/nonfinite values never become zero. */
export function NumericHeatmap({ label, rows, columns, values, min = -3, max = 3, maxRows = 30, maxColumns = 12, missingLabel = 'Not available', formatValue = String, onCellSelect, limitLabel = (r, rt, c, ct) => `Showing ${r}/${rt} rows and ${c}/${ct} columns` }: NumericHeatmapProps) {
  const shownRows = rows.slice(0, bound(maxRows, 30)), shownCols = columns.slice(0, bound(maxColumns, 12));
  return <div className="cwd-research-scroll" tabIndex={0} role="region" aria-label={label}><table className="cwd-research-table"><caption>{label}</caption><thead><tr><th scope="col">{label}</th>{shownCols.map(c => <th scope="col" key={c.id}>{c.label}</th>)}</tr></thead><tbody>{shownRows.map((r, i) => <tr key={r.id}><th scope="row">{r.label}</th>{shownCols.map((c, j) => {
    const value = values[i]?.[j], valid = typeof value === 'number' && Number.isFinite(value), text = valid ? formatValue(value) : missingLabel;
    const fraction = valid && Number.isFinite(min) && Number.isFinite(max) && max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : .5;
    const style: CSSProperties = valid ? { backgroundColor: `hsl(${fraction < .5 ? 205 : 28} 50% ${96 - Math.abs(fraction - .5) * 35}%)`, color: '#172d40' } : {};
    return <td key={c.id} style={style}>{onCellSelect ? <button type="button" className="cwd-research-cell" aria-label={`${r.label}, ${c.label}: ${text}`} onClick={() => onCellSelect(r.id, c.id)}>{text}</button> : text}</td>;
  })}</tr>)}</tbody></table><p>{limitLabel(shownRows.length, rows.length, shownCols.length, columns.length)}</p></div>;
}
export interface RelationshipNode { id: string; label: string; group?: string }
export interface RelationshipEdge { id: string; source: string; target: string; label: string }
export interface RelationshipGraphProps {
  label: string; nodes: readonly RelationshipNode[]; edges: readonly RelationshipEdge[];
  selectedId?: string; onSelect?: (id: string) => void; maxNodes?: number; maxEdges?: number;
  limitLabel?: (nodes: number, edges: number) => string; connectionsLabel?: string;
}
/** Deterministic circular layout: no force simulation, workers or animation loops. */
export function RelationshipGraph({ label, nodes, edges, selectedId, onSelect, maxNodes = 40, maxEdges = 80, limitLabel = (n, e) => `${n} nodes · ${e} links shown (bounded view)`, connectionsLabel = 'Connections' }: RelationshipGraphProps) {
  const visible = nodes.slice(0, bound(maxNodes, 40));
  const points = new Map(visible.map((n, i) => { const angle = i / Math.max(1, visible.length) * 2 * Math.PI - Math.PI / 2; return [n.id, { x: 250 + Math.cos(angle) * 180, y: 190 + Math.sin(angle) * 140 }]; }));
  const links: RelationshipEdge[] = [];
  for (const edge of edges) { if (links.length >= bound(maxEdges, 80)) break; if (points.has(edge.source) && points.has(edge.target)) links.push(edge); }
  const names = new Map(visible.map(n => [n.id, n.label]));
  return <section className="cwd-relationship" aria-label={label}><svg viewBox="0 0 500 380" aria-hidden="true" focusable="false">{links.map(e => { const a = points.get(e.source)!, b = points.get(e.target)!; return <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={e.source === selectedId || e.target === selectedId ? '#205f79' : '#93a5af'} strokeWidth="2" />; })}{visible.map(n => { const p = points.get(n.id)!; return <g key={n.id}><circle cx={p.x} cy={p.y} r="19" fill={n.id === selectedId ? '#205f79' : '#e8f2f5'} stroke="#205f79" /><text x={p.x} y={p.y + 34} textAnchor="middle" fill="#172d40" fontSize="12">{n.label}</text></g>; })}</svg><p>{limitLabel(visible.length, links.length)}</p><div className="cwd-research-nodes">{visible.map(n => <button type="button" key={n.id} aria-pressed={n.id === selectedId} onClick={() => onSelect?.(n.id)} disabled={!onSelect}>{n.label}{n.group ? ` · ${n.group}` : ''}</button>)}</div><details><summary>{connectionsLabel}</summary><ul>{links.map(e => <li key={e.id}>{names.get(e.source)} → {names.get(e.target)}: {e.label}</li>)}</ul></details></section>;
}
export interface ComparisonColumn { id: string; label: string }
export interface ComparisonRow { id: string; label: string; values: Readonly<Record<string, ReactNode>> }
export function ComparisonTable({ label, columns, rows, maxColumns = 8, maxRows = 40, missingLabel = 'Not available', limitLabel = (r: number, c: number) => `${r} rows · ${c} columns shown (bounded view)` }: { label: string; columns: readonly ComparisonColumn[]; rows: readonly ComparisonRow[]; maxColumns?: number; maxRows?: number; missingLabel?: string; limitLabel?: (rows: number, columns: number) => string }) {
  const cols = columns.slice(0, bound(maxColumns, 8)), shown = rows.slice(0, bound(maxRows, 40));
  return <div className="cwd-research-scroll" tabIndex={0} role="region" aria-label={label}><table className="cwd-research-table"><caption>{label}</caption><thead><tr><th scope="col">{label}</th>{cols.map(c => <th key={c.id} scope="col">{c.label}</th>)}</tr></thead><tbody>{shown.map(r => <tr key={r.id}><th scope="row">{r.label}</th>{cols.map(c => <td key={c.id}>{r.values[c.id] ?? missingLabel}</td>)}</tr>)}</tbody></table><p>{limitLabel(shown.length, cols.length)}</p></div>;
}
