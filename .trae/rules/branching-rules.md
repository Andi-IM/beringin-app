Aturan Branch untuk AI di proyek Beringin:

- Workflow: `feature/*` -> Pull Request ke `dev`. Secara periodik, `dev` akan di-merge ke `main` untuk auto-deploy.
- Branch `dev` adalah tempat integrasi utama untuk semua fitur baru.
- Branch `main` hanya di-merge dari `dev` untuk memicu deployment ke EdgeOne.
- Buat branch baru untuk Sprint/Task berbeda di `docs/ROADMAP.md` atau perubahan yang tidak lanjutan.
- Tetap di branch yang sama untuk follow-up kecil terkait Sprint/Task sama (fix test, tweak UI).
- Jangan campur pekerjaan dari beberapa Sprint berbeda di satu branch.
- Jika perlu pindah Sprint, selesaikan/merge branch aktif dulu atau buat branch baru dari `dev`.
- Perubahan kode harus eksplisit terkait Sprint/Task tertentu, tidak melompat ke Sprint berikutnya.
