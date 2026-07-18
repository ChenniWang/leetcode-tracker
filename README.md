# LeetTrack

A personal LeetCode workbook: spreadsheet-style tracking for problems you’ve solved, with notes, multiple code versions, and auto-complete from problem IDs (title + LeetCode link).

Data is stored in **Supabase** (per-user after login). The UI is hosted on **GitHub Pages**:

`https://chenniwang.github.io/leetcode-tracker/`

![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18-61dafb)
![Supabase](https://img.shields.io/badge/supabase-postgres-3FCF8E)

## Features

- Email/password login — each account only sees its own problems
- Spreadsheet-like table: ID, title, topic, difficulty, notes, attempts, status
- Delete a problem from the table or the detail drawer
- Status options: Done / Review / Passed (dropdown)
- Detail drawer: notes first; multi-version code (drafts + optimal)
- Enter a problem ID to auto-fill title, difficulty, and LeetCode link
- Filter / sort by difficulty, topic, status, ID, and more

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| Auth + DB | Supabase Auth + Postgres (RLS) |
| Hosting | GitHub Pages |

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Open **SQL Editor** → New query → paste and run [`supabase/schema.sql`](./supabase/schema.sql).
3. **Authentication → Providers → Email**: enable Email. For easier testing, turn **off** “Confirm email”.
4. **Authentication → URL Configuration**:
   - Site URL: `https://chenniwang.github.io/leetcode-tracker`
   - Redirect URLs: add `https://chenniwang.github.io/leetcode-tracker/**` and `http://127.0.0.1:5173/**`
5. **Project Settings → API**: copy Project URL and `anon` `public` key.

## 2. Local setup

Requires **Node.js 18+** (20 / 22 recommended).

```bash
git clone https://github.com/ChenniWang/leetcode-tracker.git
cd leetcode-tracker
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

```bash
npm run dev
```

Open http://127.0.0.1:5173 — register / log in, then add problems.

## 3. Deploy to GitHub Pages

### Repo secrets

In GitHub: **Settings → Secrets and variables → Actions** → add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Enable Pages

1. **Settings → Pages**
2. **Source**: GitHub Actions

### Deploy

Push to `main` (or run **Deploy GitHub Pages**). Then open:

**https://chenniwang.github.io/leetcode-tracker/**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |

## Notes

- Optional: refresh the problem-ID index with `node scripts/update-leetcode-index.mjs`
- After enabling auth isolation, re-run `supabase/schema.sql` if you still have the old open RLS policy.

## License

MIT
