# 集美笔记（本机）

多课程 Markdown 笔记，VitePress 本地预览。

## 快速开始

```bash
npm install
npm run dev
```

手机同 WiFi 查看：`npm run dev:lan`，用手机浏览器打开终端里的 `http://192.168.x.x:5173`。详见 [guide.md](./guide.md#在手机上查看)。

## 课程与配置

- 每门课一个**文件夹**
- 所有课程在 **`.vitepress/courses.ts`** 统一注册（侧栏、顶栏自动生成）
- 笔记模板见 **`templates/`**

- 使用说明：站点内 [guide](/guide) 或本地 `guide.md`
- 部署到公网：[deploy](/deploy) 或本地 `deploy.md`
