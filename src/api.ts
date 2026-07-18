import { getSupabase, problemToRow, requireUserId, rowToProblem } from './lib/supabase'
import type { Problem } from './types'

export async function fetchProblems(): Promise<Problem[]> {
  const supabase = getSupabase()
  await requireUserId()
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('leetcode_id', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToProblem)
}

export async function createProblem(problem: Problem): Promise<Problem> {
  const supabase = getSupabase()
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from('problems')
    .insert(problemToRow(problem, userId))
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error(`你已经添加过 #${problem.leetcodeId}`)
    }
    throw new Error(error.message)
  }
  return rowToProblem(data)
}

export async function updateProblem(problem: Problem): Promise<Problem> {
  const supabase = getSupabase()
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from('problems')
    .update({
      ...problemToRow(problem, userId),
      updated_at: new Date().toISOString(),
    })
    .eq('id', problem.id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return rowToProblem(data)
}

export async function deleteProblem(id: string): Promise<void> {
  const supabase = getSupabase()
  await requireUserId()
  const { error } = await supabase.from('problems').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
