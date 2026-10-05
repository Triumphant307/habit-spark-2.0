# AGENTS.md

## Monorepo Structure

```
habit-spark/
├── frontend/    # Next.js 16 app
├── backend/     # Express 5 / Prisma app
├── package.json # Root convenience scripts only — no shared deps
└── .gitignore
```

## Commands

### Root (delegates to each app)
```bash
npm run dev:frontend      # Next.js dev server
npm run dev:backend       # Express dev server
npm run build:frontend    # Next.js production build
npm run build:backend     # tsc compile
npm run lint:frontend     # ESLint (frontend)
npm run lint:backend      # ESLint (backend)
npm run test:backend      # Jest (backend)
npm run install:all       # npm install in both apps
```

### Frontend (run from frontend/)
```bash
npm run dev       # Next.js dev server (Turbopack)
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint + TS check
npm run format    # Prettier write
```

### Backend (run from backend/)
```bash
npm run dev       # tsx watch src/server.ts
npm run build     # tsc
npm run start     # node dist/server.js
npm run test      # Jest (ESM mode)
npm run lint      # ESLint src/
npm run format    # Prettier write
```

## Verified Agent Pitfalls

- **No test framework in frontend**: Do not look for test commands in `frontend/`.
- **No typecheck script in frontend**: Use `npm run lint` (runs next lint which includes TS).
- **Backend uses ESM**: `"type": "module"` in `backend/package.json`. Imports require `.js` extensions.
- **Mixed extensions in frontend**: Project uses both `.tsx` and `.jsx`. Check `tsconfig.json` includes both.
- **Isolated node_modules**: Each app installs independently. Never run `npm install` at the repo root expecting shared deps.

## Architecture Facts

### Frontend
- **Custom Reactor pattern**: Uses `sia-reactor` library. State lives in `frontend/src/core/state/state.ts`.
- **PWA**: Offline-capable with service worker for notifications.
- **Path alias**: `@/*` resolves to `./src/*` (relative to `frontend/`).

### Backend
- **Express 5** with Prisma 7 + PostgreSQL
- **Dual-token auth**: Access + refresh tokens with database session tracking
- **Google OAuth**: Lazy-initialized client, account linking
- **Pino logger**: Structured JSON logging with `pino-pretty` in dev

## Key Directories

### Frontend (`frontend/`)
- `frontend/src/app/` — Next.js App Router pages
- `frontend/src/core/state/` — App state definition
- `frontend/src/core/reactor/` — State management system
- `frontend/src/components/Auth/` — Authentication components

### Backend (`backend/`)
- `backend/src/routes/` — Express route definitions
- `backend/src/controllers/` — Request handlers
- `backend/src/services/` — Business logic
- `backend/src/repositories/` — Database access (Prisma)
- `backend/src/middleware/` — Auth, validation, error handling
- `backend/prisma/` — Schema and migrations