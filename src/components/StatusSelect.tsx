import { useEffect, useId, useRef, useState } from 'react'
import { STATUS_PRESETS } from '../types'

type Props = {
  value: string
  onChange: (next: string) => void
  /** 表格里紧凑一点；详情里可以撑满 */
  wide?: boolean
}

export function StatusSelect({ value, onChange, wide = false }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const options =
    value && !(STATUS_PRESETS as readonly string[]).includes(value)
      ? [value, ...STATUS_PRESETS]
      : [...STATUS_PRESETS]

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
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

  return (
    <div
      className={`status-select${wide ? ' is-wide' : ''}${open ? ' is-open' : ''}`}
      ref={rootRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
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
      {open && (
        <ul className="status-select__menu" id={listId} role="listbox">
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
        </ul>
      )}
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
