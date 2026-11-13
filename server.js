const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (readErr, content) => {
    if (readErr) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Server Error');
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    }
  });
}

function serve404(res) {
  const notFoundPath = path.join(PUBLIC_DIR, '404.html');
  fs.readFile(notFoundPath, (err404, data404) => {
    if (!err404) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(data404);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (!err) {
      if (stats.isDirectory()) {
        const indexInDir = path.join(filePath, 'index.html');
        fs.stat(indexInDir, (errIdx, statsIdx) => {
          if (!errIdx && statsIdx.isFile()) {
            serveFile(res, indexInDir);
          } else {
            serve404(res);
          }
        });
      } else {
        serveFile(res, filePath);
      }
      return;
    }

    // Try with .html appended
    const htmlCandidate = filePath + '.html';
    fs.stat(htmlCandidate, (errHtml, statsHtml) => {
      if (!errHtml && statsHtml.isFile()) {
        serveFile(res, htmlCandidate);
        return;
      }

      // Try looking inside pages/
      const pagesCandidate = path.join(PUBLIC_DIR, 'pages', reqPath + '.html');
      fs.stat(pagesCandidate, (errPages, statsPages) => {
        if (!errPages && statsPages.isFile()) {
          serveFile(res, pagesCandidate);
          return;
        }

        // Try looking inside pages/services/
        const serviceCandidate = path.join(PUBLIC_DIR, 'pages', 'services', reqPath.replace(/^\/services\//, '') + '.html');
        fs.stat(serviceCandidate, (errSvc, statsSvc) => {
          if (!errSvc && statsSvc.isFile()) {
            serveFile(res, serviceCandidate);
            return;
          }

          serve404(res);
        });
      });
    });
  });
});

// Listening without host binds to dual-stack IPv6 (::1/localhost) and IPv4 (127.0.0.1/0.0.0.0)
server.listen(PORT, () => {
  console.log(`Server listening on dual-stack port ${PORT} (localhost, 127.0.0.1, and LAN)`);
});
