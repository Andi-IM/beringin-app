# 📖 Panduan Pengguna - Beringin App

> **Status Dokumen**: ✅ Aktif (v1.1)
> **Terakhir Diperbarui**: 2026-02-11T16:50:00+07:00

Selamat datang di **Beringin**, aplikasi pembelajaran adaptif yang membantu Anda membangun pengetahuan yang **kokoh seperti pohon beringin**. Kami fokus pada _retensi jangka panjang_, bukan sekadar menghafal semalam.

---

## 🌳 Filosofi Beringin

Berbeda dengan aplikasi lain yang memberikan ilusi "penguasaan" (mastery), Beringin membedakan antara pengetahuan yang **Rapuh** (hanya ingat sebentar) dan **Stabil** (berakar kuat). Tujuan Anda adalah mengubah semua konsep menjadi **Stabil**.

---

## 🚀 Memulai

### 1. Akses Aplikasi

Buka aplikasi melalui browser Anda (secara default di `http://localhost:3000` untuk lingkungan lokal atau URL deployment produksi).

### 2. Registrasi & Login

Untuk menyimpan progres belajar Anda, Anda perlu masuk ke dalam akun.

- **Login dengan Google**:
  - Klik tombol **"Sign in with Google"** di halaman Login.
  - Pilih akun Google Anda.
  - Anda akan langsung diarahkan ke Dashboard.

- **Login dengan Email & Password**:
  - Jika belum punya akun, klik **"Daftar"** di halaman Login.
  - Masukkan email dan password pilihan Anda.
  - Setelah terdaftar, login menggunakan kredensial tersebut.

---

## 📊 Dashboard

Setelah login, Anda akan disambut oleh halaman Dashboard. Halaman ini memberikan ringkasan status pembelajaran Anda.

### Kartu Statistik

- **Total Konsep**: Jumlah seluruh materi yang tersedia untuk dipelajari.
- **Sudah Dipelajari**: Jumlah konsep yang sudah pernah Anda pelajari minimal satu kali.
- **Retensi**: Estimasi seberapa baik Anda mengingat materi yang sudah dipelajari.

### Status Konsep

Setiap kotak mewakili satu konsep pembelajaran dengan indikator warna status:

- **🆕 Baru**: Materi belum pernah dipelajari.
- **📈 Belajar (Learning)**: Materi sedang dalam tahap awal pembelajaran.
- **🏗️ Rapuh (Fragile)**: Materi sudah dipelajari tapi berisiko lupa jika tidak segera diulang.
- **🌳 Stabil (Stable)**: Materi sudah tertanam kuat (khas Beringin) dan dapat diingat dalam jangka panjang.
- **🍂 Lupa (Lapsed)**: Materi yang dulunya stabil namun gagal diingat saat review.

---

## 🧠 Sesi Belajar (Study Session)

Inti dari Beringin adalah Sesi Belajar.

### 1. Memulai Sesi

Klik tombol **"Mulai Sesi Belajar"** di Dashboard. Aplikasi akan secara otomatis memilih materi yang paling prioritas untuk Anda pelajari hari ini (berdasarkan jadwal review atau materi baru).

### 2. Menjawab Pertanyaan

- Aplikasi akan menampilkan pertanyaan atau konsep.
- Coba jawab dalam hati atau ucapkan jawaban Anda.
- Klik tombol **"Tampilkan Jawaban"** untuk melihat kunci jawaban.

### 3. Self-Grading (Penilaian Mandiri)

Setelah jawaban muncul, nilai pemahaman Anda sendiri secara jujur. Algoritma Beringin akan menggunakan nilai ini untuk menentukan kapan materi ini akan muncul lagi.

| Nilai     | Arti                                  | Konsekuensi                                                |
| :-------- | :------------------------------------ | :--------------------------------------------------------- |
| **Again** | **Lupa / Salah Total**                | Materi akan langsung diulang sebentar lagi dalam sesi ini. |
| **Hard**  | **Ingat tapi Susah Payah**            | Materi akan diulang dalam waktu dekat (misal: besok).      |
| **Good**  | **Ingat dengan Sedikit Usaha**        | Jeda pengulangan normal (misal: 3 hari lagi).              |
| **Easy**  | **Sangat Lancar / Hafal Luar Kepala** | Jeda pengulangan lama (misal: 7 hari lagi).                |

---

## 🛠️ Penanganan Kendala

Meskipun kami berusaha menjaga aplikasi tetap stabil, terkadang gangguan teknis bisa terjadi. Beringin dilengkapi dengan **Error Boundary** untuk memastikan satu masalah kecil tidak merusak seluruh pengalaman belajar Anda.

### Jika Muncul Pesan Error:

1. **Pesan "Waduh, ada masalah dikit..."**: Ini berarti terjadi kesalahan pada salah satu bagian layar.
   - Klik tombol **"Coba Lagi"** untuk mereset komponen tersebut.
   - Jika masih bermasalah, coba muat ulang (refresh) browser Anda.
2. **Sesi Belajar Terhenti**: Jangan khawatir, progres Anda biasanya sudah tersimpan secara otomatis setiap kali Anda menekan tombol penilaian (Again/Hard/Good/Easy).

---

## 🚪 Keluar (Logout)

Untuk keluar dari akun, klik tombol **"Logout"** di pojok kanan atas Dashboard. Pastikan progres Anda sudah tersimpan (penyimpanan otomatis dilakukan setiap kali Anda menyelesaikan penilaian kartu).

---

> **Catatan**: Aplikasi ini masih dalam tahap pengembangan (Beta). Fitur-fitur baru seperti pengaturan profil dan mode gelap akan segera hadir!

---

## 📝 Riwayat Perubahan

| Versi    | Tanggal    | Deskripsi Perubahan                                                                              |
| :------- | :--------- | :----------------------------------------------------------------------------------------------- |
| **v1.1** | 2026-02-11 | Penambahan section "Penanganan Kendala" (Error Boundary) dan sinkronisasi status fitur terbaru.  |
| **v1.0** | 2026-02-11 | Rilis awal dokumen untuk MVP Phase 1 (Foundation). Mencakup Login, Dashboard, dan Study Session. |
