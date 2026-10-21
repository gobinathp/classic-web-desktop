export interface Rect { x: number; y: number; width: number; height: number }
export interface Bounds { width: number; height: number }
export interface WindowState { id: string; rect: Rect; minimized: boolean; maximized: boolean }
export interface DesktopState { windows: WindowState[]; active: string | null }
export interface GeometryPolicy { minWidth?: number; minHeight?: number; defaultWidth?: number; defaultHeight?: number; cascadeOrigin?: number; cascadeStep?: number; windowCeiling?: number }
export type Action = (
  | { type: 'open'; id: string; bounds: Bounds; limit: number; size?: Partial<Bounds>; position?: { x: number; y: number } }
  | { type: 'focus' | 'close' | 'minimize' | 'maximize'; id: string }
  | { type: 'rect'; id: string; rect: Rect; bounds: Bounds }
  | { type: 'bounds'; bounds: Bounds }
  | { type: 'sync'; ids: string[]; limit: number }) & { policy?: GeometryPolicy };
const finite = (n: number, fallback: number) => Number.isFinite(n) ? n : fallback;
export function windowLimit(value = 8, ceiling = 32) { return Math.max(1, Math.min(Math.max(1, Math.floor(finite(ceiling, 32))), Math.floor(finite(value, 8)))); }
export function fitRect(rect: Rect, bounds: Bounds, policy: GeometryPolicy = {}): Rect {
  const bw = Math.max(1, finite(bounds.width, 1));
  const bh = Math.max(1, finite(bounds.height, 1));
  const width = Math.min(bw, Math.max(Math.min(Math.max(1, finite(policy.minWidth ?? 260, 260)), bw), finite(rect.width, 480)));
  const height = Math.min(bh, Math.max(Math.min(Math.max(1, finite(policy.minHeight ?? 160, 160)), bh), finite(rect.height, 320)));
  return { width, height, x: Math.min(bw - width, Math.max(0, finite(rect.x, 0))), y: Math.min(bh - height, Math.max(0, finite(rect.y, 0))) };
}
function lastVisible(windows: WindowState[]) { return [...windows].reverse().find(w => !w.minimized)?.id ?? null; }
export function reducer(state: DesktopState, action: Action): DesktopState {
  const current = 'id' in action ? state.windows.find(w => w.id === action.id) : undefined;
  switch (action.type) {
    case 'open': {
      if (current) return { active: current.id, windows: [...state.windows.filter(w => w.id !== current.id), { ...current, minimized: false }] };
      if (state.windows.length >= windowLimit(action.limit, action.policy?.windowCeiling)) return state;
      const offset = finite(action.policy?.cascadeOrigin ?? 24, 24) + state.windows.length * finite(action.policy?.cascadeStep ?? 28, 28);
      const rect = fitRect({ x: action.position?.x ?? offset, y: action.position?.y ?? offset, width: action.size?.width ?? action.policy?.defaultWidth ?? 480, height: action.size?.height ?? action.policy?.defaultHeight ?? 340 }, action.bounds, action.policy);
      return { active: action.id, windows: [...state.windows, { id: action.id, rect, minimized: false, maximized: false }] };
    }
    case 'focus':
      if (!current || (state.active === action.id && !current.minimized)) return state;
      return { active: action.id, windows: [...state.windows.filter(w => w.id !== action.id), { ...current, minimized: false }] };
    case 'close': {
      const windows = state.windows.filter(w => w.id !== action.id);
      return { windows, active: state.active === action.id ? lastVisible(windows) : state.active };
    }
    case 'minimize': {
      const windows = state.windows.map(w => w.id === action.id ? { ...w, minimized: true } : w);
      return { windows, active: state.active === action.id ? lastVisible(windows) : state.active };
    }
    case 'maximize':
      if (!current) return state;
      return { active: action.id, windows: [...state.windows.filter(w => w.id !== action.id), { ...current, minimized: false, maximized: !current.maximized }] };
    case 'rect':
      return { ...state, windows: state.windows.map(w => w.id === action.id ? { ...w, rect: fitRect(action.rect, action.bounds, action.policy) } : w) };
    case 'bounds':
      return { ...state, windows: state.windows.map(w => ({ ...w, rect: fitRect(w.rect, action.bounds, action.policy) })) };
    case 'sync': {
      const windows = state.windows.filter(w => action.ids.includes(w.id)).slice(0, windowLimit(action.limit, action.policy?.windowCeiling));
      if (windows.length === state.windows.length) return state;
      return { windows, active: windows.some(w => w.id === state.active && !w.minimized) ? state.active : lastVisible(windows) };
    }
  }
}
