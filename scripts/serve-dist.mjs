import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const portArg = args.find((a) => a.startsWith("--port="));
const port = portArg ? Number(portArg.split("=")[1]) : Number(process.env.PORT || 5175);

const root = path.join(process.cwd(), "dist");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  try {
    let p = (req.url || "/").split("?")[0];
    if (p === "/" || p === "") p = "/index.html";
    p = decodeURIComponent(p);

    const fp = path.join(root, p);
    if (!fp.startsWith(root)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    fs.readFile(fp, (err, data) => {
      if (err) {
        // SPA fallback
        if (p !== "/index.html") {
          fs.readFile(path.join(root, "index.html"), (err2, data2) => {
            if (err2) {
              res.statusCode = 404;
              res.end("Not found");
              return;
            }
            res.setHeader("Content-Type", mime[".html"]);
            res.end(data2);
          });
          return;
        }

        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      res.setHeader("Content-Type", mime[path.extname(fp)] || "application/octet-stream");
      res.end(data);
    });
  } catch (e) {
    res.statusCode = 500;
    res.end(String(e));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("static server:", root, `http://127.0.0.1:${port}`);
});
