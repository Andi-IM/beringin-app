Aturan Sprint Development untuk proyek Beringin:

- Sprint-Driven Code Generation: Setiap perubahan harus terkait dengan task spesifik di `docs/ROADMAP.md` (misal: Sprint 1.1 / Task 1.1.3).
- Fokus Implementasi: Implementasikan hanya apa yang diperlukan untuk Sprint aktif; hindari melompat ke Sprint berikutnya.
- Naming yang Jelas: Beri nama file/fungsi agar mapping ke Sprint task jelas (commit message, nama test, dll).
- Sprint Status Table: Update tabel status Sprint terlebih dahulu, lalu implementasi kode yang memenuhi baris tersebut.
- Isolasi Sprint: Jangan campur pekerjaan dari beberapa Sprint dalam satu branch. Untuk Sprint/Task berbeda, buat branch baru dari `main` dengan nama yang mencerminkan Sprint/Task.
