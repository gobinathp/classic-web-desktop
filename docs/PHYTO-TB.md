# HDT-PhytoTB — research interface POC

Open `/phytotb.html` on the existing Pages site, or `http://127.0.0.1:4173/phytotb.html` after `npm run build && npm run preview`.

This is a frontend feasibility demonstration for a dual-layer host-target and compound research database. It is not a curated database, scientific analysis, clinical tool or reconstruction of a doctoral study. All six records, four associations, expression values, centrality values and docking scores are fictional. No real gene or compound identities are used. Approval status is unverified, including the repurposing category. No claim about MDR-TB efficacy is made.

## Working workflow

1. Open the catalogue; search by name, ID, collection or source, filter class, sort and paginate.
2. Open a record to inspect provenance; this selects the corresponding graph node.
3. Add/remove compounds from comparison. The comparison app reads the same session selection.
4. Select network nodes using native buttons; expand Connections for an accessible text equivalent. Arrows indicate source/target storage order, not causal or mechanistic direction.
5. Inspect expression cells; missing observations remain explicitly missing.
6. Write notes and export JSON containing the selected records and a synthetic-data marker.

State lives above desktop windows; selections and notes survive close/minimise. Reload resets them. Notes are capped at 10,000 characters. There is no local storage, remote request, patient data, file ingestion, backend, prediction engine, authentication or audit service. JSON export escapes values through JSON.stringify; no CSV formula interpretation is involved. React renders strings as text. External source links use noopener/noreferrer. The strict demo CSP blocks network connections.

## Existing versus new components

| Need | Implementation |
| --- | --- |
| Desktop windows, taskbar, launcher | Existing Desktop and DesktopProvider |
| Search, filters, detail dialog, notebook | Existing TextField, Select, Dialog and TextArea |
| Catalogue sorting/pagination | Existing DataGrid |
| Evidence labels and actions | Existing Badge and Button |
| Relationships | New RelationshipGraph |
| Cross-study numeric matrix | New NumericHeatmap |
| ADMET/docking evidence comparison | New ComparisonTable |

## Reusable API

```tsx
import { NumericHeatmap, RelationshipGraph, ComparisonTable } from '@gobinathp/classic-web-desktop/research';
import '@gobinathp/classic-web-desktop/research.css';
```

These source additions are not yet published to npm. Build/install the repository package to use them. Components accept supplied data; TB names and domain logic exist only in the demo.

- **NumericHeatmap**: `label`, `rows`/`columns` (`id`, `label`), `values` (number/null matrix), optional `min`/`max`, `formatValue`, `missingLabel`, `onCellSelect(rowId, columnId)`, `maxRows` (30), `maxColumns` (12), `limitLabel`. Null, absent and nonfinite values remain missing. Default scale is -3 to +3; supply a suitable domain for your data. Colour is supplemented by readable numbers and native keyboard buttons.
- **RelationshipGraph**: `label`, `nodes` (`id`, `label`, optional `group`), `edges` (`id`, `source`, `target`, `label`), `selectedId`, `onSelect`, `maxNodes` (40), `maxEdges` (80), `limitLabel`, `connectionsLabel`. Fixed circular SVG layout with equivalent native selection buttons and text connection list; no physics, timers, WebGL or analysis. Links to nodes outside the visible slice are excluded. Counts disclose bounded output. Node IDs and edge IDs must be unique; host applications should prefilter and keep graph labels short. Large-scale graphs, edge editing and pan/zoom are outside this POC.
- **ComparisonTable**: `label`, `columns` (`id`, `label`), `rows` (`id`, `label`, `values` keyed by column ID), `maxColumns` (8), `maxRows` (40), `missingLabel`, `limitLabel`. Zero is retained; missing values receive a distinct label. Native table semantics and keyboard-scrollable container.

All limits are configurable positive integers. Invalid/nonfinite limits fall back to defaults. Limits bound rendered DOM, not the caller's input-array memory. Hosts must bound input sizes as well. Default labels can be translated through props. CSS variables `--cwd-research-text`, `--cwd-research-surface`, `--cwd-research-border`, and `--cwd-research-heading` allow surface customisation; the heatmap's built-in diverging palette is fixed in this first version. No claim of unlimited graph scale or guaranteed RAM use.

The optional entry is not re-exported by the root: existing consumers and demos avoid loading research code/styles. No runtime dependencies were added.

## Requirements for a real curated database

- Source publications and permission to use the doctoral data, canonical human gene IDs, miRNA IDs, pathway versions, study accessions, cohort/tissue metadata, sample sizes and contrasts.
- Transcriptomic methods: normalisation, batch treatment, effect sizes, adjusted p-values, meta-analysis/heterogeneity, network construction and centrality definitions.
- Compound identifiers and source-organism provenance, measured versus predicted endpoints, source licence and retrieval date. Regulatory approval requires a verifiable regulator record and indication; it does not establish approval for TB.
- Docking receptor/structure, preparation and protocol, engine/version, score units and validation context. Do not combine incomparable scores or present them as efficacy.
- ADMET endpoint definitions, units, model/version, confidence/applicability domain and experimental validation, with missing results explicit.
- Evidence records linked to source identifiers, curator, review date, uncertainty and revision history; authenticated review, backend validation and access controls before multi-user use.

Resource starting points (not evidence for our fixtures): [NCBI GEO](https://www.ncbi.nlm.nih.gov/geo/) archives functional genomics data; [PubChem](https://pubchem.ncbi.nlm.nih.gov/docs/about) provides chemical information. These links were checked on 2026-10-22. No study accessions or chemical source records have been selected or imported.

The Structure viewers app now demonstrates reusable MoleculeViewer and ProteinStructureViewer components with separate, clearly attributed examples; see [integration details](STRUCTURE-VIEWERS.md). Synthetic catalogue records have no structures attached. Future domain components may include a volcano plot, miRNA/protein multi-layer graph and evidence review queue. They are not required to validate this first navigation/curation workflow. Attach structures to real catalogue records only after verifying identity, provenance and supported format.
