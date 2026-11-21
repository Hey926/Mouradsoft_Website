"use strict";

const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = __dirname;
const publicPages = new Set([
  "index.html", "minimal.html", "api.html", "download.html", "coming-soon.html",
  "styles.css", "script.js", "minimal.js", "api.js", "coming-soon.js",
]);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function createRequestServer() {
  return http.createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }

    try {
      const url = new URL(request.url, "http://localhost");
      // Never publish a static online flag: this route exists only while this
      // process is running and reachable on the owner's computer.
      if (url.pathname === "/api/presence") {
        response.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        });
        response.end(request.method === "HEAD" ? undefined : JSON.stringify({ online: true }));
        return;
      }

      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
      const extension = path.extname(relative).toLowerCase();
      const isAsset = relative.startsWith("assets/") && Boolean(mimeTypes[extension]);
      if (!publicPages.has(relative) && !isAsset) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      const file = await fs.realpath(path.resolve(root, relative));
      const withinRoot = path.relative(root, file);
      if (withinRoot.startsWith("..") || path.isAbsolute(withinRoot)) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      const content = await fs.readFile(file);
      response.writeHead(200, { "Content-Type": mimeTypes[extension] });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 8080);
  const host = process.env.HOST || "127.0.0.1";
  const server = createRequestServer();
  server.on("error", (error) => {
    console.error(`Cannot start request server: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log(`Mubuntu: http://${host}:${port}/coming-soon.html`);
    console.log("Requests are open while this server is reachable. Press Ctrl+C to close them.");
  });
}

module.exports = { createRequestServer };
