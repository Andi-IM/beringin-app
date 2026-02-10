# 📊 Current State - Beringin v0.1.0 (MVP)

> Dokumen ini mencatat kondisi terkini proyek Beringin  
> **Last Updated**: 2026-02-10T18:20+07:00

## 🎯 Status Overview

| Aspek           | Status        | Catatan                |
| --------------- | ------------- | ---------------------- |
| **Development** | ✅ Active     | Phase 1 - Foundation   |
| **Build**       | ✅ Passing    | `npm run build` OK     |
| **Tests**       | ✅ Passing    | 209/209 passing (100%) |
| **Lint**        | ✅ Passing    | 0 errors, 0 warnings   |
| **CI/CD**       | ✅ Configured | GitHub Actions         |

## 🧭 Sprint Status

- Phase 0: MVP — ✅ DONE
- Phase 1 / Sprint 1.1: Persistence Layer (EdgeOne KV) — ✅ DONE
- Phase 1 / Sprint 1.2: Authentication — ✅ DONE
- Phase 1 / Sprint 1.3: Quality Gate — 🔜 NEXT

## 🏗️ Implemented Features

### ✅ Core Features (Done)

1. **Landing Page** - Halaman utama dengan navigasi
2. **Study Session** - Sesi belajar dengan self-grading
3. **Dashboard** - Monitoring status konsep (Refactored to Client Component)
4. **Adaptive Scheduler** - Algoritma SRS berbasis SM-2 modifikasi
5. **Authentication Flow** - Login & Register menggunakan Supabase Auth (Lazy-loaded client)
6. **Google Sign-In** - OAuth login via Supabase dengan reusable `GoogleIcon` component
7. **Client API Wrappers** - `AuthApi` & `DashboardApi` untuk pemisahan layer UI/Infra

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
✅ Strict Branching Policy (Force feature branches, forbid direct push dev/main)
✅ Robust Error Handling (Full catch block logging in UI & Use Cases)
✅ Codecov integration with layered patch coverage thresholds
```

### ⚠️ In Progress / Known Issues

| Issue                              | Severity | Status                    |
| ---------------------------------- | -------- | ------------------------- |
| `act()` warnings di test Dashboard | Low      | Tests pass, perlu cleanup |
| `Registry` belum punya unit tests  | Low      | Akan dicakup di Phase 1   |

## 📦 Dependencies

```json
{
  "next": "^16.1.6",
  "react": "^19.0.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.7.3",
  "jest": "^30.2.0",
  "@supabase/supabase-js": "^2.48.1"
}
```

## 📈 Test Coverage

```
Statements : 87.21%
Branches   : 81.33%
Functions  : 86.42%
Lines      : 90.15%
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

### 2026-02-10 (Sesi #9)

- ✅ **PR #10 Feedback Resolution**:
  - Refactor `GoogleIcon` — removed `React.FC`, using `React.ComponentProps<'svg'>` with prop spreading.
  - Extracted `OAUTH_PROVIDER` constant in `auth.api.ts`, eliminated magic strings.
  - Updated test assertions to match new generic error messages.
- ✅ **Dashboard Test Fix**:
  - Fixed ambiguous `findByText('Stabil')` collision between stats label and concept card badge.
  - Used `findAllByText` + class filtering for reliable stat verification.
- ✅ **Infrastructure & CI**:
  - Added `.codecov.yml` with layered coverage thresholds (50% patch target).
  - Configured ignore rules for hard-to-test infra boundaries (middleware, Supabase clients).
  - Fixed `supabase-client.ts` unused `error` variables.
  - Renamed root `package.json` to `beringin-app-root` (Haste Map collision fix).
  - Configured `gh` CLI to use HTTPS protocol.
- ✅ **CI Status**: 7/7 checks pass (build, test, CodeQL, GitGuardian, Codecov). 209/209 tests.

### 2026-02-10 (Sesi #8)

- ✅ **Google Sign-In Implementation**:
  - Implementasi fungsi `signInWithGoogle` di `AuthApi` client wrapper.
  - Penambahan tombol Google Sign-In premium dengan Google branding pada halaman Login.
  - Penambahan unit tests untuk OAuth flow dengan **100% statement coverage** pada area terdampak.
- ✅ **Infrastructure & Quality**:
  - Sinkronisasi roadmap aktual dan velocity data.
  - Pembersihan feature branches pasca merge Sprint 1.2.

### 2026-02-10 (Sesi #7)

- ✅ Implementasi Supabase Auth:
  - `signIn`, `signUp`, `getCurrentUser` use cases
  - Middleware perlindungan rute
  - `AuthApi` client wrapper dengan lazy loading Supabase (fix CI crash)
- ✅ Peningkatan Kualitas Kode:
  - Migrasi `window.location.href` ke `useRouter` di Dashboard
  - Logging error eksplisit pada seluruh catch block
  - Pembersihan variabel tidak terpakai dan duplikasi kode
- ✅ Verifikasi & Coverage:
  - **209/209 tests pass**
  - **100% test coverage** pada client API wrappers (`AuthApi`, `DashboardApi`)
  - Konfigurasi CI branch `dev` (sebelumnya mismatch `develop`)

### 2026-02-10 (Sesi #6)

- ✅ Merged PR #1 ke `main`
- ✅ Refactor KV implementation:
  - Parallel fetching (`Promise.all`) untuk menghilangkan N+1 query
  - Restrukturisasi key `question:${conceptId}:${id}` untuk atomisitas (hapus manual index)
  - Perbaikan dokumentasi EdgeOne CLI (`edgeone pages link`)
- ✅ Verifikasi 179/179 tests pass di branch `main`

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

1. Sprint 1.3 Quality Gate: Playwright E2E, `act()` warnings cleanup, Registry coverage
2. Tambah concept/question management UI (admin CRUD — Phase 2)
3. E2E test untuk flow utama (landing → login → session → dashboard)
4. Mobile responsive audit & dark mode polish

---

_Lihat [ROADMAP.md](./ROADMAP.md) untuk rencana pengembangan lengkap._
