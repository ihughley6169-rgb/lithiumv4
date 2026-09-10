const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4141);
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".wasm": "application/wasm", ".css": "text/css", ".json": "application/json" };

const server = http.createServer((request, response) => {
	if (request.url === "/wisp" || request.url === "/wisp/") {
		response.writeHead(426, { "content-type": "text/plain" });
		response.end("Wisp websocket endpoint requires a websocket-capable backend.");
		return;
	}

	const requested = decodeURIComponent((request.url || "/").split("?")[0]);
	const file = path.resolve(root, `.${requested === "/" ? "/index.html" : requested}`);
	if (!file.startsWith(`${root}${path.sep}`) && file !== path.join(root, "index.html")) {
		response.writeHead(403);
		response.end("Forbidden");
		return;
	}
	fs.readFile(file, (error, data) => {
		if (error) {
			response.writeHead(error.code === "ENOENT" ? 404 : 500);
			response.end(error.code === "ENOENT" ? "Not found" : "Server error");
			return;
		}
		response.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
		response.end(data);
	});
});

server.listen(port, () => console.log(`Anchor OS serving at http://localhost:${port}`));