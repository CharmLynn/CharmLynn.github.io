# charmlynn.github.io

庄谷 (charmlynn) 的个人博客与自研项目展台。基于 **Astro 7 + Tailwind CSS v4** 构建。

- **站点地址**: [https://charmlynn.github.io/](https://charmlynn.github.io/)
- **核心项目 SaveAnswer**: [https://charmlynn.github.io/saveanswer/](https://charmlynn.github.io/saveanswer/)

---

## 🌟 站点特色

1. **极简极客美学**：沉浸式暗色调、纯净字体排版、精致微边框与高质感卡片布局。
2. **零 JS 运行时负担**：静态输出，秒速加载，Lighthouse 跑分 100/100。
3. **完美兼容 SaveAnswer 子站**：`saveanswer/` 完整保留在 `public/saveanswer/`，Chrome 商店外链、多级落地页、静态资源 100% 正常访问，零破坏。
4. **AI 专注博客**：主博客全面开启新篇章，专注 AI 思考、Local-first 产品设计与独立开发实践。2018 年旧文已妥善归档至 `/archive` 与 `archive_legacy_posts/`。
5. **随时无缝迁往独立服务器**：输出标准静态 HTML，不管是 GitHub Pages、Cloudflare Pages，还是未来独立 VPS（Nginx / Caddy / Docker），一行代码都不用改。

---

## 📁 目录结构

```text
charmlynn.github.io/
├── public/
│   ├── saveanswer/             # 原汁原味的 SaveAnswer 推广页（已完全保留）
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── blog/               # AI 思考与博客 Markdown 文章
│   ├── layouts/
│   │   └── Layout.astro        # 极简全局布局与导航、页脚、SEO
│   ├── pages/
│   │   ├── index.astro         # 首页（个人 Hero + SaveAnswer 置顶卡片 + 最新博文）
│   │   ├── projects.astro      # 项目展台（多维度呈现自研工具与概念设计）
│   │   ├── blog.astro          # 博客专区列表
│   │   ├── blog/[...slug].astro# 博客阅读详页
│   │   ├── about.astro         # 关于我
│   │   ├── archive.astro       # 2018 历史旧文归档索引
│   │   └── rss.xml.ts          # RSS 2.0 订阅端点
│   ├── styles/
│   │   └── global.css          # Tailwind CSS v4 与自定义样式
│   └── content.config.ts       # Astro Content Collections 类型校验
├── archive_legacy_posts/       # 2018 年 8 篇旧 Markdown 博客存档
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages 自动部署流水线
└── astro.config.mjs
```

---

## 🚀 本地开发与预览

推荐使用 **Bun**（或 pnpm / npm）：

```bash
# 安装依赖
bun install

# 启动本地开发服务 (支持热更新)
bun run dev

# 编译打包静态产物
bun run build

# 预览打包产物
bun run preview
```

---

## ✍️ 如何发布新文章

在 `src/content/blog/` 下新建一个 `.md` 文件（如 `my-new-ai-thoughts.md`），头部填入 Frontmatter：

```markdown
---
title: "你的文章标题"
description: "文章的精炼摘要，会显示在列表页和 SEO 卡片中"
pubDate: 2026-11-20
tags: ["AI思考", "Local-first", "独立开发"]
draft: false
---

正文内容... 支持标准 Markdown 语法和代码高亮。
```

保存后直接通过 Git 提交推送到 GitHub，GitHub Actions 会在 1 分钟内自动完成构建并发布上线。

---

## 🌐 未来迁移到独立域名与服务器

### 1. 绑定独立域名（如 charmlynn.com）
在 GitHub 仓库设置中：`Settings -> Pages -> Custom domain` 输入你的域名，并在 DNS 服务商处添加 CNAME 或 A 记录解析即可。

### 2. 迁移到自己的独立云服务器 (VPS)
执行 `bun run build` 生成的 `dist/` 文件夹就是全站的纯静态产物。
Nginx 配置参考示例：

```nginx
server {
    listen 80;
    server_name charmlynn.com;
    root /var/www/charmlynn.github.io/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源强缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp4)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```
