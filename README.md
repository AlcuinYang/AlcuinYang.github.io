# Alcuin Personal Portal

The public identity and destination index at `alcuinyang.github.io`. The portal links to three
independently deployed workspaces: Research Station, private Tennis OS, and GitHub.

## Stack

- Vue 3 + TypeScript + Vite
- Static GitHub Pages deployment
- Chinese-first bilingual copy, persisted locally
- Semantic landmarks, keyboard focus, responsive layout, and reduced-motion support

## Destination configuration

Links are defined once in `src/config.ts` and can be overridden at build time:

```bash
VITE_RESEARCH_URL=https://research.example.com \
VITE_TENNIS_URL=https://tennis.example.com \
VITE_GITHUB_URL=https://github.com/AlcuinYang \
npm run build
```

The GitHub Actions workflow reads repository variables with the same names. Change a destination
without editing components by updating its repository variable and redeploying.

## Commands

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`postbuild` creates `dist/404.html` so GitHub Pages never returns a blank SPA fallback.

## Release safety

The previous Research Station production state is preserved by the remote tag
`pre-portal-migration-2026-07-22`. The independent destinations are now:

- Research Station: `https://alcuin-research.vercel.app`
- Tennis OS: `https://alcuin-tennis-os.vercel.app`
