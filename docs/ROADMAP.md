# 🗺️ Roadmap - Beringin

> Rencana pengembangan berbasis data nyata dari git history  
> **Last Updated**: 2026-02-10T09:52+07:00

---

## 📊 Velocity Aktual (dari Git History)

| Sesi      | Tanggal     | Waktu                     | Output                                      | Lines Changed   |
| --------- | ----------- | ------------------------- | ------------------------------------------- | --------------- |
| #1        | 9 Feb 2026  | 23:36–23:56 (20 menit)    | MVP initial + ESLint + docs                 | +16,531 / -323  |
| #2        | 10 Feb 2026 | 09:32–09:45 (13 menit)    | Registry DI + fix 7 tests + coverage config | +3,454 / -1,792 |
| **Total** |             | **~33 menit commit time** | **10 commits, 47+ files**                   |                 |

> **Catatan**: Waktu commit ≠ waktu kerja total. Sesi kerja aktual (termasuk diskusi, review, debugging) diestimasi **~2–3× waktu commit** → **~1–1.5 jam kerja efektif** untuk seluruh MVP.

### Throughput Terukur (AI-Assisted)

| Metrik                          | Nilai                  |
| ------------------------------- | ---------------------- |
| Lines of code per sesi          | ~5,000–16,000          |
| Files changed per sesi          | 20–47                  |
| Test cases created per sesi     | ~80–146                |
| Rata-rata per jam kerja efektif | ~10,000 LoC, ~30 files |

---

## ✅ Phase 0: MVP — DONE

| Tanggal      | Waktu  | Deliverable                                          | Commit    |
| ------------ | ------ | ---------------------------------------------------- | --------- |
| 9 Feb 23:36  | —      | Initial commit: seluruh MVP (47 files, 15,886 lines) | `c82ba1e` |
| 9 Feb 23:39  | +3 min | ESLint config + fix TypeScript errors                | `bcaeee0` |
| 9 Feb 23:42  | +3 min | Migrate ke ESLint flat config                        | `53b7085` |
| 9 Feb 23:46  | +4 min | Clean Architecture ESLint rules                      | `4832851` |
| 9 Feb 23:51  | +5 min | Resolve lint errors                                  | `f50818b` |
| 9 Feb 23:55  | +4 min | Docs (README, ARCHITECTURE, CURRENT_STATE, ROADMAP)  | `59b6b7a` |
| 9 Feb 23:56  | +1 min | Contributing guidelines                              | `5f90427` |
| 10 Feb 09:32 | —      | Registry DI + refactor semua layer                   | `46018e3` |
| 10 Feb 09:41 | +9 min | Fix 7 failing infra tests (146/146 ✅)               | `ccd3835` |
| 10 Feb 09:43 | +2 min | Minor test fixes                                     | `2673f32` |
| 10 Feb 09:45 | +2 min | Per-layer coverage thresholds                        | `ac9d966` |

---

## 🔄 Phase 1: Foundation — NEXT

> **Estimasi berdasarkan velocity**: MVP (Phase 0) selesai dalam ~2 sesi kerja.  
> Phase 1 memiliki kompleksitas _serupa_ dengan MVP → estimasi **2–4 sesi kerja**.

### Sprint 1.1: Persistence Layer

| #     | Task                                            | Kompleksitas                  | Status |
| ----- | ----------------------------------------------- | ----------------------------- | ------ |
| 1.1.1 | Abstract repos → localStorage adapters          | 🟢 Rendah (pattern sudah ada) | ☐      |
| 1.1.2 | Supabase client + env config                    | 🟢 Rendah                     | ☐      |
| 1.1.3 | Supabase schema (concepts, questions, progress) | 🟡 Sedang                     | ☐      |
| 1.1.4 | Supabase repository adapters (swap in-memory)   | 🟡 Sedang (3 adapters)        | ☐      |
| 1.1.5 | Offline fallback + sync                         | 🟠 Tinggi                     | ☐      |

