import { lookupById, titleToSlug } from '../data/problemCatalog'
import { DEFAULT_STATUS, type Problem } from '../types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function createProblemFromId(leetcodeId: number): Problem {
  const hit = lookupById(leetcodeId)
  const title = hit?.title ?? ''
  return {
    id: `p-${leetcodeId}-${Date.now()}`,
    leetcodeId,
    title,
    slug: hit?.slug ?? (title ? titleToSlug(title) : ''),
    topics: hit?.topics ?? [],
    difficulty: hit?.difficulty ?? 'Medium',
    attempts: 1,
    status: DEFAULT_STATUS,
    notes: '',
    lastPracticedAt: today(),
    codeVersions: [],
  }
}
