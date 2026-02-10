---
description: Langkah wajib sebelum mengerjakan task apapun di proyek Beringin
---

# Aturan: Baca CONTRIBUTING.md Sebelum Mulai

> **WAJIB**: Sebelum mengerjakan task apapun (fitur baru, bug fix, refactor, dll), baca file `CONTRIBUTING.md` di root proyek terlebih dahulu.

## Langkah-langkah

// turbo-all

1. Baca `CONTRIBUTING.md` untuk memahami:
   - Branching strategy (prefix branch yang benar)
   - Commit message format (Conventional Commits)
   - PR checklist & guidelines
   - Architecture rules (layer separation)
   - Testing requirements (minimal 80% coverage, naming `*.test.ts`)

2. Baca `docs/ARCHITECTURE.md` untuk memahami aturan layer:
   - UI → Application → Domain → Infrastructure
   - Apa yang boleh dan tidak boleh di setiap layer

3. Baca `docs/ROADMAP.md` untuk memahami konteks task yang akan dikerjakan

4. Setelah memahami semua aturan, baru mulai merencanakan dan mengerjakan task dengan workflow yang benar:
   - Buat branch baru dari `main` (JANGAN langsung di `main`)
   - Develop sesuai aturan arsitektur
   - Tulis test untuk setiap kode baru
   - Jalankan `npm run lint`, `npm test`, `npm run build` sebelum commit
   - Commit dengan format Conventional Commits
   - Push dan buat Pull Request

5. **Setelah fitur selesai**, WAJIB update dokumentasi sebelum commit terakhir:
   - Update `docs/CURRENT_STATE.md` — catat perubahan yang dilakukan, status terbaru, dan known issues baru (jika ada)
   - Update `docs/ROADMAP.md` — tandai task yang sudah selesai (☐ → ✅), update status, dan catat waktu/sesi kerja
   - Kedua file ini akan menjadi referensi utama untuk sesi pengembangan berikutnya
