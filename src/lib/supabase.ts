import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { CodeVersion, Difficulty, Problem } from '../types'

export type ProblemRow = {
  id: string
  user_id: string
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

/** Project URL only — strip accidental /rest/v1 or trailing slash from dashboard copy-paste */
function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, '')
  url = url.replace(/\/rest\/v1$/i, '')
  return url
}

export function getSupabase(): SupabaseClient {
  if (client) return client
  const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()
  if (!rawUrl || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. For local: copy .env.example to .env.local. For GitHub Pages: set Actions secrets and redeploy.',
    )
  }
  if (anonKey.startsWith('sb_secret_') || anonKey.includes('service_role')) {
    throw new Error(
      'You used a secret/service_role key. Use the publishable key (sb_publishable_...) or legacy anon public key instead.',
    )
  }
  const url = normalizeSupabaseUrl(rawUrl)
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
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

export function problemToRow(problem: Problem, userId: string): Omit<ProblemRow, never> {
  return {
    id: problem.id,
    user_id: userId,
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

export async function requireUserId(): Promise<string> {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('请先登录')
  return data.user.id
}
