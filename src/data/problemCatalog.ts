import type { Difficulty } from '../types'
import index from './leetcodeIndex.json'

type Compact = { t: string; s: string; d: Difficulty }

const INDEX = index as Record<string, Compact>

/** 少量题目补 Topic（全量索引不含 tags） */
const TOPIC_EXTRAS: Record<number, string[]> = {
  1: ['Array', 'Hash Table'],
  3: ['Hash Table', 'String', 'Sliding Window'],
  42: ['Array', 'Two Pointers', 'Stack'],
  53: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
  70: ['Dynamic Programming'],
  146: ['Hash Table', 'Linked List', 'Design'],
  215: ['Heap', 'Quickselect'],
  297: ['Tree', 'BFS', 'Design'],
}

export type CatalogEntry = {
  leetcodeId: number
  title: string
  slug: string
  difficulty: Difficulty
  topics: string[]
}

export function titleToSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function problemUrl(slug: string): string {
  return `https://leetcode.cn/problems/${slug}/`
}

export function problemSearchUrl(leetcodeId: number): string {
  return `https://leetcode.cn/problemset/?search=${leetcodeId}`
}

export function lookupById(leetcodeId: number): CatalogEntry | null {
  if (!Number.isFinite(leetcodeId) || leetcodeId <= 0) return null
  const row = INDEX[String(leetcodeId)]
  if (!row) return null
  return {
    leetcodeId,
    title: row.t,
    slug: row.s,
    difficulty: row.d,
    topics: TOPIC_EXTRAS[leetcodeId] ?? [],
  }
}

export function catalogSize(): number {
  return Object.keys(INDEX).length
}
