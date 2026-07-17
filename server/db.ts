import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEED_PROBLEMS } from '../src/data/seed.ts'
import type { Problem } from '../src/types.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'data')
const dbPath = join(dataDir, 'problems.json')

mkdirSync(dataDir, { recursive: true })

function readAll(): Problem[] {
  if (!existsSync(dbPath)) return []
  try {
    const raw = readFileSync(dbPath, 'utf8')
    const parsed = JSON.parse(raw) as Problem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(problems: Problem[]) {
  const tmp = `${dbPath}.tmp`
  writeFileSync(tmp, JSON.stringify(problems, null, 2), 'utf8')
  renameSync(tmp, dbPath)
}

export function listProblems(): Problem[] {
  return readAll().sort((a, b) => a.leetcodeId - b.leetcodeId)
}

export function getProblem(id: string): Problem | null {
  return readAll().find((p) => p.id === id) ?? null
}

export function createProblem(problem: Problem): Problem {
  const all = readAll()
  if (all.some((p) => p.id === problem.id)) {
    throw new Error('Problem id already exists')
  }
  if (all.some((p) => p.leetcodeId === problem.leetcodeId)) {
    throw new Error(`题号 #${problem.leetcodeId} 已存在`)
  }
  all.unshift(problem)
  writeAll(all)
  return problem
}

export function updateProblem(problem: Problem): Problem | null {
  const all = readAll()
  const idx = all.findIndex((p) => p.id === problem.id)
  if (idx < 0) return null
  all[idx] = problem
  writeAll(all)
  return problem
}

export function deleteProblem(id: string): boolean {
  const all = readAll()
  const next = all.filter((p) => p.id !== id)
  if (next.length === all.length) return false
  writeAll(next)
  return true
}

export function resetToSeed(): Problem[] {
  const seed = structuredClone(SEED_PROBLEMS)
  writeAll(seed)
  return listProblems()
}

export function ensureSeeded() {
  if (readAll().length === 0) {
    resetToSeed()
  }
}

export { dbPath }
