import type { Difficulty, Problem, SortDir, SortKey } from '../types'
import { problemSearchUrl, problemUrl } from '../data/problemCatalog'
import { StatusCell } from './StatusCell'

type Props = {
  rows: Problem[]
  selectedId: string | null
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  onSelect: (id: string) => void
  onPatch: (id: string, patch: Partial<Problem>) => void
}

const DIFF_CLASS: Record<Difficulty, string> = {
  Easy: 'diff-easy',
  Medium: 'diff-medium',
  Hard: 'diff-hard',
}

function SortBtn({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: SortDir
  onClick: () => void
}) {
  return (
    <button type="button" className={`th-sort${active ? ' is-active' : ''}`} onClick={onClick}>
      {label}
      {active ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
    </button>
  )
}

export function ProblemTable({
  rows,
  selectedId,
  sortKey,
  sortDir,
  onSort,
  onSelect,
  onPatch,
}: Props) {
  return (
    <div className="table-wrap">
      <table className="sheet">
        <colgroup>
          <col className="col-id" />
          <col className="col-title" />
          <col className="col-topic" />
          <col className="col-diff" />
          <col className="col-notes" />
          <col className="col-attempts" />
          <col className="col-status" />
          <col className="col-date" />
        </colgroup>
        <thead>
          <tr>
            <th className="is-center">
              <SortBtn
                label="题号"
                active={sortKey === 'leetcodeId'}
                dir={sortDir}
                onClick={() => onSort('leetcodeId')}
              />
            </th>
            <th className="is-center">题目</th>
            <th className="is-center">Topic</th>
            <th className="is-center">
              <SortBtn
                label="难度"
                active={sortKey === 'difficulty'}
                dir={sortDir}
                onClick={() => onSort('difficulty')}
              />
            </th>
            <th>笔记</th>
            <th>
              <SortBtn
                label="遍数"
                active={sortKey === 'attempts'}
                dir={sortDir}
                onClick={() => onSort('attempts')}
              />
            </th>
            <th>
              <SortBtn
                label="状态"
                active={sortKey === 'status'}
                dir={sortDir}
                onClick={() => onSort('status')}
              />
            </th>
            <th>
              <SortBtn
                label="最近"
                active={sortKey === 'lastPracticedAt'}
                dir={sortDir}
                onClick={() => onSort('lastPracticedAt')}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const href = p.slug ? problemUrl(p.slug) : problemSearchUrl(p.leetcodeId)
            return (
              <tr
                key={p.id}
                className={selectedId === p.id ? 'is-selected' : undefined}
                onClick={() => onSelect(p.id)}
              >
                <td className="id-cell" onClick={(e) => e.stopPropagation()}>
                  <a
                    className="id-link mono"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title="打开题目"
                  >
                    {p.leetcodeId}
                  </a>
                </td>
                <td className="title-cell">{p.title}</td>
                <td className="topic-cell">
                  <div className="topic-row">
                    {p.topics.map((t) => (
                      <span key={t} className="topic-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="diff-cell">
                  <span className={`diff ${DIFF_CLASS[p.difficulty]}`}>{p.difficulty}</span>
                </td>
                <td className="notes-cell">
                  <div className="notes-cell__text">{p.notes.trim() || '—'}</div>
                </td>
                <td className="attempts-cell" onClick={(e) => e.stopPropagation()}>
                  <input
                    className="cell-num"
                    type="number"
                    min={0}
                    value={p.attempts}
                    onChange={(e) =>
                      onPatch(p.id, { attempts: Math.max(0, Number(e.target.value) || 0) })
                    }
                  />
                </td>
                <td className="status-cell">
                  <StatusCell value={p.status} onChange={(status) => onPatch(p.id, { status })} />
                </td>
                <td className="date-cell mono muted">{p.lastPracticedAt}</td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="empty">
                还没有题目，在上方输入题号添加。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
