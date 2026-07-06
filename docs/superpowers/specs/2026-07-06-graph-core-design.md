# Knowledge Graph Core — Design Spec

**Date:** 2026-07-06
**Scope:** Build the knowledge-graph spine (the "唯一真相源") + the Graph view page. This is step 2 + step 4 of the master Build Spec v2 (§9), adapted to the actual repo (Vue 3 + Vite, not Astro).
**Out of scope this round:** `roadmap.ts → paths/*.yaml` migration, re-linking existing notes to node ids, Dashboard graph thumbnail, arXiv pipeline. These are the next round.

---

## 1. Goal & context

The repo is a polished Vue 3 + Vite front-end with hand-authored static TS data across Dashboard / Feed / Notes / Roadmap pages. The knowledge graph — which the master spec designates as the single source of truth that every other view renders — does not exist yet. This spec builds it: a DAG of domain concepts stored in `nodes.yaml`, validated in CI, and rendered as an interactive Cytoscape view with lit/ghost states, prereq-chain highlighting, and a browser-side wishlist.

**Decisions already made (this session):**
- Data format: **YAML source of truth + zod validation** (aligns with master spec §4 and the content-import template).
- Scope: **graph spine + Graph page only** (ship small).
- Framework: **stay on Vue 3 + Vite** (resolves master spec §10 ⚠️ Astro-vs-Hugo fork by a third path already taken).

---

## 2. Files & dependencies

```
src/data/graph/
  nodes.yaml            # ★ single source of truth: collected + candidate nodes
  schema.ts             # zod schema + exported TS types (GraphNode, Domain, Mastery, …)
  index.ts              # import yaml → validate (dev/build) → derive edges + query helpers
scripts/
  validate_graph.ts     # standalone CI/build gate (node scripts/validate_graph.ts)
src/pages/
  Graph.vue             # route /graph — page shell, legend, hosts the island
src/components/
  GraphView.vue         # Cytoscape client island (mount in onMounted)
  GraphLegend.vue       # state + domain key, wishlist export button
```

**New dependencies:**
- `zod` — schema validation.
- `js-yaml` — parse yaml inside `validate_graph.ts` (node context).
- `@rollup/plugin-yaml` — let Vite `import nodes from './nodes.yaml'` at build time.
- `cytoscape`, `cytoscape-dagre`, `dagre` — layered DAG rendering.