### Sprint 1.2: Authentication

| #     | Task                               | Kompleksitas                  | Status |
| ----- | ---------------------------------- | ----------------------------- | ------ |
| 1.2.1 | Supabase Auth setup                | 🟢 Rendah                     | ☐      |
| 1.2.2 | Login + Register UI                | 🟡 Sedang (2 pages)           | ☐      |
| 1.2.3 | OAuth Google                       | 🟢 Rendah (Supabase built-in) | ☐      |
| 1.2.4 | Auth middleware + protected routes | 🟡 Sedang                     | ☐      |
| 1.2.5 | Replace `demo-user` → real user ID | 🟢 Rendah                     | ☐      |

### Sprint 1.3: Quality Gate

| #     | Task                           | Kompleksitas | Status |
| ----- | ------------------------------ | ------------ | ------ |
| 1.3.1 | Playwright E2E setup + 2 flows | 🟡 Sedang    | ☐      |
| 1.3.2 | Fix `act()` warnings           | 🟢 Rendah    | ☐      |
| 1.3.3 | Registry coverage 35% → 80%    | 🟢 Rendah    | ☐      |
| 1.3.4 | Error boundary component       | � Rendah     | ☐      |

---

## 📦 Phase 2: Content Management

> Kompleksitas lebih tinggi (CRUD UI, question types, responsive).  
> Estimasi **3–5 sesi kerja**.

### Sprint 2.1: Admin Panel

| #     | Task                   | Kompleksitas | Status |
| ----- | ---------------------- | ------------ | ------ |
| 2.1.1 | Admin layout + sidebar | 🟡 Sedang    | ☐      |
| 2.1.2 | Concept CRUD UI        | 🟡 Sedang    | ☐      |
| 2.1.3 | Question CRUD UI       | 🟡 Sedang    | ☐      |
| 2.1.4 | Category management    | 🟢 Rendah    | ☐      |
| 2.1.5 | Bulk import (JSON/CSV) | 🟡 Sedang    | ☐      |

### Sprint 2.2: Enhanced Learning

| #     | Task                 | Kompleksitas | Status |
| ----- | -------------------- | ------------ | ------ |
| 2.2.1 | Question type: MCQ   | 🟡 Sedang    | ☐      |
| 2.2.2 | Question type: Cloze | 🟡 Sedang    | ☐      |
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
| 3.1.1 | Study streak tracking            | 🟢 Rendah    | ☐      |
| 3.1.2 | Time spent analytics             | 🟡 Sedang    | ☐      |
| 3.1.3 | Retention rate graph             | 🟠 Tinggi    | ☐      |
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

| Phase               | Sesi Kerja    | Target Selesai        | Confidence |
| ------------------- | ------------- | --------------------- | ---------- |
| ~~Phase 0: MVP~~    | 2 sesi        | ~~10 Feb~~ ✅         | —          |
| Phase 1: Foundation | 2–4 sesi      | Sesi kerja berikutnya | 🟢 High    |
| Phase 2: Content    | 3–5 sesi      | Setelah Phase 1       | 🟡 Medium  |
| Phase 3: Analytics  | 4–6 sesi      | Setelah Phase 2       | 🟠 Low     |
| **Total remaining** | **9–15 sesi** |                       |            |

> **Cara baca**: 1 sesi = 1 kali duduk kerja bersama AI (~30–90 menit efektif).  
> Timeline **tidak dikunci ke tanggal** karena tergantung kapan Anda mulai sesi berikutnya.  
> Roadmap ini akan di-update otomatis setelah setiap sesi berdasarkan commit terbaru.

---

## 📋 Backlog (Post v1.0)

- [ ] Multi-language support (i18n)
- [ ] Collaborative decks
- [ ] Integrasi Notion / Obsidian
- [ ] Public API
- [ ] Gamification (achievements, leaderboard)

---

_Lihat [CURRENT_STATE.md](./CURRENT_STATE.md) untuk status terkini._
