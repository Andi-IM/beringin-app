# 📝 Post-Mortem: PR #17 CI Failures

## 🔍 Incident Summary

- **PR**: #17 (`feat/error-boundary`)
- **Date**: 2026-02-11
- **Symptoms**: Failed GitHub Checks (Build, Format) and initially stuck PR due to merge conflicts.

## 💣 Root Causes

### 1. Merge Conflicts & Stale Branch

Branch `feat/error-boundary` tertinggal jauh dari `dev`. Konflik pada `ROADMAP.md` dan `USER_GUIDE.md` menghambat sinkronisasi awal dan sempat memblokir workflow CI tertentu.

### 2. Syntax Error (`supabase-client.ts`)

Kesalahan penulisan (mismatched braces & undefined `error`) pada file infrastruktur kritis. Ini terjadi akibat "quick fix" manual yang tidak diverifikasi secara lokal.

### 3. Formatting Mismatch

`next-env.d.ts` dan file baru lainnya melanggar aturan Prettier (`check-format` fail). Hal ini terjadi karena auto-generated files atau manual edits yang tidak diproses melalui `npm run format`.

## 🛡️ Preventive Actions (Lessons Learned)

> [!IMPORTANT]
> **"Don't Trust, Verify Locally"**

| Tindakan             | Deskripsi                                                                                                        |
| :------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **Local Full Build** | Selalu jalankan `npm run build` & `npx tsc --noEmit` sebelum push PR. **Dapat diautomasi via Husky `pre-push`**. |
| **Sync Early**       | Merge `dev` ke feature branch secara berkala (`git merge origin/dev`).                                           |
| **Auto-Format**      | Gunakan `pre-commit` hook (sudah aktif) untuk memastikan kode selalu rapi sebelum masuk ke git.                  |
| **Dependency Check** | Verifikasi perubahan pada auto-generated files agar tidak merusak build environment.                             |

---
