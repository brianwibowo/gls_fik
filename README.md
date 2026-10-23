# Gymnastics Competition Level (GCL)

Platform materi video senam artistik dengan akses gratis untuk video pilihan, login Google, tracker belajar pribadi, dan pengelolaan konten serta akun oleh admin.

## Menjalankan aplikasi

Frontend memakai Next.js 16 di `frontend/`; API Go dan PostgreSQL berada di `backend/`. Baca [konfigurasi backend](backend/README.md) untuk variabel database, autentikasi, dan perintah pengujian.

Konfigurasi frontend di `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=https://api.gymnasticcomplevel.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

`GOOGLE_CLIENT_ID` pada backend harus sama dengan client ID frontend. Daftarkan origin frontend yang digunakan pada pengaturan OAuth Google. `JWT_SECRET` wajib diatur, termasuk ketika menjalankan Docker Compose.

Alamat API bawaan adalah `https://api.gymnasticcomplevel.com/api`. Untuk memakai backend lokal saat pengembangan, override `NEXT_PUBLIC_API_URL=http://localhost:8088/api` di `frontend/.env.local`. Pada Vercel, gunakan alamat HTTPS produksi dan redeploy setelah mengubah environment. Ikuti [panduan HTTPS dan Vercel](docs/deploy-https.md) untuk konfigurasi VPS.

```sh
npm --prefix frontend install
npm run dev
```

Jalankan API terpisah mengikuti petunjuk backend atau gunakan `docker compose up --build` setelah konfigurasi environment tersedia. Login dan perubahan admin memerlukan API serta database aktif; aplikasi tidak membuat sesi atau menyimpan perubahan admin secara lokal ketika server gagal.

## Alur akun dan belajar

- Login Google yang terverifikasi menyimpan akun baru sebagai `user`. Email bootstrap pada `ADMIN_EMAILS` hanya menentukan admin ketika akun tersebut pertama kali dibuat.
- Admin melihat akun pada **Users & Roles** dan dapat mengangkat user menjadi admin. API memeriksa role terbaru dari database untuk setiap permintaan; tampilan akun diperbarui saat kembali ke tab dan berkala.
- Tamu dapat menonton materi gratis. Endpoint pemutaran memerlukan sesi valid untuk materi lainnya.
- Checklist memakai status **Belum dipelajari**, **Perlu diulang**, dan **Sudah dipahami**. Progres serta catatan disimpan berdasarkan akun, video, dan ID item checklist.
- Hasil analisis belajar dihitung dari checklist yang diisi pengguna. Ini bukan analisis gerakan otomatis dari video.

## Menambahkan video

Admin dapat mengatur judul, deskripsi sesuai isi materi, sumber Google Drive, status akses, dan daftar checklist untuk masing-masing video. Thumbnail otomatis mengikuti sumber video; admin dapat memberi URL gambar pengganti. Jika sumber tidak menyediakan gambar yang dapat diakses, aplikasi menampilkan placeholder yang jelas.

Perubahan metadata atau checklist yang disimpan admin dipertahankan setelah API dimulai ulang. Menambah video pada level yang sama tidak menggabungkan progresnya dengan video lain.

## Pemeriksaan

```sh
npm run lint
npm run build
```

Tes integrasi backend menggunakan database PostgreSQL khusus pengujian melalui `TEST_DATABASE_URL`; petunjuk lengkap ada pada README backend.
