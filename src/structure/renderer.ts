import { safeLimit, validateStructure } from './protocol';
import type { StructureRequest, StructureStyle } from './protocol';
import type { GLViewer } from '3dmol';
let viewer: GLViewer | undefined, generation = 0, initialView: number[] | undefined;
const root = document.getElementById('view')!;
function status(state: string, extra: Record<string, unknown> = {}) { parent.postMessage({ kind: 'cwd-structure-status', status: state, ...extra }, location.origin); }
function style(value: StructureStyle) {
  if (!viewer || !['stick', 'sphere', 'cartoon'].includes(value)) return;
  viewer.setStyle({}, value === 'cartoon' ? { cartoon: { color: 'spectrum' } } : value === 'sphere' ? { sphere: { scale: .3 } } : { stick: { radius: .15 } }); viewer.render();
}
async function load(request: StructureRequest) {
  const token = ++generation;
  try {
    const maxBytes = safeLimit(request.maxBytes, 2_000_000, 5_000_000), maxAtoms = safeLimit(request.maxAtoms, 500, 50000);
    validateStructure(request.data, request.format, maxBytes);
    if (request.format === 'smiles') {
      const { default: Drawer } = await import('smiles-drawer'); if (token !== generation) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); root.replaceChildren(svg);
      const tree = await new Promise<Parameters<InstanceType<typeof Drawer.SvgDrawer>['draw']>[0]>((resolve, reject) => Drawer.parse(request.data, resolve, reject));
      const drawer = new Drawer.SvgDrawer({ width: 600, height: 350 });
      // Count parse-tree atoms before invoking the layout algorithm.
      let atoms = 0; const queue: unknown[] = [tree];
      while (queue.length) { const node = queue.pop() as { atom?: unknown; next?: unknown; branches?: unknown[] }; if (!node) continue; if (node.atom) atoms++; if (atoms > maxAtoms) throw new Error('Structure exceeds the configured atom limit.'); if (node.next) queue.push(node.next); if (node.branches) queue.push(...node.branches); }
      drawer.draw(tree, svg, 'light');
      status('ready', { atoms }); return;
    }
    // Bound parsing work before calling the engine; only one supplied model is displayed.
    if (request.format === 'pdb' && (request.data.match(/^(?:ATOM  |HETATM)/gm)?.length ?? 0) > maxAtoms) throw new Error('Structure exceeds the configured atom limit.');
    if (request.format === 'sdf') {
      const first = request.data.split('$$$$', 1)[0], lines = first.split(/\r?\n/);
      const declared = /V2000/.test(lines[3] ?? '') ? Number(lines[3].slice(0, 3)) : Number(first.match(/M  V30 COUNTS (\d+)/)?.[1]);
      if (!Number.isInteger(declared) || declared < 1) throw new Error('Invalid atom count in MOL/SDF data.');
      if (declared > maxAtoms) throw new Error('Structure exceeds the configured atom limit.');
    }
    const module = await import('3dmol'); if (token !== generation) return;
    const engine = (module as unknown as { default?: typeof module }).default ?? module;
    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl2') && !probe.getContext('webgl')) throw new Error('WebGL is unavailable. Enable browser graphics acceleration or use the 2D view.');
    (probe.getContext('webgl2') ?? probe.getContext('webgl'))?.getExtension('WEBGL_lose_context')?.loseContext();
    viewer = engine.createViewer(root, { backgroundColor: 'white', antialias: false });
    const model = viewer.addModel(request.data, request.format, { multimodel: false });
    const atoms = model.selectedAtoms({});
    if (!atoms.length) throw new Error('No atoms were parsed from this structure.');
    if (atoms.length > maxAtoms) throw new Error('Structure exceeds the configured atom limit.');
    if (atoms.some(a => ![a.x, a.y, a.z].every(Number.isFinite))) throw new Error('Structure contains invalid coordinates.');
    style(request.style); viewer.zoomTo(); viewer.render(); initialView = viewer.getView();
    status('ready', { atoms: atoms.length });
  } catch (error) { viewer?.clear(); status('error', { message: error instanceof Error ? error.message : 'Structure rendering failed.' }); }
}
window.addEventListener('message', event => {
  if (event.source !== parent || event.origin !== location.origin || !event.data) return;
  if (event.data.kind === 'cwd-structure-load' && generation === 0 && typeof event.data.data === 'string') void load(event.data);
  if (event.data.kind === 'cwd-structure-style') style(event.data.style);
  if (event.data.kind === 'cwd-structure-command' && viewer) {
    const a = event.data.action;
    if (a === 'reset' && initialView) viewer.setView(initialView);
    else if (a === 'zoom-in') viewer.zoom(1.2);
    else if (a === 'zoom-out') viewer.zoom(.8);
    else if (a === 'left' || a === 'right') viewer.rotate(a === 'left' ? -15 : 15, 'y');
    else if (a === 'up' || a === 'down') viewer.rotate(a === 'up' ? -15 : 15, 'x');
    viewer.render();
  }
});
window.addEventListener('pagehide', () => { ++generation; viewer?.clear(); const canvas = root.querySelector('canvas'); const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl'); gl?.getExtension('WEBGL_lose_context')?.loseContext(); viewer = undefined; root.replaceChildren(); });
status('boot');
