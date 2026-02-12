# 📊 Current State - Beringin v0.1.0 (MVP)

> Dokumen ini mencatat kondisi terkini proyek Beringin  
> **Last Updated**: 2026-02-12T12:50:00+07:00

## 🎯 Status Overview

| Aspek           | Status        | Catatan                          |
| --------------- | ------------- | -------------------------------- |
| **Development** | ✅ Active     | Phase 2 - Content Mgmt           |
| **Build**       | ✅ Passing    | `npm run build` OK               |
| **Unit Tests**  | ✅ Passing    | 253/253 passing (Clean suite)    |
| **E2E Tests**   | ✅ Passing    | 9/9 passing (Standard + Mocked)  |
| **Lint**        | ✅ Passing    | 0 errors, 0 warnings             |
| **CI/CD**       | ✅ Configured | GitHub Actions (Green)           |
| **License**     | ✅ MIT        | Added 2026-02-11                 |
| **Test Flows**  | ✅ Ready      | [TEST_FLOWS.md](./TEST_FLOWS.md) |

## 🧭 Sprint Status

- Phase 0: MVP — ✅ DONE
- Phase 1 / Sprint 1.1: Persistence Layer (EdgeOne KV) — ✅ DONE
- Phase 1 / Sprint 1.2: Authentication — ✅ DONE
- Phase 1 / Sprint 1.3: Quality Gate — ✅ DONE
- Phase 2 / Sprint 2.1: Admin Panel (Concepts CRUD) — ✅ DONE (PR #18)
- Phase 2 / Sprint 2.1.3: Question CRUD UI — ☐ IN PROGRESS

## 🏗️ Implemented Features

### ✅ Core Features (Done)

1. **Landing Page** - Halaman utama dengan navigasi
2. **Study Session** - Sesi belajar dengan self-grading
3. **Dashboard** - Monitoring status konsep (Refactored to Client Component)
4. **Adaptive Scheduler** - Algoritma SRS berbasis SM-2 modifikasi
5. **Authentication Flow** - Login & Register menggunakan Supabase Auth (Lazy-loaded client)
6. **Google Sign-In** - OAuth login via Supabase dengan reusable `GoogleIcon` component
7. **Client API Wrappers** - `AuthApi` & `DashboardApi` untuk pemisahan layer UI/Infra
8. **Admin Panel** - CRUD interface untuk Concepts (\`/admin/concepts\`) menggunakan Server Actions.

### ✅ Architecture (Done)

```
✅ Clean Architecture layers implemented
✅ Domain layer bebas framework
✅ Repository pattern untuk data access
✅ Use Case pattern untuk business logic
- [x] **Registry Pattern**: Centralized dependency injection for Use Cases.
- [x] **Error Handling**: React Error Boundaries & Global Error Handlers.
- [x] **Persona Alignment**: Prioritas fitur berdasarkan "Reza Standard".
✅ ESLint rules untuk enforce architecture
✅ GitHub CLI knowledge base (.agent/rules/github-cli.md)
✅ EdgeOne CLI knowledge base (.agent/rules/edgeone-cli.md)
✅ EdgeOne KV repository adapters (src/infrastructure/kv/)
✅ Strict Branching Policy (Force feature branches, forbid direct push dev/main)
✅ Robust Error Handling (Full catch block logging in UI & Use Cases)
✅ Codecov integration with layered patch coverage thresholds
✅ **Smart Edge API** (`/edge-api/{entity}`) with distributed entity logic
✅ **Distributed SM-2**: SRS logic moved to Edge for atomic Read-Modify-Write
✅ **Semantic Repositories**: Clean infrastructure layer using target-specific endpoints
✅ **HttpKVClient** simplified (logical fallbacks handled by Edge Functions)
```

### ⚠️ In Progress / Known Issues

| Issue                              | Severity | Status                                                    |
| ---------------------------------- | -------- | --------------------------------------------------------- |
| **KV API Local Dev Binding**       | Low      | **FIXED**: Multi-file smart functions with unified MockKV |
| `act()` warnings di test Dashboard | Low      | Tests pass, perlu cleanup                                 |
| `Registry` belum punya unit tests  | Low      | Akan dicakup di Phase 1                                   |
| React `act()` warnings di UI tests | Low      | Tests pass, dari async state updates di useEffect         |
| `middleware.ts` deprecated warning | Low      | Perlu migrasi ke proxy pattern                            |

## 📦 Dependencies

```json
{
  "next": "^16.1.6",
  "react": "^19.0.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.7.3",
  "jest": "^30.2.0",
  "jest": "^30.2.0",
  "@supabase/supabase-js": "^2.48.1",
  "@playwright/test": "latest"
}
```

## 📈 Test Coverage

```
Statements : 83.62%
Branches   : 82.58%
Functions  : 79.89%
Lines      : 84.82%
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

### Recent Sessions

- ✅ **Sesi #18**: Smart Edge API Refactoring & perfection (100% Tests).
- 🔄 **Sesi #17**: KV Access Refactoring (Edge Function API & MockKV).
- ✅ **Sesi #16**: PR Conflict Resolution & Docs Cleanup.
- ✅ **Sesi #15**: Technical Debt Resolution & Licensing.
- ✅ **Sesi #14**: Admin Panel Polish & Codecov hardening.

> [!NOTE]
> Riwayat sesi lengkap (Sesi #1 - #16) tersedia di [ROADMAP.md](./ROADMAP.md#📊-velocity-aktual-dari-git-history).

---

_Lihat [ROADMAP.md](./ROADMAP.md) untuk rencana pengembangan lengkap._
