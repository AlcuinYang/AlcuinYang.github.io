<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { feed, formatAge, type FeedItem } from '@/data/feed'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { L, locale } = useLocale()

// -1 = all clusters, otherwise the cluster index
const active = ref(-1)
const query = ref('')
const activeTag = ref<string | null>(null)

function itemText(item: FeedItem): string {
  return `${item.id} ${item.title} ${item.suffix ?? ''} ${item.abstract.en} ${item.abstract.zh} ${item.tags.join(' ')}`.toLowerCase()
}

function itemMatches(item: FeedItem): boolean {
  if (activeTag.value && !item.tags.includes(activeTag.value)) return false
  const q = query.value.trim().toLowerCase()
  return q === '' || itemText(item).includes(q)
}

// clusters filtered by the selected cluster chip, then by search + tag,
// with empty clusters dropped
const shown = computed(() =>
  feed
    .map((cluster, ci) => ({ cluster, ci }))
    .filter(({ ci }) => active.value === -1 || ci === active.value)
    .map(({ cluster, ci }) => ({ ...cluster, ci, items: cluster.items.filter(itemMatches) }))
    .filter((cluster) => cluster.items.length > 0),
)

const total = computed(() => shown.value.reduce((sum, c) => sum + c.items.length, 0))
const filtered = computed(
  () => active.value !== -1 || activeTag.value !== null || query.value.trim() !== '',
)

function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? null : tag
}

function clearFilters() {
  active.value = -1
  activeTag.value = null
  query.value = ''
}
</script>

<template>
  <div class="shell shell--narrow">
    <article class="surface feed">
      <header class="feed__head">
        <h1 class="feed__title">{{ t('feed.title') }}</h1>
        <p class="feed__intro">{{ t('feed.intro') }}</p>

        <div class="search">
          <svg class="search__icon" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.5" />
            <line x1="10.8" y1="10.8" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <input
            v-model="query"
            class="search__input"
            type="search"
            :placeholder="t('feed.search')"
            :aria-label="t('feed.search')"
          />
        </div>

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

        <div v-if="filtered" class="result">
          <span class="result__count">{{ t('feed.new', { n: total }) }}</span>
          <button class="result__clear" type="button" @click="clearFilters">{{ t('feed.clear') }}</button>
        </div>
      </header>

      <p v-if="shown.length === 0" class="empty">{{ t('feed.noResults') }}</p>

      <section v-for="cluster in shown" :key="cluster.ci" class="cluster">
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
                <button
                  v-for="(tg, ti) in item.tags"
                  :key="tg"
                  class="tag"
                  :class="{ 'tag--cat': ti === 0, 'tag--on': activeTag === tg }"
                  type="button"
                  @click="toggleTag(tg)"
                >
                  {{ tg }}
                </button>
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
  padding: 34px 40px;
  font: 400 14px var(--font-sans);
  color: var(--muted);
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
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.18s ease;
}
.tag:hover {
  color: var(--accent);
  border-color: var(--accent-border);
}
.tag--cat {
  color: var(--accent);
  background: var(--accent-fill);
}
.tag--on {
  color: var(--accent);
  background: var(--accent-fill);
  border-color: var(--accent-border);
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
