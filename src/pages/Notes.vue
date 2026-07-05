<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { notes, type Maturity } from '@/data/notes'
import { useLocale } from '@/composables/useLocale'
import MaturityDot from '@/components/MaturityDot.vue'

const { t } = useI18n()
const { L } = useLocale()

const maturities: Array<'all' | Maturity> = ['all', 'evergreen', 'growing', 'seed']
const active = ref<'all' | Maturity>('all')

const shown = computed(() =>
  active.value === 'all' ? notes : notes.filter((n) => n.maturity === active.value),
)
</script>

<template>
  <div class="shell shell--narrow">
    <article class="surface notes">
      <header class="notes__head">
        <h1 class="notes__title">{{ t('notes.title') }}</h1>
        <p class="notes__intro" v-html="t('notes.intro')"></p>
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
      </header>

      <div class="list">
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
            <span v-for="tg in note.tags" :key="tg" class="tag">{{ tg }}</span>
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
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
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
