---
trigger: always_on
---

# 🧭 Aturan Arsitektur Tim – Next.js

Dokumen ini adalah **aturan wajib** untuk menjaga proyek Next.js tetap scalable, minim bug, dan mudah dites.
Jika melanggar aturan di bawah, **refactor adalah kewajiban**, bukan opsi.

---

## 1. Prinsip Utama

> **Pisahkan UI, logika bisnis, dan akses data secara keras.**

- UI hanya menampilkan
- Use Case menjalankan aturan
- Domain menyimpan logika inti
- Infrastructure menangani side effect

---

## 2. Aturan Lapisan (WAJIB)

### Lapisan Arsitektur

```
UI → Application (Use Case) → Domain → Infrastructure
```

### Larangan

- ❌ UI memanggil API / fetch
- ❌ UI berisi logic bisnis
- ❌ Domain tahu React / Next.js
- ❌ Import bolak-balik antar layer

---

## 3. Page & Component

### Aturan

- `page.tsx` & component **harus bodoh**
- Hanya:
  - menerima data
  - render UI

### Dilarang

- fetch data
- filter data bisnis
- akses env / storage

> Jika logic bisa dijelaskan dengan kalimat → **bukan urusan UI**

---

## 4. Use Case (WAJIB)

- Setiap aksi bisnis = 1 use case
- Nama eksplisit: `*.usecase.ts`
- Semua logic bisnis **HARUS DI SINI**

Contoh:

```ts
getUser.usecase.ts
createOrder.usecase.ts
```

---

## 5. Domain

### Boleh

- entity
- policy / rule
- validasi bisnis

### Dilarang

- import React / Next.js
- fetch / axios
- side effect apa pun

Domain harus **100% testable tanpa framework**.

---

## 6. Infrastructure

- Satu-satunya tempat:
  - fetch API
  - DB
  - storage
  - env

- Diakses **hanya lewat interface (repository)**

UI **tidak boleh** tahu detail infrastructure.

---

## 7. Dependency Injection

- Dependency lewat parameter function
- Default dependency boleh disediakan

```ts
function useCase(repo = defaultRepo)
```

❌ Tidak pakai DI container berat

---

## 8. Testing Rules

### Test berdasarkan layer

| Layer    | Jenis Test  |
| -------- | ----------- |
| Domain   | Unit        |
| Use Case | Unit + mock |
| UI       | Render      |
| API      | Integration |

### Aturan keras

- Use case **harus bisa dites tanpa React**
- Satu test = satu perilaku
- Tidak ada test “segala hal sekaligus”

---

## 9. State Management

- Server state → server component / fetch
- UI lokal → `useState`
- UI global → Zustand

❌ Dilarang:

- logic bisnis di store
- fetch di store

---

## 10. Error Handling

- Error bisnis ≠ error teknis
- Domain mendefinisikan error
- UI hanya menampilkan, **tidak menafsirkan**

---

## 11. Naming & Struktur

### Naming wajib

- `*.usecase.ts`
- `*.repository.ts`
- `*.policy.ts`
- `*.entity.ts`

Jika nama file tidak menjelaskan perannya → **ganti nama**

---

## 12. Checklist Sebelum Commit

- [ ] Page hanya render
- [ ] Logic ada di use case
- [ ] UI bebas fetch
- [ ] Dependency searah
- [ ] Use case bisa dites tanpa React

Jika semua ✔ → **siap merge**

---

## 13. Prinsip Terakhir

> **Jika ragu, tarik logic ke use case.**

Lebih cepat refactor sekarang
daripada debug 3 bulan lagi.

## 14. Aturan TypeScript, ESLint & Prettier

> Kode harus aman dari bug, mudah dibaca, konsisten, dan menghormati pemisahan layer.  
> Jangan matikan aturan hanya karena “ribet” – perbaiki kodenya saja.

Semua programmer **wajib** mengikuti aturan ini setiap hari. Jika melanggar → review akan ditolak, wajib diperbaiki sebelum merge.

### 14.1 Prinsip Dasar yang Harus Diingat Selalu

