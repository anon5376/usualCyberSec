#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import stat
import zipfile


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "usualcybersec-source.zip"
ROOT_FILES = {".gitignore", "CONTRIBUTING.md", "DESIGN.md", "LICENSE", "LICENSE.arc", "NOTICE.md", "NOTICE.txt", "PRODUCT.md", "README.md", "SECURITY.md", "THIRD_PARTY_NOTICES.md", "index.html", "package-lock.json", "package.json", "vite.config.mjs"}
ROOT_CONFIGS = {"tsconfig.json"}
SOURCE_DIRS = {".github", "docs", "public", "scripts", "src", "tests"}
SOURCE_SUFFIXES = {".css", ".html", ".js", ".json", ".mjs", ".md", ".png", ".py", ".svg", ".toml", ".ttf", ".txt", ".ts", ".tsx", ".woff2", ".yml", ".yaml"}
SOURCE_FILENAMES = {"_headers", "_redirects"}
EXCLUDED_DIRS = {".git", ".impeccable", ".openai", ".wrangler", "archives", "credentials", "node_modules", "__pycache__", "releases", "secrets"}
EXCLUDED_NAMES = {"usualcybersec-source.zip", "usualcybersec-source.zip.tmp", "prooflane-source.zip", ".DS_Store"}


def source_files(root=ROOT):
    candidates = [root / name for name in ROOT_FILES]
    candidates.extend(root / name for name in ROOT_CONFIGS)
    for dirname in SOURCE_DIRS:
        directory = root / dirname
        if directory.is_dir() and not directory.is_symlink():
            candidates.extend(directory.rglob("*"))
    for path in sorted(candidates):
        relative = path.relative_to(root)
        if any(part in EXCLUDED_DIRS for part in relative.parts):
            continue
        if path.name in EXCLUDED_NAMES or path.name.startswith(".env"):
            continue
        if any("credential" in part.lower() or "secret" in part.lower() for part in relative.parts):
            continue
        is_allowlisted_root_file = len(relative.parts) == 1 and (path.name in ROOT_FILES or path.name in ROOT_CONFIGS)
        is_license_file = path.name == "LICENSE" or path.name.startswith("LICENSE.") or path.name == "NOTICE" or path.name.startswith("NOTICE.")
        if not is_allowlisted_root_file and path.suffix not in SOURCE_SUFFIXES and path.name not in SOURCE_FILENAMES and not is_license_file:
            continue
        if path.is_symlink() or not path.is_file():
            continue
        if any((root / Path(*relative.parts[:index])).is_symlink() for index in range(1, len(relative.parts))):
            continue
        yield path, relative.as_posix()


def build_archive(root, output):
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(".zip.tmp")
    with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path, name in source_files(root):
            info = zipfile.ZipInfo(f"usualcybersec/{name}", date_time=(2020, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (stat.S_IFREG | (0o755 if path.stat().st_mode & 0o111 else 0o644)) << 16
            archive.writestr(info, path.read_bytes())
    temporary.replace(output)


def main():
    build_archive(ROOT, OUTPUT)
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
