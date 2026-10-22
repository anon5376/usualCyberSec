import http.client
import importlib.util
import threading
import tempfile
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("usualcybersec_serve", ROOT / "scripts" / "serve.py")
serve = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(serve)


class ServerBehaviorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.dist = Path(self.temp.name)
        self.index = self.dist / "index.html"
        self.asset = self.dist / "app.mjs"
        self.index.write_text("<!doctype html><title>Test</title>", encoding="utf-8")
        self.asset.write_text("export const answer = 42;", encoding="utf-8")
        self.old_dist = serve.DIST
        serve.DIST = self.dist
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), serve.usualCyberSecHandler)
        self.port = self.server.server_port
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=3)
        serve.DIST = self.old_dist
        self.temp.cleanup()

    def get(self, path):
        conn = http.client.HTTPConnection("127.0.0.1", self.port, timeout=3)
        conn.request("GET", path)
        response = conn.getresponse()
        body = response.read()
        headers = dict(response.getheaders())
        conn.close()
        return response.status, headers, body

    def test_root_and_static_asset_are_served_with_security_headers(self):
        for path, expected in (("/", b"Test"), ("/app.mjs", b"answer = 42")):
            with self.subTest(path=path):
                status, headers, body = self.get(path)
                self.assertEqual(status, 200)
                self.assertIn(expected, body)
                self.assertIn("default-src 'self'", headers["Content-Security-Policy"])
                self.assertEqual(headers["Referrer-Policy"], "no-referrer")
                self.assertEqual(headers["X-Content-Type-Options"], "nosniff")
                self.assertEqual(headers["X-Frame-Options"], "DENY")

    def test_directories_missing_files_and_traversal_are_not_served(self):
        outside = Path(self.temp.name).parent / (Path(self.temp.name).name + "-outside.txt")
        outside.write_text("outside", encoding="utf-8")
        try:
            for path in ("/nested/", "/missing", "/../server-test-outside.txt"):
                with self.subTest(path=path):
                    status, _, _ = self.get(path)
                    self.assertEqual(status, 404)
        finally:
            outside.unlink(missing_ok=True)


if __name__ == "__main__":
    unittest.main()
