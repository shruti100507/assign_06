const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;
const PAGES_DIR = path.join(__dirname, "pages");
const PUBLIC_DIR = path.join(__dirname, "public");
function serveHtml(res, fileName, statusCode = 200) {
    const filePath = path.join(PAGES_DIR, fileName);
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err.message);
            res.writeHead(500, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            res.end("500 - Internal Server Error");
            return;
        }
        res.writeHead(statusCode, {
            "Content-Type": "text/html; charset=utf-8"
        });
        res.end(data);
    });
}
const server = http.createServer((req, res) => {
    const pathname = new URL(
        req.url,
        `http://${req.headers.host || "localhost"}`
    ).pathname;
    if (req.method !== "GET") {
        res.writeHead(405, {
            "Content-Type": "text/plain; charset=utf-8",
            "Allow": "GET"
        });
        res.end("405 - Method Not Allowed");
        return;
    }
    if (pathname === "/style.css") {
        const cssPath = path.join(PUBLIC_DIR, "style.css");
        fs.readFile(cssPath, "utf8", (err, css) => {
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain; charset=utf-8"
                });
                res.end("500 - Unable to load CSS");
                return;
            }
            res.writeHead(200, {
                "Content-Type": "text/css; charset=utf-8"
            });
            res.end(css);
        });
        return;
    }
    switch (pathname) {
        case "/":
        case "/home":
            serveHtml(res, "home.html");
            break;
        case "/about":
            serveHtml(res, "about.html");
            break;
        case "/contact":
            serveHtml(res, "contact.html");
            break;
        default:
            serveHtml(res, "404.html", 404);
    }
});
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
server.on("error", (err) => {
    console.error("Server error:", err.message);
});