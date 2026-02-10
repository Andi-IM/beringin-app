Aturan Kualitas Kode & Testing untuk proyek Beringin:

- TypeScript strict, ESLint, dan Prettier harus dipatuhi; penggunaan `any`, non-null `!`, dan `console.log` di commit dihindari. Import dijaga rapi dan tidak melanggar aturan layer.
- Testing minimal: domain & use case diberi unit test, UI diberi render test bila disentuh. Sebelum task dinyatakan selesai, `npm run lint`, `npm test`, dan `npm run build` dijalankan dan harus lulus.
- Format kode wajib konsisten: gunakan `npm run format` sebelum push, dan pastikan `npm run check-format` hijau bila tersedia, supaya job "Check code formatting" di CI tidak gagal.
