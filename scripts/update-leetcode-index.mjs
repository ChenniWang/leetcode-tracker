/**
 * 重新拉取题号索引：node scripts/update-leetcode-index.mjs
 * 来源：https://leetcode.com/api/problems/all/
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const out = join(dirname(fileURLToPath(import.meta.url)), '../src/data/leetcodeIndex.json')
const DIFF = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }

const res = await fetch('https://leetcode.com/api/problems/all/')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const data = await res.json()
const map = {}

for (const p of data.stat_status_pairs ?? []) {
  const s = p.stat
  if (!s || s.question__hide) continue
  const id = s.frontend_question_id
  if (id == null) continue
  map[id] = {
    t: s.question__title,
    s: s.question__title_slug,
    d: DIFF[p.difficulty?.level] ?? 'Medium',
  }
}

writeFileSync(out, JSON.stringify(map))
console.log(`Wrote ${Object.keys(map).length} problems → ${out}`)
