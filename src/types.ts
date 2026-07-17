export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/** 追踪已做过的题：做过 / 复习 / 过关 */
export const STATUS_PRESETS = ['做过', '复习', '过关'] as const
export const DEFAULT_STATUS = '做过' as const

export type CodeVersion = {
  id: string
  label: string
  language: string
  code: string
  timeComplexity?: string
  spaceComplexity?: string
  /** 标准答案 / 最优解 —— 在列表末尾，默认打开 */
  isOptimal?: boolean
}

export type Problem = {
  id: string
  leetcodeId: number
  title: string
  /** URL slug，如 trapping-rain-water */
  slug: string
  topics: string[]
  difficulty: Difficulty
  attempts: number
  /** 做过 / 复习 / 过关，或自定义 */
  status: string
  notes: string
  lastPracticedAt: string
  codeVersions: CodeVersion[]
}

export type SortKey = 'leetcodeId' | 'difficulty' | 'attempts' | 'lastPracticedAt' | 'status'
export type SortDir = 'asc' | 'desc'
