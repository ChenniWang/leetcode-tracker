# LeetTrack

A personal LeetCode workbook: spreadsheet-style tracking for problems you’ve solved, with notes, multiple code versions, and auto-complete from problem IDs (title + LeetCode link).

![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18-61dafb)
![Express](https://img.shields.io/badge/express-4-lightgrey)

## Features

- Spreadsheet-like table: ID, title, topic, difficulty, notes, attempts, status
- Status options: Done / Review / Passed (dropdown)
- Detail drawer: notes first; multi-version code (drafts + optimal, optimal opened by default)
- Enter a problem ID to auto-fill title, difficulty, and LeetCode link (~4000 problems indexed)
- New problems start as a draft — edit first, then confirm to save
- Filter / sort by difficulty, topic, status, ID, and more
- Frontend + Express API with local JSON file persistence

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Express |
| Storage | `data/problems.json` (local file, gitignored) |

## Quick start

Requires **Node.js 18+** (20 / 22 recommended).

```bash
git clone https://github.com/ChenniWang/leetcode-tracker.git
cd leetcode-tracker
npm install
npm run dev
```

Then open:

- Web: http://127.0.0.1:5173
- API: http://127.0.0.1:5174 (Vite proxies `/api` in development)

On first launch, `data/problems.json` is created with sample data. Your personal progress stays local (`data/` is in `.gitignore`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + API together |
| `npm run dev:web` | Frontend only |
| `npm run dev:api` | API only |
| `npm run build` | Build the frontend |
| `npm run start:api` | Run the API (non-watch) |

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/problems` | List problems |
| `POST` | `/api/problems` | Create a problem |
| `PUT` | `/api/problems/:id` | Update a problem (including code versions) |
| `DELETE` | `/api/problems/:id` | Delete a problem |
| `POST` | `/api/problems/reset` | Reset to sample data |

## Notes

- This app is meant to run **locally**: each clone gets its own data file — it is not a shared cloud ledger.
- To host it online, deploy the API to a server and replace the JSON file with a real database.
- Optional: refresh the problem-ID index with:

```bash
node scripts/update-leetcode-index.mjs
```

## License

MIT
