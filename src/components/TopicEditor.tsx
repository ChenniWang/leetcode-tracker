import { TOPIC_OPTIONS } from '../data/topics'

type Props = {
  value: string[]
  onChange: (next: string[]) => void
}

export function TopicEditor({ value, onChange }: Props) {
  const selected = new Set(value)

  function toggle(topic: string) {
    if (selected.has(topic)) {
      onChange(value.filter((t) => t !== topic))
    } else {
      onChange([...value, topic])
    }
  }

  return (
    <div className="topic-editor">
      <div className="topic-editor__label">Topic</div>
      {value.length > 0 ? (
        <div className="topic-row">
          {value.map((t) => (
            <button
              key={t}
              type="button"
              className="topic-chip topic-chip--active"
              onClick={() => toggle(t)}
              title="点击移除"
            >
              {t}
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="topic-editor__empty">还没有标签，从下面点选</p>
      )}
      <div className="topic-editor__picker">
        {TOPIC_OPTIONS.map((t) => {
          const on = selected.has(t)
          return (
            <button
              key={t}
              type="button"
              className={`topic-pick${on ? ' is-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(t)}
            >
              {t}
            </button>
          )
        })}
      </div>
    </div>
  )
}
