# LeetTrack

个人 LeetCode 刷题工作簿：表格记录做过的题，支持笔记、多版代码，以及按题号自动补全标题和跳转链接。

![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18-61dafb)
![Express](https://img.shields.io/badge/express-4-lightgrey)

## Features

- Excel 感表格：题号、标题、Topic、难度、笔记、遍数、状态
- 状态：做过 / 复习 / 过关（下拉选择）
- 详情侧栏：笔记优先，代码多版本（草稿 + 最优解，默认打开最优解）
- 输入题号自动关联标题、难度、LeetCode 链接（内置约 4000 题索引）
- 新增为草稿：先编辑，点「确定新增」再写入数据
- 筛选 / 排序：难度、Topic、状态、题号等
- 前后端分离：Express API + 本地 JSON 文件持久化

## Stack

| 层 | 技术 |
|----|------|
| 前端 | React 18 + Vite + TypeScript |
| 后端 | Express |
| 存储 | `data/problems.json`（本地文件，已 gitignore） |

## Quick start

需要 **Node.js 18+**（推荐 20 / 22）。

```bash
git clone https://github.com/ChenniWang/leetcode-tracker.git
cd leetcode-tracker
npm install
npm run dev
```

然后打开：

- Web：http://127.0.0.1:5173
- API：http://127.0.0.1:5174（开发时由 Vite 代理 `/api`）

首次启动会自动创建 `data/problems.json` 并写入示例数据。个人刷题记录不会进 Git（`data/` 已在 `.gitignore`）。

## Scripts

| 命令 | 说明 |
|------|------|
| `npm run dev` | 同时启动前端 + API |
| `npm run dev:web` | 仅前端 |
| `npm run dev:api` | 仅后端 |
| `npm run build` | 构建前端 |
| `npm run start:api` | 生产方式启动 API |

## API

| Method | Path | 说明 |
|--------|------|------|
| `GET` | `/api/health` | 健康检查 |
| `GET` | `/api/problems` | 列表 |
| `POST` | `/api/problems` | 新增 |
| `PUT` | `/api/problems/:id` | 更新（含代码版本） |
| `DELETE` | `/api/problems/:id` | 删除 |
| `POST` | `/api/problems/reset` | 恢复示例数据 |

## Notes

- 这是**本机运行**的应用：每人 clone 后各自有一份数据，不是多人共享云端账本。
- 若要部署成在线服务，需要把 API 放到云服务器，并把 JSON 换成真正的数据库。
- 更新题号索引（可选）：

```bash
node scripts/update-leetcode-index.mjs
```

## License

MIT
