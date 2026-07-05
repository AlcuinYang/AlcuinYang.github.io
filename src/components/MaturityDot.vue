<script setup lang="ts">
import type { Maturity } from '@/data/notes'

defineProps<{ maturity: Maturity }>()
</script>

<template>
  <span class="dot" :class="`dot--${maturity}`" aria-hidden="true"></span>
</template>

<style scoped>
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  box-sizing: border-box;
}
.dot--evergreen {
  background: var(--accent);
}
.dot--growing {
  background: linear-gradient(90deg, var(--accent) 50%, transparent 50%);
  border: 1.2px solid var(--accent);
}
.dot--seed {
  border: 1.2px solid var(--faint);
}
</style>
