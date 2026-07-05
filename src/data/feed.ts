import type { Localized } from '@/i18n'

export interface FeedItem {
  id: string
  title: string // real arXiv title — kept in English
  suffix?: string
  abstract: Localized
  tags: string[] // category codes & keywords — kept in English
  age: string // e.g. '2h', '1d' — localized at render
}

export interface FeedCluster {
  name: Localized
  short: Localized
  items: FeedItem[]
}

export const feed: FeedCluster[] = [
  {
    name: { en: 'Aesthetics & Preference', zh: '美学与偏好' },
    short: { en: 'Aesthetics', zh: '美学' },
    items: [
      {
        id: '2506.14821',
        title: 'Image Aesthetic Assessment with pairwise ranking',
        abstract: {
          en: 'Learns preference from relative comparisons rather than absolute scores — sidesteps the calibration problem in MOS-style aesthetic datasets.',
          zh: '从相对比较中学习偏好，而非绝对分数——绕开了 MOS 式美学数据集的标定难题。',
        },
        tags: ['cs.CV', 'ranking'],
        age: '2h',
      },
      {
        id: '2506.13077',
        title: 'Non-transitive preference and reward modeling',
        abstract: {
          en: 'Human preferences form cycles (A>B>C>A); a single scalar reward can’t capture them. Proposes a low-rank skew-symmetric model.',
          zh: '人类偏好存在循环（A>B>C>A），单一标量 reward 无法刻画。提出一个低秩反对称模型。',
        },
        tags: ['cs.LG', 'preference'],
        age: '5h',
      },
    ],
  },
  {
    name: { en: 'Generative & Multimodal', zh: '生成与多模态' },
    short: { en: 'Generative', zh: '生成' },
    items: [
      {
        id: '2507.02198',
        title: 'Seedance 2.0: Advancing Video Generation for World Complexity',
        abstract: {
          en: 'Scales a spatiotemporal diffusion transformer with a physics-consistency objective; strong long-horizon coherence on complex scenes.',
          zh: '用带物理一致性目标的时空 diffusion transformer 做扩展；在复杂场景上有很强的长时程一致性。',
        },
        tags: ['cs.CV', 'video'],
        age: '9h',
      },
      {
        id: '2406.11838',
        title: 'Autoregressive Image Generation without Vector Quantization',
        suffix: 'MAR',
        abstract: {
          en: 'Replaces the categorical VQ codebook with a small per-token diffusion head, letting AR models operate on continuous tokens.',
          zh: '用一个小的 per-token diffusion head 取代类别式 VQ 码本，让自回归模型在连续 token 上运作。',
        },
        tags: ['cs.CV', 'autoregressive'],
        age: '1d',
      },
    ],
  },
  {
    name: { en: 'RL & Alignment', zh: '强化学习与对齐' },
    short: { en: 'RL & Alignment', zh: 'RL 与对齐' },
    items: [
      {
        id: '2311.12908',
        title: 'Diffusion-DPO: Aligning Text-to-Image Models with Human Preferences',
        abstract: {
          en: 'Ports Direct Preference Optimization to the diffusion setting — a reward-free objective over pairs of generations.',
          zh: '把 Direct Preference Optimization 迁移到 diffusion 场景——一种在生成样本对上、无需 reward 的目标。',
        },
        tags: ['cs.LG', 'alignment'],
        age: '1d',
      },
      {
        id: '2507.00815',
        title: 'GRPO for image generation',
        abstract: {
          en: 'Group-relative policy optimization applied to sampling trajectories; removes the value network by normalizing rewards within a group.',
          zh: '把 group-relative policy optimization 用在采样轨迹上；通过组内奖励归一化去掉 value network。',
        },
        tags: ['cs.LG', 'rlhf'],
        age: '2d',
      },
    ],
  },
]

/** localize a compact age token like '2h' / '1d' */
export function formatAge(age: string, locale: string): string {
  if (locale !== 'zh') return age
  const m = age.match(/^(\d+)([hd])$/)
  if (!m) return age
  return m[2] === 'h' ? `${m[1]} 小时前` : `${m[1]} 天前`
}
