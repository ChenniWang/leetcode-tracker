import { SEED_PROBLEMS } from './data/seed'
import { getSupabase, problemToRow, rowToProblem } from './lib/supabase'
import type { Problem } from './types'

export async function fetchProblems(): Promise<Problem[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('leetcode_id', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToProblem)
}

export async function createProblem(problem: Problem): Promise<Problem> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('problems')
    .insert(problemToRow(problem))
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error(`Problem #${problem.leetcodeId} already exists`)
    }
    throw new Error(error.message)
  }
  return rowToProblem(data)
}

export async function updateProblem(problem: Problem): Promise<Problem> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('problems')
    .update({
      ...problemToRow(problem),
      updated_at: new Date().toISOString(),
    })
    .eq('id', problem.id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return rowToProblem(data)
}

export async function resetProblemsApi(): Promise<Problem[]> {
  const supabase = getSupabase()
  const { error: delError } = await supabase.from('problems').delete().gte('leetcode_id', 0)
  if (delError) throw new Error(delError.message)

  const rows = SEED_PROBLEMS.map(problemToRow)
  const { data, error } = await supabase.from('problems').insert(rows).select('*')
  if (error) throw new Error(error.message)

  return (data ?? []).map(rowToProblem).sort((a, b) => a.leetcodeId - b.leetcodeId)
}
