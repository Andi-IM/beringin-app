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
getUser.usecase.ts;
createOrder.usecase.ts;
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
function useCase(repo = defaultRepo);
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
