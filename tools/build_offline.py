"""Build the desktop offline package from the public site and original example."""

import re
import sys
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]


def inline_script(match):
    script = (ROOT / match[1]).read_text(encoding="utf-8")
    if re.search(r"</script", script, re.IGNORECASE):
        raise ValueError(f"Cannot inline script safely: {match[1]}")
    return "<script>\n" + script + "\n</script>"


def build(output):
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    page = re.sub(r'<script src="(?:\./)?([\w-]+\.js)"></script>', inline_script, page)
    page = re.sub(r'^<link rel="manifest"[^>]*>\n?', "", page, flags=re.MULTILINE)
    base = "句读"
    with ZipFile(output, "w", ZIP_DEFLATED) as archive:
        archive.writestr(f"{base}/打开句读.html", page.encode("utf-8"))
        for name in ("README.md", "LICENSE", "ECDICT-LICENSE.txt", "WORDNET-LICENSE.txt",
                     "导入说明.md", "示例导入.json", "icon-192.png"):
            archive.write(ROOT / name, f"{base}/{name}")
    with ZipFile(output) as archive:
        invalid = archive.testzip()
        if invalid:
            raise ValueError(f"Invalid archive entry: {invalid}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 tools/build_offline.py OUTPUT.zip")
    build(Path(sys.argv[1]))
