<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { feed, formatAge } from '@/data/feed'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { L, locale } = useLocale()

// -1 = all clusters, otherwise the cluster index
const active = ref(-1)

const shown = computed(() =>
  active.value === -1 ? feed : [feed[active.value]],
)
</script>

<template>
  <div class="shell shell--narrow">
    <article class="surface feed">
      <header class="feed__head">
        <h1 class="feed__title">{{ t('feed.title') }}</h1>
        <p class="feed__intro">{{ t('feed.intro') }}</p>
        <div class="chips">
          <button
            class="chip"
            :class="{ 'chip--on': active === -1 }"
            type="button"
            @click="active = -1"
          >
            {{ t('feed.all') }}
          </button>
          <button
            v-for="(cluster, ci) in feed"
            :key="ci"
            class="chip"
            :class="{ 'chip--on': active === ci }"
            type="button"
            @click="active = ci"
          >
            {{ L(cluster.short) }}
          </button>
        </div>
      </header>

      <section v-for="(cluster, ci) in shown" :key="ci" class="cluster">
        <div class="cluster__head">
          <span class="cluster__name">{{ L(cluster.name) }}</span>
          <span class="cluster__count">{{ t('feed.new', { n: cluster.items.length }) }}</span>
        </div>
        <div class="cluster__items">
          <article v-for="item in cluster.items" :key="item.id" class="item">
            <div class="item__id">{{ item.id }}</div>
            <div class="item__body">
              <h3 class="item__title">
                {{ item.title }}
                <span v-if="item.suffix" class="item__suffix">({{ item.suffix }})</span>
              </h3>
              <p class="item__abstract">{{ L(item.abstract) }}</p>
              <div class="item__tags">
                <span class="tag tag--cat">{{ item.tags[0] }}</span>
                <span v-for="tg in item.tags.slice(1)" :key="tg" class="tag">{{ tg }}</span>
              </div>
            </div>
            <div class="item__age">{{ formatAge(item.age, locale) }}</div>
          </article>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.feed__head {
  padding: 34px 40px 10px;
}
.feed__title {
  margin: 0 0 8px;
  font: 500 30px/1.1 var(--font-serif);
  letter-spacing: -0.01em;
  color: var(--ink);
}
.feed__intro {
  margin: 0;
  max-width: 60ch;
  font: 400 14px/1.5 var(--font-sans);
  color: var(--muted);
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

.cluster {
  padding: 26px 40px 8px;
}
.cluster__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 8px;
}
.cluster__name {
  font: 500 13px var(--font-sans);
  color: var(--ink);
  letter-spacing: 0.02em;
}
.cluster__count {
  font: 400 11px var(--font-mono);
  color: var(--faint);
}
.item {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line-2);
}
.cluster__items .item:last-child {
  border-bottom: 0;
}
.item__id {
  font: 400 11px var(--font-mono);
  color: var(--faint-2);
  padding-top: 4px;
  flex: none;
  width: 74px;
}
.item__body {
  flex: 1;
  min-width: 0;
}
.item__title {
  margin: 0 0 5px;
  font: 400 17px/1.35 var(--font-serif);
  color: var(--ink);
}
.item__suffix {
  font: 400 12px var(--font-mono);
  color: var(--faint-2);
}
.item__abstract {
  margin: 0 0 9px;
  font: 400 12.5px/1.5 var(--font-sans);
  color: var(--muted);
}
.item__tags {
  display: flex;
  gap: 7px;
}
.tag {
  font: 400 10px var(--font-mono);
  color: var(--chip-ink);
  background: var(--chip-bg);
  padding: 3px 8px;
  border-radius: 4px;
}
.tag--cat {
  color: var(--accent);
  background: var(--accent-fill);
}
.item__age {
  flex: none;
  font: 400 11px var(--font-mono);
  color: var(--whisper);
  padding-top: 4px;
}
.cluster:last-child {
  padding-bottom: 34px;
}

@media (max-width: 720px) {
  .feed__head {
    padding: 26px 22px 8px;
  }
  .cluster {
    padding: 22px 22px 8px;
  }
  .item {
    gap: 12px;
  }
  .item__id {
    width: 62px;
  }
}
</style>
