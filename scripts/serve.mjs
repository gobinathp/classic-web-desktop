import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Map([['/phytotb.html', ['site/phytotb.html', 'text/html']], ['/phytotb.js', ['site/phytotb.js', 'text/javascript']], ['/phytotb.css', ['site/phytotb.css', 'text/css']], ['/gallery.html', ['site/gallery.html', 'text/html']], ['/gallery.js', ['site/gallery.js', 'text/javascript']], ['/gallery.css', ['site/gallery.css', 'text/css']], ['/', ['site/index.html', 'text/html']], ['/index.html', ['site/index.html', 'text/html']], ['/app.js', ['site/app.js', 'text/javascript']], ['/app.css', ['site/app.css', 'text/css']]]);
createServer(async (req, res) => {
  const entry = files.get(new URL(req.url, 'http://localhost').pathname);
  if (!entry) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(entry[0]); res.writeHead(200, { 'Content-Type': entry[1], 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' }); res.end(body); }
  catch { res.writeHead(503); res.end('Run npm run build first.'); }
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173'));
