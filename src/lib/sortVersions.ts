import type { CodeVersion } from '../types'

/** 草稿在前，最优解始终排在最后 */
export function orderCodeVersions(versions: CodeVersion[]): CodeVersion[] {
  const drafts = versions.filter((v) => !v.isOptimal)
  const optimals = versions.filter((v) => v.isOptimal)
  return [...drafts, ...optimals]
}

export function defaultVersionId(versions: CodeVersion[]): string | null {
  const ordered = orderCodeVersions(versions)
  if (ordered.length === 0) return null
  const optimal = ordered.find((v) => v.isOptimal)
  return (optimal ?? ordered[ordered.length - 1]).id
}
