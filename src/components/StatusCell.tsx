import { StatusSelect } from './StatusSelect'

type Props = {
  value: string
  onChange: (next: string) => void
}

export function StatusCell({ value, onChange }: Props) {
  return <StatusSelect value={value} onChange={onChange} />
}
