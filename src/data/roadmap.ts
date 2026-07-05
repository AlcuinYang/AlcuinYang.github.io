import type { Localized } from '@/i18n'

export type PhaseStatus = 'in-progress' | 'upcoming' | 'done'

export interface Task {
  title: Localized
  done?: boolean
  current?: boolean
}

export interface Phase {
  n: number
  name: Localized
  status: PhaseStatus
  months: Localized
  /** column start (0-based) and length on the 8-month axis */
  start: number
  span: number
  tasks: Task[]
}

// month axis stays in short English codes (compact, script-neutral)
export const months = ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB']

/** where the "today" marker sits, as a fraction of the axis (early July) */
export const todayFraction = 0.065

export const timeplan: Localized = {
  en: 'Jul 2026 → Feb 2027',
  zh: '2026 年 7 月 → 2027 年 2 月',
}

export const roadmapIntro: Localized = {
  en: 'A self-directed track from diffusion fundamentals to aesthetic alignment. Roughly eight months, four phases — paced, not raced.',
  zh: '一条自定的学习路线，从 diffusion 基础走到美学对齐。大约八个月、四个阶段——按节奏走，不赶。',
}

export const phases: Phase[] = [
  {
    n: 1,
    name: { en: 'Diffusion Core', zh: '扩散模型核心' },
    status: 'in-progress',
    months: { en: 'Jul – Aug', zh: '7 月 – 8 月' },
    start: 0,
    span: 2,
    tasks: [
      { title: { en: 'Score matching, intuition', zh: 'Score matching 直觉' }, done: true },
      { title: { en: 'ELBO derivation', zh: 'ELBO 推导' }, done: true },
      { title: { en: 'Hand-write DDPM on CIFAR', zh: '在 CIFAR 上手写 DDPM' }, current: true },
      { title: { en: 'Classifier-free guidance', zh: 'Classifier-free guidance' } },
      { title: { en: 'Flow matching reading', zh: 'Flow matching 阅读' } },
    ],
  },
  {
    n: 2,
    name: { en: 'Preference & Reward', zh: '偏好与奖励' },
    status: 'upcoming',
    months: { en: 'Sep – Oct', zh: '9 月 – 10 月' },
    start: 2,
    span: 2,
    tasks: [
      { title: { en: 'Bradley–Terry models', zh: 'Bradley–Terry 模型' } },
      { title: { en: 'Non-transitive preference', zh: '非传递偏好' } },
      { title: { en: 'Reward model training', zh: 'reward model 训练' } },
      { title: { en: 'DPO from first principles', zh: '从头理解 DPO' } },
    ],
  },
  {
    n: 3,
    name: { en: 'Aesthetic Assessment', zh: '美学评估' },
    status: 'upcoming',
    months: { en: 'Nov – Dec', zh: '11 月 – 12 月' },
    start: 4,
    span: 2,
    tasks: [
      { title: { en: 'IAA datasets & MOS', zh: 'IAA 数据集与 MOS' } },
      { title: { en: 'Pairwise ranking', zh: '成对排序' } },
      { title: { en: 'Aesthetic reward heads', zh: '美学 reward head' } },
      { title: { en: 'Evaluation protocols', zh: '评测协议' } },
      { title: { en: 'My thesis framing', zh: '我的论文选题' } },
    ],
  },
  {
    n: 4,
    name: { en: 'Alignment & RLHF', zh: '对齐与 RLHF' },
    status: 'upcoming',
    months: { en: 'Jan – Feb', zh: '1 月 – 2 月' },
    start: 6,
    span: 2,
    tasks: [
      { title: { en: 'Diffusion-DPO', zh: 'Diffusion-DPO' } },
      { title: { en: 'GRPO for generation', zh: '用于生成的 GRPO' } },
      { title: { en: 'Aesthetic alignment loop', zh: '美学对齐闭环' } },
      { title: { en: 'Write-up & ablations', zh: '撰写与消融' } },
    ],
  },
]
