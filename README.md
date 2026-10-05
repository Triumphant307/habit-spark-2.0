# habit-spark — Monorepo

Monorepo holding the full habit-spark stack.

## Structure

```
habit-spark/
├── frontend/    # Next.js 16 — React, TypeScript, MUI
├── backend/     # Express 5 — Prisma, PostgreSQL, TypeScript, Jest
├── package.json # Root convenience scripts (no shared dependencies)
└── .gitignore
```

Each app is **fully self-contained**. Neither app depends on the other to install or run.

---

## Getting Started

### Full stack

```bash
npm run install:all   # installs deps in both apps
npm run dev:frontend  # starts Next.js dev server
npm run dev:backend   # starts Express server
```

### Frontend only

```bash
cd frontend
npm install
npm run dev
```

### Backend only

```bash
cd backend
npm install
npm run dev
```

---

## Sparse Checkout (Partial Clones)

You can clone only the part of the stack you need using Git sparse-checkout.

### Frontend Developers
Clone only the `frontend/` folder:

```bash
git clone --no-checkout git@github.com:Triumphant307/habit-spark-2.0.git habit-spark
cd habit-spark
git sparse-checkout init --cone
git sparse-checkout set frontend
git checkout main
cd frontend && npm install && npm run dev
```

### Backend Developers
Clone only the `backend/` folder:

```bash
git clone --no-checkout git@github.com:Triumphant307/habit-spark-2.0.git habit-spark
cd habit-spark
git sparse-checkout init --cone
git sparse-checkout set backend
git checkout main
cd backend && npm install && npm run dev
```

---

## Scripts (from repo root)

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Next.js dev server |
| `npm run dev:backend` | Start Express dev server |
| `npm run build:frontend` | Production build (Next.js) |
| `npm run build:backend` | Compile TypeScript (tsc) |
| `npm run lint:frontend` | ESLint — frontend |
| `npm run lint:backend` | ESLint — backend |
| `npm run test:backend` | Jest test suite |
| `npm run install:all` | Install deps for both apps |

---

## Original Repositories

| App | Original remote (read-only reference) |
|---|---|
| Frontend | `github.com/Triumphant307/habit-spark-2.0` |
| Backend | `github.com/Triumphant307/habit-spark_backend` |

