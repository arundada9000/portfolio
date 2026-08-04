"""Enforce ASCII-only in documentation and config files.

The site source (src/) intentionally uses terminal ASCII-art and emoji
as part of its design, so this check only covers repo-level docs.
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

ALLOWED = set("\u00a9")  # copyright sign

# Scan only the repo root and .github/ - skip site source and tooling.
SKIP = {".git", ".next", "node_modules", ".agents", ".claude", "public", "src", "screenshots"}
EXTENSIONS = (".md", ".yml", ".yaml", ".txt", ".json")


def main():
    errors = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel = os.path.relpath(dirpath, ROOT)
        parts = rel.replace("\\", "/").split("/")
        dirnames[:] = [d for d in dirnames if d not in SKIP]
        if parts[0] not in ("", ".github"):
            continue
        for name in sorted(filenames):
            path = os.path.join(dirpath, name)
            if not path.endswith(EXTENSIONS):
                continue
            with open(path, encoding="utf-8-sig", errors="ignore") as fh:
                content = fh.read()
            bad = sorted({ch for ch in content if ord(ch) > 127 and ch not in ALLOWED})
            if bad:
                errors.append(f"{os.path.relpath(path, ROOT)}: non-ASCII chars -> {[hex(ord(c)) for c in bad]}")

    if errors:
        for err in errors:
            print(f"ERROR: {err}")
        sys.exit(1)
    print("OK: all documentation and config files are ASCII")


if __name__ == "__main__":
    main()
