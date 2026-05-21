# 部署到公网（GitHub Pages / Cloudflare Pages）

出门用手机、平板看笔记，需要把站点放到互联网上。本教程以 **GitHub Pages（推荐）** 为主，并附 **Cloudflare Pages** 简要步骤。

---

## 部署前要确认

在 `笔记` 文件夹执行，确保能通过：

```bash
npm run check
npm run build
```

成功后会有 `.vitepress/dist` 文件夹（静态网站成品）。

---

## 一、GitHub Pages（推荐：免费 + 自动更新）

### 1. 准备工具

1. 安装 [Git](https://git-scm.com/download/win)
2. 注册 [GitHub](https://github.com/) 账号
3. 安装后终端可执行 `git -v`

### 2. 选择仓库类型（决定网址形式）

| 类型 | 仓库名示例 | 访问地址 | 配置 `base` |
|------|------------|----------|-------------|
| **用户站**（推荐简单） | `你的用户名.github.io` | `https://你的用户名.github.io/` | `/` |
| **项目站** | `jimei-notes` 等任意名 | `https://你的用户名.github.io/jimei-notes/` | `/jimei-notes/` |

下面按 **项目站**（仓库名 `jimei-notes`）举例；若你用 **用户站**，把文中的 `jimei-notes` 换成 `你的用户名.github.io`，且 `base` 用 `/`。

### 3. 在 GitHub 创建空仓库

1. 打开 GitHub → **New repository**
2. 仓库名填：`jimei-notes`（或你想要的英文名）
3. 选 **Private**（笔记建议私有）或 Public
4. **不要**勾选 “Add a README”（本地已有文件）
5. 创建后记下仓库地址，例如：  
   `https://github.com/你的用户名/jimei-notes.git`

### 4. 本地用 Git 管理笔记文件夹

在 `笔记` 目录打开终端，依次执行（邮箱、用户名改成你的）：

```bash
git init
git add .
git commit -m "init: 集美笔记"
git branch -M main
git remote add origin https://github.com/你的用户名/jimei-notes.git
git push -u origin main
```

首次 push 会要求登录 GitHub（浏览器或 Personal Access Token）。

::: tip 隐私
若不想上传 `cursor_.md`（聊天记录），可先执行：  
`git rm --cached cursor_.md`，并把 `cursor_.md` 写入 `.gitignore` 后再 commit。
:::

### 5. 配置 VitePress 的 `base`（项目站必做）

打开 `.vitepress/config.mts`，确认有这一行（已预置）：

```ts
base: process.env.VP_BASE || '/',
```

**项目站** 构建时要带仓库名，本地可先试：

```powershell
# PowerShell（仓库名改成你的）
$env:VP_BASE="/jimei-notes/"; npm run build
```

**用户站** `username.github.io` 不需要改，直接 `npm run build` 即可（`base` 为 `/`）。

### 6. 启用 GitHub Actions 自动部署

仓库里已包含 `.github/workflows/deploy.yml`。推送代码后：

1. 打开 GitHub 仓库 → **Settings** → **Pages**
2. **Build and deployment** → Source 选 **GitHub Actions**
3. 等几分钟，Actions 里出现绿色的 **Deploy VitePress to Pages**
4. Pages 页面会显示网址，例如：  
   `https://你的用户名.github.io/jimei-notes/`

之后每次在本机 `git add` → `git commit` → `git push`，网站会自动重新构建，手机刷新即可看到新笔记。

### 7. 日常更新笔记流程

```bash
# 1. 改完 .md 后
git add .
git commit -m "更新第一讲笔记"
git push

# 2. 等 1～3 分钟，手机打开 Pages 网址刷新
```

### 8. Actions 显示红叉（部署失败）怎么查

1. 打开仓库 **Actions** → 点失败的那条 **init: 集美笔记**（或最新一条）
2. 点左侧红色的 **build** 或 **deploy** → 展开**第一个变红的步骤**，看最后几行英文报错

常见原因与处理：

| 报错大致内容 | 处理 |
|--------------|------|
| `npm ci` / `package-lock` | 确保已提交 `package-lock.json`：`git add package-lock.json` 再 push |
| `npm run check` 失败 | 本地先 `npm run check`，按提示改 `.md` 里的 `:::` |
| `npm run build` / `dead link` | 本地 `npm run build`，不要链到 `templates/`、`.ts` |
| `Permission denied` / `403` | 仓库 **Settings → Actions → General → Workflow permissions** 选 **Read and write** |
| `build` 成功、`deploy` 失败 | **Settings → Pages** 确认 Source 为 **GitHub Actions**；首次 deploy 有时需在 Actions 里点 **Review deployments** 批准 |

改完后本地：

```bash
git add .
git commit -m "fix: 修复 Actions 部署"
git push
```

等 1～2 分钟，Actions 变绿 ✓ 后，**Settings → Pages** 会出现网站地址。

### 9. 打开首页正常，点链接全是 404

**原因：** 项目站地址是 `https://用户名.github.io/仓库名/`，但构建时 `base` 仍是 `/`，链接会跳到 `https://用户名.github.io/guide`（少了仓库名）→ 404。

**处理：**

1. 确认存在 `.vitepress/config.mts`，且含 `base: process.env.VP_BASE || '/'`
2. 重新 `git push`，等 Actions 变绿后再访问
3. 浏览器地址栏必须是 **Settings → Pages 显示的完整网址**（含仓库名），例如：  
   `https://226-cpu.github.io/你的仓库名/`  
   不要只打开 `https://226-cpu.github.io/`
4. 本地验证（把 `你的仓库名` 换成 GitHub 上真实仓库名）：

```powershell
$env:VP_BASE="/你的仓库名/"; npm run build
npx vitepress preview
```

预览里链接若正常，部署后也会正常。

### 10. 其他常见问题

| 现象 | 处理 |
|------|------|
| 网页空白、样式丢失 | 多半是 `base` 不对；项目站必须是 `/仓库名/` |
| 私有仓库 | 免费账户支持私有库 + Pages，访问网站常需登录 GitHub |
| 想用自己的域名 | Pages 设置里填 Custom domain，并把 `base` 改为 `/` |

---

## 二、Cloudflare Pages（可选）

适合已有 Cloudflare 账号、或想用自定义域名的情况。

### 1. 先把代码放到 GitHub

完成上一节 **步骤 3～4**，代码已在 GitHub 上即可。

### 2. 在 Cloudflare 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. 选 **Pages** → **Connect to Git** → 选你的 `jimei-notes` 仓库
3. 构建设置：

| 项 | 值 |
|----|-----|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `.vitepress/dist` |
| Node version | 20 或 22 |

4. **Environment variables**（项目站才要）：

| 变量名 | 值（示例） |
|--------|------------|
| `VP_BASE` | `/jimei-notes/` |

用户站或绑定独立域名时，`VP_BASE` 填 `/`。

5. **Save and Deploy**，等构建完成，会给出 `https://xxx.pages.dev` 地址。

### 3. 更新

之后每次 `git push`，Cloudflare 会自动重新构建。

---

## 三、不用 GitHub Actions 的手动上传（了解即可）

1. 本地：`npm run build`（项目站记得设 `VP_BASE`）
2. 把 `.vitepress/dist` **里的所有文件**（不是 dist 文件夹本身）上传到：
   - GitHub Pages 的 `gh-pages` 分支，或
   - Cloudflare / 其他静态空间的网站根目录

步骤多、易漏文件，**更推荐第一节的自动部署**。

---

## 四、三种访问方式对照

| 方式 | 命令 / 操作 | 适用场景 |
|------|-------------|----------|
| 本机 | `npm run dev` | 电脑上写笔记 |
| 同 WiFi 手机 | `npm run dev:lan` | 宿舍/家，不部署 |
| 公网 | `git push` → GitHub Pages | 出门、学校外任意网络 |

---

## 五、安全提醒

- 笔记含课程内容，**建议 GitHub 仓库设为 Private**
- 不要把 API 密钥、密码写进笔记或提交到 Git
- `cursor_.md` 等私人对话导出建议加入 `.gitignore`

---

更基础的本地用法见 [使用说明](/guide)。
