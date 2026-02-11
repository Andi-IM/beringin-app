# 🤖 AGENTS.md - Development Guide for Beringin

This file contains essential information for agentic coding agents working on the Beringin Spaced Repetition System (SRS) application.

## 🚀 Development Commands

### Build & Development

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint checks
npm run format       # Format code with Prettier
npm run check-format # Check code formatting
```

### Testing

```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ci      # Run tests in CI mode (no watch)
```

#### Running Single Tests

```bash
# Run a specific test file
npm test -- src/domain/entities/concept.entity.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should calculate next interval"

# Run tests in specific directory
npm test src/domain/
npm test src/application/usecases/
```

## 🏗️ Architecture Rules (MANDATORY)

### Layer Architecture (STRICT)

```
UI (src/app/) → Application (usecases/) → Domain (entities/, policies/) → Infrastructure (repositories/, kv/)
```

### Critical Rules

- **UI Layer**: Only render, NO business logic, NO fetch calls
- **Application Layer**: All business orchestration in `*.usecase.ts` files
- **Domain Layer**: Pure TypeScript, NO React/Next/fetch imports
- **Infrastructure Layer**: Only place for fetch, DB, storage, env access

### Dependency Direction (STRICT)

- Domain → NO external dependencies
- Use Cases → Domain + Repository interfaces
- UI → Use Cases (never Infrastructure directly)
- Infrastructure → Repository implementations

## 📝 Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled** - all types must be explicit
- **Path aliases**: `@/*` maps to `src/*`
- **No `any` type** unless absolutely necessary (comment required)
- **No non-null assertions `!`** - use type guards or optional chaining

### Import Rules (ENFORCED)

```typescript
// Correct order: React → third-party → internal layers → styles
import React from 'react'
import { useRouter } from 'next/navigation'
import { submitAnswer } from '@/application/usecases/submitAnswer.usecase'
import { Concept } from '@/domain/entities/concept.entity'
import './styles.css'
```

### Import Type Separation

```typescript
import type { Concept } from '@/domain/entities/concept.entity'
import { submitAnswer } from '@/application/usecases/submitAnswer.usecase'
```

### Naming Conventions

- **Files**: `*.usecase.ts`, `*.entity.ts`, `*.policy.ts`, `*.repository.ts`, `*.test.ts`
- **Use Cases**: PascalCase with `UseCase` suffix (ESLint enforced)
- **Repositories**: PascalCase with `Repository` suffix (ESLint enforced)
- **Policies**: PascalCase with `Policy` suffix (ESLint enforced)
- **Entities**: PascalCase with `Entity` suffix (ESLint enforced)

### Prettier Configuration

- **Single quotes**: `'string'` (not `"string"`)
- **No semicolons**: (semi: false)
- **Trailing commas**: All objects/arrays
- **Max line length**: 100 characters
- **Tailwind class sorting**: Automatic via plugin

### Error Handling

- **Business errors**: Define in domain layer
- **Technical errors**: Handle in infrastructure layer
- **UI**: Only display error messages, never interpret

## 🧪 Testing Guidelines

### Coverage Requirements

- **Domain**: 95% statements, 90% branches (critical business logic)
- **Application**: 90% statements, 85% branches (use case orchestration)
- **Infrastructure**: 80% statements, 70% branches (implementations may change)
- **UI**: 70% statements, 60% branches (render tests + key interactions)

### Test Structure

```typescript
// Domain tests - pure unit tests
describe('ConceptEntity', () => {
  it('should validate concept creation', () => {
    // Pure TypeScript, no mocking needed
  })
})

// Use case tests - unit tests with mocked repositories
describe('SubmitAnswerUseCase', () => {
  it('should calculate next review date', async () => {
    const mockRepo = jest.mocked<ProgressRepository>(...)
    // Test orchestration logic
  })
})

// UI tests - render tests + interactions
describe('HomePage', () => {
  it('should render learning options', () => {
    render(<HomePage />)
    // Test UI rendering and user interactions
  })
})
```

### Testing Commands for Development

```bash
# Fast feedback loop during development
npm run test:watch -- src/domain/entities/concept.entity.test.ts

# Coverage for specific layer
npm run test:coverage -- src/domain/
npm run test:coverage -- src/application/usecases/

# Before committing (required)
npm run lint && npm test && npm run build
```

## 🔧 Development Workflow

### Pre-commit Checklist (MANDATORY)

- [ ] ESLint passes with 0 errors/warnings
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Code formatted with Prettier
- [ ] UI layer contains no business logic
- [ ] Domain layer has no framework imports
- [ ] No `console.log` statements in production code
- [ ] Proper error handling implemented
- [ ] Fix React `act()` warnings in tests when adding new UI components
- [ ] Clean up unused imports before committing

### Sprint-Driven Code Generation (for AI Agents)

When generating or modifying code, always anchor changes to the **current Sprint task**:

- Every change must be traceable to a specific item in `docs/ROADMAP.md` (e.g. `Sprint 1.1 / Task 1.1.3`).
- Prefer implementing **only** what is necessary for the active Sprint task; avoid jumping ahead to future Sprints.
- When adding files or functions, name and structure them so the mapping to the Sprint task is obvious (e.g. commit/PR message, test names).
- When in doubt, update the Sprint status table first, then implement code that satisfies that row.

### Commit & PR Naming (for AI Agents)

- Use Conventional Commits for all commits and PR titles:
  - Allowed types: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
  - PR title format: `<type>: <short description> (Sprint X.Y / Task X.Y.Z)`.
- Always mention the related Sprint/Task in the commit body or PR description, for example:
  - `feat: implement EdgeOne KV persistence (Sprint 1.1 / Task 1.1.1)`
  - `fix: handle session API errors (Sprint 1.1 / Task 1.1.3)`
- Do not mix work from multiple Sprints in a single branch; if you need to start a different Sprint/Task, create a new branch from `main` and use a branch name that reflects that Sprint/Task.

### File Organization

```
src/
├── app/                    # UI Layer - Next.js pages
├── application/usecases/   # Business logic orchestration
├── domain/
│   ├── entities/          # Pure business entities
│   └── policies/          # Business rules/algorithms
└── infrastructure/
    ├── repositories/      # Data access implementations
    └── kv/               # EdgeOne KV storage
```

## 🚫 Forbidden Patterns

### UI Layer Violations

```typescript
// ❌ NEVER in UI components
fetch('/api/data') // Use use cases instead
const data = filterByBusinessRules(items) // Move to use case
const config = process.env.API_URL // Use repository pattern
```

### Domain Layer Violations

```typescript
// ❌ NEVER in domain layer
import React from 'react'
import { NextRequest } from 'next/server'
fetch('/external-api')
localStorage.setItem('key', 'value')
```

## 📚 Key Dependencies

### Framework Stack

- **Next.js 16** with App Router
- **React 19** with modern hooks
- **TypeScript 5.7** with strict mode
- **Tailwind CSS 3.4** for styling

### Testing Stack

- **Jest 30** with jsdom environment
- **React Testing Library** for UI testing
- **Coverage reporting** with lcov and HTML
- **Husky** for pre-commit hooks
- **lint-staged** for automated code quality checks

### Development Tools

- **ESLint 9** with Next.js TypeScript rules
- **Prettier 3.8** with Tailwind plugin
- **TypeScript 5.7** with path mapping
- **Husky 9.1.6** for git hooks
- **lint-staged 16.2.7** for pre-commit automation

## 🎯 Project Context

Beringin is a Spaced Repetition System (SRS) application that helps users remember concepts through adaptive scheduling. The app uses the SM-2 algorithm variant to calculate review intervals based on user performance and confidence levels.

**Core Features:**

- Adaptive scheduling based on performance
- Self-grading with confidence levels
- Progress tracking and dashboard
- Clean Architecture for maintainability
- User authentication with Google OAuth
- Admin panel for content management
- EdgeOne KV for serverless persistence

**Current Status:**

- MVP with Supabase Auth + EdgeOne KV persistence
- Admin Panel (Concept CRUD) implemented
- Question CRUD in progress (Sprint 2.1.3)
- ~91% test coverage with 255 tests passing
- TypeScript strict mode enabled
- Production build successful

Always prioritize maintainability and testability over quick implementation. The clean architecture ensures the business logic remains pure and testable regardless of UI or infrastructure changes.

## 📋 Current Sprint Focus

**Phase 2.1: Admin Panel - Question CRUD (Sprint 2.1.3)**

- Implement Question CRUD UI following Concept CRUD patterns
- Add bulk import functionality for JSON/CSV
- Maintain high code quality and test coverage
- Follow existing component patterns in `src/app/components/admin/`

**Known Issues to Address:**

- 3 ESLint warnings (unused imports)
- React `act()` warnings in UI tests (non-critical but should be fixed)
