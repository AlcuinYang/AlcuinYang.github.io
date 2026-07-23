const env = import.meta.env

export const destinations = Object.freeze({
  research: env.VITE_RESEARCH_URL || 'https://alcuin-research.vercel.app',
  tennis: env.VITE_TENNIS_URL || 'https://alcuin-tennis-os.vercel.app',
  github: env.VITE_GITHUB_URL || 'https://github.com/AlcuinYang',
})
