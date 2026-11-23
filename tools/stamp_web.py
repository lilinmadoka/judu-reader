"""Stamp the web app's release fingerprint and offline asset digests before publishing."""

import base64
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = (
    "index.html", "prototype-library-data.js", "prototype-library.js",
    "prototype-transfer.js", "prototype-dictionary-data.js", "prototype-cet4-data.js",
    "prototype-word-family.js", "prototype-dictionary.js", "prototype-motion.js", "prototype-tape.js",
    "prototype-study-clock.js", "install-web.js", "manifest.webmanifest",
    "icon-192.png", "icon-512.png", "示例导入.json", "导入说明.md",
)
BLOCK = re.compile(r"(?<=/\* begin asset revision \*/\n).*?(?=\n/\* end asset revision \*/)", re.S)


def stamp():
    worker = ROOT / "service-worker.js"
    source = worker.read_text(encoding="utf-8")
    assets = {
        "./" + name: "sha256-" + base64.b64encode(hashlib.sha256((ROOT / name).read_bytes()).digest()).decode("ascii")
        for name in ASSETS
    }
    manifest = json.dumps(assets, ensure_ascii=False, separators=(",", ":"))
    fingerprint = hashlib.sha256((BLOCK.sub("", source) + manifest).encode("utf-8")).hexdigest()[:16]
    assignment = f'const webBuild = {{"revision":"{fingerprint}","assets":{manifest}}};'
    generated, count = BLOCK.subn(lambda _: assignment, source)
    if count != 1:
        raise ValueError("Missing service worker asset revision block")
    worker.write_text(generated, encoding="utf-8")
    print(fingerprint)


if __name__ == "__main__":
    stamp()
