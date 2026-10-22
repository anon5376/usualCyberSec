#!/usr/bin/env python3
from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


class usualCyberSecHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def end_headers(self):
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        super().end_headers()

    def list_directory(self, path):
        self.send_error(404, "Not found")
        return None

    def send_head(self):
        request_path = unquote(urlsplit(self.path).path)
        if request_path == "/":
            request_path = "/index.html"
        candidate = (DIST / request_path.lstrip("/")).resolve()
        try:
            candidate.relative_to(DIST.resolve())
        except ValueError:
            self.send_error(404, "Not found")
            return None
        if not candidate.is_file():
            self.send_error(404, "Not found")
            return None
        return super().send_head()


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve usualCyberSec's built static files on loopback for local use.")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    if not 0 <= args.port <= 65535:
        parser.error("port must be between 0 and 65535")
    if not DIST.is_dir():
        parser.error("dist/ does not exist; build or place the app in dist/ first")
    server = ThreadingHTTPServer(("127.0.0.1", args.port), usualCyberSecHandler)
    print(f"usualCyberSec available at http://127.0.0.1:{server.server_port}/ (Ctrl-C to stop)", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
