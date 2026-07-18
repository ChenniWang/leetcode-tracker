import type { Problem } from '../types'
import { lookupById, titleToSlug } from '../data/problemCatalog'
import { NotesBlock } from './NotesBlock'
import { CodeVersions } from './CodeVersions'
import { ProblemBrief } from './ProblemBrief'
import { StatusSelect } from './StatusSelect'

type Props = {
  problem: Problem
  /** 新增草稿：底部显示「确定新增」，取消不入列表 */
  mode?: 'view' | 'create'
  onClose: () => void
  onChange: (next: Problem) => void
  onConfirmCreate?: () => void
  onDelete?: () => void
}

export function DetailPanel({
  problem,
  mode = 'view',
  onClose,
  onChange,
  onConfirmCreate,
  onDelete,
}: Props) {
  const isCreate = mode === 'create'

  function applyLeetcodeId(raw: string) {
    const leetcodeId = Math.max(0, Number(raw) || 0)
    const hit = lookupById(leetcodeId)
    if (hit) {
      onChange({
        ...problem,
        leetcodeId,
        title: hit.title,
        slug: hit.slug,
        difficulty: hit.difficulty,
        topics: hit.topics,
      })
      return
    }
    onChange({
      ...problem,
      leetcodeId,
      slug: problem.title ? titleToSlug(problem.title) : problem.slug,
    })
  }

  return (
    <aside className="drawer" aria-label={isCreate ? '新增题目' : '题目详情'}>
      <header className="drawer__head">
        <div>
          <label className="id-edit">
            <span>#</span>
            <input
              className="id-edit__input mono"
              type="number"
              min={1}
              value={problem.leetcodeId || ''}
              onChange={(e) => applyLeetcodeId(e.target.value)}
              aria-label="题号"
            />
          </label>
          <input
            className="drawer__title-input"
            value={problem.title}
            onChange={(e) => {
              const title = e.target.value
              onChange({
                ...problem,
                title,
                slug: titleToSlug(title) || problem.slug,
              })
            }}
            placeholder="题目标题"
          />
        </div>
        <button type="button" className="ghost-btn" onClick={onClose}>
          {isCreate ? '取消' : '关闭'}
        </button>
      </header>

      <ProblemBrief
        leetcodeId={problem.leetcodeId}
        title={problem.title}
        slug={problem.slug}
      />

      <div className="topic-row">
        {problem.topics.map((t) => (
          <span key={t} className="topic-chip">
            {t}
          </span>
        ))}
      </div>

      <NotesBlock
        value={problem.notes}
        onChange={(notes) => onChange({ ...problem, notes })}
      />

      <div className="drawer__meta">
        <label className="field">
          <span>遍数</span>
          <input
            type="number"
            min={0}
            value={problem.attempts}
            onChange={(e) =>
              onChange({ ...problem, attempts: Math.max(0, Number(e.target.value) || 0) })
            }
          />
        </label>
        <label className="field">
          <span>状态</span>
          <StatusSelect
            wide
            value={problem.status}
            onChange={(status) => onChange({ ...problem, status })}
          />
        </label>
      </div>

      <CodeVersions
        versions={problem.codeVersions}
        onChange={(codeVersions) => onChange({ ...problem, codeVersions })}
      />

      {(isCreate || onDelete) && (
        <div className="drawer__footer">
          {isCreate ? (
            <>
              <button type="button" className="ghost-btn" onClick={onClose}>
                取消
              </button>
              <button type="button" className="drawer__confirm" onClick={onConfirmCreate}>
                确定新增
              </button>
            </>
          ) : (
            <button type="button" className="drawer__danger" onClick={onDelete}>
              删除此题
            </button>
          )}
        </div>
      )}
    </aside>
  )
}
