# 🤝 Contributing Guidelines - Beringin

> Panduan kontribusi untuk proyek Beringin

## 🌿 Branching Strategy

### Aturan Utama

> **WAJIB**: Setiap fitur baru HARUS dikembangkan di branch terpisah (`feature/*`) dan diintegrasikan ke branch `dev` melalui Pull Request. Branch `main` akan diperbarui dari `dev` secara berkala untuk proses release/deploy.
> **Deployment**: Workflow deployment ke EdgeOne secara otomatis aktif hanya di branch `main`.

### Branch Types

| Prefix      | Penggunaan  | Contoh                        |
| ----------- | ----------- | ----------------------------- |
| `feature/`  | Fitur baru  | `feature/user-authentication` |
| `dev`       | Integrasi   | `dev`                         |
| `main`      | Production  | `main`                        |
| `fix/`      | Bug fix     | `fix/scheduler-calculation`   |
| `docs/`     | Dokumentasi | `docs/api-reference`          |
| `refactor/` | Refactoring | `refactor/repository-pattern` |
| `test/`     | Testing     | `test/e2e-session-flow`       |

> Rekomendasi: Untuk kerja berbasis roadmap, sertakan informasi Sprint/Task di nama branch, misalnya:
> `feature/sprint-1-1-edgeone-kv` atau `feature/sprint-1-2-auth-login-ui`.

### Kapan Harus Buat Branch Baru?

- Buat **branch baru** ketika:
  - Memulai Sprint baru (mis. pindah dari Sprint 1.1 → Sprint 1.2).
  - Memulai Task baru yang tidak strictly lanjutan dari pekerjaan di branch saat ini.
  - Perubahan yang akan dibuat bersifat besar atau berisiko (refactor besar, perubahan arsitektur).
- Tetap di **branch yang sama** ketika:
  - Hanya melakukan follow-up kecil untuk Sprint/Task yang sama (perbaikan bug yang baru ditemukan, tambahan test, penyempurnaan kecil UI).
  - Hanya mengupdate dokumentasi yang masih dalam ruang lingkup Sprint/Task yang sama.
- Hindari:
  - Menggabungkan pekerjaan dari beberapa Sprint berbeda dalam satu branch.
  - Menahan satu branch terlalu lama dengan scope yang terus melebar; lebih baik pecah menjadi beberapa branch yang fokus.

### Workflow

```bash
# 1. Pastikan dev up-to-date
git checkout dev
git pull origin dev

# 2. Buat branch baru untuk fitur
git checkout -b feature/nama-fitur

# 3. Develop & commit
git add .
git commit -m "feat: deskripsi singkat"

# 4. Push & Buat Pull Request ke dev
git push origin feature/nama-fitur
# (via GitHub UI: target branch 'dev')

# 5. Proses Rilis (Deployment)
# Setelah beberapa fitur terintegrasi di 'dev', maintainer akan menggabungkannya ke 'main' untuk memicu deployment otomatis.
```

### Commit Message Format

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]
```

**Types:**

- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Dokumentasi
- `refactor:` - Refactoring tanpa perubahan fungsional
- `test:` - Menambah atau memperbaiki test
- `chore:` - Maintenance (dependencies, config)

**Contoh:**

```
feat: add user authentication with Supabase

- Implement email/password login
- Add OAuth Google provider
- Create protected route middleware
```

### Roadmap Alignment (Sprint/Task)

- Setiap branch dan PR sebaiknya jelas terkait dengan **Sprint/Task** di `docs/ROADMAP.md`.
- Sertakan referensi Sprint/Task di deskripsi commit atau PR, misalnya:
  - `feat: implement EdgeOne KV persistence (Sprint 1.1 / Task 1.1.1)`
  - `fix: handle submit errors in session API (Sprint 1.1 / Task 1.1.3)`
- Hindari mengerjakan beberapa Sprint sekaligus di satu branch; fokus pada satu Sprint atau satu cluster task yang berdekatan.

---

## 🔀 Pull Request Guidelines

### Sebelum Membuat PR

```bash
# Pastikan tidak ada lint error (juga dijalankan otomatis via Husky pre-commit)
npm run lint

# Pastikan format kode sudah sesuai (Husky juga menjalankan check-format)
npm run check-format

# Pastikan type-check lulus (juga dijalankan otomatis via Husky pre-commit)
npx tsc --noEmit

# Pastikan semua test pass (Husky pre-push menjalankan `npm run test:ci`)
npm run test:ci

# Pastikan build sukses (dijalankan di CI, tapi sebaiknya dicek lokal)
npm run build
```

### PR Checklist

- [ ] Branch dibuat dari `main` terbaru
- [ ] Nama branch sesuai konvensi
- [ ] Commit messages mengikuti format
- [ ] Lint: 0 errors
- [ ] Format: OK (Prettier)
- [ ] Type-check: OK (tsc --noEmit)
- [ ] Tests: pass (npm run test:ci)
- [ ] Build: sukses
- [ ] Dokumentasi diupdate (jika perlu)

### Git Hooks (Husky)

Repo ini sudah dikonfigurasi dengan Husky:

- `pre-commit`: menjalankan `npm run lint`, `npm run check-format`, `npx tsc --noEmit`
- `pre-push`: menjalankan `npm run test:ci`

Saat menjalankan `git commit` / `git push`, hook ini akan otomatis berjalan dan memblokir jika ada error. Jika hook terasa lambat, jalankan perintah yang sama secara manual sebelum commit/push untuk mempercepat feedback loop.

### PR Title Format

```
<type>: <short description>
```

Contoh: `feat: implement dashboard analytics`

---

## 🏗️ Architecture Rules

Saat berkontribusi, pastikan mengikuti aturan arsitektur:

1. **UI Layer** - Hanya render, tidak ada business logic
2. **Application Layer** - Use cases untuk orchestration
3. **Domain Layer** - Pure business logic, bebas framework
4. **Infrastructure Layer** - Data access dan external services

Lihat [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) untuk detail.

---

## 🧪 Testing Guidelines

- Setiap fitur baru HARUS disertai test
- Minimal 80% coverage untuk kode baru
- Gunakan naming convention: `*.test.ts`

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 📝 Quick Reference

```bash
# Fitur baru
git checkout -b feature/nama-fitur

# Bug fix
git checkout -b fix/nama-bug

# Dokumentasi
git checkout -b docs/nama-doc
```

---

_Happy contributing! 🌳_
