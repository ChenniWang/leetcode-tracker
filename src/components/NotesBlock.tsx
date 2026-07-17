import { useEffect, useRef } from 'react'

type Props = {
  value: string
  onChange: (next: string) => void
}

/** 打开详情即可直接编辑，随内容长高 */
export function NotesBlock({ value, onChange }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = '0px'
    const next = Math.min(Math.max(el.scrollHeight, 96), 320)
    el.style.height = `${next}px`
  }, [value])

  return (
    <section className="notes">
      <div className="notes__bar">
        <h3 className="panel-section-title">笔记</h3>
      </div>
      <textarea
        ref={taRef}
        className="notes__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="这题学到了什么…"
        rows={4}
      />
    </section>
  )
}
