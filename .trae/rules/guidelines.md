Aturan AI untuk proyek Beringin:

- Arsitektur wajib: UI → Application (use case) → Domain → Infrastructure. UI hanya render; tidak boleh fetch, akses env, atau mengandung logika bisnis.
- Semua logika bisnis diletakkan di `*.usecase.ts` dan domain murni TypeScript (tanpa React/Next/fetch). Infrastructure menangani fetch/DB/storage/env melalui repository interface.
- TypeScript strict, ESLint, dan Prettier harus dipatuhi; penggunaan `any`, non-null `!`, dan `console.log` di commit dihindari. Import dijaga rapi dan tidak melanggar aturan layer.
- Testing minimal: domain & use case diberi unit test, UI diberi render test bila disentuh. Sebelum task dinyatakan selesai, `npm run lint`, `npm test`, dan `npm run build` dijalankan dan harus lulus.
- Format kode wajib konsisten: gunakan `npm run format` sebelum push, dan pastikan `npm run check-format` hijau bila tersedia, supaya job “Check code formatting” di CI tidak gagal.
- Deployment via EdgeOne: selalu jalankan build dulu lalu `edgeone pages deploy ./out`. KV diakses dengan `context.KV` dan binding diatur di `edgeone.json`.
- GitHub CLI: `gh pr merge` dan `git push` hanya dijalankan jika ada instruksi eksplisit USER; judul PR mengikuti Conventional Commits.
