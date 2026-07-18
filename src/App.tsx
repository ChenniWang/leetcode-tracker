import { useEffect, useMemo, useState } from 'react'
import { createProblem, deleteProblem, fetchProblems, updateProblem } from './api'
import { AddProblem } from './components/AddProblem'
import { AuthScreen } from './components/AuthScreen'
import { DetailPanel } from './components/DetailPanel'
import { ProblemTable } from './components/ProblemTable'
import { useAuth } from './lib/auth'
import { createProblemFromId } from './lib/createProblem'
import { STATUS_PRESETS, type Difficulty, type Problem, type SortDir, type SortKey } from './types'
import './App.css'

const DIFF_RANK: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 }

const ALL_TOPICS = [
  'Array',
  'Hash Table',
  'Dynamic Programming',
  'Two Pointers',
  'Stack',
  'Sliding Window',
  'Heap',
  'Quickselect',
  'Design',
  'Linked List',
  'Tree',
  'BFS',
  'Divide and Conquer',
  'String',
]

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Problem | null>(null)
  const [q, setQ] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [topic, setTopic] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('leetcodeId')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  useEffect(() => {
    if (!user) {
      setProblems([])
      setSelectedId(null)
      setDraft(null)
      setLoading(false)
      setLoadError('')
      return
    }

    let cancelled = false
    setLoading(true)
    fetchProblems()
      .then((rows) => {
        if (!cancelled) {
          setProblems(rows)
          setLoadError('')
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : '加载失败')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const selected = problems.find((p) => p.id === selectedId) ?? null
  const panelProblem = draft ?? selected
  const panelMode = draft ? 'create' : 'view'
  const statusOptions = useMemo(() => {
    const extra = problems.map((p) => p.status).filter((s) => s && s !== '待做')
    return Array.from(new Set([...STATUS_PRESETS, ...extra]))
  }, [problems])

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    let list = problems.filter((p) => {
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false
      if (topic !== 'all' && !p.topics.includes(topic)) return false
      if (status !== 'all' && p.status !== status) return false
      if (!query) return true
      return (
        String(p.leetcodeId).includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.notes.toLowerCase().includes(query) ||
        p.topics.some((t) => t.toLowerCase().includes(query)) ||
        p.status.toLowerCase().includes(query)
      )
    })

    list = [...list].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'leetcodeId':
          cmp = a.leetcodeId - b.leetcodeId
          break
        case 'difficulty':
          cmp = DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty]
          break
        case 'attempts':
          cmp = a.attempts - b.attempts
          break
        case 'status':
          cmp = a.status.localeCompare(b.status, 'zh')
          break
        case 'lastPracticedAt':
          cmp = a.lastPracticedAt.localeCompare(b.lastPracticedAt)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [problems, q, difficulty, topic, status, sortKey, sortDir])

  const solvedCount = problems.filter((p) => p.status === '过关').length

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'lastPracticedAt' ? 'desc' : 'asc')
    }
  }

  async function persist(next: Problem) {
    setProblems((prev) => prev.map((p) => (p.id === next.id ? next : p)))
    try {
      await updateProblem(next)
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败')
      const fresh = await fetchProblems()
      setProblems(fresh)
    }
  }

  function patchProblem(id: string, patch: Partial<Problem>) {
    const current = problems.find((p) => p.id === id)
    if (!current) return
    void persist({ ...current, ...patch })
  }

  function startCreate(leetcodeId: number) {
    setSelectedId(null)
    setDraft(createProblemFromId(leetcodeId))
  }

  async function confirmCreate() {
    if (!draft) return
    try {
      const created = await createProblem(draft)
      setProblems((prev) => [created, ...prev])
      setDraft(null)
      setSelectedId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : '新增失败')
    }
  }

  function cancelCreate() {
    setDraft(null)
  }

  async function handleDelete(id: string) {
    const target = problems.find((p) => p.id === id)
    const label = target ? `#${target.leetcodeId} ${target.title}` : '这道题'
    if (!confirm(`确定删除 ${label}？`)) return
    const prev = problems
    setProblems((list) => list.filter((p) => p.id !== id))
    if (selectedId === id) setSelectedId(null)
    if (draft?.id === id) setDraft(null)
    try {
      await deleteProblem(id)
    } catch (err) {
      setProblems(prev)
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  function selectByLeetcodeId(leetcodeId: number) {
    setDraft(null)
    const hit = problems.find((p) => p.leetcodeId === leetcodeId)
    if (hit) setSelectedId(hit.id)
  }

  function selectRow(id: string) {
    setDraft(null)
    setSelectedId(id)
  }

  if (authLoading) {
    return (
      <div className="auth-screen">
        <p className="auth-loading">加载中…</p>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className={`app${panelProblem ? ' app--drawer' : ''}`}>
      <header className="topbar">
        <div className="brand">
          <h1>LeetTrack</h1>
          <p>
            已做题目 · 过关 {solvedCount}/{problems.length}
            {loading ? ' · 加载中…' : ''}
            {loadError ? ` · ${loadError}` : ''}
          </p>
        </div>
        <AddProblem
          existingIds={problems.map((p) => p.leetcodeId)}
          onAdd={startCreate}
          onSelectExisting={selectByLeetcodeId}
        />
        <div className="filters">
          <input
            className="search"
            placeholder="搜题号 / 标题 / 笔记…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')}
          >
            <option value="all">全部难度</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">全部 Topic</option>
            {ALL_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">全部状态</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={`${sortKey}:${sortDir}`}
            onChange={(e) => {
              const [k, d] = e.target.value.split(':') as [SortKey, SortDir]
              setSortKey(k)
              setSortDir(d)
            }}
          >
            <option value="leetcodeId:asc">排序：题号 ↑</option>
            <option value="leetcodeId:desc">排序：题号 ↓</option>
            <option value="difficulty:asc">排序：难度 ↑</option>
            <option value="difficulty:desc">排序：难度 ↓</option>
            <option value="attempts:desc">排序：遍数 ↓</option>
            <option value="status:asc">排序：状态</option>
            <option value="lastPracticedAt:desc">排序：最近练习</option>
          </select>
          <div className="filter-account">
            <button
              type="button"
              className="filter-signout"
              title={user.email ?? '退出账号'}
              onClick={() => {
                void signOut().catch((err: unknown) => {
                  alert(err instanceof Error ? err.message : '退出失败')
                })
              }}
            >
              退出
            </button>
            <span className="filter-email" title={user.email ?? undefined}>
              {user.email}
            </span>
          </div>
        </div>
      </header>

      <main className="main">
        {loadError ? (
          <p className="boot-error">
            无法连接 Supabase：{loadError}
            <br />
            若提示权限 / RLS，请在 Supabase SQL Editor 重新执行{' '}
            <code>supabase/schema.sql</code>。
            <br />
            检查 GitHub Secrets：
            <code>VITE_SUPABASE_URL</code> 只能是{' '}
            <code>https://xxxx.supabase.co</code>（不要加 <code>/rest/v1</code>），
            <code>VITE_SUPABASE_ANON_KEY</code> 必须是 publishable / anon public。
          </p>
        ) : (
          <ProblemTable
            rows={rows}
            selectedId={selectedId}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onSelect={selectRow}
            onPatch={patchProblem}
          />
        )}
      </main>

      {panelProblem && (
        <>
          <button
            type="button"
            className="backdrop"
            aria-label="关闭详情"
            onClick={() => (draft ? cancelCreate() : setSelectedId(null))}
          />
          <DetailPanel
            problem={panelProblem}
            mode={panelMode}
            onClose={() => (draft ? cancelCreate() : setSelectedId(null))}
            onChange={(next) => {
              if (draft) setDraft(next)
              else void persist(next)
            }}
            onConfirmCreate={() => void confirmCreate()}
            onDelete={
              draft ? undefined : () => void handleDelete(panelProblem.id)
            }
          />
        </>
      )}
    </div>
  )
}
