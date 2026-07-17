import { useMemo, useState, type FormEvent } from 'react'
import { lookupById, problemUrl } from '../data/problemCatalog'

type Props = {
  existingIds: number[]
  onAdd: (leetcodeId: number) => void
  onSelectExisting: (leetcodeId: number) => void
}

export function AddProblem({ existingIds, onAdd, onSelectExisting }: Props) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState('')

  const previewId = Math.floor(Number(raw))
  const preview = useMemo(() => {
    if (!Number.isFinite(previewId) || previewId <= 0) return null
    return lookupById(previewId)
  }, [previewId])

  function submit(e?: FormEvent) {
    e?.preventDefault()
    const id = Math.floor(Number(raw))
    if (!Number.isFinite(id) || id <= 0) {
      setError('请输入有效题号')
      return
    }
    if (!lookupById(id)) {
      setError(`题库里没有 #${id}`)
      return
    }
    if (existingIds.includes(id)) {
      setError(`#${id} 已在列表`)
      onSelectExisting(id)
      setRaw('')
      return
    }
    setError('')
    onAdd(id)
    setRaw('')
  }

  return (
    <div className="add-problem">
      <form className="add-problem__row" onSubmit={submit}>
        <input
          className="add-problem__input mono"
          type="number"
          min={1}
          placeholder="题号，如 42"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value)
            setError('')
          }}
          aria-label="新增题号"
        />
        <button type="submit" className="add-problem__btn" disabled={!preview}>
          新增
        </button>
      </form>

      {preview && (
        <div className="add-preview">
          <span className={`diff diff-${preview.difficulty.toLowerCase()}`}>
            {preview.difficulty}
          </span>
          <span className="add-preview__title" title={preview.title}>
            #{preview.leetcodeId} {preview.title}
          </span>
          <a
            className="add-preview__link"
            href={problemUrl(preview.slug)}
            target="_blank"
            rel="noreferrer"
          >
            打开 ↗
          </a>
        </div>
      )}
      {error && <span className="add-problem__error">{error}</span>}
    </div>
  )
}
