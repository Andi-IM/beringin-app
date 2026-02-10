# 🏛️ Architecture - Beringin

> Dokumentasi arsitektur dan keputusan desain

## Overview

Beringin menggunakan **Clean Architecture** untuk memastikan:

- Separation of concerns
- Testability
- Framework independence
- Maintainability

```
┌────────────────────────────────────────────────────────┐
│                      UI Layer                          │
│                   (src/app/*)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │  page.tsx   │ │  dashboard  │ │   session   │      │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘      │
└─────────┼───────────────┼───────────────┼──────────────┘
          │               │               │
          ▼               ▼               ▼
┌────────────────────────────────────────────────────────┐
│                  Application Layer                     │
│              (src/application/usecases/*)              │
│  ┌─────────────────┐ ┌─────────────────────────────┐  │
│  │ getNextQuestion │ │ submitAnswer.usecase.ts     │  │
│  └────────┬────────┘ └──────────────┬──────────────┘  │
└───────────┼─────────────────────────┼──────────────────┘
            │                         │
            ▼                         ▼
┌────────────────────────────────────────────────────────┐
│                    Domain Layer                        │
│                (src/domain/*)                          │
│  ┌─────────────────────┐ ┌───────────────────────┐    │
│  │ entities/           │ │ policies/             │    │
│  │ - concept.entity    │ │ - scheduler.policy    │    │
│  │ - question.entity   │ │                       │    │
│  │ - user-progress     │ │                       │    │
│  └─────────────────────┘ └───────────────────────┘    │
└────────────────────────────────────────────────────────┘
            ▲                         ▲
            │                         │
┌───────────┼─────────────────────────┼──────────────────┐
│           │  Infrastructure Layer   │                  │
│           │ (src/infrastructure/*)  │                  │
│  ┌────────┴────────┐  ┌────────────┴────────────┐     │
│  │ repositories/   │  │ (future: API clients)   │     │
│  │ - concept.repo  │  │                         │     │
│  │ - question.repo │  │                         │     │
│  │ - progress.repo │  │                         │     │
│  └─────────────────┘  └─────────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

---

## Layer Rules

### 1. UI Layer (`src/app/`)

**Aturan:**

- ✅ Hanya render UI
- ✅ Terima data dari props/state
- ❌ TIDAK boleh ada business logic
- ❌ TIDAK boleh fetch data langsung

**ESLint Enforcement:**

```javascript
// no-restricted-globals: fetch
// Fetch harus melalui Infrastructure layer
```

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

### 5. Dependency Injection (`src/registry.ts`)

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

### 3. In-Memory Repository (MVP)

Kenapa in-memory untuk MVP?

- Cepat untuk prototyping
- Tidak perlu setup database
- Mudah di-swap dengan real database nanti

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

_Lihat [CURRENT_STATE.md](./CURRENT_STATE.md) untuk status implementasi._
