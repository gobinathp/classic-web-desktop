import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { safeLimit, validateStructure } from './structure/protocol';
import type { StructureCommand, StructureFormat, StructureStyle } from './structure/protocol';
export interface StructureLabels {
  load2d: string; load3d: string; unload: string; loading: string; unavailable: string; retry: string;
  left: string; right: string; up: string; down: string; zoomIn: string; zoomOut: string; reset: string;
  style: string; stick: string; sphere: string; cartoon: string; loaded: (atoms: number) => string;
}
const defaults: StructureLabels = { load2d: 'View 2D', load3d: 'Load 3D', unload: 'Unload structure', loading: 'Loading structure renderer…', unavailable: 'Structure unavailable', retry: 'Retry', left: 'Rotate left', right: 'Rotate right', up: 'Rotate up', down: 'Rotate down', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Reset view', style: 'Representation', stick: 'Sticks', sphere: 'Spheres', cartoon: 'Protein cartoon', loaded: n => `Structure loaded · ${n} atoms` };
export interface StructureViewerBaseProps {
  title: string; description: string; provenance: string;
  /** Same-origin URL of the bundled structure/renderer.html assets. */
  rendererUrl: string; maxAtoms?: number; maxBytes?: number; height?: number;
  labels?: Partial<StructureLabels>; className?: string; style?: CSSProperties;
  onStatusChange?: (status: 'loading' | 'ready' | 'error', message: string) => void;
}
export interface MoleculeViewerProps extends StructureViewerBaseProps { smiles?: string; sdf?: string }
export interface ProteinStructureViewerProps extends StructureViewerBaseProps { pdb?: string }
export function MoleculeViewer({ smiles, sdf, ...props }: MoleculeViewerProps) {
  // Data-keyed child resets selected view and destroys old frames on record change.
  return <Viewer key={(smiles ?? '') + '\u0000' + (sdf ?? '')} {...props} smiles={smiles} coordinates={sdf} protein={false} />;
}
export function ProteinStructureViewer({ pdb, ...props }: ProteinStructureViewerProps) { return <Viewer key={pdb ?? ''} {...props} coordinates={pdb} protein />; }
function Viewer({ smiles, coordinates, protein, ...props }: StructureViewerBaseProps & { smiles?: string; coordinates?: string; protein: boolean }) {
  const [mode, setMode] = useState<'2d' | '3d' | null>(smiles ? '2d' : null), [attempt, setAttempt] = useState(0);
  const labels = { ...defaults, ...props.labels };
  return <section className={'cwd-structure ' + (props.className ?? '')} style={props.style} aria-label={props.title}><h3>{props.title}</h3><p>{props.description}</p><div className="cwd-structure-toolbar">{!protein && <button type="button" disabled={!smiles} aria-pressed={mode === '2d'} onClick={() => setMode('2d')}>{labels.load2d}</button>}<button type="button" disabled={!coordinates} aria-pressed={mode === '3d'} onClick={() => setMode('3d')}>{labels.load3d}</button>{mode && <button type="button" onClick={() => setMode(null)}>{labels.unload}</button>}</div>{mode ? <Frame key={mode + attempt} {...props} data={mode === '2d' ? smiles! : coordinates!} format={mode === '2d' ? 'smiles' : protein ? 'pdb' : 'sdf'} labels={labels} retry={() => setAttempt(n => n + 1)} /> : <p role="status">{!smiles && !coordinates ? labels.unavailable : 'Choose a view to load the supplied structure.'}</p>}<p className="cwd-structure-provenance">{props.provenance}</p></section>;
}
function Frame({ data, format, labels, retry, ...props }: StructureViewerBaseProps & { data: string; format: StructureFormat; labels: StructureLabels; retry: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null), callback = useRef(props.onStatusChange); callback.current = props.onStatusChange;
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; text: string }>({ status: 'loading', text: labels.loading });
  const [url, setUrl] = useState(''), [representation, setRepresentation] = useState<StructureStyle>(format === 'pdb' ? 'cartoon' : 'stick'), id = useId();
  const maxBytes = safeLimit(props.maxBytes, 2_000_000, 5_000_000), maxAtoms = safeLimit(props.maxAtoms, format === 'pdb' ? 20000 : 500, 50000);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const update = (status: 'loading' | 'ready' | 'error', text: string) => { setState({ status, text }); callback.current?.(status, text); };
    try {
      validateStructure(data, format, maxBytes);
      const resolved = new URL(props.rendererUrl, window.location.href);
      if (resolved.origin !== window.location.origin || !['http:', 'https:'].includes(resolved.protocol)) throw new Error('Renderer assets must be served from this application’s origin.');
      setUrl(resolved.href); update('loading', labels.loading);
    } catch (e) { update('error', (e as Error).message); return; }
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || !event.data || event.data.kind !== 'cwd-structure-status') return;
      if (event.data.status === 'boot') {
        frame.current?.contentWindow?.postMessage({ kind: 'cwd-structure-load', data, format, maxBytes, maxAtoms, style: format === 'pdb' ? 'cartoon' : 'stick' }, window.location.origin);
      } else if (event.data.status === 'ready' && Number.isFinite(event.data.atoms)) { clearTimeout(timeout); update('ready', labels.loaded(event.data.atoms)); }
      else if (event.data.status === 'error') { clearTimeout(timeout); update('error', String(event.data.message).slice(0, 300)); }
    }
    window.addEventListener('message', receive);
    timeout = setTimeout(() => update('error', 'Renderer did not respond. Check the asset URL and content security policy.'), 30000);
    return () => { clearTimeout(timeout); window.removeEventListener('message', receive); };
  }, [data, format, props.rendererUrl, maxBytes, maxAtoms]);
  function send(action: StructureCommand) { frame.current?.contentWindow?.postMessage({ kind: 'cwd-structure-command', action }, window.location.origin); }
  return <><p role={state.status === 'error' ? 'alert' : 'status'}>{state.text}</p>{state.status === 'error' ? <button type="button" onClick={retry}>{labels.retry}</button> : url && <iframe ref={frame} title={props.title + (format === 'smiles' ? ' 2D structure' : ' 3D structure')} src={url} sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" className="cwd-structure-frame" style={{ height: safeLimit(props.height, 320, 1200) }} />}{state.status === 'ready' && format !== 'smiles' && <><div className="cwd-structure-toolbar" aria-label="Structure controls">{([['left', labels.left], ['right', labels.right], ['up', labels.up], ['down', labels.down], ['zoom-in', labels.zoomIn], ['zoom-out', labels.zoomOut], ['reset', labels.reset]] as const).map(([action, label]) => <button type="button" key={action} onClick={() => send(action)}>{label}</button>)}</div><label htmlFor={id}>{labels.style}</label><select id={id} value={representation} onChange={e => { const style = e.target.value as StructureStyle; setRepresentation(style); frame.current?.contentWindow?.postMessage({ kind: 'cwd-structure-style', style }, window.location.origin); }}>{format === 'pdb' && <option value="cartoon">{labels.cartoon}</option>}<option value="stick">{labels.stick}</option><option value="sphere">{labels.sphere}</option></select></>}</>;
}
