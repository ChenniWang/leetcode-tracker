# LeetTrack

A personal LeetCode workbook: spreadsheet-style tracking for problems you’ve solved, with notes, multiple code versions, and auto-complete from problem IDs (title + LeetCode link).

Data is stored in **Supabase**. The UI can be hosted on **GitHub Pages** at:

`https://chenniwang.github.io/leetcode-tracker/`

![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18-61dafb)
![Supabase](https://img.shields.io/badge/supabase-postgres-3FCF8E)

## Features

- Spreadsheet-like table: ID, title, topic, difficulty, notes, attempts, status
- Status options: Done / Review / Passed (dropdown)
- Detail drawer: notes first; multi-version code (drafts + optimal, optimal opened by default)
- Enter a problem ID to auto-fill title, difficulty, and LeetCode link (~4000 problems indexed)
- New problems start as a draft — edit first, then confirm to save
- Filter / sort by difficulty, topic, status, ID, and more
- Cloud persistence via Supabase (same idea as a static notes app + hosted DB)

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| Database | Supabase (Postgres) |
| Hosting | GitHub Pages |

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Open **SQL Editor** → New query → paste and run [`supabase/schema.sql`](./supabase/schema.sql).
3. Open **Project Settings → API** and copy:
   - Project URL
   - `anon` `public` key

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

Open http://127.0.0.1:5173 and add problems from an empty list.

## 3. Deploy to GitHub Pages (clickable `*.github.io` URL)

### Repo secrets

In GitHub: **Settings → Secrets and variables → Actions** → add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

(same values as `.env.local`)

### Enable Pages

1. **Settings → Pages**
2. **Source**: GitHub Actions

### Deploy

Push to `main` (or run the **Deploy GitHub Pages** workflow manually).  
After it finishes, open:

**https://chenniwang.github.io/leetcode-tracker/**

> Free GitHub Pages + anon key means your workbook data is readable/writable by anyone who has the built site’s public anon key. Fine for a personal tracker; add auth later if you need privacy.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |

## Notes

- Optional: refresh the problem-ID index with `node scripts/update-leetcode-index.mjs`
- The old Express + local JSON backend was removed in favor of Supabase.

## License

MIT
