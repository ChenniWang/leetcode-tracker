import { useEffect, useState } from 'react'
import { problemSearchUrl, problemUrl } from '../data/problemCatalog'

type Props = {
  leetcodeId: number
  title: string
  slug: string
}

type FetchState =
  | { kind: 'idle' | 'loading' }
  | { kind: 'ok'; content: string }
  | { kind: 'err'; message: string }

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+\n/g, '\n').trim()
}

export function ProblemBrief({ leetcodeId, title, slug }: Props) {
  const [state, setState] = useState<FetchState>({ kind: 'idle' })
  const [open, setOpen] = useState(false)
  const href = slug ? problemUrl(slug) : problemSearchUrl(leetcodeId)

  useEffect(() => {
    if (!open || !slug) return
    let cancelled = false
    setState({ kind: 'loading' })

    // 公开镜像接口，失败则只保留外链（完整题面仍以 LeetCode 为准）
    fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ question?: string; message?: string }>
      })
      .then((data) => {
        if (cancelled) return
        if (!data.question) throw new Error(data.message ?? '无题面')
        setState({ kind: 'ok', content: stripHtml(data.question) })
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setState({
          kind: 'err',
          message: e instanceof Error ? e.message : '拉取失败',
        })
      })

    return () => {
      cancelled = true
    }
  }, [open, slug])

  return (
    <section className="brief">
      <div className="notes__bar">
        <h3 className="panel-section-title">题目</h3>
        <div className="code-panel__actions">
          <a className="ghost-btn link-btn" href={href} target="_blank" rel="noreferrer">
            打开 LeetCode
          </a>
          {slug && (
            <button type="button" className="ghost-btn" onClick={() => setOpen((o) => !o)}>
              {open ? '收起题面' : '预览题面'}
            </button>
          )}
        </div>
      </div>
      <p className="brief__meta">
        <span className="mono">#{leetcodeId}</span>
        {title ? ` · ${title}` : ' · 尚未关联标题'}
        {slug ? (
          <>
            {' · '}
            <a href={href} target="_blank" rel="noreferrer">
              {slug}
            </a>
          </>
        ) : (
          ' · 输入题号后若目录里有匹配会自动填 slug'
        )}
      </p>
      {open && (
        <div className="brief__body">
          {state.kind === 'loading' && <p className="notes__hint">正在拉取题面…</p>}
          {state.kind === 'err' && (
            <p className="notes__hint">
              预览不可用（{state.message}）。请点「打开 LeetCode」看完整题目。
            </p>
          )}
          {state.kind === 'ok' && <pre className="brief__text">{state.content}</pre>}
        </div>
      )}
    </section>
  )
}
