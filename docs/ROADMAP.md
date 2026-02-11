# 🗺️ Roadmap - Beringin

<<<<<<< HEAD

> Rencana pengembangan berbasis data nyata dari git history  
> **Last Updated**: 2026-02-10T18:20+07:00
> =======
> Rencana pengembangan berbasis data nyata dari git history
> **Last Updated**: 2026-02-11T19:36:00+07:00
>
> > > > > > > origin/dev

---

## 🎯 Strategic Alignment (The "Reza Standard")

Agar tetap relevan dengan persona **Reza** (Professional/CPNS Aspirant) yang anti-gamifikasi dangkal, roadmap ini diprioritaskan berdasarkan **3 Pilar Strategis**:

1.  **Trust (Brutal Honesty)**: Utamakan metrik retensi nyata daripada engagement palsu (streak).
2.  **Efficiency**: Fitur yang memotong waktu belajar (Bulk Import, Smart Scheduling).
3.  **Depth**: Support untuk materi kompleks (UUD, Pasal) lewat Cloze Deletion.

_Legend:_

- ⭐ **Critical for Reza**: Fitur wajib untuk "Trust" & "Efficiency".
- ⚠️ **Risk of Vanity**: Fitur yang harus hati-hati diimplementasi agar tidak dianggap "gimmick".

## 📊 Velocity Aktual (dari Git History)

| Sesi  | Tanggal     | Waktu                   | Output                             | Lines Changed (perkiraan) |
| ----- | ----------- | ----------------------- | ---------------------------------- | ------------------------- |
| #1    | 9 Feb 2026  | 23:36–23:56 (20 menit)  | MVP initial + ESLint + docs        | ~4,000–4,500              |
| #2–#3 | 10 Feb 2026 | 09:32–09:45 (13 menit)  | Registry DI + tests + coverage     | ~1,500–2,000              |
| #4–#5 | 10 Feb 2026 | 10:32–12:09 (±60 menit) | EdgeOne KV + API routes + Husky    | ~1,000–1,500              |
| #6    | 10 Feb 2026 | 13:30–14:05 (35 menit)  | PR #1 review & merge + refactor    | ~500–800                  |
| #7    | 10 Feb 2026 | 15:30–16:25 (55 menit)  | Supabase Auth + PR #4 review-merge | ~1,200–1,800              |

<<<<<<< HEAD
| **Total** | | **±2.5 jam commit time** | **45 commits, 95 files** | **~10,000 lines touched** |
=======
| #8 | 10 Feb 2026 | 18:00–18:30 (30 menit) | Google Sign-In + Refactor | ~800–1,200 |
| #9 | 10 Feb 2026 | 19:00–20:00 (60 menit) | Dashboard Fix + CI/CD hardening | ~1,000–1,500 |
| #10 | 10 Feb 2026 | 21:00–21:30 (30 menit) | Auth Tests + Coverage Sync | ~400–600 |
| #11 | 11 Feb 2026 | 15:35–15:55 (20 menit) | User Guide + Verification | ~450–500 |
| #13 | 11 Feb 2026 | 18:30–19:10 (40 menit) | Admin Panel (Concepts CRUD) | ~1,200–1,500 |
| #14 | 11 Feb 2026 | 19:15–19:40 (25 menit) | PR #19 Polish + License | ~800–1,000 |
| #15 | 11 Feb 2026 | 20:00–20:30 (30 menit) | Technical Debt Resolution | ~500–800 |
| **Total** | | **±7.1 jam commit time** | **96 commits** | **~17,000 lines touched** |

> > > > > > > origin/dev

> Angka di atas diambil dari `git log` dan `git diff --stat`:
>
> - `git rev-list --count HEAD` → 21 commits
> - `git diff --stat <root> HEAD` → 80+ files changed, 5,300+ insertions(+), 1,650+ deletions(-)
> - Lines touched ≈ insertions + deletions

### Throughput Terukur (AI-Assisted)

| Metrik                          | Nilai Realistis (Rata-rata)           |
| ------------------------------- | ------------------------------------- |
| Lines of code per sesi          | ~1,000–1,500 lines tersentuh          |
| Files changed per sesi          | ~10–20 files                          |
| Test cases created per sesi     | ~20–40 test cases (unit + API route)  |
| Rata-rata per jam kerja efektif | ~2,500–3,000 LoC, ~15 files tersentuh |

