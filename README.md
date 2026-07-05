# Research Station

A personal **knowledge cockpit** and public digital garden for a CS PhD student working on
**image aesthetic assessment (IAA)**. It tracks a self-directed study track, keeps a knowledge base
of paper notes, and watches an auto-updated feed of new arXiv papers.

Implemented from the *Research Station* design direction (warm wood-tone, editorial serif) — the
`1b` warm-editorial variation, with the `1c` dark espresso mode as a toggle.

**Live:** https://alcuinyang.github.io/ — deployed from `master` by GitHub Actions on every push
(`.github/workflows/deploy.yml`, via GitHub Pages). This repo replaced the previous Hugo blog,
which remains in the git history.

## Stack

- Vue 3 (`<script setup>`) + TypeScript
- Vite 5
- Vue Router 4 (HTML5 history)
- Vue I18n — English / Chinese, persisted to `localStorage`
- No backend — content lives in typed data modules under `src/data/`

## Bilingual (中 / EN)

Toggle language from the header (`EN / 中`), next to the theme switch. The choice is
persisted and drives `<html lang>`.

- **UI chrome** (nav, section labels, buttons, footer) comes from message catalogs in
  `src/i18n/messages.ts`.
- **Authored prose** (feed abstracts, note bodies, roadmap descriptions) is stored bilingually
  in the data modules as `{ en, zh }` and resolved by the `L()` helper in
  `src/composables/useLocale.ts`.
- **Technical terms stay English by design** — real arXiv paper titles, category codes
  (`cs.CV`), model names (`DDPM`, `GRPO`, `Diffusion-DPO`), and IDs are plain strings, so they
  read the same in both languages and sit inline inside Chinese runs.
- **Mixed-script type** — CJK faces (`Noto Serif SC` / `Noto Sans SC`) sit in the font-stack
  fallbacks, so Latin and Chinese glyphs each resolve to the right face within a single line.

## Commands

```bash
npm install
npm run dev      # dev server on 0.0.0.0:5177
npm run build    # type-check + production build
npm run preview  # preview the build
```

## Structure

```
src/
  components/     AppHeader (masthead + nav + language & theme toggles), MaturityDot
  composables/    useTheme  — light / dark espresso, persisted
                  useLocale — L() picker for bilingual data + locale toggle
  data/           site, feed (arXiv clusters), notes (garden), roadmap (phases)
  i18n/           index.ts (i18n instance + Localized type), messages.ts (en / zh)
  pages/          Dashboard, Feed, Notes, NoteDetail, Roadmap
  styles/         tokens.css (light + dark palette, font stacks), base.css
  router/
```

## Design system

- **Palette** — warm canvas `#E3D7C3`, cream cards, terracotta accent `#B06A43`; dark mode is a
  walnut/espresso `#241D16` with a warmer `#CB8A5E` accent. All colors are CSS variables in
  `src/styles/tokens.css`; dark mode swaps them under `:root[data-theme="dark"]`.
- **Type** — Newsreader (serif reading), IBM Plex Sans (UI), IBM Plex Mono (labels/meta),
  Noto Sans SC (Chinese passages).
- **Note maturity** — `seed` → `growing` → `evergreen`, shown as a hollow / half / solid dot.
