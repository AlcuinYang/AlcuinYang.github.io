import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import { messages } from './messages'

export type Locale = 'en' | 'zh'

/** A value that either is the same in both languages (technical terms, IDs)
 *  or carries an English / Chinese pair. */
export type Localized = string | { en: string; zh: string }

const STORAGE_KEY = 'research-station-locale'

function initialLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved === 'en' || saved === 'zh') return saved
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages,
})

function applyLang(loc: string) {
  document.documentElement.setAttribute('lang', loc === 'zh' ? 'zh-CN' : 'en')
  localStorage.setItem(STORAGE_KEY, loc)
}

// react to locale changes (and set the initial <html lang>)
applyLang(i18n.global.locale.value)
watch(i18n.global.locale, applyLang)
