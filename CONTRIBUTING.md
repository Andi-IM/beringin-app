# 🤝 Contributing Guidelines - Beringin

> Panduan kontribusi untuk proyek Beringin

## 🌿 Branching Strategy

### Aturan Utama

> **WAJIB**: Setiap fitur baru HARUS dikembangkan di branch terpisah, BUKAN langsung di `main`.

### Branch Types

| Prefix      | Penggunaan  | Contoh                        |
| ----------- | ----------- | ----------------------------- |
| `feature/`  | Fitur baru  | `feature/user-authentication` |
| `fix/`      | Bug fix     | `fix/scheduler-calculation`   |
| `docs/`     | Dokumentasi | `docs/api-reference`          |
| `refactor/` | Refactoring | `refactor/repository-pattern` |
| `test/`     | Testing     | `test/e2e-session-flow`       |

### Workflow

```bash
# 1. Pastikan main up-to-date
git checkout main
git pull origin main

# 2. Buat branch baru untuk fitur
git checkout -b feature/nama-fitur

# 3. Develop & commit
git add .
git commit -m "feat: deskripsi singkat"

# 4. Push ke remote
git push origin feature/nama-fitur

# 5. Buat Pull Request ke main
# (via GitHub UI)
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

---

## 🔀 Pull Request Guidelines

### Sebelum Membuat PR

```bash
# Pastikan tidak ada lint error
npm run lint

# Pastikan semua test pass
npm test

# Pastikan build sukses
npm run build
```

### PR Checklist

- [ ] Branch dibuat dari `main` terbaru
- [ ] Nama branch sesuai konvensi
- [ ] Commit messages mengikuti format
- [ ] Lint: 0 errors
- [ ] Tests: pass
- [ ] Build: sukses
- [ ] Dokumentasi diupdate (jika perlu)

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
