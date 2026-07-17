import type { Problem } from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export function fetchProblems() {
  return request<Problem[]>('/api/problems')
}

export function createProblem(problem: Problem) {
  return request<Problem>('/api/problems', {
    method: 'POST',
    body: JSON.stringify(problem),
  })
}

export function updateProblem(problem: Problem) {
  return request<Problem>(`/api/problems/${encodeURIComponent(problem.id)}`, {
    method: 'PUT',
    body: JSON.stringify(problem),
  })
}

export function resetProblemsApi() {
  return request<Problem[]>('/api/problems/reset', { method: 'POST' })
}
