# Content Import Template — 知识树补给协议

> 你（Alcuin）在 Claude Code 会话里，把一个「学习事件」按下面的 **INPUT** 填好交给 agent；
> agent 按 **CONTRACT** 处理，产出 **OUTPUT** 的四个块。你审阅 → 落成一次 commit。
> 原则：**curation > automation。agent 起草，你拍板。绝不自动收纳。**

---

## 0. 什么时候用

- 我读完/理解了一个概念，想把它「点亮」进图（回溯）。
- 我想在某个方向前瞻播种几个待学节点（前瞻）。
- 我读了一篇 arXiv，想把它变成一则笔记 + 挂到节点。

一次只喂**一个种子**（一个概念 / 一篇论文）。批量会稀释综合质量。

---

## 1. INPUT — 我填的表（复制这块，填空）

```
### 种子
concept: <概念名，例如 "DDIM" / 或 arXiv id 2010.02502 / 或 "我想搞懂 flow matching">
domain: <iaa | gen | bridge>        # 归到哪片疆域
intent: <todo | learning | done>    # 我现在对它的掌握意图；done = 我已经会了要点亮

### 上下文（尽量填，能提升 agent 的定位质量）
path: <这个概念属于哪条学习路径的哪个 phase，例如 "video-gen / Phase 1"；没有就写 none>
prereqs_i_have: [<我自认已掌握、图里应已存在的前置 id，例如 ddpm, vae>]
source: <paper_url 或 "无">
my_understanding: |
  <2~4 句我自己现在的粗理解 / 我卡在哪。允许空，但填了 agent 能对齐我的水平，笔记不会写成教科书。>
lang: <en | zh>                     # 这则笔记正文主语言（站点 UI 恒为英文）
```

### 填写须知
- `intent: done` = 你已掌握 → agent 会填 `completed_at`（**你告诉它今天日期**，脚本环境取不到当前时间）。
- `prereqs_i_have` 里的 id 必须是图里**已存在**的节点；不存在的 agent 会提示你先补，或作为额外候选列出，**不会**擅自新建成 collected。
- `my_understanding` 是校准器：写得越具体，笔记越贴你的真实水位，越不像 wiki。

---

## 2. CONTRACT — agent 必须遵守的规则

1. **定位节点**：把 `concept` 落成一个 node（稳定 kebab-case `id`、`title`、`domain`、`prereqs`）。`status: collected`，`mastery = intent`。
2. **前置检查**：`prereqs` 里每个 id 要么在现有 `nodes.yaml` 中存在，要么明确标为「缺口」列进候选，供我决定是否回补。**不得静默新建 collected 节点。**
3. **生成候选（§5.2 闸门）**：
   - 只有当本节点 `mastery ≥ learning` 时才生成候选；`todo` 节点**不长光晕**。
   - 按 relation 分三类：`prereq_of` / `extension_of` / `adjacent_to`。
   - **每类 cap 3~6，只出 top-N 最该学的**，宁少勿滥。候选 `status: candidate`，带 `suggested_from` = 本节点 id。
   - **候选不再生候选**（不递归）。
4. **起草笔记**：一则挂在本节点上的笔记（frontmatter `nodes: [<id>]` 多对多），正文用 §3.C 的骨架，语言 = `lang`。写成「我的综合」，不是摘要搬运。
5. **可选产物**：若概念该进某 feed 簇，提 1~3 个 `keywords.json` 关键词；若属于某 path，给出该 path 的 step 补丁。
6. **零运行时 LLM**：这一切发生在离线会话，产物是纯静态 YAML/TS/MD。站点运行时不调模型。
7. **收敛输出**：只回 §3 的四个块 + 一段「给我的决策清单」（哪些要我确认、哪些是缺口）。不写寒暄。

---

## 3. OUTPUT — agent 的标准化产物（四块）

### A. 收纳节点（追加进 `src/data/graph/nodes.yaml`）
```yaml
- id: ddim
  title: "DDIM"
  domain: gen
  status: collected
  mastery: learning
  completed_at:                 # 仅当 mastery: done 时由我给的日期填入
  prereqs: [ddpm]
```

### B. 候选节点（同文件，虚影；我勾选后才转 collected）
```yaml
- id: dpm-solver
  title: "DPM-Solver"
  domain: gen
  status: candidate
  suggested_from: ddim
  relation: extension_of        # prereq_of | extension_of | adjacent_to
- id: pf-ode
  title: "Probability-flow ODE"
  domain: gen
  status: candidate
  suggested_from: ddim
  relation: prereq_of
```

### C. 笔记（`src/content/notes/<slug>.mdx`，或当前仓库的 `src/data/notes.ts` 条目）
```yaml
---
title: "DDIM — deterministic sampling in one page"
date: 2026-07-06
nodes: [ddim]                   # ★ 挂载节点，多对多
tags: [diffusion, sampling]
status: seed                    # seed | growing | evergreen（笔记成熟度，与 mastery 正交）
lang: en
paper_url: https://arxiv.org/abs/2010.02502
paper_authors: "Song, Meng, Ermon"
review:                         # 可选，SRS 预留
  - { q: "Why is DDIM sampling deterministic?", a: "Zero-variance reverse step; same non-Markovian ODE." }
---
```
正文骨架（我的综合，≤ 一页）：
1. **一句话定位** — 它是什么、和已知的什么互为变体。
2. **核心机制** — 最少的公式 + 一段直觉。
3. **为什么重要 / 我为什么学它** — 挂回我的主线（IAA / 生成前沿）。
4.（可选）**我卡住的点 / 待办** — 让 seed 笔记诚实。

### D. 决策清单（给我，纯文本）
```
- 待确认收纳: [dpm-solver, pf-ode]   ← 想学的在下次会话勾进心愿单/收纳
- 缺口(prereq 不在图里): [none]
- 建议 feed 关键词: ["DDIM inversion", "consistency models"]
- path 补丁: video-gen / Phase 1 追加 step {node: ddim, task: "...", gate: false}
```

---

## 4. 一个填好的真实例子（可直接照抄改）

**INPUT**
```
### 种子
concept: DDIM
domain: gen
intent: learning
### 上下文
path: video-gen / Phase 1
prereqs_i_have: [ddpm]
source: https://arxiv.org/abs/2010.02502
my_understanding: |
  知道 DDIM 采样更快、可以确定性采样，但没搞清它和 DDPM 的反向过程差在哪，
  以及为什么能跳步。想把「同一条概率路径的不同离散化」这句说清。
lang: en
```

**OUTPUT** → 见 §3 A–D（上面各块正是这个例子的产物）。

---

## 5. 边界（别越线 —— 对应 spec §1 铁律）

- 预铺疆域仅限 spec §5.4 两片（IAA 回溯 + 视频/多模态前瞻 + bridge 桥接边）。此模板之外**不批量造节点**。
- 候选只由 agent 推荐、由我点击/勾选收纳。**git 为准**，浏览器心愿单只是暂存。
- 掌握度只存在 node 上；path 和 graph 是同一状态的两个视图，不各存一份。
```
