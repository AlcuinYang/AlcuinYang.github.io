<script setup lang="ts">
import { destinations } from '@/config'

const links = [
  { label: 'Research Station', href: destinations.research, index: '01' },
  { label: 'Tennis OS', href: destinations.tennis, index: '02' },
  { label: 'GitHub', href: destinations.github, index: '03' },
]
</script>

<template>
  <a class="skip-link" href="#main">Skip to main content</a>

  <header class="site-header shell">
    <a class="monogram" href="#main" aria-label="Alcuin Yang home">AY<span>.</span></a>
  </header>

  <main id="main" class="shell">
    <section class="hero" aria-labelledby="hero-title">
      <p class="identity">Alcuin Yang</p>
      <h1 id="hero-title">Make Alcuin<br />Great Again</h1>
      <p class="profile-line">
        <span>🎓 PhD Student @ BUPT</span>
        <span>🤖 CV | MLLM | AIGC</span>
        <span>📊 Image Aesthetics Assessment (IAA) &amp; IQA</span>
      </p>
    </section>

    <nav class="destination-list" aria-label="Destinations">
      <a v-for="link in links" :key="link.label" :href="link.href">
        <span class="destination-index">{{ link.index }}</span>
        <strong>{{ link.label }}</strong>
        <span class="destination-arrow" aria-hidden="true">↗</span>
        <span class="sr-only">Open {{ link.label }}</span>
      </a>
    </nav>
  </main>

  <footer class="site-footer shell">© {{ new Date().getFullYear() }} Alcuin Yang</footer>
</template>
