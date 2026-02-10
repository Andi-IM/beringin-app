Aturan Arsitektur untuk proyek Beringin:

- Arsitektur wajib: UI → Application (use case) → Domain → Infrastructure. UI hanya render; tidak boleh fetch, akses env, atau mengandung logika bisnis.
- Semua logika bisnis diletakkan di `*.usecase.ts` dan domain murni TypeScript (tanpa React/Next/fetch). Infrastructure menangani fetch/DB/storage/env melalui repository interface.
