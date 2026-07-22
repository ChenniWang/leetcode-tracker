import { useEffect, useState } from 'react'
import type { Problem } from '../types'
import { lookupById, titleToSlug } from '../data/problemCatalog'
import { NotesBlock } from './NotesBlock'
import { CodeVersions } from './CodeVersions'
import { ProblemBrief } from './ProblemBrief'
import { StatusSelect } from './StatusSelect'
import { TopicEditor } from './TopicEditor'

type Props = {
  problem: Problem
  /** 新增：底部「保存」写入数据库；取消不保存 */
  mode?: 'view' | 'create'
  onSave: (next: Problem) => void
  onCancel: () => void
  onDelete?: () => void
}

export function DetailPanel({
  problem,
  mode = 'view',
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const isCreate = mode === 'create'
  const [local, setLocal] = useState(problem)

  useEffect(() => {
    setLocal(problem)
  }, [problem.id, mode])

  function patch(updater: (prev: Problem) => Problem) {
    setLocal(updater)
  }

  function applyLeetcodeId(raw: string) {
    const leetcodeId = Math.max(0, Number(raw) || 0)
    const hit = lookupById(leetcodeId)
    patch((prev) => {
      if (hit) {
        return {
          ...prev,
          leetcodeId,
          title: hit.title,
          slug: hit.slug,
          difficulty: hit.difficulty,
          topics: hit.topics.length > 0 ? hit.topics : prev.topics,
        }
      }
      return {
        ...prev,
        leetcodeId,
        slug: prev.title ? titleToSlug(prev.title) : prev.slug,
      }
    })
  }

  return (
    <aside className="drawer" aria-label={isCreate ? '新增题目' : '题目详情'}>
      <header className="drawer__head">
        <div className="drawer__head-main">
          <label className="id-edit">
            <span>#</span>
            <input
              className="id-edit__input mono"
              type="number"
              min={1}
              value={local.leetcodeId || ''}
              onChange={(e) => applyLeetcodeId(e.target.value)}
              aria-label="题号"
            />
          </label>
          <input
            className="drawer__title-input"
            value={local.title}
            onChange={(e) => {
              const title = e.target.value
              patch((prev) => ({
                ...prev,
                title,
                slug: titleToSlug(title) || prev.slug,
              }))
            }}
            placeholder="题目标题"
          />
        </div>
      </header>

      <div className="drawer__body">
        <div className="drawer__side">
          <ProblemBrief leetcodeId={local.leetcodeId} title={local.title} slug={local.slug} />

          <TopicEditor
            value={local.topics}
            onChange={(topics) => patch((prev) => ({ ...prev, topics }))}
          />

          <NotesBlock
            value={local.notes}
            onChange={(notes) => patch((prev) => ({ ...prev, notes }))}
          />

          <div className="drawer__meta">
            <label className="field">
              <span>遍数</span>
              <input
                type="number"
                min={0}
                value={local.attempts}
                onChange={(e) =>
                  patch((prev) => ({
                    ...prev,
                    attempts: Math.max(0, Number(e.target.value) || 0),
                  }))
                }
              />
            </label>
            <label className="field">
              <span>状态</span>
              <StatusSelect
                wide
                value={local.status}
                onChange={(status) => patch((prev) => ({ ...prev, status }))}
              />
            </label>
          </div>
        </div>

        <div className="drawer__code">
          <CodeVersions
            fill
            versions={local.codeVersions}
            onChange={(codeVersions) => patch((prev) => ({ ...prev, codeVersions }))}
          />
        </div>
      </div>

      <div className="drawer__footer drawer__footer--actions">
        {onDelete ? (
          <button type="button" className="drawer__action drawer__action--danger" onClick={onDelete}>
            删除
          </button>
        ) : (
          <span />
        )}
        <div className="drawer__footer-right">
          <button type="button" className="drawer__action" onClick={onCancel}>
            取消
          </button>
          <button
            type="button"
            className="drawer__action drawer__action--save"
            onClick={() => onSave(local)}
          >
            保存
          </button>
        </div>
      </div>
    </aside>
  )
}
