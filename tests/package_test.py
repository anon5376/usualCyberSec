"""Archive-level checks for the source distribution allowlist."""

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
                ".gitignore": "secrets/\n",
                "README.md": "Project\n",
                "dist/core.mjs": "export {};\n",
                "dist/vault.mjs": "export {};\n",
                "dist/_headers": "/*\n  X-Frame-Options: DENY\n",
                "tests/vault.test.mjs": "import 'node:test';\n",
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
                self.assertIn("usualcybersec/.gitignore", names)
                self.assertIn("usualcybersec/dist/core.mjs", names)
                self.assertIn("usualcybersec/dist/vault.mjs", names)
                self.assertIn("usualcybersec/dist/_headers", names)
                self.assertIn("usualcybersec/tests/vault.test.mjs", names)
                self.assertFalse(any("credentials" in name or "/archives/" in name or ".openai" in name for name in names))
                self.assertFalse(any(name.endswith("usualcybersec-source.zip") or name.endswith("prooflane-source.zip") for name in names))
                self.assertFalse(any("linked-source" in name for name in names))


if __name__ == "__main__":
    unittest.main()
