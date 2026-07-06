<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { notes, allNoteTags, noteSearchText, type Maturity } from '@/data/notes'
import { useLocale } from '@/composables/useLocale'
import MaturityDot from '@/components/MaturityDot.vue'

const { t } = useI18n()
const { L } = useLocale()

const maturities: Array<'all' | Maturity> = ['all', 'evergreen', 'growing', 'seed']
const active = ref<'all' | Maturity>('all')
const query = ref('')
const activeTag = ref<string | null>(null)

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return notes.filter((n) => {
    if (active.value !== 'all' && n.maturity !== active.value) return false
    if (activeTag.value && !n.tags.includes(activeTag.value)) return false
    if (q && !noteSearchText(n).includes(q)) return false
    return true
  })
})

const filtered = computed(
  () => active.value !== 'all' || activeTag.value !== null || query.value.trim() !== '',
)

function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? null : tag
}

function clearFilters() {
  active.value = 'all'
  activeTag.value = null
  query.value = ''
}
</script>

<template>
  <div class="shell shell--narrow">
    <article class="surface notes">
      <header class="notes__head">
        <h1 class="notes__title">{{ t('notes.title') }}</h1>
        <p class="notes__intro" v-html="t('notes.intro')"></p>

        <div class="search">
          <svg class="search__icon" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.5" />
            <line x1="10.8" y1="10.8" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <input
            v-model="query"
            class="search__input"
            type="search"
            :placeholder="t('notes.search')"
            :aria-label="t('notes.search')"
          />
        </div>

        <div class="chips">
          <button
            v-for="m in maturities"
            :key="m"
            class="chip"
            :class="{ 'chip--on': active === m }"
            type="button"
            @click="active = m"
          >
            {{ m === 'all' ? t('notes.all') : t(`maturity.${m}`) }}
          </button>
        </div>

        <div class="chips chips--tags">
          <button
            v-for="tag in allNoteTags"
            :key="tag"
            class="chip chip--tag"
            :class="{ 'chip--on': activeTag === tag }"
            type="button"
            @click="toggleTag(tag)"
          >
            #{{ tag }}
          </button>
        </div>

        <div v-if="filtered" class="result">
          <span class="result__count">{{ t('notes.count', { n: shown.length, total: notes.length }) }}</span>
          <button class="result__clear" type="button" @click="clearFilters">{{ t('notes.clear') }}</button>
        </div>
      </header>

      <p v-if="shown.length === 0" class="empty">{{ t('notes.noResults') }}</p>

      <div v-else class="list">
        <RouterLink
          v-for="note in shown"
          :key="note.slug"
          :to="`/notes/${note.slug}`"
          class="note"
        >
          <div class="note__main">
            <h3 class="note__title">{{ L(note.title) }}</h3>
            <p class="note__lede">{{ L(note.lede) }}</p>
            <div class="note__meta">
              <MaturityDot :maturity="note.maturity" />
              <span class="note__mat">{{ t(`maturity.${note.maturity}`) }}</span>
              <span class="note__dot">·</span>
              <span class="note__age">{{ t('notes.lastTended', { when: L(note.tended) }) }}</span>
              <span v-if="note.minutes" class="note__dot">·</span>
              <span v-if="note.minutes" class="note__age">{{ t('notes.min', { n: note.minutes }) }}</span>
            </div>
          </div>
          <div class="note__tags">
            <button
              v-for="tg in note.tags"
              :key="tg"
              class="tag"
              :class="{ 'tag--on': activeTag === tg }"
              type="button"
              @click.prevent.stop="toggleTag(tg)"
            >
              {{ tg }}
            </button>
          </div>
        </RouterLink>
      </div>
    </article>
  </div>
</template>

<style scoped>
.notes__head {
  padding: 34px 40px 10px;
}
.notes__title {
  margin: 0 0 8px;
  font: 500 30px/1.1 var(--font-serif);
  letter-spacing: -0.01em;
  color: var(--ink);
}
.notes__intro {
  margin: 0;
  max-width: 62ch;
  font: 400 14px/1.55 var(--font-sans);
  color: var(--muted);
}
.notes__intro :deep(em) {
  font-style: italic;
  color: var(--accent);
}
.search {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 18px;
  padding: 0 13px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: transparent;
  transition: border-color 0.18s ease;
}
.search:focus-within {
  border-color: var(--accent-border);
}
.search__icon {
  width: 15px;
  height: 15px;
  flex: none;
  color: var(--faint);
}
.search__input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
  padding: 9px 0;
  font: 400 13.5px var(--font-sans);
  color: var(--ink);
}
.search__input::placeholder {
  color: var(--whisper);
}
.search__input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.chips--tags {
  margin-top: 8px;
}
.chip {
  font: 400 11px var(--font-mono);
  color: var(--muted);
  border: 1px solid var(--line);
  background: transparent;
  padding: 4px 11px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.18s ease;
}
.chip:hover {
  border-color: var(--accent-border);
  color: var(--accent);
}
.chip--on {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-fill);
}
.chip--tag {
  color: var(--faint);
}

.result {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 14px;
}
.result__count {
  font: 400 11px var(--font-mono);
  color: var(--faint);
}
.result__clear {
  font: 400 11px var(--font-mono);
  color: var(--accent);
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: border-color 0.18s ease;
}
.result__clear:hover {
  border-bottom-color: var(--accent-border);
}
.empty {
  margin: 0;
  padding: 40px;
  font: 400 14px var(--font-sans);
  color: var(--muted);
}

.list {
  padding: 12px 40px 34px;
}
.note {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 22px 0;
  border-top: 1px solid var(--line-2);
}
.note:first-child {
  border-top: 0;
}
.note__title {
  margin: 0 0 7px;
  font: 500 20px/1.25 var(--font-serif);
  color: var(--ink);
  transition: color 0.18s ease;
}
.note:hover .note__title {
  color: var(--accent);
}
.note__lede {
  margin: 0 0 12px;
  max-width: 58ch;
  font: 400 13.5px/1.55 var(--font-sans);
  color: var(--muted);
}
.note__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}
.note__mat {
  font: 400 10px var(--font-mono);
  color: var(--faint);
  letter-spacing: 0.05em;
}
.note__dot {
  color: var(--whisper);
}
.note__age {
  font: 400 10px var(--font-mono);
  color: var(--whisper);
}
.note__tags {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
  flex: none;
}
.tag {
  font: 400 10px var(--font-mono);
  color: var(--chip-ink);
  background: var(--chip-bg);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.18s ease;
}
.tag:hover {
  color: var(--accent);
  border-color: var(--accent-border);
}
.tag--on {
  color: var(--accent);
  background: var(--accent-fill);
  border-color: var(--accent-border);
}

@media (max-width: 720px) {
  .notes__head {
    padding: 26px 22px 8px;
  }
  .list {
    padding: 8px 22px 28px;
  }
  .note {
    flex-direction: column;
    gap: 12px;
  }
  .note__tags {
    flex-direction: row;
    align-items: flex-start;
  }
}
</style>
