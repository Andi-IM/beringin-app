[![codecov](https://codecov.io/gh/Andi-IM/beringin-app/graph/badge.svg?token=PQj9KJS9R6)](https://codecov.io/gh/Andi-IM/beringin-app)

# 🌳 Beringin

> **Ilmu yang Berakar Kuat, Tak Mudah Lupa**

Beringin adalah aplikasi pembelajaran berbasis **Spaced Repetition System (SRS)** yang membantu Anda mengingat konsep-konsep penting dengan lebih efektif. Aplikasi ini menggunakan algoritma adaptif untuk menjadwalkan review berdasarkan performa dan tingkat kepercayaan diri Anda.

## ✨ Fitur Utama

- **Adaptive Scheduling** - Algoritma cerdas yang menyesuaikan interval review berdasarkan performa
- **Self-Grading** - Penilaian mandiri dengan tingkat kepercayaan (Yakin/Ragu/Tebak)
- **Progress Tracking** - Dashboard untuk memantau status konsep (Stabil/Rapuh/Belajar/Lupa)
- **Authentication** - Login dengan Email/Password dan Google Sign-In via Supabase Auth
- **Clean Architecture** - Kode terstruktur dengan pemisahan layer yang jelas

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Struktur Proyek

```
src/
├── app/                    # UI Layer (Next.js Pages)
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page (Email + Google)
│   ├── register/          # Register page
│   ├── dashboard/         # Dashboard page
│   └── session/           # Learning session page
├── application/           # Application Layer (Use Cases)
│   └── usecases/          # Business logic orchestration
├── components/            # Shared UI Components
│   └── icons/             # Icon components (GoogleIcon, etc.)
├── domain/                # Domain Layer (Core Business)
│   ├── entities/          # Business entities
│   └── policies/          # Business rules & algorithms
└── infrastructure/        # Infrastructure Layer
    ├── auth/              # Supabase auth clients
    ├── client/            # Client API wrappers (AuthApi, DashboardApi)
    ├── kv/                # EdgeOne KV adapters
    └── repositories/      # Data access & persistence
```

## 🏗️ Arsitektur

Beringin mengikuti prinsip **Clean Architecture**:

| Layer              | Deskripsi                | Contoh                    |
| ------------------ | ------------------------ | ------------------------- |
| **UI**             | Presentasi, hanya render | `page.tsx`, components    |
| **Application**    | Orchestration use cases  | `submitAnswer.usecase.ts` |
| **Domain**         | Logika bisnis murni      | `scheduler.policy.ts`     |
| **Infrastructure** | Akses data eksternal     | `in-memory.repository.ts` |

## 📚 Dokumentasi

- [Current State](./docs/CURRENT_STATE.md) - Status dan kondisi proyek saat ini
- [Roadmap](./docs/ROADMAP.md) - Rencana pengembangan dan fitur masa depan
- [Architecture](./docs/ARCHITECTURE.md) - Detail arsitektur dan keputusan desain

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

Coverage saat ini: **~87% statements, ~81% branches** (209 tests)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript 5.7
- **Auth**: Supabase Auth (Email + Google OAuth)
- **Styling**: Tailwind CSS 3.4
- **Testing**: Jest 30 + React Testing Library
- **Linting**: ESLint 9 (Flat Config) + Prettier
- **CI/CD**: GitHub Actions + Husky

## 📄 License

MIT © 2026
