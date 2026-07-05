<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import { site } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <AppHeader />

  <main class="main">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>

  <footer class="foot">
    <div class="foot__inner shell">
      <span class="foot__caps">{{ site.owner }} · {{ t('footer.field') }}</span>
      <span class="foot__caps foot__muted">{{ t('footer.built') }}</span>
    </div>
  </footer>
</template>

<style scoped>
.main {
  padding: 40px 0 60px;
  min-height: 60vh;
}
.foot {
  border-top: 1px solid var(--line);
  transition: border-color 0.35s ease;
}
.foot__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 22px;
  padding-bottom: 30px;
  gap: 14px;
  flex-wrap: wrap;
}
.foot__caps {
  font: 400 10px var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--faint);
}
.foot__muted {
  color: var(--whisper);
}
@media (max-width: 720px) {
  .main {
    padding: 24px 0 40px;
  }
}
</style>
