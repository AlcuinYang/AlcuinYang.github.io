<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { destinations } from '@/config'

type Locale = 'zh' | 'en'

const locale = ref<Locale>('zh')

const copy = {
  zh: {
    skip: '跳到主要内容',
    eyebrow: '个人研究与实践索引',
    navAbout: '关于',
    navWork: '入口',
    language: '切换为英文',
    hello: 'Alcuin Yang',
    title: '在图像感知与网球训练之间，建立可以长期积累的系统。',
    intro:
      '计算机科学博士生，研究图像美学评估、感知质量与视觉表征；同时以结构化训练推进个人网球发展。这里不是内容聚合页，而是一张通往不同工作空间的地图。',
    focusLabel: '当前关注',
    focus:
      '研究侧正在建立可审计的图像“通透感”与 clarity 操作定义；训练侧正在把 NTRP 2.5 推向稳定 3.5，优先重建击球准备、动力链与移动效率。',
    destinations: '三个工作空间',
    destinationsIntro: '研究、训练与代码彼此独立，各自保留清晰的边界与演化历史。',
    publicKnowledge: '公开知识',
    privatePractice: '私人训练',
    publicCode: '公开代码',
    researchTitle: 'Research Station',
    researchBody: '论文笔记、研究路线与图像美学评估的长期知识花园。保留中英双语与原有编辑式阅读体验。',
    tennisTitle: 'Tennis OS',
    tennisBody: '仅本人使用的训练日志、技术发展地图、训练周期与 AI 教练复盘系统。',
    githubTitle: 'GitHub',
    githubBody: '研究原型、工程实验与公开项目的版本历史。',
    enter: '进入',
    privateNote: '需要登录',
    footer: '研究是把未知变得可检验；训练是让改变变得可重复。',
  },
  en: {
    skip: 'Skip to main content',
    eyebrow: 'Personal research & practice index',
    navAbout: 'About',
    navWork: 'Destinations',
    language: '切换为中文',
    hello: 'Alcuin Yang',
    title: 'Building systems that compound—across visual perception research and tennis practice.',
    intro:
      'A computer science PhD student studying image aesthetic assessment, perceptual quality, and visual representation; also pursuing tennis development through structured practice. This page is a map to distinct workspaces, not a content aggregator.',
    focusLabel: 'Now',
    focus:
      'Research is focused on auditable operational definitions for visual transparency and clarity. Training is moving from NTRP 2.5 toward a stable 3.5, beginning with preparation, kinetic-chain efficiency, and movement.',
    destinations: 'Three workspaces',
    destinationsIntro: 'Research, practice, and code evolve independently, each with a clear boundary and history.',
    publicKnowledge: 'Public knowledge',
    privatePractice: 'Private practice',
    publicCode: 'Public code',
    researchTitle: 'Research Station',
    researchBody: 'A long-lived garden for paper notes, research roadmaps, and image aesthetics. Bilingual, editorial, and independently deployed.',
    tennisTitle: 'Tennis OS',
    tennisBody: 'A private training log, technical development map, periodized plan, and bounded AI coaching workspace.',
    githubTitle: 'GitHub',
    githubBody: 'Versioned research prototypes, engineering experiments, and public projects.',
    enter: 'Enter',
    privateNote: 'Sign-in required',
    footer: 'Research makes uncertainty testable. Practice makes change repeatable.',
  },
} as const

const t = computed(() => copy[locale.value])

function toggleLocale() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
  localStorage.setItem('portal-locale', locale.value)
}

onMounted(() => {
  const saved = localStorage.getItem('portal-locale')
  if (saved === 'zh' || saved === 'en') locale.value = saved
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
})
</script>

<template>
  <a class="skip-link" href="#main">{{ t.skip }}</a>

  <header class="site-header shell">
    <a class="monogram" href="#top" aria-label="Alcuin Yang home">AY<span>.</span></a>
    <nav class="site-nav" :aria-label="locale === 'zh' ? '主导航' : 'Primary navigation'">
      <a href="#about">{{ t.navAbout }}</a>
      <a href="#destinations">{{ t.navWork }}</a>
      <button class="locale-toggle" type="button" :aria-label="t.language" @click="toggleLocale">
        {{ locale === 'zh' ? 'EN' : '中' }}
      </button>
    </nav>
  </header>

  <main id="main">
    <section id="top" class="hero shell" aria-labelledby="hero-title">
      <div class="hero__orbit" aria-hidden="true">
        <span class="orbit orbit--one"></span>
        <span class="orbit orbit--two"></span>
        <span class="orbit-dot orbit-dot--research"></span>
        <span class="orbit-dot orbit-dot--tennis"></span>
        <span class="orbit-dot orbit-dot--code"></span>
      </div>
      <div class="hero__content">
        <p class="eyebrow">{{ t.eyebrow }}</p>
        <p class="identity">{{ t.hello }}</p>
        <h1 id="hero-title">{{ t.title }}</h1>
        <p class="hero__intro">{{ t.intro }}</p>
      </div>
      <aside id="about" class="focus-note" aria-labelledby="focus-title">
        <p id="focus-title" class="focus-note__label">{{ t.focusLabel }}</p>
        <p>{{ t.focus }}</p>
      </aside>
    </section>

    <section id="destinations" class="destinations shell" aria-labelledby="destinations-title">
      <header class="section-heading">
        <p class="index">01 / 03</p>
        <div>
          <h2 id="destinations-title">{{ t.destinations }}</h2>
          <p>{{ t.destinationsIntro }}</p>
        </div>
      </header>

      <div class="destination-list">
        <article class="destination destination--research">
          <div class="destination__number" aria-hidden="true">R</div>
          <div class="destination__copy">
            <p class="destination__kind">{{ t.publicKnowledge }}</p>
            <h3>{{ t.researchTitle }}</h3>
            <p>{{ t.researchBody }}</p>
          </div>
          <a :href="destinations.research" class="destination__link">
            {{ t.enter }} <span aria-hidden="true">↗</span>
            <span class="sr-only">{{ t.researchTitle }}</span>
          </a>
        </article>

        <article class="destination destination--tennis">
          <div class="destination__number" aria-hidden="true">T</div>
          <div class="destination__copy">
            <p class="destination__kind">{{ t.privatePractice }}</p>
            <h3>{{ t.tennisTitle }}</h3>
            <p>{{ t.tennisBody }}</p>
            <span class="private-badge">{{ t.privateNote }}</span>
          </div>
          <a :href="destinations.tennis" class="destination__link">
            {{ t.enter }} <span aria-hidden="true">↗</span>
            <span class="sr-only">{{ t.tennisTitle }}</span>
          </a>
        </article>

        <article class="destination destination--github">
          <div class="destination__number" aria-hidden="true">G</div>
          <div class="destination__copy">
            <p class="destination__kind">{{ t.publicCode }}</p>
            <h3>{{ t.githubTitle }}</h3>
            <p>{{ t.githubBody }}</p>
          </div>
          <a :href="destinations.github" class="destination__link">
            {{ t.enter }} <span aria-hidden="true">↗</span>
            <span class="sr-only">{{ t.githubTitle }}</span>
          </a>
        </article>
      </div>
    </section>
  </main>

  <footer class="site-footer shell">
    <p>{{ t.footer }}</p>
    <p>© {{ new Date().getFullYear() }} Alcuin Yang</p>
  </footer>
</template>
