import { useI18n } from 'vue-i18n'
import type { Locale, Localized } from '@/i18n'

/**
 * Locale helpers for content that lives in data modules.
 * `L(value)` returns the string for the current locale; a plain string
 * (a technical term, ID, or paper title kept in English) is returned as-is.
 */
export function useLocale() {
  const { locale } = useI18n()

  const L = (value: Localized): string => {
    if (typeof value === 'string') return value
    return value[locale.value as 'en' | 'zh'] ?? value.en
  }

  const setLocale = (l: Locale) => {
    locale.value = l
  }
  const toggle = () => {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
  }

  return { locale, L, setLocale, toggle }
}
