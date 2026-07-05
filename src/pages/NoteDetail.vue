<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { noteBySlug } from '@/data/notes'
import { useLocale } from '@/composables/useLocale'
import MaturityDot from '@/components/MaturityDot.vue'

const { t } = useI18n()
const { L } = useLocale()

const props = defineProps<{ slug: string }>()
const note = computed(() => noteBySlug(props.slug))
</script>

<template>
  <div class="shell shell--reading">
    <article v-if="note" class="surface note">
      <div class="note__wrap">
        <!-- breadcrumb -->
        <nav v-if="note.breadcrumb" class="crumb">
          <template v-for="(c, i) in note.breadcrumb" :key="i">
            <span :class="{ 'crumb--last': i === note.breadcrumb.length - 1 }">{{ L(c) }}</span>
            <span v-if="i < note.breadcrumb.length - 1" class="crumb__sep">/</span>
          </template>
        </nav>

        <!-- maturity + meta -->
        <div class="meta">
          <MaturityDot :maturity="note.maturity" />
          <span class="meta__mat">{{ t(`maturity.${note.maturity}`) }}</span>
          <span class="meta__rest">
            · {{ t('notes.lastTended', { when: L(note.tended) }) }}<template v-if="note.minutes"> · {{ t('notes.min', { n: note.minutes }) }}</template>
          </span>
        </div>

        <h1 class="title">{{ L(note.title) }}</h1>
        <p class="lede">{{ L(note.lede) }}</p>

        <div class="tags">
          <span v-if="note.arxiv" class="tag tag--accent">arXiv:{{ note.arxiv }}</span>
          <span v-for="t in note.tags" :key="t" class="tag">{{ t }}</span>
        </div>

        <!-- body -->
        <div class="prose">
          <template v-for="(block, i) in note.body" :key="i">
            <h2 v-if="block.type === 'h2'" class="prose__h2">
              {{ L(block.text) }}
              <span class="prose__tick"></span>
            </h2>
            <div v-else-if="block.type === 'formula'" class="prose__formula" v-html="block.html" />
            <blockquote v-else-if="block.type === 'quote'" class="prose__quote" v-html="L(block.html)" />
            <p v-else-if="block.type === 'cjk'" class="prose__cjk" v-html="L(block.html)" />
            <p v-else class="prose__p" v-html="L(block.html)" />
          </template>

          <div v-if="note.linked?.length" class="linked">
            <span class="linked__label">{{ t('notes.linked') }}</span>
            <template v-for="(l, i) in note.linked" :key="i">
              <span class="linked__item">{{ L(l) }}</span>
              <span v-if="i < note.linked.length - 1" class="linked__sep">·</span>
            </template>
          </div>
        </div>

        <RouterLink to="/notes" class="back">{{ t('notes.back') }}</RouterLink>
      </div>
    </article>

    <article v-else class="surface note">
      <div class="note__wrap missing">
        <p>{{ t('notes.missing') }}</p>
        <RouterLink to="/notes" class="back">{{ t('notes.back') }}</RouterLink>
      </div>
    </article>
  </div>
</template>

<style scoped>
.note__wrap {
  padding: 40px 76px 60px;
}
.crumb {
  font: 400 11px var(--font-mono);
  color: var(--faint-2);
  letter-spacing: 0.04em;
  margin-bottom: 26px;
}
.crumb--last {
  color: var(--muted);
}
.crumb__sep {
  margin: 0 6px;
  color: var(--whisper);
}
.meta {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 16px;
}
.meta__mat {
  font: 400 11px var(--font-mono);
  color: var(--accent);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.meta__rest {
  font: 400 11px var(--font-mono);
  color: var(--whisper);
}
.title {
  margin: 0 0 14px;
  font: 500 38px/1.12 var(--font-serif);
  letter-spacing: -0.015em;
  color: var(--ink);
}
.lede {
  margin: 0 0 22px;
  max-width: 66ch;
  font: 400 italic 17px/1.5 var(--font-serif);
  color: var(--serif-italic);
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 34px;
}
.tag {
  font: 400 10px var(--font-mono);
  color: var(--chip-ink);
  background: var(--chip-bg);
  padding: 4px 9px;
  border-radius: 4px;
}
.tag--accent {
  color: var(--accent);
  background: var(--accent-fill);
}

.prose {
  max-width: 66ch;
}
.prose__p {
  margin: 0 0 22px;
  font: 400 18px/1.72 var(--font-serif);
  color: var(--ink-serif);
}
.prose__p :deep(em) {
  font-style: italic;
}
.prose :deep(code) {
  font: 400 16px var(--font-mono);
  color: var(--accent);
}
.prose__h2 {
  position: relative;
  margin: 36px 0 16px;
  padding-bottom: 10px;
  font: 500 15px var(--font-sans);
  letter-spacing: 0.03em;
  color: var(--ink);
}
.prose__tick {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 34px;
  height: 2px;
  background: var(--accent);
}
.prose__formula {
  background: var(--accent-fill-2);
  border-left: 2px solid var(--accent);
  border-radius: 0 8px 8px 0;
  padding: 16px 22px;
  margin: 0 0 22px;
  font: 400 17px var(--font-mono);
  color: var(--accent-ink);
  letter-spacing: 0.01em;
  overflow-x: auto;
}
.prose__quote {
  margin: 0 0 24px;
  padding: 4px 0 4px 22px;
  border-left: 2px solid var(--accent-border);
  font: 400 italic 19px/1.6 var(--font-serif);
  color: var(--muted-2);
}
.prose__cjk {
  margin: 0 0 20px;
  font: 400 18px/1.95 var(--font-cjk);
  color: var(--ink-serif);
  letter-spacing: 0.01em;
}
.prose__cjk :deep(strong) {
  font-weight: 500;
}
.linked {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.linked__label {
  font: 400 11px var(--font-mono);
  color: var(--faint-2);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.linked__item {
  font: 400 12px var(--font-sans);
  color: var(--accent);
}
.linked__sep {
  color: var(--line);
}
.back {
  display: inline-block;
  margin-top: 40px;
  font: 400 12px var(--font-mono);
  color: var(--muted);
  transition: color 0.18s ease;
}
.back:hover {
  color: var(--accent);
}
.missing {
  text-align: center;
  color: var(--muted);
  font: 400 16px/1.6 var(--font-serif);
}

@media (max-width: 720px) {
  .note__wrap {
    padding: 30px 24px 44px;
  }
  .title {
    font-size: 30px;
  }
  .prose__p,
  .prose__cjk {
    font-size: 17px;
  }
}
</style>
