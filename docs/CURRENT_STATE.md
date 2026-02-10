# 📊 Current State - Beringin v0.1.0 (MVP)

> Dokumen ini mencatat kondisi terkini proyek Beringin  
> **Last Updated**: 2026-02-10T12:09+07:00

## 🎯 Status Overview

| Aspek           | Status        | Catatan                |
| --------------- | ------------- | ---------------------- |
| **Development** | ✅ Active     | Phase 1 - Foundation   |
| **Build**       | ✅ Passing    | `npm run build` OK     |
| **Tests**       | ✅ Passing    | 179/179 passing (100%) |
| **Lint**        | ✅ Passing    | 0 errors, 0 warnings   |
| **CI/CD**       | ✅ Configured | GitHub Actions         |

## 🧭 Sprint Status

- Phase 0: MVP — ✅ DONE
- Phase 1 / Sprint 1.1: Persistence Layer (EdgeOne KV) — ✅ DONE
- Phase 1 / Sprint 1.2: Authentication — 🔜 NEXT (fokus berikutnya)
- Phase 1 / Sprint 1.3: Quality Gate — 🔜 NEXT

## 🏗️ Implemented Features

### ✅ Core Features (Done)

1. **Landing Page** - Halaman utama dengan navigasi
2. **Study Session** - Sesi belajar dengan self-grading
3. **Dashboard** - Monitoring status konsep
4. **Adaptive Scheduler** - Algoritma SRS berbasis SM-2 modifikasi

### ✅ Architecture (Done)

```
✅ Clean Architecture layers implemented
✅ Domain layer bebas framework
✅ Repository pattern untuk data access
✅ Use Case pattern untuk business logic
✅ Registry pattern untuk Dependency Injection
✅ ESLint rules untuk enforce architecture
✅ GitHub CLI knowledge base (.agent/rules/github-cli.md)
✅ EdgeOne CLI knowledge base (.agent/rules/edgeone-cli.md)
✅ EdgeOne KV repository adapters (src/infrastructure/kv/)
```

### ⚠️ In Progress / Known Issues

| Issue                               | Severity | Status                  |
| ----------------------------------- | -------- | ----------------------- |
| Hardcoded user ID (`demo-user`)     | Low      | MVP limit, pending auth |
| `act()` warnings di test Dashboard  | Low      | Tests pass, perlu cleanup |
| `Registry` belum punya unit tests   | Low      | Akan dicakup di Phase 1 |

## 📦 Dependencies

```json
{
  "next": "^16.1.6",
  "react": "^19.0.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.7.3",
  "jest": "^30.2.0"
}
```

## 📈 Test Coverage

```
Statements : 86.80%
Branches   : 81.02%
Functions  : 85.93%
Lines      : 89.94%
```

## 🔧 Available Scripts

| Command                | Description              |
| ---------------------- | ------------------------ |
| `npm run dev`          | Start development server |
| `npm run build`        | Production build         |
| `npm run lint`         | Run ESLint               |
| `npm run format`       | Format code (Prettier)   |
| `npm run check-format` | Check code format        |
| `npm test`             | Run Jest tests           |
| `npm run test:ci`      | CI mode with coverage    |

## 📝 Recent Changes

### 2026-02-10 (Sesi #5)

- ✅ Menambahkan Edge Runtime API routes:
  - `GET /api/dashboard`
  - `POST /api/debug/seed`
  - `GET /api/session/next`
  - `POST /api/session/submit`
- ✅ Menambahkan unit test untuk seluruh API route di atas
- ✅ Menambahkan polyfill `Request` dan `Response` untuk environment Jest
- ✅ Mengkonfigurasi Husky:
  - `pre-commit`: `npm run lint`, `npm run check-format`, `npx tsc --noEmit`
  - `pre-push`: `npm run test:ci`
- ✅ Menyesuaikan CI agar lulus dengan coverage UI layer `src/app/*` ≥ 70%

### 2026-02-10 (Sesi #5)

- ✅ Refined AI rules into dedicated TRAE rule files (architecture, quality, deployment, workflow)
- ✅ Updated `AGENTS.md` and `CONTRIBUTING.md` with Sprint/Task-aligned branching, commit, and PR rules
- ✅ Updated `.agent/workflows/start-task.md` to enforce Sprint-first workflow for all new tasks
- ✅ Synced `docs/ROADMAP.md` Phase 0 timeline and Sprint 1.1 status with actual git history

### 2026-02-10 (Sesi #4)

- ✅ Created `edgeone.json` with KV namespace binding (ns-LDVwXjJrAM0H)
- ✅ Implemented KV repository adapters: concept, question, progress
- ✅ Created `EdgeOneKV` type interface for testability
- ✅ Added 25 new unit tests for KV adapters (171/171 total)

### 2026-02-10 (Sesi #3)

- ✅ Revised Sprint 1.1 persistence strategy: localStorage + Supabase → EdgeOne KV
  - Scoring: EdgeOne KV 78% vs Supabase 77% vs localStorage 55%
  - Alasan: native EdgeOne deployment, multi-device support, persona Reza butuh cross-device

### 2026-02-10 (Sesi #2)

- ✅ Refactored UI to use `Registry` for Dependency Injection
- ✅ Decoupled `app` layer from `infrastructure` layer
- ✅ Fixed `SessionPage`, `DashboardPage`, `Layout` tests
- ✅ Fixed infrastructure tests (Date mocking, undefined variables)
- ✅ Added Prettier and format check to CI pipeline

### 2026-02-09

- ✅ Added ESLint architecture enforcement rules
- ✅ Renamed `AdaptiveScheduler` to `AdaptiveSchedulerPolicy`
- ✅ Fixed lint errors for CI compatibility
- ✅ Added test file rule relaxations
- ✅ Configured GitHub Actions CI workflow

### Previous

- ✅ Implemented Clean Architecture structure
- ✅ Created study session with self-grading
- ✅ Built dashboard with concept status tracking
- ✅ Implemented adaptive scheduling algorithm

## 🚧 Next Steps

1. Implement user authentication (Supabase) dan ganti `demo-user` → real user ID
2. Tambah concept/question management UI (admin CRUD)
3. Meningkatkan coverage `Registry` dan mengurangi `act()` warnings di test UI
4. Menambah E2E test (Playwright) untuk flow utama (landing → session → dashboard)

---

_Lihat [ROADMAP.md](./ROADMAP.md) untuk rencana pengembangan lengkap._
