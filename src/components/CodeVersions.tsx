import { useEffect, useRef, useState } from 'react'
import type { CodeVersion } from '../types'
import { defaultVersionId, orderCodeVersions } from '../lib/sortVersions'

type Props = {
  versions: CodeVersion[]
  onChange: (versions: CodeVersion[]) => void
  /** Fill available height (drawer right pane) */
  fill?: boolean
}

export function CodeVersions({ versions, onChange, fill = false }: Props) {
  const ordered = orderCodeVersions(versions)
  const [activeId, setActiveId] = useState<string | null>(() => defaultVersionId(versions))
  const [expanded, setExpanded] = useState(fill || versions.length > 0)
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId

  // Keep current tab unless that version was removed — never snap back to 最优解 on rename.
  useEffect(() => {
    const prev = activeIdRef.current
    if (prev && versions.some((v) => v.id === prev)) return
    const next = defaultVersionId(versions)
    setActiveId(next)
    activeIdRef.current = next
  }, [versions])

  useEffect(() => {
    if (fill) setExpanded(true)
  }, [fill])

  const active = ordered.find((v) => v.id === activeId) ?? null

  function selectVersion(id: string) {
    activeIdRef.current = id
    setActiveId(id)
  }

  function addDraft() {
    const id = `v-${Date.now()}`
    const next: CodeVersion = {
      id,
      label: `草稿 ${versions.filter((v) => !v.isOptimal).length + 1}`,
      language: 'python',
      code: '',
      isOptimal: false,
    }
    activeIdRef.current = id
    setActiveId(id)
    setExpanded(true)
    onChange([...versions.filter((v) => !v.isOptimal), next, ...versions.filter((v) => v.isOptimal)])
  }

  function addOptimal() {
    if (versions.some((v) => v.isOptimal)) return
    const id = `v-opt-${Date.now()}`
    const next: CodeVersion = {
      id,
      label: '最优解 / 标准答案',
      language: 'python',
      code: '',
      isOptimal: true,
    }
    activeIdRef.current = id
    setActiveId(id)
    setExpanded(true)
    onChange([...versions, next])
  }

  function updateActive(patch: Partial<CodeVersion>) {
    const id = activeIdRef.current
    if (!id) return
    onChange(versions.map((v) => (v.id === id ? { ...v, ...patch } : v)))
  }

  return (
    <section className={`code-panel${fill ? ' code-panel--fill' : ''}`}>
      <div className="notes__bar">
        <h3 className="panel-section-title">代码版本</h3>
        <div className="code-panel__actions">
          {!fill && (
            <button type="button" className="ghost-btn" onClick={() => setExpanded((e) => !e)}>
              {expanded ? '收起' : '展开'}
            </button>
          )}
          <button type="button" className="ghost-btn" onClick={addDraft}>
            + 草稿
          </button>
          {!versions.some((v) => v.isOptimal) && (
            <button type="button" className="ghost-btn" onClick={addOptimal}>
              + 最优解
            </button>
          )}
        </div>
      </div>

      {!expanded && (
        <p className="notes__hint">
          {ordered.length === 0
            ? '可选：有多版代码时再展开。默认打开最优解。'
            : `${ordered.length} 个版本 · 默认优先显示最优解`}
        </p>
      )}

      {expanded && ordered.length === 0 && (
        <p className="notes__hint">还没有代码。不想记也可以一直空着。</p>
      )}

      {expanded && ordered.length > 0 && (
        <>
          <div className="code-tabs" role="tablist">
            {ordered.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={v.id === active?.id}
                className={`code-tab${v.id === active?.id ? ' is-active' : ''}${
                  v.isOptimal ? ' is-optimal' : ''
                }`}
                onClick={() => selectVersion(v.id)}
              >
                {v.label}
                {v.isOptimal ? ' ★' : ''}
              </button>
            ))}
          </div>
          {active && (
            <div className="code-editor">
              <div className="code-meta">
                <input
                  className="inline-input"
                  value={active.label}
                  onChange={(e) => updateActive({ label: e.target.value })}
                  aria-label="版本名称"
                />
                <input
                  className="inline-input inline-input--sm"
                  value={active.timeComplexity ?? ''}
                  placeholder="时间复杂度"
                  onChange={(e) => updateActive({ timeComplexity: e.target.value })}
                />
                <input
                  className="inline-input inline-input--sm"
                  value={active.spaceComplexity ?? ''}
                  placeholder="空间复杂度"
                  onChange={(e) => updateActive({ spaceComplexity: e.target.value })}
                />
              </div>
              <textarea
                className="code-textarea"
                spellCheck={false}
                value={active.code}
                onChange={(e) => updateActive({ code: e.target.value })}
                placeholder="# 贴代码…"
              />
            </div>
          )}
        </>
      )}
    </section>
  )
}
