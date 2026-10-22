import importlib.util
from pathlib import Path
import tempfile
import unittest
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("usualcybersec_package", ROOT / "scripts" / "package.py")
package = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(package)


class PackageArchiveTests(unittest.TestCase):
    def test_archive_contains_required_source_and_excludes_private_or_generated_paths(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary) / "source"
            output = Path(temporary) / "out" / "source.zip"
            for relative, content in {
                "LICENSE": "MIT License\n",
                "LICENSE.arc": "Arc MIT License\n",
                ".gitignore": "secrets/\n",
                "README.md": "Project\n",
                "src/App.tsx": "export default function App() {}\n",
                "src/lib/core.ts": "export {};\n",
                "src/generated.js.map": "generated source map\n",
                "src/releases/generated.json": "ignored build output\n",
                "public/icon.svg": "<svg></svg>\n",
                "public/third-party-licenses.txt": "Runtime licenses\n",
                "docs/arc/SOURCES.json": "[]\n",
                "index.html": "<div id=\"root\"></div>\n",
                "vite.config.mjs": "export default {};\n",
                "tsconfig.json": "{}\n",
                "package.json": "{}\n",
                "package-lock.json": "{}\n",
                "THIRD_PARTY_NOTICES.md": "Third-party license notices\n",
                "src/components/arc/LICENSE": "Arc MIT License\n",
                "src/components/arc/LICENSE.arc": "Arc MIT License\n",
                "public/fonts/OFL-geist.txt": "SIL Open Font License\n",
                "tests/vault.test.mjs": "import 'node:test';\n",
                "dist/index.html": "generated build\n",
                "node_modules/react/index.js": "installed dependency\n",
                ".env.local": "secret\n",
                "docs/credentials/token.md": "private\n",
                "docs/archives/old.md": "generated\n",
                "dist/usualcybersec-source.zip": "generated archive\n",
                "dist/prooflane-source.zip": "stale archive\n",
                ".openai/private.json": "private\n",
            }.items():
                path = root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8")

            outside = Path(temporary) / "outside"
            outside.mkdir()
            (outside / "borrowed.mjs").write_text("secret\n", encoding="utf-8")
            (root / "docs" / "linked-source").symlink_to(outside, target_is_directory=True)

            package.build_archive(root, output)

            with ZipFile(output) as archive:
                names = set(archive.namelist())
                self.assertIn("usualcybersec/LICENSE", names)
                self.assertIn("usualcybersec/LICENSE.arc", names)
                self.assertIn("usualcybersec/src/components/arc/LICENSE", names)
                self.assertIn("usualcybersec/src/components/arc/LICENSE.arc", names)
                self.assertIn("usualcybersec/public/fonts/OFL-geist.txt", names)
                self.assertIn("usualcybersec/.gitignore", names)
                self.assertIn("usualcybersec/src/App.tsx", names)
                self.assertIn("usualcybersec/src/lib/core.ts", names)
                self.assertIn("usualcybersec/public/icon.svg", names)
                self.assertIn("usualcybersec/public/third-party-licenses.txt", names)
                self.assertIn("usualcybersec/docs/arc/SOURCES.json", names)
                self.assertIn("usualcybersec/index.html", names)
                self.assertIn("usualcybersec/vite.config.mjs", names)
                self.assertIn("usualcybersec/tsconfig.json", names)
                self.assertIn("usualcybersec/package-lock.json", names)
                self.assertIn("usualcybersec/THIRD_PARTY_NOTICES.md", names)
                self.assertFalse(any(name.startswith("usualcybersec/dist/") for name in names))
                self.assertFalse(any("node_modules/" in name or name.endswith(".map") or ".env.local" in name or "/releases/" in name for name in names))
                self.assertIn("usualcybersec/tests/vault.test.mjs", names)
                self.assertFalse(any("credentials" in name or "/archives/" in name or ".openai" in name for name in names))
                self.assertFalse(any(name.endswith("usualcybersec-source.zip") or name.endswith("prooflane-source.zip") for name in names))
                self.assertFalse(any("linked-source" in name for name in names))


if __name__ == "__main__":
    unittest.main()
