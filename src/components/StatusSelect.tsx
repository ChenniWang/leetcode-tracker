import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { STATUS_PRESETS } from '../types'

type Props = {
  value: string
  onChange: (next: string) => void
  /** 表格里紧凑一点；详情里可以撑满 */
  wide?: boolean
}

type MenuPos = { top: number; left: number; width: number }

export function StatusSelect({ value, onChange, wide = false }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<MenuPos | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  const options =
    value && !(STATUS_PRESETS as readonly string[]).includes(value)
      ? [value, ...STATUS_PRESETS]
      : [...STATUS_PRESETS]

  function updatePos() {
    const btn = btnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const menuH = menuRef.current?.offsetHeight ?? options.length * 36 + 12
    const spaceBelow = window.innerHeight - r.bottom
    const openUp = spaceBelow < menuH + 8 && r.top > spaceBelow
    setPos({
      top: openUp ? Math.max(8, r.top - menuH - 4) : r.bottom + 4,
      left: r.left,
      width: Math.max(r.width, wide ? 140 : 88),
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePos()
    const raf = requestAnimationFrame(() => updatePos())
    const onReposition = () => updatePos()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, options.length, wide])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      const t = e.target as Node
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const menu =
    open && pos
      ? createPortal(
          <ul
            className="status-select__menu status-select__menu--portal"
            id={listId}
            role="listbox"
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {options.map((s) => (
              <li key={s} role="option" aria-selected={s === value}>
                <button
                  type="button"
                  className={`status-select__option status-tone ${toneClass(s)}${
                    s === value ? ' is-active' : ''
                  }`}
                  onClick={() => {
                    onChange(s)
                    setOpen(false)
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null

  return (
    <div
      className={`status-select${wide ? ' is-wide' : ''}${open ? ' is-open' : ''}`}
      ref={rootRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        ref={btnRef}
        className={`status-select__btn status-tone ${toneClass(value)}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value || '做过'}</span>
        <span className="status-select__chev" aria-hidden>
          ▾
        </span>
      </button>
      {menu}
    </div>
  )
}

function toneClass(status: string): string {
  if (status === '过关') return 'is-solved'
  if (status === '复习') return 'is-review'
  if (status === '做过') return 'is-attempted'
  if (status === '待做') return 'is-todo'
  return 'is-custom'
}
