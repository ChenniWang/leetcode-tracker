import cors from 'cors'
import express from 'express'
import {
  createProblem,
  deleteProblem,
  ensureSeeded,
  getProblem,
  listProblems,
  resetToSeed,
  updateProblem,
  dbPath,
} from './db.ts'
import type { Problem } from '../src/types.ts'

const PORT = Number(process.env.PORT) || 5174

ensureSeeded()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: dbPath })
})

app.get('/api/problems', (_req, res) => {
  res.json(listProblems())
})

app.get('/api/problems/:id', (req, res) => {
  const problem = getProblem(req.params.id)
  if (!problem) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(problem)
})

app.post('/api/problems/reset', (_req, res) => {
  res.json(resetToSeed())
})

app.post('/api/problems', (req, res) => {
  const body = req.body as Problem
  if (!body?.id || body.leetcodeId == null) {
    res.status(400).json({ error: 'Invalid problem payload' })
    return
  }
  try {
    const created = createProblem(normalizeProblem(body))
    res.status(201).json(created)
  } catch (err) {
    res.status(409).json({
      error: err instanceof Error ? err.message : 'Create failed',
    })
  }
})

app.put('/api/problems/:id', (req, res) => {
  const body = req.body as Problem
  if (!body?.id || body.id !== req.params.id) {
    res.status(400).json({ error: 'id mismatch' })
    return
  }
  const updated = updateProblem(normalizeProblem(body))
  if (!updated) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(updated)
})

app.delete('/api/problems/:id', (req, res) => {
  const ok = deleteProblem(req.params.id)
  if (!ok) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.status(204).end()
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`LeetTrack API  http://127.0.0.1:${PORT}`)
  console.log(`Data file      ${dbPath}`)
})

function normalizeProblem(p: Problem): Problem {
  return {
    id: String(p.id),
    leetcodeId: Number(p.leetcodeId) || 0,
    title: String(p.title ?? ''),
    slug: String(p.slug ?? ''),
    topics: Array.isArray(p.topics) ? p.topics.map(String) : [],
    difficulty: (p.difficulty as Problem['difficulty']) || 'Medium',
    attempts: Math.max(0, Number(p.attempts) || 0),
    status: String(p.status || '做过'),
    notes: String(p.notes ?? ''),
    lastPracticedAt: String(p.lastPracticedAt ?? ''),
    codeVersions: Array.isArray(p.codeVersions)
      ? p.codeVersions.map((v, i) => ({
          id: String(v.id || `v-${p.id}-${i}`),
          label: String(v.label || `版本 ${i + 1}`),
          language: String(v.language || 'python'),
          code: String(v.code ?? ''),
          timeComplexity: v.timeComplexity ? String(v.timeComplexity) : undefined,
          spaceComplexity: v.spaceComplexity ? String(v.spaceComplexity) : undefined,
          isOptimal: Boolean(v.isOptimal),
        }))
      : [],
  }
}
