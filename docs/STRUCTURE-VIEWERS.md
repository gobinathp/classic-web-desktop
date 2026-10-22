# Reusable molecule and protein structure viewers

Source version 0.4.3; not yet published to npm. Demo: [HDT-PhytoTB → Structure viewers](https://gobinathp.github.io/classic-web-desktop/phytotb.html).

## Components and formats

| Component | Input | Behaviour |
| --- | --- | --- |
| MoleculeViewer | `smiles?: string` | Automatically renders a 2D depiction when mounted with SMILES |
| MoleculeViewer | `sdf?: string` | Load 3D button renders supplied MOL/SDF coordinates |
| ProteinStructureViewer | `pdb?: string` | Load 3D button renders supplied PDB coordinates; cartoon, sticks or spheres |

The viewers do not generate conformers, predict protein structures, perform docking, infer therapeutic links or fetch structures from an identifier. They do not verify that independently supplied SMILES and SDF describe the same molecule: the database/host must ensure that match. The initial protein format is legacy PDB; mmCIF, trajectories, volume maps and complex analysis are outside this version. Only the engine's first supplied model is displayed. No automatic biological assembly expansion is performed.

## Install and host the assets

Build/install the repository package, then copy the **entire** `dist/structure/` directory, including `chunks/` and licence files, into your application's public assets. For example, copy to `public/structure/` in Next.js. Retain relative paths between HTML, entry script and chunks. The package includes pinned, bundled renderers; consumers need not install them separately.

```tsx
'use client';
import { MoleculeViewer, ProteinStructureViewer } from '@gobinathp/classic-web-desktop/structures';
import '@gobinathp/classic-web-desktop/structures.css';

<MoleculeViewer
  title="Selected compound"
  description="Description supplied by the curated record"
  smiles={record.smiles}
  sdf={record.sdf}
  rendererUrl="/structure/renderer.html"
  provenance={record.structureSource}
  maxAtoms={500}
/>

<ProteinStructureViewer
  title="Selected protein"
  description="Include chain, organism and experimental/model context"
  pdb={record.pdb}
  rendererUrl="/structure/renderer.html"
  provenance={record.structureSource}
  maxAtoms={10000}
/>
```

For hosting beneath a subpath, supply that subpath, for example `/classic-web-desktop/structure/renderer.html`. A relative URL resolves against the current page, not the JS bundle. `rendererUrl` is required and must resolve to the same HTTP(S) origin as the host application. It must refer to the trusted bundled renderer, not uploaded HTML.

The parent host's CSP must permit `frame-src 'self'`. The bundled frame uses its own CSP: same-origin scripts, no network connections, no objects, no form submission. The renderers need inline styles for drawing, but scripts do not require `unsafe-eval` or `unsafe-inline`. Host headers must permit same-origin framing of renderer.html. Test your own deployment policy; the demo's policy is covered by browser tests.

## Shared API

Required: `title`, `description`, `provenance`, `rendererUrl`. Optional:

- `maxAtoms`: 500 for molecules / 20,000 for protein; maximum 50,000. Smaller budgets are recommended for modest devices.
- `maxBytes`: 2,000,000 by default; maximum 5,000,000 UTF-8 bytes. Limits reject the structure; no silent truncation.
- SMILES has an additional 2,000-character ceiling and rejects reaction/annotation syntax. Only a single molecular SMILES expression is accepted, including disconnected fragments when valid SMILES.
- `height`: 320 pixels by default, bounded to 1–1,200.
- `labels`: overrides for view/unload/loading/retry/style/rotation/zoom/reset labels and the `loaded(atomCount)` formatter.
- `onStatusChange(status, message)`: loading, ready or error notifications; callback replacement does not rebuild the graphics renderer.
- `className`, `style`: container customisation. CSS variables: `--cwd-structure-text`, `--cwd-structure-background`, `--cwd-structure-border`. The initial rendering palette is light with conventional engine atom colours; arbitrary engine style injection is not exposed.

Descriptions and provenance are rendered as text. Include a useful nonvisual summary: identity, chain/residue context, source, experimental versus predicted status and uncertainty. Keyboard users can activate rotation, zoom and reset buttons and select representations. These summaries and controls do not constitute an equivalent screen-reader interpretation of a scientific 3D scene.

Missing data disables the corresponding view. Invalid input, atom/byte-limit failures, missing assets and unavailable WebGL produce an error with retry; the failed iframe is removed. 3D requires a WebGL-capable maintained browser. 2D uses SVG and does not require WebGL.

## Loading, memory and lifecycle

The root library and existing AlignMe/gallery entries do not import these components or engines. The `/structures` React wrapper is small and server-importable; engines are loaded dynamically **inside a separate same-origin iframe** only when that view is mounted. Loading 2D does not download 3Dmol. Protein and molecule 3D remain opt-in. Browser HTTP caching can reuse assets across viewers, but separate active frames have separate engine instances and consume additional memory.

Frames isolate lifecycle, not untrusted code: `allow-scripts allow-same-origin` permits trusted rendering code. Do not treat this as a security boundary against malicious same-origin scripts. Messages validate both source window and origin. There is no CDN dependency, structure URL fetch, raw HTML injection or automatic animation/spin. Atom and byte limits bound input work; they are not chemical validation or a guaranteed RAM ceiling.

Changing structure data, switching 2D/3D, unloading, closing or default-minimising the desktop window removes its frame. Parent listeners/timeouts are removed by effect cleanup. Frame pagehide clears models and attempts to lose its WebGL context; destroying the frame removes its document, observer and event-handler lifecycle. Browser reclamation timing varies. If a host deliberately keeps hidden windows mounted, it should unmount viewers when not needed. No retained-heap audit or physical low-end-device benchmark has been performed.

## Rendering engines, provenance and licences

- [SmilesDrawer](https://reymond-group.github.io/smilesDrawer/getting-started/) **2.4.1**, MIT, for SMILES parsing and SVG depiction. Uses the explicit parser API; reaction/embedded-options shortcuts are not exposed.
- [3Dmol.js](https://3dmol.org/doc/) **2.5.5**, BSD-3-Clause, for molecular/protein WebGL rendering. Bundled only in optional structure assets.
- Third-party notices are included alongside renderer assets, including SmilesDrawer, 3Dmol and chroma-js licences. Core components continue to require only React; optional assets contain third-party rendering code and are materially larger than basic controls.
- Demo protein: [RCSB PDB 1CRN](https://www.rcsb.org/structure/1CRN), DOI [10.2210/pdb1CRN/pdb](https://doi.org/10.2210/pdb1CRN/pdb). Crambin, 46 residues, 327 atoms, X-ray entry. Deposited by W. A. Hendrickson and M. M. Teeter. Original PDB file retrieved from `https://files.rcsb.org/download/1CRN.pdb` on 2026-10-22; bundled unchanged as `demo/1crn.pdb`. This plant protein is a renderer demonstration, not a human TB host target.
- Ethanol SDF: hand-authored illustrative three-heavy-atom geometry, not an optimised or experimentally determined conformer. Caffeine is a SMILES depiction example with no 3D structure supplied. Neither example is linked to the fictional research catalogue or presented as a therapeutic candidate.

## Verification

Browser tests cover lazy asset loading, ethanol/caffeine SVG output and atom counts, malformed/missing inputs, disabled 3D without coordinates, real WebGL molecule/protein rendering, visible rotation changes, representation/zoom/reset controls, accessible app controls, narrow viewport, unload/minimise cleanup and simulated WebGL failure. Unit/package tests cover preflight limits and server-safe ESM/CommonJS imports. Local headless Chromium uses software WebGL for reproducibility; this is not a physical-GPU compatibility test.
