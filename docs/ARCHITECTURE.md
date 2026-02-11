# 🏛️ Architecture - Beringin

> **Status Dokumen**: ✅ Aktif (v1.2)
> **Terakhir Diperbarui**: 2026-02-11T19:36:00+07:00

## Overview

Beringin menggunakan **Clean Architecture** untuk memastikan:

- Separation of concerns
- Testability
- Framework independence
- Maintainability

```
┌────────────────────────────────────────────────────────┐
│ UI Layer                                               │
│ (src/app/_)                                            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ Client Comp │ │ Server Comp │ │ Pages       │        │
│ └───────┬─────┘ └───────┬─────┘ └───────┬─────┘        │
└─────────┼───────────────┼───────────────┼──────────────┘
          │               │               │
          │ (via Registry)│               │ (via Server Actions / Client Wrapper)
          ▼               ▼               ▼
┌───────────────────────┐ ┌──────────────────────────────┐
│ Application Layer     │ │ Client-Side Infra            │
│ (src/application/_)   │ │ (src/infrastructure/client/_)│
└─────────┬─────────────┘ └──────┬───────────────────────┘
          │                      │
          ▼                      ▼
┌────────────────────────────────────────────────────────┐
│ Domain Layer                                           │
│ (src/domain/_)                                         │
└────────────────────────────────────────────────────────┘
          ▲
          │
┌─────────┴──────────────────────────────────────────┐
│ Infrastructure Layer                               │
│ (src/infrastructure/\*)                            │
│ ┌──────────────┐ ┌─────────────┐ ┌───────────────┐ │
│ │ Repositories │ │ Supabase    │ │ Edge Runtime  │ │
│ └──────────────┘ └─────────────┘ └───────────────┘ │
└────────────────────────────────────────────────────┘

```

### 3. Error Handling Pattern

Beringin menggunakan pendekatan berlapis untuk menangani error:

1.  **Global Error Boundary (`app/global-error.tsx`)**: Menangkap crash kritis di root layout.
2.  **Route Error Boundary (`app/error.tsx`)**: Handler default Next.js untuk segmen halaman.
3.  **Component Error Boundary (`src/app/components/ErrorBoundary.tsx`)**: Digunakan secara granular untuk membungkus komponen berisiko agar tidak meruntuhkan seluruh halaman.

Semua error dicatat melalui Centralized Logger (`src/lib/logger.ts`).

---

## 4. Layer Rules

### 1. UI Layer (`src/app/`)

**Aturan:**

- ✅ Hanya render UI
- ✅ Terima data dari props/state
- ❌ TIDAK boleh ada business logic
- ❌ TIDAK boleh fetch data langsung

**ESLint Enforcement:**

```javascript
// Fetch harus melalui Infrastructure layer atau Server Actions
```

### 1.1 Server Actions (`src/app/admin/*/actions.ts`)

**Status**: 🆕 Added in Sprint 2.1 (Admin Panel)

**Aturan:**

- ✅ Digunakan untuk mutasi data (POST/PUT/DELETE) dari Client Components.
- ✅ Melakukan validasi input (Zod) sebelum memanggil Use Case.
- ✅ Menangani pemetaan data (e.g. `FormData` -> `Entity`).
- ❌ TIDAK BOLEH berisi business logic murni.

### 2. Application Layer (`src/application/usecases/`)

**Aturan:**

- ✅ Orchestrate business operations
- ✅ Koordinasi antara Domain dan Infrastructure
- ✅ Naming: `*.usecase.ts`
- ❌ TIDAK boleh ada UI logic

**Pattern:**

```typescript
export async function submitAnswer(
  input: SubmitAnswerInput,
  progressRepo: ProgressRepository, // Dependency Injection
): Promise<SubmitAnswerOutput> {
  // 1. Get current state
  // 2. Apply domain policy
  // 3. Persist changes
  // 4. Return result
}
```

### 3. Domain Layer (`src/domain/`)

**Aturan:**

- ✅ Pure business logic
- ✅ Tidak ada dependency ke framework
- ✅ 100% testable tanpa mock
- ❌ TIDAK import React, Next.js, atau Infrastructure

**ESLint Enforcement:**

```javascript
"no-restricted-imports": [
  "error",
  {
    paths: ["react", "next", "next/router"],
    patterns: ["@/infrastructure/**", "@/app/**"]
  }
]
```

### 4. Infrastructure Layer (`src/infrastructure/`)

**Aturan:**

- ✅ Implementasi repository interfaces
- ✅ External service integrations
- ✅ Data persistence
- ✅ Naming: `*.repository.ts`

---

### 5. Client-Side Infrastructure (`src/infrastructure/client/`)

**Status**: 🆕 Added in Sprint 1.2

**Pattern:**
Komponen UI Client (`'use client'`) tidak bisa mengimpor modul Node.js atau server-side libraries langsung. Kita menggunakan **Client API Wrappers** sebagai jembatan.

**Aturan:**

