import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { CodeVersion, Difficulty, Problem } from '../types'

type ProblemRow = {
  id: string
  leetcode_id: number
  title: string
  slug: string
  topics: string[] | null
  difficulty: string
  attempts: number
  status: string
  notes: string
  last_practiced_at: string
  code_versions: CodeVersion[] | null
}

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your project keys.',
    )
  }
  client = createClient(url, anonKey)
  return client
}

export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export function rowToProblem(row: ProblemRow): Problem {
  return {
    id: row.id,
    leetcodeId: row.leetcode_id,
    title: row.title ?? '',
    slug: row.slug ?? '',
    topics: Array.isArray(row.topics) ? row.topics : [],
    difficulty: (row.difficulty as Difficulty) || 'Medium',
    attempts: row.attempts ?? 0,
    status: row.status || '做过',
    notes: row.notes ?? '',
    lastPracticedAt: row.last_practiced_at ?? '',
    codeVersions: Array.isArray(row.code_versions) ? row.code_versions : [],
  }
}

export function problemToRow(problem: Problem): ProblemRow {
  return {
    id: problem.id,
    leetcode_id: problem.leetcodeId,
    title: problem.title,
    slug: problem.slug,
    topics: problem.topics,
    difficulty: problem.difficulty,
    attempts: problem.attempts,
    status: problem.status,
    notes: problem.notes,
    last_practiced_at: problem.lastPracticedAt,
    code_versions: problem.codeVersions,
  }
}
