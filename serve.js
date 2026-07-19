/**
 * Local dev server with URL rewriting
 * Mirrors Cloudflare Pages Function: /video/* -> /video.html
 * Usage: node serve.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5500;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

http.createServer((req, res) => {
  let url = req.url.split('?')[0].split('#')[0];

  // Rewrite /video/* to /video.html (same as Cloudflare Pages _redirects)
  if (url.startsWith('/video/')) {
    url = '/video.html';
  }

  // Serve index.html for root
  if (url === '/' || url === '') {
    url = '/index.html';
  }

  const filePath = path.join(ROOT, url);
  serveFile(res, filePath);
}).listen(PORT, () => {
  console.log(`VideoHub dev server running at:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://127.0.0.1:${PORT}`);
});