**Wiring:**
- `src/router/index.ts`: add `{ path: '/graph', name: 'graph', component: () => import('@/pages/Graph.vue') }`.
- `src/data/site.ts`: add `{ key: 'nav.graph', to: '/graph' }` to `nav`, placed immediately after `nav.dashboard` (the graph is the site's centerpiece view).
- `src/i18n/messages.ts`: add `nav.graph` (en: "Graph", zh: "图谱") + graph-page strings (legend labels, tooltip labels, export button).
- `package.json`: add `tsx` as a devDep; set `"build": "tsx scripts/validate_graph.ts && vue-tsc --noEmit && vite build"` and expose `"validate:graph": "tsx scripts/validate_graph.ts"`.
- `vite.config.ts`: register `@rollup/plugin-yaml` in the Vite plugins array.

---

## 3. Data model

`src/data/graph/schema.ts` (zod). Mirrors master spec §4.1.

```ts
Domain   = 'iaa' | 'gen' | 'bridge'
Status   = 'collected' | 'candidate'
Mastery  = 'todo' | 'learning' | 'done'
Relation = 'prereq_of' | 'extension_of' | 'adjacent_to'

GraphNode = {
  id: string            // kebab-case, globally unique, stable slug
  title: string         // display label (mostly English technical terms)
  domain: Domain
  status: Status
  prereqs: string[]     // default []  → derives DAG edges (prereq → this node)
  // collected-only:
  mastery?: Mastery
  completed_at?: string // ISO date 'YYYY-MM-DD', only when mastery === 'done'
  // candidate-only:
  suggested_from?: string
  relation?: Relation
}
```

**`.superRefine` rules:**
- `status: collected` → `mastery` required; `suggested_from`/`relation` forbidden; `completed_at` present **iff** `mastery === 'done'`.
- `status: candidate` → `suggested_from` + `relation` required; `mastery`/`completed_at` forbidden.
- `id` matches `^[a-z0-9]+(-[a-z0-9]+)*$`.

**Edges are derived, never stored:** `index.ts` builds `edges = nodes.flatMap(n => n.prereqs.map(p => ({ from: p, to: n.id })))`. Mastery lives only on the node — Graph and (future) Tracker are two views of the same state.

`index.ts` exports: the validated `nodes` array, derived `edges`, and helpers — `nodeById(id)`, `prereqChain(id)` (all ancestors via prereqs), `unlitPrereqChain(id)` (ancestors whose `mastery !== 'done'`), `candidatesOf(id)`, `notesForNode(id)` (stubbed: returns `[]` until notes carry `nodes:[id]` next round).

---

## 4. Validator — `scripts/validate_graph.ts`

The master spec's CI gate. Parses `nodes.yaml` with `js-yaml`, then asserts:

1. **Schema** — every node passes the zod schema (incl. superRefine).
2. **Unique ids** — no duplicate `id`.
3. **Referential integrity** — every `prereqs[]` entry and every `suggested_from` resolves to an existing node id.
4. **Acyclicity** — the prereq graph is a DAG (DFS with white/grey/black coloring; on a back-edge, print the cycle path and exit non-zero).
5. **Candidate hygiene** (warn, not fail) — per `(suggested_from, relation)` group, count > 6 emits a warning (master spec §5.2 cap 3–6).

Exit non-zero with a readable message on any hard failure. Runs standalone (`npm run validate:graph`) and inside `npm run build`, so a bad Claude-Code commit cannot ship a broken graph.

---

## 5. Seed content — two territories (master spec §5.4)

Bootstrapped from §5.4 + existing `roadmap.ts` / `notes.ts` / `feed.ts`. **Mastery flags below are proposed — Alcuin corrects them before commit.** All are `status: collected` unless marked candidate.

### 5.1 IAA backbone (backtrack —登记已掌握, mostly `done`)
| id | title | domain | mastery | prereqs |
|----|-------|--------|---------|---------|
| `mos` | Mean Opinion Score | iaa | done | [] |
| `ava-dataset` | AVA dataset | iaa | done | [mos] |
| `pairwise-ranking` | Pairwise ranking | iaa | done | [] |
| `bradley-terry` | Bradley–Terry model | iaa | done | [pairwise-ranking] |
| `srcc-plcc` | SRCC / PLCC metrics | iaa | done | [] |
| `non-transitive-preference` | Non-transitive preference | iaa | learning | [bradley-terry] |
| `aesthetic-reward-head` | Aesthetic reward head | iaa | todo | [ava-dataset, reward-model] |

### 5.2 Video / multimodal (foresight — 前瞻播种, mostly `todo`)
| id | title | domain | mastery | prereqs |
|----|-------|--------|---------|---------|
| `prob-basics` | Probability basics | gen | done | [] |
| `vae` | VAE | gen | done | [prob-basics] |
| `score-matching` | Score matching | gen | done | [prob-basics] |
| `elbo` | ELBO | gen | done | [prob-basics, vae] |
| `ddpm` | DDPM | gen | learning | [score-matching, elbo] |
| `ddim` | DDIM | gen | todo | [ddpm] |
| `cfg` | Classifier-free guidance | gen | todo | [ddpm] |
| `flow-matching` | Flow matching | gen | learning | [ddpm] |
| `video-diffusion` | Video diffusion | gen | todo | [ddpm, cfg] |

### 5.3 Bridge (桥接边 — connects the two territories)
| id | title | domain | mastery | prereqs |
|----|-------|--------|---------|---------|
| `reward-model` | Reward model | bridge | learning | [bradley-terry] |
| `preference-optimization` | Preference optimization | bridge | todo | [bradley-terry] |
| `dpo` | DPO | bridge | todo | [reward-model, preference-optimization] |
| `diffusion-dpo` | Diffusion-DPO | bridge | todo | [dpo, ddpm] |
| `grpo` | GRPO | bridge | todo | [preference-optimization] |

The bridge edges (`bradley-terry → reward-model`, `dpo → diffusion-dpo ← ddpm`) produce the intended topology: **dense IAA region → bridge → generation-frontier halo**.

### 5.4 Seed candidates (虚影, demonstrate the ghost state)
A few `candidate` nodes so the ghost styling is visible from day one. Per the §5.2 gate, candidates may only hang off nodes with `mastery ≥ learning` — in the seed set those are `ddpm`, `flow-matching`, `non-transitive-preference`, `reward-model`. So:
```yaml
- id: dpm-solver
  title: "DPM-Solver"
  domain: gen
  status: candidate
  suggested_from: ddpm          # ddpm is 'learning' — gate satisfied
  relation: extension_of
- id: consistency-models
  title: "Consistency models"
  domain: gen
  status: candidate
  suggested_from: flow-matching # flow-matching is 'learning'
  relation: adjacent_to
- id: preference-reward-cycles
  title: "Reward hacking under non-transitivity"
  domain: bridge
  status: candidate
  suggested_from: reward-model  # reward-model is 'learning'
  relation: extension_of
```

---

## 6. Graph page & rendering (master spec §5.5)

**Layout:** Cytoscape + `cytoscape-dagre`, `rankDir: 'TB'` (top-down layered — tree-like feel, tolerates DAG cross-edges).

**Visual states — derived only from `tokens.css` wood palette, no chart colors:**
- `done` → solid filled node in wood accent (点亮).
- `learning` → half-bright: accent ring on muted fill.
- `todo` → grey solid (paper-muted).
- `candidate` → dashed outline ghost; `relation` sub-styles the dash/opacity (`prereq_of` vs `extension_of` vs `adjacent_to`).
- **domain** → three subtle wood-derived tints (iaa / gen / bridge), all reading as one wood system.

**Interactions:**
- **Click a node → highlight its un-lit prereq chain** (`unlitPrereqChain`): fade everything else, emphasize ancestors not yet `done` — the "top-down补" entry point.
- **Click a candidate → toggle wishlist** (§7).
- **Hover → tooltip:** `completed_at` (if done) + linked note titles (stub: empty until notes carry node ids next round).

**Rendering discipline:** `GraphView.vue` is a client island — Cytoscape needs the DOM, so instantiate in `onMounted` and destroy in `onUnmounted`. Vite is SPA (no SSR) so no hydration guard needed, but keep Cytoscape import dynamic to avoid bloating other routes' chunks. Colors read from CSS custom properties (via `getComputedStyle` on the container) so light/dark theme both work and stay in sync with `tokens.css`.

**`GraphLegend.vue`:** static key for the four mastery states + three domains + candidate relations, plus the wishlist export button.

---

## 7. Wishlist (browser-side, non-authoritative — master spec §5.3)

- localStorage key `rs:graph:wishlist` → `string[]` of candidate ids (stored as JSON, loaded into a reactive `Set`).
- Clicking a candidate toggles membership; wishlisted ghosts get a distinct marked style (e.g. accent dashed ring).
- **"Export wishlist"** button → assembles a paste-able block for the next Claude Code session:
  ```
  Wishlist to collect (status → collected + generate candidates):
  - dpm-solver
  - consistency-models
  ```
  Copied to clipboard (with a visible fallback textarea).
- **Git is authoritative; localStorage is scratch.** Nothing here writes to the repo; no runtime LLM call anywhere on the site.

---

## 8. i18n & theme

- Node titles: mostly English technical terms, shown as-is (consistent with existing notes/feed convention of keeping technical terms in English).
- Chrome strings (nav label, legend, tooltip field labels, export button, empty states) go through `messages.ts` with en/zh.
- All graph colors resolve from `tokens.css` custom properties → automatic light/dark parity with the rest of the site.

---

## 9. Testing / verification

- `npm run validate:graph` passes on the seed data; deliberately introducing a cycle or a dangling prereq makes it exit non-zero (manual check during build).
- `npm run build` (which now runs the validator + `vue-tsc` + `vite build`) succeeds.
- Manual: `/graph` renders the seeded DAG; clicking `aesthetic-reward-head` highlights its un-lit ancestors (`reward-model`, `ava-dataset` chain); clicking a candidate toggles the wishlist marker; export produces the id list; theme toggle recolors nodes correctly.

---

## 10. Interfaces (isolation check)

- **`schema.ts`** — owns the shape + validation. Depends on `zod`. Consumers import types + the schema object.
- **`index.ts`** — owns loading + derivation + queries. Depends on `nodes.yaml`, `schema.ts`. Everyone reads the graph through its helpers, never re-parses.
- **`validate_graph.ts`** — owns the CI gate. Depends on `js-yaml`, `schema.ts`. No coupling to Vue.
- **`GraphView.vue`** — owns rendering + interaction. Depends on `index.ts` helpers + Cytoscape. Knows nothing about how nodes are stored.
- **`GraphLegend.vue`** / wishlist — owns localStorage + export. Isolated from rendering internals (communicates via props/events).

Each unit is independently understandable and swappable (e.g. swap Cytoscape for another renderer without touching the data layer).
