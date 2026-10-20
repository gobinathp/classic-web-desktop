import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, DataGrid, Desktop, Panel, Toolbar } from '../src';
import type { DesktopApp, GridColumn } from '../src';
import '../src/styles.css';
import './demo.css';
const projects = Array.from({ length: 240 }, (_, i) => ({ id: String(i + 1), name: ['Atlas workspace', 'North district', 'Field operations', 'Customer portal', 'Asset inventory', 'Planning studio'][i % 6] + (i >= 6 ? ` ${i + 1}` : ''), owner: ['Gobinath', 'Priya', 'Arun', 'Meena'][i % 4], status: i % 4 ? 'Ready' : 'In review' }));
const columns: GridColumn<typeof projects[number]>[] = [
  { key: 'id', title: '#', render: row => row.id }, { key: 'name', title: 'Project', render: row => row.name },
  { key: 'owner', title: 'Owner', render: row => row.owner }, { key: 'status', title: 'Status', render: row => <span className={`status ${row.status === 'Ready' ? 'ready' : ''}`}>{row.status}</span> }
];
function Projects() {
  const [query, setQuery] = useState('');
  return <div className="fill"><Toolbar><label className="search-label">Find project <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search sample records" /></label></Toolbar><DataGrid caption="Sample project directory · 20 rows per page" rows={projects.filter(row => row.name.toLowerCase().includes(query.toLowerCase()))} columns={columns} rowKey={row => row.id} /></div>;
}
function Notes() { const [text, setText] = useState('A little space for a big idea.\n\nThis note stays in memory only. Minimizing or closing releases it.'); return <div className="fill"><Toolbar><span>Unsaved scratchpad · never uploaded</span></Toolbar><textarea className="notes" aria-label="Scratchpad" value={text} maxLength={20000} onChange={e => setText(e.target.value)} /><div className="footnote">{text.length.toLocaleString()} / 20,000 characters</div></div>; }
function Settings() {
  const [message, setMessage] = useState('');
  return <form className="demo-form" onSubmit={e => { e.preventDefault(); setMessage('Preferences preview saved for this window only.'); }}><h3>Your preferences</h3><p>Native controls, classic details.</p><label>Display name<input name="displayName" maxLength={60} defaultValue="Gobinath" /></label><label>Workspace<select defaultValue="personal"><option value="personal">Personal workspace</option><option value="team">Team workspace</option></select></label><label className="checkbox"><input type="checkbox" defaultChecked /> Show desktop tips</label><Button type="submit">Apply preferences</Button><p role="status">{message}</p></form>;
}
const apps: DesktopApp[] = [
  { id: 'welcome', title: 'Welcome', icon: '▣', initialPosition: { x: 135, y: 38 }, initialSize: { width: 440, height: 405 }, render: () => <div className="welcome"><div className="welcome-banner"><span className="eyebrow">OPEN SOURCE / REACT</span><h1>Feels like home.<br />Built for today.</h1><p>The classic web desktop, reimagined.</p></div><div className="welcome-body"><p>A small foundation for tools that do real work. Open an app, move a window, make this workspace yours.</p><div className="feature-pair"><div><b>01 / Familiar</b><span>Windows, taskbar & start menu</span></div><div><b>02 / Considered</b><span>No extra runtime dependencies*</span></div></div><p className="footnote">*React is a peer dependency. No trackers, remote fonts, or background polling.</p><a href="https://github.com/gobinathp/classic-web-desktop" target="_blank" rel="noopener noreferrer">Explore the source ↗</a></div></div> },
  { id: 'projects', title: 'Projects', icon: '▤', initialPosition: { x: 600, y: 82 }, initialSize: { width: 560, height: 350 }, render: () => <Projects /> },
  { id: 'explorer', title: 'Explorer', icon: '▰', initialPosition: { x: 480, y: 340 }, initialSize: { width: 285, height: 360 }, render: () => <div className="explorer"><Toolbar><span>Workspace explorer</span></Toolbar><details open><summary>▾ My workspace</summary><ul><li>▤ Projects</li><li>▱ Documents</li><li>▧ Resources</li></ul></details><details open><summary>▾ Team</summary><ul><li><span className="online" /> Gobinath</li><li><span className="online" /> Priya</li><li><span className="offline" /> Arun</li></ul></details><details><summary>▸ Archive</summary><p>No archived items.</p></details><p className="footnote">Sample folder tree using native disclosure controls.</p></div> },
  { id: 'notes', title: 'Notepad', icon: '▱', render: () => <Notes /> },
  { id: 'settings', title: 'Preferences', icon: '⚙', initialSize: { width: 370, height: 365 }, render: () => <Settings /> },
  { id: 'about', title: 'About & help', icon: '?', render: () => <div className="help"><Panel title="Classic Web Desktop · v0.1.0"><p>Original React components inspired by classic desktop interfaces. Created for reusable applications by Gobinath Palanisamy.</p><p>MIT licensed. Not affiliated with or endorsed by Sencha or Ext JS.</p></Panel><h3>Make yourself at home</h3><ul><li>Click a shortcut or use Start to open an app.</li><li>Drag a title bar to move; drag the lower-right grip to resize.</li><li>Double-click a title bar to maximize or restore.</li><li>Use Alt + arrows to move; Alt + Shift + arrows to resize.</li><li>Minimized apps release content by default. Notes reset when restored.</li></ul><p>Designed for modest hardware and maintained browsers. This is not an operating system or an app security sandbox.</p></div> }
];
createRoot(document.getElementById('root')!).render(<StrictMode><Desktop apps={apps} initialOpen={['welcome', 'projects', 'explorer']} label="Classic Web Desktop demo" /></StrictMode>);
