<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { feed } from '@/data/feed'
import { notes } from '@/data/notes'
import { phases } from '@/data/roadmap'
import { useLocale } from '@/composables/useLocale'
import MaturityDot from '@/components/MaturityDot.vue'

const { t } = useI18n()
const { L } = useLocale()

const current = phases[0]
const done = current.tasks.filter((t) => t.done).length
const total = current.tasks.length
const nextUp = current.tasks.find((t) => t.current) ?? current.tasks.find((t) => !t.done)
</script>

<template>
  <div class="shell">
    <article class="surface dash">
      <!-- masthead line -->
      <div class="dash__masthead">
        <p class="dash__tagline">{{ t('site.tagline') }}</p>
        <div class="loop">
          <span>{{ t('nav.feed') }}</span><span class="loop__arw">→</span>
          <span>{{ t('nav.notes') }}</span><span class="loop__arw">→</span>
          <span>{{ t('nav.roadmap') }}</span>
        </div>
      </div>
      <hr class="rule dash__rule" />

      <!-- three zones -->
      <div class="dash__grid">
        <!-- ZONE A · Currently -->
        <section class="zone">
          <RouterLink to="/roadmap" class="eyebrow zone__head">{{ t('dash.currently') }}</RouterLink>
          <h3 class="zone__phase">{{ t('common.phase') }} {{ current.n }} · {{ L(current.name) }}</h3>
          <p class="zone__count">
            <span class="zone__count-n">{{ t('dash.of', { done, total }) }}</span>
            <span class="zone__count-lbl">{{ t('dash.tasksComplete') }}</span>
          </p>
          <div class="segbar">
            <span
              v-for="(task, i) in current.tasks"
              :key="i"
              class="segbar__seg"
              :class="{ 'segbar__seg--on': task.done }"
            ></span>
          </div>

          <p class="eyebrow zone__sub">{{ t('dash.nextUp') }}</p>
          <RouterLink to="/roadmap" class="nextup">
            <div class="nextup__title">{{ nextUp ? L(nextUp.title) : '' }}</div>
            <div class="nextup__desc">{{ t('dash.nextUpDesc') }}</div>
          </RouterLink>
        </section>

        <!-- ZONE B · Feed -->
        <section class="zone">
          <RouterLink to="/feed" class="eyebrow zone__head">
            {{ t('dash.fromFeed') }} · {{ t('site.feedDate') }}
          </RouterLink>
          <div class="feedcol">
            <template v-for="(cluster, ci) in feed" :key="ci">
              <div class="feedcol__group">
                <div class="feedcol__label">{{ L(cluster.name) }}</div>
                <RouterLink
                  v-for="item in cluster.items"
                  :key="item.id"
                  to="/feed"
                  class="feedcol__item"
                >
                  {{ item.title }}
                  <span class="feedcol__cat">&nbsp;{{ item.tags[0] }}</span>
                </RouterLink>
              </div>
              <hr v-if="ci < feed.length - 1" class="feedcol__div" />
            </template>
          </div>
        </section>

        <!-- ZONE C · Notes -->
        <section class="zone">
          <RouterLink to="/notes" class="eyebrow zone__head">{{ t('dash.recentNotes') }}</RouterLink>
          <div class="notecol">
            <RouterLink
              v-for="note in notes"
              :key="note.slug"
              :to="`/notes/${note.slug}`"
              class="notecol__item"
            >
              <div class="notecol__title">{{ L(note.title) }}</div>
              <div class="notecol__meta">
                <MaturityDot :maturity="note.maturity" />
                <span class="notecol__mat">{{ t(`maturity.${note.maturity}`) }}</span>
                <span class="notecol__age">· {{ L(note.tended) }}</span>
              </div>
            </RouterLink>
          </div>
        </section>
      </div>
    </article>
  </div>
</template>

<style scoped>
.dash__masthead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 40px 16px;
}
.dash__tagline {
  margin: 0;
  font: 400 italic 15px/1.4 var(--font-serif);
  color: var(--serif-italic);
}
.loop {
  display: flex;
  align-items: center;
  gap: 9px;
  font: 400 11px var(--font-mono);
  color: var(--faint);
  white-space: nowrap;
}
.loop__arw {
  color: var(--accent);
}
.dash__rule {
  margin: 0 40px;
}
.dash__grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr 1fr;
  gap: 36px;
  padding: 28px 40px 40px;
}
.zone__head {
  display: block;
  margin-bottom: 14px;
  transition: color 0.2s ease;
}
a.zone__head:hover {
  color: var(--accent);
}
.zone__phase {
  margin: 0 0 4px;
  font: 500 19px/1.25 var(--font-serif);
  color: var(--ink);
}
.zone__count {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0 0 16px;
}
.zone__count-n {
  font: 500 12px var(--font-sans);
  color: var(--accent);
}
.zone__count-lbl {
  font: 400 12px var(--font-sans);
  color: var(--faint);
}
.segbar {
  display: flex;
  gap: 5px;
  margin-bottom: 22px;
}
.segbar__seg {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--line);
}
.segbar__seg--on {
  background: var(--accent);
}
.zone__sub {
  margin: 0 0 9px;
  letter-spacing: 0.1em;
}
.nextup {
  display: block;
  padding: 15px 16px;
  background: var(--nextup-bg);
  border: 1px solid var(--nextup-border);
  border-radius: 9px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.nextup:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -12px rgba(43, 36, 28, 0.35);
}
.nextup__title {
  font: 500 15px/1.3 var(--font-serif);
  color: var(--ink);
  margin-bottom: 5px;
}
.nextup__desc {
  font: 400 12px/1.45 var(--font-sans);
  color: var(--muted);
}

/* feed column */
.feedcol {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.feedcol__label {
  font: 400 12px var(--font-sans);
  color: var(--accent);
  margin-bottom: 9px;
}
.feedcol__item {
  display: block;
  font: 400 15px/1.4 var(--font-serif);
  color: var(--ink);
  margin-bottom: 5px;
  transition: color 0.18s ease;
}
.feedcol__item:last-child {
  margin-bottom: 0;
}
.feedcol__item:hover {
  color: var(--accent);
}
.feedcol__cat {
  font: 400 10px var(--font-mono);
  color: var(--faint-2);
  white-space: nowrap;
}
.feedcol__div {
  height: 1px;
  background: var(--line-2);
  border: 0;
  margin: 0;
}

/* notes column */
.notecol {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.notecol__title {
  font: 500 16px/1.3 var(--font-serif);
  color: var(--ink);
  margin-bottom: 6px;
  transition: color 0.18s ease;
}
.notecol__item:hover .notecol__title {
  color: var(--accent);
}
.notecol__meta {
  display: flex;
  align-items: center;
  gap: 7px;
}
.notecol__mat {
  font: 400 10px var(--font-mono);
  color: var(--faint);
  letter-spacing: 0.05em;
}
.notecol__age {
  font: 400 10px var(--font-mono);
  color: var(--whisper);
}

@media (max-width: 900px) {
  .dash__grid {
    grid-template-columns: 1fr;
    gap: 34px;
    padding: 26px 28px 34px;
  }
  .dash__masthead {
    padding: 22px 28px 14px;
    flex-direction: column;
    gap: 12px;
  }
  .dash__rule {
    margin: 0 28px;
  }
}
</style>
