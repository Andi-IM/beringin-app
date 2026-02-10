Aturan GitHub CLI untuk proyek Beringin:

- `gh pr merge` dan `git push` hanya dijalankan jika ada instruksi eksplisit USER.
- Judul PR mengikuti Conventional Commits dengan format: `<type>: <description> (Sprint X.Y / Task X.Y.Z)`.
- Prefix yang diizinkan: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Deskripsi PR wajib menyebut Sprint/Task terkait dari `docs/ROADMAP.md`.
