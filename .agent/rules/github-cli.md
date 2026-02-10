---
trigger: always_on
---

# 🐙 GitHub CLI (gh) Rules & Knowledge

Dokumen ini berisi panduan dan aturan penggunaan GitHub CLI (`gh`) dalam proyek Beringin untuk manajemen repositori, Pull Request, dan Issues secara efisien.

---

## 1. Prinsip Utama

- Gunakan `gh` untuk mempercepat alur kerja Git tanpa meninggalkan terminal.
- Setiap aksi yang mengubah state remote (PR, Issue, Repo) harus mengikuti konvensi penamaan proyek.

---

## 2. Manajemen Pull Request (`gh pr`)

### Membuat PR

Gunakan `gh pr create` dengan flag yang sesuai:

```bash
gh pr create --title "<type>: <description>" --body "<summary of changes>" --draft
```

- **Draft PR**: Gunakan `--draft` jika pekerjaan belum selesai 100% tapi butuh visibilitas.
- **Title**: Harus mengikuti Conventional Commits (e.g., `feat: implementation of EdgeOne KV`).

### Meninjau & Checkout

- **List PR**: `gh pr list` untuk melihat PR yang terbuka.
- **Checkout PR**: `gh pr checkout <number>` untuk mengetes PR rekan tim secara lokal.
- **Status PR**: `gh pr status` untuk melihat status review dan CI.

### Merge PR

- Gunakan `gh pr merge --squash` untuk menjaga history git tetap bersih.

---

## 3. Manajemen Issues (`gh issue`)

### Workflow Pengembangan

1. **List Issues**: `gh issue list`
2. **Lihat Detail**: `gh issue view <number>`
3. **Mulai Kerja**: `gh issue develop <number> -c` (membuat branch baru yang terhubung ke issue).

---

## 4. GitHub Actions (`gh run`)

- **Monitor CI**: `gh run watch` untuk memantau jalannya tes setelah push.
- **Lihat Log Gagal**: `gh run view --log` membantu debugging cepat jika CI gagal.

---

## 5. Ringkasan Perintah Cepat

| Perintah             | Fungsi                                |
| :------------------- | :------------------------------------ |
| `gh auth status`     | Cek status login                      |
| `gh repo view --web` | Buka repo di browser                  |
| `gh pr view --web`   | Buka PR aktif di browser              |
| `gh browse`          | Akses cepat file/folder di GitHub web |

---

## 6. Aturan untuk AI Agent

- ❌ Jangan melakukan `gh pr merge` tanpa persetujuan USER eksplisit.
- ✅ Gunakan `gh run watch` untuk memastikan tes CI lulus sebelum melaporkan task selesai.
- ✅ Gunakan `gh pr create --draft` saat pekerjaan masih dalam tahap feedback.
