const { createServer } = require('http');
const { readFileSync, existsSync, statSync, readdirSync } = require('fs');
const { join, extname, resolve } = require('path');
const { parse } = require('url');

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
  '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.map': 'application/json',
};

const ROOT = __dirname;
const STATIC_FILES = {
  '/daily-feed.json': 'public/daily-feed.json',
  '/phase2-feed.json': 'public/phase2-feed.json',
  '/phase3-feed.json': 'public/phase3-feed.json',
  '/ouroboros.webp': 'public/ouroboros.webp',
  '/ouroboros.png': 'public/ouroboros.png',
};

const INDEX = '.next/server/app/index.html';

function serveFile(res, filePath) {
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': content.length,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    res.end(content);
    return true;
  } catch (e) {
    return false;
  }
}

createServer((req, res) => {
  const url = parse(req.url).pathname || '/';

  // Phase feed files and other public assets
  if (STATIC_FILES[url]) {
    if (serveFile(res, join(ROOT, STATIC_FILES[url]))) return;
  }

  // PDF files
  if (url.includes('ARGUS-NCR') && url.endsWith('.pdf')) {
    if (serveFile(res, join(ROOT, 'public', url.split('/').pop()))) return;
  }

  // Public assets
  if (url.startsWith('/public/') || ['/ouroboros.svg', '/favicon.ico'].includes(url)) {
    const publicPath = join(ROOT, 'public', url.replace('/public/', ''));
    if (serveFile(res, publicPath)) return;
  }

  // Next.js static chunks (JS/CSS bundles for hydration)
  if (url.startsWith('/_next/')) {
    const staticPath = join(ROOT, '.next', url);
    if (serveFile(res, staticPath)) return;
  }

  // Root or HTML pages → serve the index.html (SPA)
  if (url === '/' || url.endsWith('.html') || !url.includes('.')) {
    res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' });
    res.end(readFileSync(join(ROOT, INDEX)));
    return;
  }

  // Fallback
  res.writeHead(404);
  res.end('Not found');
}).listen(3333, () => {
  console.log('ARGUS-NCR running on http://localhost:3333');
});