- ✅ Berisi wrapper statis untuk pemanggilan API / Supabase client side.
- ✅ Memungkinkan lazy-loading (code splitting).
- ❌ TIDAK BOLEH mengandung business logic (hanya pass-through).

```typescript
// src/infrastructure/client/auth.api.ts
export const AuthApi = {
  async signIn(data) {
    // Lazy load Supabase client only when needed
    const supabase = createClient()
    return supabase.auth.signInWithPassword(data)
  },
}
```

---

### 6. Dependency Injection (`src/registry.ts`)

**Aturan:**

- ✅ **Composition Root**: Satu-satunya tempat di mana implementasi konkret (Infrastructure) dihubungkan ke abstraksi (Domain/Use Cases).
- ✅ **Lazy Loading**: Import dependency hanya saat dibutuhkan untuk menghindari circular dependencies.
- ✅ **UI Interface**: Menyediakan fungsi statis yang aman untuk dipanggil oleh UI components.

```typescript
// src/registry.ts
export const Registry = {
  async getNextQuestion(userId: string) {
    // Lazy load use case & repo
    const { getNextQuestion } = await import('@/application/usecases/...')
    const { repo } = await import('@/infrastructure/...')

    // Inject dependency
    return getNextQuestion({ userId }, repo)
  },
}
```

---

## Key Design Decisions

### 1. Self-Grading System

Kenapa self-grading bukan auto-grading?

- Open-ended questions tidak bisa di-auto-grade
- User awareness tentang pemahaman sendiri
- Lebih fleksibel untuk berbagai jenis konten

### 2. Confidence Levels

Tiga level confidence (high/low/none):

- Mempengaruhi ease factor adjustment
- Lebih nuanced daripada binary benar/salah
- Mengidentifikasi "lucky guesses"

### 3. In-Memory Repository (MVP) + EdgeOne KV

Kenapa in-memory untuk MVP?

- Cepat untuk prototyping
- Tidak perlu setup database
- Mudah di-swap dengan real database nanti

Kenapa sekarang ada EdgeOne KV?

- Mendukung persistence di lingkungan EdgeOne tanpa mengubah domain/use case
- Menggunakan repository khusus (`KVConceptRepository`, `KVQuestionRepository`, `KVProgressRepository`)
- Dipilih otomatis oleh `Registry` ketika `globalThis.KV` tersedia

### 4. ESLint Architecture Enforcement

Kenapa pakai ESLint untuk enforce architecture?

- Automatic checking di CI
- Immediate feedback di IDE
- Dokumentasi yang hidup

---

## File Naming Conventions

| Layer        | Pattern           | Example                    |
| ------------ | ----------------- | -------------------------- |
| Entities     | `*.entity.ts`     | `concept.entity.ts`        |
| Policies     | `*.policy.ts`     | `scheduler.policy.ts`      |
| Use Cases    | `*.usecase.ts`    | `submitAnswer.usecase.ts`  |
| Repositories | `*.repository.ts` | `progress.repository.ts`   |
| Registry     | `registry.ts`     | `registry.ts`              |
| Tests        | `*.test.ts`       | `scheduler.policy.test.ts` |

---

## Dependency Flow

```
UI → Registry → Application → Domain ← Infrastructure
        │           │            ↑
        └───────────┼────────────┘
                    ↓
              (abstractions)
```

**Key Principle**:

1. UI components NEVER import from `infrastructure` or `application/usecases` directly.
2. UI components ONLY import from `registry`.
3. `registry` composes the application by injecting Infrastructure implementations into Use Cases.

---

---

## 📜 Architectural Decision Log (ADL)

| Tanggal    | Keputusan                          | Konteks                                                                 | Status     |
| ---------- | ---------------------------------- | ----------------------------------------------------------------------- | ---------- |
| 2026-02-09 | **Clean Architecture**             | Memisahkan UI, Domain, Infra untuk testability jangka panjang.          | ✅ Adopted |
| 2026-02-10 | **Registry Pattern**               | Dependency Injection tanpa framework berat (Inversify/NestJS).          | ✅ Adopted |
| 2026-02-10 | **EdgeOne KV**                     | Mengganti LocalStorage/Supabase DB untuk persistence di Edge.           | ✅ Adopted |
| 2026-02-10 | **Client-Side Infra**              | Memisahkan `AuthApi` untuk mendukung Lazy Loading di Client Components. | ✅ Adopted |
| 2026-02-10 | **Strict ESLint Arch Enforcement** | Mencegah import cross-layer yang ilegal secara otomatis.                | ✅ Adopted |
| 2026-02-11 | **Server Actions**                 | Digunakan untuk Admin CRUD mutations di Next.js.                        | ✅ Adopted |
| 2026-02-11 | **Test-Safe Redirects**            | Menangani re-throw `redirect()` agar tidak crash di Jest.               | ✅ Adopted |

---

_Lihat [CURRENT_STATE.md](./CURRENT_STATE.md) untuk status implementasi._
