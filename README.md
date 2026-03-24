# Alcuin 的博客

基于 Hugo + PaperMod 主题的个人博客。

## 快速开始

### 1. 安装 Hugo

**macOS:**
```bash
brew install hugo
```

**Windows (Scoop):**
```bash
scoop install hugo
```

**Linux:**
```bash
sudo apt install hugo
```

### 2. 下载 PaperMod 主题

```bash
cd hugo-new-blog
git init
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

### 3. 本地预览

```bash
hugo server -D
```

打开 http://localhost:1313 查看效果。

### 4. 新建文章

```bash
hugo new content posts/my-new-post.md
```

### 5. 构建（发布前）

```bash
hugo
```

生成的静态文件在 `public/` 目录。

## 写作格式

文章使用 Markdown，Front Matter 示例：

```yaml
---
title: "文章标题"
date: 2024-03-24T10:00:00+08:00
draft: false
tags: ["标签1", "标签2"]
categories: ["分类"]
---
```

## 部署到 GitHub Pages

1. 推送到 GitHub 仓库
2. 在仓库 Settings > Pages 中设置 Source 为 GitHub Actions
3. 工作流已配置，会自动构建和部署

## 主题定制

编辑 `hugo.toml` 修改：
- 网站标题、描述
- 菜单项
- 社交链接
- 主题颜色模式

更多选项参考 [PaperMod 文档](https://github.com/adityatelange/hugo-PaperMod/wiki)。
