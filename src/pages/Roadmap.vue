<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  phases,
  months,
  todayFraction,
  timeplan,
  roadmapIntro,
  type Phase,
} from '@/data/roadmap'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { L } = useLocale()

const totalMonths = months.length

const doneCount = computed(() =>
  phases.reduce((s, p) => s + p.tasks.filter((t) => t.done).length, 0),
)
const taskCount = computed(() => phases.reduce((s, p) => s + p.tasks.length, 0))

function pct(n: number) {
  return `${(n / totalMonths) * 100}%`
}

/** which fill a bar gets: current phase solid, the following phase medium, rest faint */
function barKind(p: Phase, i: number): 'now' | 'next' | 'later' {
  if (p.status === 'in-progress') return 'now'
  const activeIndex = phases.findIndex((x) => x.status === 'in-progress')
  return i === activeIndex + 1 ? 'next' : 'later'
}

function phaseDone(p: Phase) {
  return p.tasks.filter((t) => t.done).length
}
function phasePct(p: Phase) {
  return Math.round((phaseDone(p) / p.tasks.length) * 100)
}
</script>

<template>
  <div class="shell shell--narrow">
    <article class="surface road">
      <header class="road__head">
        <h1 class="road__title">{{ t('roadmap.title') }}</h1>
        <p class="road__intro">{{ L(roadmapIntro) }}</p>
      </header>

      <!-- overall time plan / gantt -->
      <section class="plan">
        <div class="plan__top">
          <span class="eyebrow">{{ t('roadmap.timePlan') }} · {{ L(timeplan) }}</span>
          <span class="plan__count">{{ t('roadmap.tasks', { done: doneCount, total: taskCount }) }}</span>
        </div>

        <div class="gantt">
          <!-- month axis -->
          <div class="axis">
            <div v-for="m in months" :key="m" class="axis__cell">{{ m }}</div>
          </div>

          <!-- today marker -->
          <div class="today" :style="{ left: `${todayFraction * 100}%` }"></div>
          <div class="today__label" :style="{ left: `${todayFraction * 100}%` }">TODAY</div>

          <!-- bars -->
          <div class="bars">
            <div v-for="(p, i) in phases" :key="p.n" class="barrow">
              <div
                class="bar"
                :class="`bar--${barKind(p, i)}`"
                :style="{ left: pct(p.start), width: pct(p.span) }"
              >
                <span class="bar__label">{{ t('common.phase') }} {{ p.n }} · {{ L(p.name) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- phase detail -->
      <section class="detail">
        <div class="eyebrow detail__eyebrow">{{ t('roadmap.phaseDetail') }}</div>

        <div v-for="p in phases" :key="p.n" class="phase">
          <div class="phase__side">
            <div class="phase__status">
              <span
                class="status-dot"
                :class="p.status === 'in-progress' ? 'status-dot--on' : 'status-dot--off'"
              ></span>
              <span
                class="status-label"
                :class="p.status === 'in-progress' ? 'status-label--on' : 'status-label--off'"
              >
                {{ p.status === 'in-progress' ? t('roadmap.inProgress') : t('roadmap.upcoming') }}
              </span>
            </div>
            <div class="phase__name" :class="{ 'phase__name--muted': p.status !== 'in-progress' }">
              {{ t('common.phase') }} {{ p.n }}<br />{{ L(p.name) }}
            </div>
            <div class="phase__months">{{ L(p.months) }}</div>
          </div>

          <div class="phase__body">
            <div class="phase__progress-head">
              <span
                class="phase__count"
                :class="{ 'phase__count--on': phaseDone(p) > 0 }"
              >
                {{ t('roadmap.complete', { done: phaseDone(p), total: p.tasks.length }) }}
              </span>
              <span class="phase__pct">{{ phasePct(p) }}%</span>
            </div>
            <div class="track">
              <div class="track__fill" :style="{ width: `${phasePct(p)}%` }"></div>
            </div>
            <div class="tasks">
              <span
                v-for="(task, ti) in p.tasks"
                :key="ti"
                class="task"
                :class="{
                  'task--done': task.done,
                  'task--current': task.current,
                }"
              >
                <span v-if="task.current" class="task__bullet">●</span>{{ L(task.title) }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.road__head {
  padding: 34px 44px 4px;
}
.road__title {
  margin: 0 0 8px;
  font: 500 30px/1.1 var(--font-serif);
  letter-spacing: -0.01em;
  color: var(--ink);
}
.road__intro {
  margin: 0;
  max-width: 62ch;
  font: 400 14px/1.5 var(--font-sans);
  color: var(--muted);
}

/* ---- gantt ---- */
.plan {
  padding: 26px 44px 8px;
}
.plan__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}
.plan__count {
  font: 400 11px var(--font-mono);
  color: var(--accent);
}
.gantt {
  position: relative;
  padding-top: 2px;
}
.axis {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  border-bottom: 1px solid var(--line);
  margin-bottom: 14px;
}
.axis__cell {
  font: 400 10px var(--font-mono);
  color: var(--faint);
  padding: 0 0 7px 6px;
  border-left: 1px solid var(--line-2);
}
.today {
  position: absolute;
  top: 0;
  bottom: 14px;
  width: 1.5px;
  background: var(--accent);
  opacity: 0.55;
}
.today__label {
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
  font: 400 9px var(--font-mono);
  color: var(--accent);
  background: var(--card);
  padding: 0 4px;
}
.bars {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding-top: 16px;
}
.barrow {
  position: relative;
  height: 30px;
}
.bar {
  position: absolute;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  overflow: hidden;
}
.bar__label {
  font: 500 11.5px var(--font-sans);
  white-space: nowrap;
}
.bar--now {
  background: var(--accent);
  box-shadow: inset 0 0 0 1.5px var(--accent-deep);
}
.bar--now .bar__label {
  color: var(--accent-contrast);
}
.bar--next {
  background: var(--bar-2);
}
.bar--next .bar__label {
  color: var(--bar-2-ink);
}
.bar--later {
  background: var(--bar-3);
}
.bar--later .bar__label {
  color: var(--bar-3-ink);
}

/* ---- phase detail ---- */
.detail {
  padding: 30px 44px 42px;
}
.detail__eyebrow {
  margin-bottom: 6px;
}
.phase {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  border-top: 1px solid var(--line);
}
.phase:last-child {
  border-bottom: 1px solid var(--line);
}
.phase__side {
  flex: none;
  width: 150px;
}
.phase__status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 4px;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  box-sizing: border-box;
  flex: none;
}
.status-dot--on {
  background: var(--accent);
}
.status-dot--off {
  border: 1.2px solid var(--accent-border);
}
.status-label {
  font: 400 10px var(--font-mono);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.status-label--on {
  color: var(--accent);
}
.status-label--off {
  color: var(--faint);
}
.phase__name {
  font: 500 17px/1.2 var(--font-serif);
  color: var(--ink);
}
.phase__name--muted {
  color: var(--muted-2);
}
.phase__months {
  font: 400 11px var(--font-mono);
  color: var(--faint-2);
  margin-top: 5px;
}
.phase__body {
  flex: 1;
  min-width: 0;
}
.phase__progress-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}
.phase__count {
  font: 400 12px var(--font-sans);
  color: var(--faint);
}
.phase__count--on {
  font-weight: 500;
  color: var(--accent);
}
.phase__pct {
  font: 400 11px var(--font-mono);
  color: var(--faint-2);
}
.track {
  height: 5px;
  border-radius: 3px;
  background: var(--track);
  overflow: hidden;
  margin-bottom: 14px;
}
.track__fill {
  height: 100%;
  background: var(--accent);
}
.tasks {
  display: flex;
  flex-wrap: wrap;
  column-gap: 18px;
  row-gap: 7px;
}
.task {
  font: 400 12.5px var(--font-sans);
  color: var(--muted-2);
}
.task--done {
  color: var(--faint);
  text-decoration: line-through;
}
.task--current {
  font-weight: 500;
  color: var(--ink);
}
.task__bullet {
  color: var(--accent);
  font-size: 9px;
  margin-right: 5px;
  vertical-align: middle;
}

@media (max-width: 720px) {
  .road__head {
    padding: 26px 22px 4px;
  }
  .plan {
    padding: 22px 22px 8px;
  }
  .detail {
    padding: 24px 22px 34px;
  }
  .bar__label {
    font-size: 10px;
  }
  .phase {
    flex-direction: column;
    gap: 12px;
  }
  .phase__side {
    width: auto;
  }
}
</style>
