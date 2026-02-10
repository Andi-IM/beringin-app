---
trigger: always_on
---

# 🌩️ EdgeOne CLI Rules & Knowledge

Dokumen ini berisi panduan penggunaan EdgeOne CLI untuk manajemen deployment, functions, dan KV storage pada platform Tencent Cloud EdgeOne.

---

## 1. Prinsip Utama

- Proyek Beringin dideploy menggunakan **EdgeOne Pages** dan **Edge Functions**.
- Persistensi data menggunakan **EdgeOne KV**.

---

## 2. Inisialisasi & Login

- **Install**: `npm install -g edgeone`
- **Login**: `edgeone login` (pilih region: Global).
- **Status**: `edgeone whoami` untuk memverifikasi akun.

---

## 3. Deployment (`edgeone pages`)

### Alur Kerja Deployment

1. **Initialize**: `edgeone pages init` (hanya di awal proyek).
2. **Local Dev**: `edgeone pages dev` (menjalankan service lokal, biasanya port 8088).
3. **Manual Deploy**: `edgeone pages deploy ./out` (setelah `npm run build`).

### Aturan Deployment

- ✅ Selalu jalankan `npm run build` sebelum `edgeone pages deploy`.
- ❌ Jangan deploy langsung jika `npm test` atau `npm run lint` gagal.

---

## 4. EdgeOne KV Storage

### Operasi via Code (Edge Functions)

KV binds ke project dan diakses global:

```typescript
await context.KV.put('key', 'value')
const val = await context.KV.get('key')
```

### Aturan KV

- **Namespace**: Nama namespace harus deskriptif (e.g., `beringin-prod`, `beringin-staging`).
- **Binding**: Pastikan binding dilakukan di console atau `edgeone.json` agar terbaca oleh function.

---

## 5. Sinkronisasi Environment

- **Link Project**: `edgeone pages link` to associate local folder with console project.
- **Global Deployment**: `edgeone pages deploy ./out`

---

## 6. Ringkasan Perintah Penting

| Perintah                    | Deskripsi                               |
| :-------------------------- | :-------------------------------------- |
| `edgeone pages dev`         | Jalankan sandbox lokal                  |
| `edgeone pages deploy`      | Upload build ke EdgeOne                 |
| `edgeone associate project` | Hubungkan folder lokal ke project Pages |
| `edgeone -h`                | Tampilkan bantuan lengkap               |

---

## 7. Aturan untuk AI Agent

- ✅ Pastikan `edgeone.json` diperbarui jika ada penambahan binding KV baru.
- ❌ Jangan menghapus project Pages melalui CLI tanpa konfirmasi USER.
- ✅ Gunakan `edgeone pages dev` untuk memverifikasi behavior Edge Function secara lokal sebelum deploy.
