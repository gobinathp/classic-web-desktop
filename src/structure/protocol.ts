export type StructureFormat = 'smiles' | 'sdf' | 'pdb';
export type StructureStyle = 'stick' | 'sphere' | 'cartoon';
export type StructureCommand = 'left' | 'right' | 'up' | 'down' | 'zoom-in' | 'zoom-out' | 'reset';
export interface StructureRequest { kind: 'cwd-structure-load'; data: string; format: StructureFormat; maxAtoms: number; maxBytes: number; style: StructureStyle }
export function validateStructure(data: string, format: StructureFormat, maxBytes: number) {
  if (!['smiles', 'sdf', 'pdb'].includes(format)) throw new Error('Unsupported structure format.');
  if (!data.trim()) throw new Error('Structure data is empty.');
  if (data.length > maxBytes || new TextEncoder().encode(data).length > maxBytes) throw new Error('Structure exceeds the configured byte limit.');
  if (format === 'smiles') {
    if (data.length > 2000) throw new Error('SMILES exceeds the 2,000-character limit.');
    if (/\s|>|__/.test(data)) throw new Error('Supply a single SMILES string without annotations or reaction syntax.');
  } else if (format === 'pdb') {
    if (!/^ATOM  |^HETATM/m.test(data)) throw new Error('No PDB coordinate records found.');
  } else if (!/V2000|V3000/.test(data) || !/M  END/.test(data)) throw new Error('Supply a complete MOL/SDF structure with coordinates.');
}
export function safeLimit(value: number | undefined, fallback: number, ceiling: number) { return Number.isFinite(value) && value! > 0 ? Math.min(ceiling, Math.max(1, Math.floor(value!))) : fallback; }
