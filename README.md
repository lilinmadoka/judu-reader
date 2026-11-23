# 句读

句读是一款适用于电脑和平板的英语精读工具。先读英文，再按需查常用词义、拆句，最后看整句译文。阅读页面的左栏是英文和练习，右栏是词典或句子详解。

## 使用

- **网页版** [打开句读](https://lilinmadoka.github.io/judu-reader/)。电脑和平板使用同一个网址。iPad 可以用 Safari 打开并添加到主屏幕。首次完整加载后，浏览器支持时可从缓存离线阅读。
- **电脑离线版** 在 [GitHub Releases](https://github.com/lilinmadoka/judu-reader/releases/latest) 下载 ZIP，完整解压后用浏览器打开 `打开句读.html`。
- **在本机运行源码** 用 Python 3 在仓库根目录启动本地服务，然后用浏览器访问 `http://127.0.0.1:8768/`。

```sh
python3 -m http.server 8768 --bind 127.0.0.1
```

## 精读流程

1. 点单词查看常用义、词形和构词信息。双击贴上手撕胶带，再双击可以揭下。触屏上点单词后，用右栏的「贴上标记」。
2. 点段落旁的「选句」，再点目标句子。右栏先给意群与结构，接着解释读法，完整译文在最后。
3. 做完本篇可以查看段落译文和参考答案。读完后可标为「已精读」，试卷库会显示完成篇数。
4. 侧边回形针返回最新一处胶带，旁边的复习入口可以调出生词卡。连续五分钟无操作时，计时暂停。

## 导入和保存

试卷库中有一篇原创示例。通过「导入 JSON」添加你有权使用的材料。每份文件对应一套试卷，可含选词填空、长篇匹配和两篇仔细阅读。格式见 [导入说明](导入说明.md) 和 [示例文件](示例导入.json)。

导入内容、生词、作答和进度由当前浏览器保存，各设备单独记录。直接打开离线 HTML 时，保留同一文件路径，并使用同一浏览器以继续原来的学习记录。

## 构建电脑离线版

```sh
python3 tools/build_offline.py /tmp/judu-reader-offline.zip
```

## 许可

项目原创代码和示例采用 [MIT 许可证](LICENSE)。内置词典节选来自 [ECDICT](https://github.com/skywind3000/ECDICT)，保留 [ECDICT 许可](ECDICT-LICENSE.txt)。构词所用的词族关系节选来自 [Princeton WordNet 3.0](https://wordnet.princeton.edu/)，遵守 [WordNet 许可](WORDNET-LICENSE.txt)。

公开版本使用原创阅读材料。导入第三方内容时，请遵守其授权条件。