- Prettier mengatur tampilan kode (spasi, kutip, panjang baris, semi-colon, dll). Biarkan Prettier saja yang mengurus ini – jangan pakai ESLint untuk hal yang sama.
- ESLint mengurus kualitas kode, keamanan, best practice, dan penegakan arsitektur (layer separation).
- TypeScript diatur **strict** supaya bug ketahuan sejak awal, bukan pas runtime.

### 14.2 Aturan TypeScript yang Wajib Diikuti

- Selalu tulis tipe secara eksplisit (jangan biarkan TypeScript menebak-nebak).
- Jangan pakai `any` kecuali benar-benar di boundary (library pihak ketiga yang tidak punya tipe). Jika pakai `any`, **wajib** kasih komentar jelas kenapa.
- Gunakan `type` untuk alias sederhana, `interface` untuk props komponen atau object yang mungkin di-extend.
- Selalu handle semua Promise dengan benar: pakai `await`, atau `.then` + `.catch`. Jangan biarkan promise “melayang” (floating promises) – ini sering bikin bug susah dilacak.
- Import tipe harus pakai `import type { ... }` atau `type` di depan – supaya jelas mana yang value, mana yang hanya tipe (membantu tree-shaking).
- Jangan pakai non-null assertion (`!`) sembarangan – lebih baik pakai type guard atau optional chaining.
- Variabel yang tidak dipakai harus dihapus (unused vars & imports).
- Parameter fungsi yang tidak dipakai boleh diawali `_` (contoh: `_event`).

### 14.3 Aturan ESLint & Best Practice yang Wajib

- Import harus diurutkan secara otomatis & rapi (grup: React → third-party → internal layer → styles).
- Jangan import sesuatu yang melanggar arah dependency:
  - UI (page/component) **dilarang** import langsung dari infrastructure (API, DB, env). Harus lewat use-case atau repository.
  - Use-case **dilarang** import React/Next.js atau infrastructure detail. Hanya boleh domain + interface repository.
  - Domain **harus murni** TypeScript – dilarang import React, Next.js, fetch, axios, atau side-effect apa pun.
- Jangan pakai `console.log` di kode production (boleh sementara untuk debug, tapi hapus sebelum commit).
- React Hooks harus dipakai sesuai aturan (rules of hooks) – jangan panggil di kondisi/loop.
- Komponen fungsional tidak perlu `React.FC` lagi – cukup tulis langsung `(props: Props) => ...`.
- Selalu pakai `key` yang stabil di list rendering.
- Error handling: bedakan error bisnis (dari domain) vs error teknis. UI hanya tampilkan pesan, jangan logic interpretasi di UI.

### 14.4 Aturan Prettier yang Wajib Diikuti

- Satu baris maksimal 100 karakter.
- Pakai single quote (`'`) bukan double quote.
- Selalu tambah trailing comma di object/array (kecuali single line).
- Selalu pakai semi-colon di akhir statement.
- Arrow function pakai parentheses hanya kalau perlu (avoid jika bisa).
- Biarkan Prettier format otomatis saat save – jangan lawan formatnya.

### 14.5 Checklist Harian Sebelum Commit / PR (Tambahan dari Bagian 12)

- Kode sudah di-format Prettier (save file atau jalankan perintah format).
- ESLint tidak ada error atau warning baru (jalankan lint).
- `tsc --noEmit` lolos (tidak ada error tipe).
- Tidak ada `any` baru tanpa alasan & komentar.
- Import sudah rapi & tidak langgar aturan layer (arah dependency benar).
- Tidak ada `console.log` yang tertinggal.
- Semua async function di-handle dengan benar (await atau then/catch).
- UI tetap “bodoh” – tidak ada fetch, filter bisnis, atau logic di page/component.

Jika semua poin di atas sudah centang → kode siap direview.

### Penutup (Prinsip ke-15 – Wajib Diingat Semua Orang)

> Lint complain bukan musuh – itu alarm bahwa ada potensi bug atau pelanggaran arsitektur.  
> Lebih baik lambat 5 menit memperbaiki sekarang, daripada debug berjam-jam nanti atau bahkan di production.