---

## ✅ Phase 0: MVP — DONE

| Tanggal      | Waktu    | Deliverable                                          | Sprint/Task | Commit    |
| ------------ | -------- | ---------------------------------------------------- | ----------- | --------- |
| 9 Feb 23:36  | —        | Initial commit: seluruh MVP (47 files, 15,886 lines) | Phase 0     | `c82ba1e` |
| 9 Feb 23:39  | +3 min   | ESLint config + fix TypeScript errors                | Phase 0     | `bcaeee0` |
| 9 Feb 23:42  | +3 min   | Migrate ke ESLint flat config                        | Phase 0     | `53b7085` |
| 9 Feb 23:46  | +4 min   | Clean Architecture ESLint rules                      | Phase 0     | `4832851` |
| 9 Feb 23:51  | +5 min   | Resolve lint errors                                  | Phase 0     | `f50818b` |
| 9 Feb 23:55  | +4 min   | Docs (README, ARCHITECTURE, CURRENT_STATE, ROADMAP)  | Phase 0     | `59b6b7a` |
| 9 Feb 23:56  | +1 min   | Contributing guidelines                              | Phase 0     | `5f90427` |
| 10 Feb 09:32 | —        | Registry DI + refactor semua layer                   | Phase 0     | `46018e3` |
| 10 Feb 09:41 | +9 min   | Fix 7 failing infra tests (146/146 ✅)               | Phase 0     | `ccd3835` |
| 10 Feb 09:43 | +2 min   | Minor test fixes                                     | Phase 0     | `2673f32` |
| 10 Feb 09:45 | +2 min   | Per-layer coverage thresholds                        | Phase 0     | `ac9d966` |
| 10 Feb 10:32 | +4 min   | Add GitHub & EdgeOne CLI knowledge base              | Sprint 1.1  | `51cbcea` |
| 10 Feb 10:45 | +13 min  | EdgeOne KV Repository Adapters (PR #1)               | Sprint 1.1  | `1596ba0` |
| 10 Feb 14:05 | +140 min | Merge PR #1 & Parallel KV Refactor                   | Sprint 1.1  | `d3488e7` |
| 10 Feb 16:20 | +135 min | Merge PR #4: Supabase Auth & Quality Gate            | Sprint 1.2  | `e2ec2da` |

---

<<<<<<< HEAD

## 🔄 Phase 1: Foundation — IN PROGRESS (80%)

=======

## ✅ Phase 1: Foundation — DONE

> > > > > > > origin/dev

> **Estimasi berdasarkan velocity**: Foundation (Phase 1) hampir selesai dalam ~3 sesi kerja intensif.  
> Sisa Sprint 1.3 (Quality Gate) sebagai pemoles akhir sebelum Phase 2.

### Sprint 1.1: Persistence Layer (EdgeOne KV)

| #     | Task                                           | Kompleksitas           | Status |
| ----- | ---------------------------------------------- | ---------------------- | ------ |
| 1.1.1 | EdgeOne KV Adapters (Concept, Question, Progr) | 🟢 Rendah (Clean Arch) | ✅     |
| 1.1.2 | KV Type Definitions & Mocking (Testability)    | 🟢 Rendah              | ✅     |
| 1.1.3 | Edge Function API Routes (Edge Runtime)        | 🟡 Sedang              | ✅     |
| 1.1.4 | Registry Integration (Swap In-Memory → KV)     | 🟢 Rendah              | ✅     |
| 1.1.5 | Data Seeding to EdgeOne KV                     | 🟡 Sedang              | ✅     |

#### Sprint 1.1 Timeline (berdasarkan git history)

| Tanggal      | Waktu   | Deliverable                                               | Terkait Task Sprint 1.1 | Commit    |
| ------------ | ------- | --------------------------------------------------------- | ----------------------- | --------- |
| 10 Feb 10:32 | —       | Add GitHub & EdgeOne CLI knowledge base                   | 1.1.2, 1.1.5 (support)  | `51cbcea` |
| 10 Feb 10:44 | +12 min | Implement EdgeOne KV repository adapters & infrastructure | 1.1.1, 1.1.4            | `1596ba0` |
| 10 Feb 10:46 | +2 min  | Fix code formatting dan enforce LF line endings           | 1.1.x (stabilization)   | `89d4950` |
| 10 Feb 11:17 | +31 min | Resolve test issues dan lint violations setelah KV        | 1.1.1, 1.1.3, 1.1.4     | `4491900` |
| 10 Feb 11:30 | +13 min | Format code dan update AI guidelines (EdgeOne/KV docs)    | 1.1.1–1.1.5 (docs)      | `d239ae7` |
| 10 Feb 12:05 | +35 min | Tambah Edge API route tests dan Husky hooks               | 1.1.3, 1.1.5            | `6949e10` |
| 10 Feb 12:09 | +4 min  | Refine pre-commit hook (lint, format, tsc)                | 1.1.3, 1.1.5 (quality)  | `c8c16a0` |

### Sprint 1.2: Authentication — ✅ DONE

| #     | Task                               | Kompleksitas        | Status |
| ----- | ---------------------------------- | ------------------- | ------ |
| 1.2.1 | Supabase Auth setup                | 🟢 Rendah           | ✅     |
| 1.2.2 | Login + Register UI                | 🟡 Sedang (2 pages) | ✅     |
| 1.2.3 | Client API Wrapper (`AuthApi`)     | 🟢 Rendah           | ✅     |
| 1.2.4 | Auth middleware + protected routes | 🟡 Sedang           | ✅     |
| 1.2.5 | Replace `demo-user` → real user ID | 🟢 Rendah           | ✅     |
| 1.2.6 | Google Sign-In (OAuth)             | 🟢 Rendah           | ✅     |
| 1.2.7 | GoogleIcon component extraction    | 🟢 Rendah           | ✅     |

<<<<<<< HEAD

#### Sprint 1.2 Timeline (berdasarkan git history)

| Tanggal      | Waktu   | Deliverable                                          | Terkait Task Sprint 1.2 | Commit    |
| ------------ | ------- | ---------------------------------------------------- | ----------------------- | --------- |
| 10 Feb 15:30 | —       | implement supabase authentication flow & validation  | 1.2.1, 1.2.2, 1.2.4     | `46a4097` |
| 10 Feb 15:35 | +5 min  | add auth use case and ui tests (coverage thresholds) | 1.2.2 (quality)         | `ccf7d56` |
| 10 Feb 15:45 | +10 min | refactor auth api to be lazy and fix dashboard tests | 1.2.3, 1.2.5            | `af250e1` |
| 10 Feb 16:20 | +35 min | Merge PR #4: Final adjustments & branching policy    | Sprint 1.2 (final)      | `e2ec2da` |
| 10 Feb 16:25 | +5 min  | docs: sync current state after Sprint 1.2 merge (#6) | Sprint 1.2 (sync)       | `2865684` |
| 10 Feb 17:50 | +85 min | Google Sign-In + GoogleIcon refactor (PR #10)        | Sprint 1.2 (auth)       | `4203ad5` |
| 10 Feb 18:15 | +25 min | PR #10 feedback: constants, props, test fixes        | Sprint 1.2 (quality)    | `3292865` |

=======

> > > > > > > origin/dev

#### Sprint 1.2 Timeline (berdasarkan git history)

| Tanggal      | Waktu   | Deliverable                                          | Terkait Task Sprint 1.2 | Commit    |
| ------------ | ------- | ---------------------------------------------------- | ----------------------- | --------- |
| 10 Feb 15:30 | —       | implement supabase authentication flow & validation  | 1.2.1, 1.2.2, 1.2.4     | `46a4097` |
| 10 Feb 15:35 | +5 min  | add auth use case and ui tests (coverage thresholds) | 1.2.2 (quality)         | `ccf7d56` |
| 10 Feb 15:45 | +10 min | refactor auth api to be lazy and fix dashboard tests | 1.2.3, 1.2.5            | `af250e1` |
| 10 Feb 16:20 | +35 min | Merge PR #4: Final adjustments & branching policy    | Sprint 1.2 (final)      | `e2ec2da` |
| 10 Feb 16:25 | +5 min  | docs: sync current state after Sprint 1.2 merge (#6) | Sprint 1.2 (sync)       | `2865684` |
| 10 Feb 17:50 | +85 min | Google Sign-In + GoogleIcon refactor (PR #10)        | Sprint 1.2 (auth)       | `4203ad5` |
| 10 Feb 18:15 | +25 min | PR #10 feedback: constants, props, test fixes        | Sprint 1.2 (quality)    | `3292865` |

#### Sprint 1.2 Timeline (berdasarkan git history)

| Tanggal      | Waktu   | Deliverable                                          | Terkait Task Sprint 1.2 | Commit    |
| ------------ | ------- | ---------------------------------------------------- | ----------------------- | --------- |
| 10 Feb 15:30 | —       | implement supabase authentication flow & validation  | 1.2.1, 1.2.2, 1.2.4     | `46a4097` |
| 10 Feb 15:35 | +5 min  | add auth use case and ui tests (coverage thresholds) | 1.2.2 (quality)         | `ccf7d56` |
| 10 Feb 15:45 | +10 min | refactor auth api to be lazy and fix dashboard tests | 1.2.3, 1.2.5            | `af250e1` |
| 10 Feb 16:20 | +35 min | Merge PR #4: Final adjustments & branching policy    | Sprint 1.2 (final)      | `e2ec2da` |
| 10 Feb 16:25 | +5 min  | docs: sync current state after Sprint 1.2 merge (#6) | Sprint 1.2 (sync)       | `2865684` |
| 10 Feb 17:50 | +85 min | Google Sign-In + GoogleIcon refactor (PR #10)        | Sprint 1.2 (auth)       | `4203ad5` |
| 10 Feb 18:15 | +25 min | PR #10 feedback: constants, props, test fixes        | Sprint 1.2 (quality)    | `3292865` |

### Sprint 1.3: Quality Gate — ✅ DONE

| #     | Task                           | Kompleksitas | Status |
| ----- | ------------------------------ | ------------ | ------ |
| 1.3.1 | Playwright E2E setup + 2 flows | 🟡 Sedang    | ✅     |
| 1.3.2 | Fix `act()` warnings           | 🟢 Rendah    | ✅     |
| 1.3.3 | Registry coverage 35% → 80%    | 🟢 Rendah    | ✅     |
| 1.3.4 | Error boundary component       | 🟢 Rendah    | ✅     |
| 1.3.5 | User Guide Documentation       | 🟢 Rendah    | ✅     |
| 1.3.6 | Technical Debt Resolution      | 🟢 Rendah    | ✅     |

---

## 📦 Phase 2: Content Management

> Kompleksitas lebih tinggi (CRUD UI, question types, responsive).  
> Estimasi **3–5 sesi kerja**.

### Sprint 2.1: Admin Panel — ✅ DONE (PR #18)

| #     | Task                   | Kompleksitas | Status |
| ----- | ---------------------- | ------------ | ------ |
| 2.1.1 | Admin layout + sidebar | 🟡 Sedang    | ✅     |
| 2.1.2 | Concept CRUD UI        | 🟡 Sedang    | ✅     |
| 2.1.3 | Question CRUD UI       | 🟡 Sedang    | ☐      |
| 2.1.4 | Category management    | 🟢 Rendah    | ✅     |
| 2.1.5 | Bulk import (JSON/CSV) | 🟡 Sedang    | ☐ ⭐   |

### Sprint 2.2: Enhanced Learning

| #     | Task                 | Kompleksitas | Status |
| ----- | -------------------- | ------------ | ------ |
| 2.2.1 | Question type: MCQ   | 🟡 Sedang    | ☐      |
| 2.2.2 | Question type: Cloze | 🟡 Sedang    | ☐ ⭐   |
| 2.2.3 | Markdown support     | 🟢 Rendah    | ☐      |
| 2.2.4 | Image attachments    | 🟡 Sedang    | ☐      |
| 2.2.5 | Audio playback       | 🟡 Sedang    | ☐      |

### Sprint 2.3: Mobile Experience

| #     | Task                   | Kompleksitas | Status |
| ----- | ---------------------- | ------------ | ------ |
| 2.3.1 | Responsive audit + fix | 🟡 Sedang    | ☐      |
| 2.3.2 | Touch gestures         | 🟡 Sedang    | ☐      |
| 2.3.3 | Mobile navigation      | 🟢 Rendah    | ☐      |
| 2.3.4 | Dark mode              | � Rendah     | ☐      |

---

## 📊 Phase 3: Analytics & PWA

> Highest complexity (charts, API integrations, service workers).  
> Estimasi **4–6 sesi kerja**.

### Sprint 3.1: Learning Analytics

| #     | Task                             | Kompleksitas | Status |
| ----- | -------------------------------- | ------------ | ------ |
| 3.1.1 | Study streak tracking            | 🟢 Rendah    | ☐ ⚠️   |
| 3.1.2 | Time spent analytics             | 🟡 Sedang    | ☐      |
| 3.1.3 | Retention rate graph             | 🟠 Tinggi    | ☐ ⭐   |
| 3.1.4 | Difficult concept identification | 🟡 Sedang    | ☐      |
| 3.1.5 | Forgetting curve visualization   | 🟠 Tinggi    | ☐      |

### Sprint 3.2: Smart Features

| #     | Task                              | Kompleksitas | Status |
| ----- | --------------------------------- | ------------ | ------ |
| 3.2.1 | AI hint generation (API)          | 🟠 Tinggi    | ☐      |
| 3.2.2 | Similar concept suggestions       | 🟡 Sedang    | ☐      |
| 3.2.3 | Optimal study time recommendation | 🟡 Sedang    | ☐      |
| 3.2.4 | Study session summary             | 🟢 Rendah    | ☐      |

### Sprint 3.3: PWA & Notifications

| #     | Task                      | Kompleksitas | Status |
| ----- | ------------------------- | ------------ | ------ |
| 3.3.1 | Service worker + manifest | 🟡 Sedang    | ☐      |
| 3.3.2 | Push notifications        | 🟠 Tinggi    | ☐      |
| 3.3.3 | Add to Home Screen        | 🟢 Rendah    | ☐      |
| 3.3.4 | Background sync           | 🟠 Tinggi    | ☐      |

---

## � Proyeksi Timeline (kalibrasi dari data nyata)

<<<<<<< HEAD
| Phase | Sesi Kerja | Target Selesai | Confidence |
| ------------------- | ------------- | --------------------- | ---------- |
| ~~Phase 0: MVP~~ | 2 sesi | ~~10 Feb~~ ✅ | — |
| Phase 1: Foundation | 3 sesi | ~~10 Feb~~ ✅ | 🟢 High |
| Phase 2: Content | 3–5 sesi | Sesi kerja berikutnya | 🟡 Medium |
| Phase 3: Analytics | 4–6 sesi | Strategis | 🟠 Low |
| **Total remaining** | **7–11 sesi** | | |
=======
| Phase | Sesi Kerja | Target Selesai | Confidence |
| ----------------------- | ------------- | --------------------- | ---------- |
| ~~Phase 0: MVP~~ | 2 sesi | ~~10 Feb~~ ✅ | — |
| ~~Phase 1: Foundation~~ | 3 sesi | ~~11 Feb~~ ✅ | 🟢 High |
| Phase 2: Content | 3–5 sesi | Sesi kerja berikutnya | 🟡 Medium |
| Phase 3: Analytics | 4–6 sesi | Strategis | 🟠 Low |
| **Total remaining** | **7–11 sesi** | | |

> > > > > > > origin/dev

> **Cara baca**: 1 sesi = 1 kali duduk kerja bersama AI (~30–90 menit efektif).  
> Timeline **tidak dikunci ke tanggal** karena tergantung kapan Anda mulai sesi berikutnya.  
> Roadmap ini akan di-update otomatis setelah setiap sesi berdasarkan commit terbaru.

---

## 📋 Backlog (Post v1.0)

- [ ] Multi-language support (i18n)
- [ ] Collaborative decks
- [ ] Integrasi Notion / Obsidian
- [ ] Public API
- [ ] Gamification (achievements, leaderboard) ⚠️ _Low Priority for Reza_

---

_Lihat [CURRENT_STATE.md](./CURRENT_STATE.md) untuk status terkini._
