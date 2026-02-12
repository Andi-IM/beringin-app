# 🧪 Test Flows - Beringin

> **Status**: ✅ Active (v1.6 - Debugging Findings)
> **Based on**: `USER_GUIDE.md` (v1.4 - Action Oriented)
> **Tujuan**: Memastikan aplikasi memenuhi janji "Brutal Honesty" dan "Stability" bagi pengguna.

Dokumen ini berisi **Checklist Validasi Manual** yang harus dijalankan sebelum rilis update baru.

## 🛠️ Pre-flight Checklist (Wajib)

_Environment Check_ berdasarkan debugging (12/Feb/2026):

- [ ] **Config**: `edgeone.json` sudah mengandung: `"functions": "edge-functions"`.
- [ ] **Server**: `edgeone pages dev` berjalan di port **8088**.
- [ ] **Env**: `NEXT_PUBLIC_APP_URL` di `.env.local` menunjuk ke `http://localhost:8088`.
- [ ] **API**: Endpoint `/edge-api/concept` merespon (bukan 404).

---

## 🏁 Skenario 1: Day 1 Experience (Inisialisasi)

_Target: Memastikan pengguna baru bisa masuk dan melihat kondisi "kosong" yang benar tanpa crash._

| #   | Langkah                   | Ekspektasi (Validasi)                                                           | Status  |
| --- | ------------------------- | ------------------------------------------------------------------------------- | ------- |
| 1.1 | Buka Aplikasi             | Halaman Login muncul. Tidak ada redirect aneh.                                  | ✅ Pass |
| 1.2 | Login (Google/Email)      | Berhasil masuk. Redirect ke `/dashboard`.                                       | ✅ Pass |
| 1.3 | **Cek Dashboard**         | Grid Konsep terlihat. Status mayoritas (atau semua) **Abu-abu (Baru)**.         | ✅ Pass |
| 1.4 | Klik "Mulai Sesi Belajar" | Masuk ke tampilan kartu/pertanyaan pertama.                                     | ⏭️ Skip |
| 1.5 | **Validasi Isi**          | Pertanyaan muncul. Tombol "Tampilkan Jawaban" ada.                              | ⏭️ Skip |
| 1.6 | Jawab & Nilai (Day 1)     | Pilih "Hard" atau "Again".                                                      | ⏭️ Skip |
| 1.7 | Redirect post-study       | Kembali ke Dashboard/Next Card. Status kartu berubah warna (cth: Kuning/Rapuh). | ⏭️ Skip |

---

## 🔄 Skenario 2: The Daily Grind (Rutinitas Harian)

_Target: Memastikan algoritma Spaced Repetition bekerja dan Dashboard jujur._

| #   | Langkah                 | Ekspektasi (Validasi)                                             | Status |
| --- | ----------------------- | ----------------------------------------------------------------- | ------ |
| 2.1 | Cek Dashboard           | Indikator warna sesuai database (database seed/previous session). |        |
| 2.2 | Identifikasi Prioritas  | Pastikan ada materi **Kuning (Rapuh)** atau **Merah (Lapsed)**.   |        |
| 2.3 | **Eksekusi Sesi**       | Klik "Mulai Sesi Belajar". Materi "Rapuh" muncul duluan.          |        |
| 2.4 | **Active Recall Check** | User tidak bisa melihat jawaban sebelum klik tombol.              |        |
| 2.5 | Grading: **"Again"**    | Kartu yang sama muncul lagi di akhir sesi (short-term queue).     |        |
| 2.6 | Grading: **"Good"**     | Kartu hilang dari antrian hari ini (dijadwalkan besok/lusa).      |        |
| 2.7 | Selesai Sesi            | Dashboard terupdate. Jumlah "Rapuh" berkurang.                    |        |

---

## 🛠️ Skenario 3: Content Management (Studio)

_Target: Memastikan User bisa menambah materi mandiri (walau terbatas)._

| #   | Langkah              | Ekspektasi (Validasi)                                                                                                                                                  | Status   |
| --- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 3.1 | Akses `/studio`      | Halaman "Knowledge Studio" terbuka. List Concepts muncul.                                                                                                              | ✅ Pass  |
| 3.2 | Klik "New Concept"   | Form pembuatan konsep muncul.                                                                                                                                          | ✅ Pass  |
| 3.3 | Input Data           | Isi Title, Deskripsi, Kategori.                                                                                                                                        | ✅ Pass  |
| 3.4 | Submit               | Redirect ke List. Data baru muncul di tabel.                                                                                                                           | ❌ Fail  |
| 3.5 | **Validasi Data**    | Buka database/Dashboard, pastikan konsep baru ada (status "Baru").                                                                                                     | ⛔ Block |
| 3.6 | **Known Limitation** | _Pertanyaan untuk konsep ini belum bisa dibuat di UI._ (Verifikasi tidak ada error saat konsep tanpa pertanyaan dimuat di sesi belajar - harusnya skip atau fallback). | ⏭️ Skip  |
| 3.7 | _Troubleshooting_    | Jika 500/404, cek console browser. Pastikan `edgeone.json` benar & server restart.                                                                                     | ℹ️ Note  |

---

---

## 🔒 Skenario 4: Data Privacy & Isolation (Studio Refactor)

_Target: Memastikan data antar user benar-benar terpisah (Multi-tenancy logic)._

| #   | Langkah                  | Ekspektasi (Validasi)                                                    | Status  |
| --- | ------------------------ | ------------------------------------------------------------------------ | ------- |
| 4.1 | Login User A             | Buat Konsep unik "Rahasia A" di `/studio`.                               | ⛔ Pend |
| 4.2 | Logout & Login User B    | Masuk dengan akun berbeda (User B).                                      | ⛔ Pend |
| 4.3 | **Cek List Studio**      | Konsep "Rahasia A" **TIDAK BOLEH** muncul di list `/studio` User B.      | ⛔ Pend |
| 4.4 | **Cek Dashboard**        | Konsep "Rahasia A" **TIDAK BOLEH** muncul di grid belajar User B.        | ⛔ Pend |
| 4.5 | Akses URL Langsung (Opt) | User B akses URL detail konsep A (jika tahu ID). Harusnya 404/Forbidden. | ⛔ Pend |

---

## 🚨 Skenario 5: Resilience (Kondisi Darurat)

_Target: Memastikan data aman meski koneksi putus atau user logout paksa._

| #   | Langkah                     | Ekspektasi (Validasi)                                                                                | Status  |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| 5.1 | Sedang Belajar (Kartu 3/10) | Jawab & Nilai kartu ke-3.                                                                            | ⏭️ Skip |
| 5.2 | Force Close / Refresh       | Browser ditutup atau di-refresh paksa.                                                               | ⏭️ Skip |
| 5.3 | Buka Kembali                | Progress kartu 1-3 **Tersimpan**. Belajar lanjut dari kartu 4 (atau 1 tapi status 1-3 sudah update). | ⏭️ Skip |
| 5.4 | Trigger Error (Opsional)    | Jika ada glitch, layar Error Boundary muncul ("Coba Lagi").                                          | ⏭️ Skip |

---

## ✅ Kriteria Lulus Rilis

- [ ] Skenario 1 (Login) Sukses 100%.
- [ ] Skenario 2 (Algoritma) Sukses (Status berubah sesuai tombol).
- [ ] Skenario 3 (Studio) Sukses (Create Concept berhasil).
- [ ] **Skenario 4 (Privacy)** Sukses (Data User A tidak bocor ke User B).
- [ ] Tidak ada "White Screen of Death" (Blank page).
- [ ] Data tidak hilang setelah refresh (Scenario 5).
