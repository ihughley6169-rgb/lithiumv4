const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 4141);
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.mp4':'video/mp4', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml' };
const server = http.createServer((request, response) => {
  const requested = decodeURIComponent((request.url || '/').split('?')[0]);
  const file = path.resolve(root, `.${requested === '/' ? '/index.html' : requested}`);
  if (!file.startsWith(`${root}${path.sep}`)) { response.writeHead(403); response.end('Forbidden'); return; }
  fs.readFile(file, (error, data) => {
    if (!error) { response.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' }); response.end(data); return; }
    fs.readFile(path.join(root, '404.html'), (notFoundError, page) => { response.writeHead(404, { 'content-type':'text/html; charset=utf-8' }); response.end(notFoundError ? 'Not found' : page); });
  });
});
server.listen(port, () => console.log(`lithium.sh serving at http://localhost:${port}`));
