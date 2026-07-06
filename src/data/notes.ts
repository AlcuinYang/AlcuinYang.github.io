import type { Localized } from '@/i18n'

export type Maturity = 'evergreen' | 'growing' | 'seed'

export type Block =
  | { type: 'p'; html: Localized }
  | { type: 'cjk'; html: Localized }
  | { type: 'h2'; text: Localized }
  | { type: 'formula'; html: string }
  | { type: 'quote'; html: Localized }

export interface Note {
  slug: string
  title: Localized
  maturity: Maturity
  tended: Localized
  minutes?: number
  arxiv?: string
  tags: string[] // kept in English
  /** breadcrumb trail; entries are mostly technical terms kept in English */
  breadcrumb?: Localized[]
  lede: Localized
  linked?: Localized[]
  body?: Block[]
}

export const notes: Note[] = [
  {
    slug: 'ddpm-forward-reverse',
    title: {
      en: 'DDPM — forward & reverse in one page',
      zh: 'DDPM —— 前向与反向，一页讲清',
    },
    maturity: 'evergreen',
    tended: { en: '2 days ago', zh: '2 天前' },
    minutes: 6,
    arxiv: '2006.11239',
    tags: ['diffusion', 'generative'],
    breadcrumb: [{ en: 'Notes', zh: '笔记' }, 'Diffusion', 'DDPM'],
    lede: {
      en: 'The whole model is two Markov chains that are inverses of each other: one that destroys structure with noise, one you train to rebuild it.',
      zh: '整个模型就是两条互为逆过程的 Markov 链：一条用噪声摧毁结构，另一条你训练它把结构重建回来。',
    },
    linked: [
      { en: 'Flow matching vs score-based', zh: 'Flow matching 与 score-based' },
      { en: 'CFG in one page', zh: 'CFG 一页讲清' },
    ],
    body: [
      {
        type: 'p',
        html: {
          en: 'A denoising diffusion probabilistic model defines a <em>forward process</em> that gradually corrupts a data sample <code>x₀</code> into pure Gaussian noise over <code>T</code> steps, and a <em>reverse process</em>, parameterized by a network, that learns to undo it one step at a time.',
          zh: '一个 denoising diffusion probabilistic model 定义了一个<em>前向过程</em>，它在 <code>T</code> 步内把数据样本 <code>x₀</code> 逐渐破坏为纯高斯噪声；再定义一个由网络参数化的<em>反向过程</em>，学着一步步把它还原回来。',
        },
      },
      { type: 'h2', text: { en: 'The forward process', zh: '前向过程' } },
      {
        type: 'p',
        html: {
          en: 'At each step we add a little Gaussian noise scaled by a variance schedule <code>β₁…β_T</code>. The convenient property is that we never need to iterate to sample an arbitrary step:',
          zh: '每一步我们都加入一点由方差调度 <code>β₁…β_T</code> 缩放的高斯噪声。方便之处在于，我们无需迭代就能采样到任意一步：',
        },
      },
      {
        type: 'formula',
        html: 'q(x_t | x₀) = 𝒩( √α̅_t · x₀,&nbsp; (1−α̅_t)·𝐈 )',
      },
      {
        type: 'p',
        html: {
          en: 'Because the sum of Gaussians is Gaussian, the marginal at step <code>t</code> is just a rescaled image plus noise of known variance — which is what makes the training objective so cheap to compute.',
          zh: '由于高斯之和仍是高斯，第 <code>t</code> 步的边缘分布不过是一张按比例缩放的图像、加上已知方差的噪声——正是这一点让训练目标的计算如此便宜。',
        },
      },
      {
        type: 'h2',
        text: { en: 'The reverse process & the objective', zh: '反向过程与训练目标' },
      },
      {
        type: 'p',
        html: {
          en: 'Ho et al. show the variational bound collapses, after reparameterization, to something almost embarrassingly simple: predict the noise that was added. The network <code>ε_θ</code> is trained to regress the sampled noise, and the loss is a plain mean-squared error.',
          zh: 'Ho 等人证明：经过重参数化后，变分下界会坍缩成一件近乎简单到令人尴尬的事——预测被加入的噪声。网络 <code>ε_θ</code> 被训练去回归采样出的噪声，损失就是一个普通的均方误差。',
        },
      },
      {
        type: 'quote',
        html: {
          en: 'Sampling is just this network run in a loop — denoise, add a touch of noise back, repeat — walking a random point slowly back onto the data manifold.',
          zh: '采样不过是把这个网络放进一个循环里——去噪、再加回一点噪声、重复——让一个随机点慢慢走回数据流形上。',
        },
      },
      { type: 'h2', text: '一点中文笔记' },
      {
        type: 'cjk',
        html: '从直觉上看，前向过程是在<strong>不断地"打碎"</strong>一张图像，把它推向标准高斯分布；而反向过程要学会的，正是这一步步破坏的<strong>逆运算</strong>。训练目标之所以简洁，是因为我们并不需要预测原图，只需预测"这一步加进去的噪声"——两条马尔可夫链，一破一立，互为镜像。',
      },
      {
        type: 'p',
        html: {
          en: 'This mixed-script paragraph is the real typographic stress test: full-width punctuation（，。——）needs to breathe, the CJK line-height runs looser than the Latin body, and Latin words like <em>Markov chain</em> should sit comfortably inside the Chinese run without fighting the baseline.',
          zh: '这段混排文字才是真正的排版压力测试：全角标点（，。——）需要呼吸的空间，中文行高比拉丁正文更松，而像 <em>Markov chain</em> 这样的拉丁词，应当自在地嵌在中文行里，不与基线较劲。',
        },
      },
    ],
  },
  {
    slug: 'flow-matching-vs-score',
    title: {
      en: 'Flow matching vs score-based: the same object',
      zh: 'Flow matching 与 score-based：其实是同一个东西',
    },
    maturity: 'growing',
    tended: { en: '5 days ago', zh: '5 天前' },
    minutes: 4,
    tags: ['diffusion', 'flow-matching'],
    breadcrumb: [{ en: 'Notes', zh: '笔记' }, 'Diffusion', 'Flow matching'],
    lede: {
      en: 'Conditional flow matching and score-based diffusion are two coordinate systems on the same probability path — a note in progress reconciling the two derivations.',
      zh: 'conditional flow matching 与 score-based diffusion，是同一条概率路径上的两套坐标系——一则仍在生长的笔记，试图把两种推导对上。',
    },
    linked: [{ en: 'DDPM — forward/reverse in one page', zh: 'DDPM —— 前向与反向' }],
    body: [
      {
        type: 'p',
        html: {
          en: 'Still tending this one. The claim I want to make crisp: the CFM vector field and the score are related by a fixed affine transform of the noise schedule, so a model trained under either objective can be re-read as the other at sampling time.',
          zh: '还在打理这则。想说清的核心主张是：CFM 的向量场与 score 之间，差的只是噪声调度的一个固定仿射变换——因此在任一目标下训练出的模型，采样时都可被重新读作另一种。',
        },
      },
      {
        type: 'quote',
        html: {
          en: 'Growing note — the algebra is here, the clean one-paragraph intuition is not yet.',
          zh: '生长中的笔记——代数推导已经在这儿，干净的一段直觉还没写出来。',
        },
      },
    ],
  },
  {
    slug: 'reward-models-non-transitive',
    title: {
      en: 'Reward models as non-transitive preference',
      zh: '把 reward model 看作非传递偏好',
    },
    maturity: 'seed',
    tended: { en: '1 week ago', zh: '1 周前' },
    tags: ['preference', 'rlhf'],
    breadcrumb: [{ en: 'Notes', zh: '笔记' }, 'Alignment', 'Reward models'],
    lede: {
      en: 'A seed: if human aesthetic preference contains cycles, a scalar reward head is mis-specified from the start. What does a low-rank skew-symmetric term buy us?',
      zh: '一颗种子：如果人类的审美偏好包含循环，那么标量 reward head 从一开始就设定错了。低秩反对称项能带来什么？',
    },
    linked: ['Non-transitive preference and reward modeling'],
    body: [
      {
        type: 'p',
        html: {
          en: 'Seed note — mostly a question. Placeholder for working through the skew-symmetric preference decomposition and whether it matters for aesthetic reward heads specifically.',
          zh: '种子笔记——大多还只是个问题。留作占位，用来梳理反对称偏好分解，以及它对美学 reward head 究竟是否重要。',
        },
      },
    ],
  },
]

export function noteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug)
}

/** every distinct tag across the garden, sorted */
export const allNoteTags: string[] = [
  ...new Set(notes.flatMap((n) => n.tags)),
].sort()

function localizedText(value: Localized): string {
  return typeof value === 'string' ? value : `${value.en} ${value.zh}`
}

/**
 * A lowercased haystack of everything searchable in a note — both languages,
 * tags, breadcrumb, linked titles, and body prose (so search reaches inside
 * a note, not just its card). Computed once per note and memoized.
 */
const haystacks = new WeakMap<Note, string>()
export function noteSearchText(note: Note): string {
  const cached = haystacks.get(note)
  if (cached) return cached
  const parts: string[] = [note.slug, ...note.tags]
  parts.push(localizedText(note.title), localizedText(note.lede), localizedText(note.tended))
  note.breadcrumb?.forEach((b) => parts.push(localizedText(b)))
  note.linked?.forEach((l) => parts.push(localizedText(l)))
  note.body?.forEach((b) => {
    if ('text' in b) parts.push(localizedText(b.text))
    if ('html' in b) parts.push(localizedText(b.html))
  })
  const text = parts.join(' ').toLowerCase()
  haystacks.set(note, text)
  return text
}
