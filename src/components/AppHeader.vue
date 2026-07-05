<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { site, nav } from '@/data/site'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const { t } = useI18n()
const { theme, toggle } = useTheme()
const { locale, toggle: toggleLocale } = useLocale()

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <header class="hdr">
    <div class="hdr__inner">
      <RouterLink to="/" class="masthead">
        <span class="masthead__name">{{ site.owner }}</span>
        <span class="masthead__caps">Research&nbsp;Station</span>
      </RouterLink>

      <nav class="nav">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="nav__link"
          :class="{ 'nav__link--active': isActive(item.to) }"
        >
          {{ t(item.key) }}
        </RouterLink>

        <button
          class="lang"
          type="button"
          :aria-label="t('lang.switchTo')"
          :title="t('lang.switchTo')"
          @click="toggleLocale"
        >
          <span :class="{ 'lang--on': locale === 'en' }">EN</span>
          <span class="lang__sep">/</span>
          <span :class="{ 'lang--on': locale === 'zh' }">中</span>
        </button>

        <button
          class="toggle"
          type="button"
          :aria-label="theme === 'dark' ? 'Switch to light' : 'Switch to dark'"
          :title="theme === 'dark' ? 'Light' : 'Dark'"
          @click="toggle"
        >
          <svg v-if="theme === 'dark'" viewBox="0 0 24 24" width="15" height="15" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" />
          </svg>
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--page) 88%, transparent);
  backdrop-filter: saturate(1.1) blur(8px);
  border-bottom: 1px solid var(--line);
  transition: background-color 0.35s ease, border-color 0.35s ease;
}
.hdr__inner {
  max-width: 1160px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.masthead {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.masthead__name {
  font: 500 21px var(--font-serif);
  letter-spacing: -0.01em;
  color: var(--ink);
}
.masthead__caps {
  font: 400 10.5px var(--font-mono);
  color: var(--masthead-caps);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: translateY(-1px);
}
.nav {
  display: flex;
  align-items: center;
  gap: 26px;
}
.nav__link {
  font: 400 13px var(--font-sans);
  color: var(--muted);
  padding-bottom: 2px;
  border-bottom: 1.5px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.nav__link:hover {
  color: var(--ink);
}
.nav__link--active {
  color: var(--ink);
  border-bottom-color: var(--accent);
}
.lang {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: transparent;
  font: 500 11px var(--font-mono);
  color: var(--faint);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.lang:hover {
  border-color: var(--accent-border);
  background: var(--accent-fill);
}
.lang--on {
  color: var(--accent);
}
.lang__sep {
  color: var(--line);
}
.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-left: 2px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.toggle:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-fill);
}

@media (max-width: 720px) {
  .hdr__inner {
    padding: 12px 14px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .nav {
    gap: 16px;
  }
  .masthead__caps {
    display: none;
  }
}
</style>
