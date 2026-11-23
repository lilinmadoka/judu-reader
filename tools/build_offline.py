"""Build offline packages from the public site and original example."""

import argparse
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
IPAD_GUIDE = """句读 · iPad 离线版

1. 从 App Store 安装「HTML & Markdown 查看器」，提供者为洪霞 刘。
   https://apps.apple.com/cn/app/id6782357972
2. 把这个 ZIP 保存到 iPad 的「文件」。在查看器里选择导入这个 ZIP，
   或从「文件」的分享菜单用该查看器打开压缩包。
3. 打开项目里的 index.html。以后从查看器里打开同一个已导入的项目。

试读时可以点一个单词查义，点段落旁的「选句」再点句子。
在右栏点「贴上标记」可以把单词加到复习里。
首次使用时可以标记一个词，退出查看器后重新打开，确认记录能保留。

包内含原创阅读示例和离线词典。可在「试卷库」复制提示词、导入 JSON、导出学习记录或导入备份。
使用方法见同包的「导入说明.md」，格式可参考「示例导入.json」。
"""


def inline_script(match, root):
    script = (root / match[1]).read_text(encoding="utf-8")
    if re.search(r"</script", script, re.IGNORECASE):
        raise ValueError(f"Cannot inline script safely: {match[1]}")
    return "<script>\n" + script + "\n</script>"


def inline_page(root, entry, ipad=False):
    page = (root / entry).read_text(encoding="utf-8")
    if ipad:
        page = re.sub(r'<script src="(?:\./)?install-web\.js"></script>\n?', "", page)
    page = re.sub(r'<script src="(?:\./)?([\w-]+\.js)"></script>',
                  lambda match: inline_script(match, root), page)
    return re.sub(r'^<link rel="manifest"[^>]*>\n?', "", page, flags=re.MULTILINE)


def build(output, ipad=False):
    page = inline_page(ROOT, "index.html", ipad=ipad)
    base = "" if ipad else "句读/"
    entry = "index.html" if ipad else "打开句读.html"
    with ZipFile(output, "w", ZIP_DEFLATED) as archive:
        archive.writestr(base + entry, page.encode("utf-8"))
        for name in ("LICENSE", "ECDICT-LICENSE.txt", "WORDNET-LICENSE.txt",
                     "导入说明.md", "示例导入.json", "icon-192.png"):
            archive.write(ROOT / name, base + name)
        if ipad:
            archive.writestr("iPad打开说明.txt", IPAD_GUIDE.encode("utf-8-sig"))
        else:
            archive.write(ROOT / "README.md", base + "README.md")
    with ZipFile(output) as archive:
        invalid = archive.testzip()
        if invalid:
            raise ValueError(f"Invalid archive entry: {invalid}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--ipad", action="store_true", help="build a ZIP for a local iPad viewer")
    args = parser.parse_args()
    build(args.output, ipad=args.ipad)
