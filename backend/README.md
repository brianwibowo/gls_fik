# GCL API

Backend untuk Gymnastics Competition Level (GCL), memakai Go dan PostgreSQL.

## Konfigurasi

Set environment berikut sebelum menjalankan `go run ./cmd/api`:

| Variabel | Keterangan |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Koneksi PostgreSQL. Default lokal: `localhost:5432`, user `mymac`, database `gls_fik_db`. |
| `JWT_SECRET` | Secret acak yang kuat untuk sesi. Wajib diisi; login gagal jika kosong. |
| `GOOGLE_CLIENT_ID` | OAuth client ID yang sama dengan `NEXT_PUBLIC_GOOGLE_CLIENT_ID` di frontend. Wajib untuk login Google. |
| `ADMIN_EMAILS` | Daftar email admin awal dipisahkan koma. Berlaku saat akun Google pertama kali dibuat. Login berikutnya mempertahankan role yang ditentukan admin. |
| `FRONTEND_URL` | Origin frontend tambahan untuk CORS, dipisahkan koma. |
| `PUBLIC_API_URL` | Origin backend publik, misalnya `https://api.example.com`, untuk URL thumbnail di balik proxy. Jika kosong, memakai origin request. |
| `PORT` | Port HTTP; default `8080`. |

Startup menjalankan migrasi, menormalkan email menjadi huruf kecil, menambahkan materi awal yang belum ada, dan menyalin checklist kurikulum ke tiap video satu kali. Perubahan materi/checklist dari admin dipertahankan. Akun demo beserta password bawaan tidak dibuat lagi. Admin awal masuk lewat Google dengan email pada `ADMIN_EMAILS`; akun lain otomatis menjadi `user` dan tampil pada manajemen user.

Password bawaan akun demo lama ditolak khusus pada ID akun seed tersebut. Akun tetap tersimpan, dapat masuk melalui Google terverifikasi, dan dapat memakai password baru yang secara eksplisit ditetapkan admin.

## Materi dan progres

- `GET /api/videos` dan `GET /api/videos/:id` menampilkan metadata. Sumber Drive video terkunci hanya tersedia pada metadata untuk admin.
- `GET /api/videos/:id/playback` tersedia untuk video gratis; video lain memerlukan sesi yang valid.
- `GET /api/videos/:id/thumbnail` mengambil gambar cuplikan dari Drive di server. URL thumbnail tidak membocorkan ID Drive. Admin dapat memilih URL thumbnail sendiri melalui field `thumbnail`; nilai kosong memakai cuplikan otomatis.
- `GET /api/videos/:id/tracker` mengambil checklist, status, catatan pribadi, dan persentase pemahaman akun yang masuk.
- `PUT /api/videos/:id/tracker/items/:itemId` menerima `{ "status": "pending|review|understood", "note": "..." }`.
- `PUT /api/videos/:id/tracker/note` menerima `{ "note": "..." }`.

Checklist dikelola bersama video melalui field `checklistItems: [{ "id": "...", "name": "..." }]`. Pertahankan ID ketika mengubah nama/urutan agar progres tetap terkait item yang sama. ID kosong membuat item baru; array kosong menghapus checklist. Maksimal 100 item per video, 500 karakter per nama, dan 2000 karakter per catatan. Persentase = jumlah item `understood` / jumlah item × 100.

JWT membuktikan sesi; role dan keberadaan akun diperiksa ulang dari database setiap request. Promosi/demosi berlaku juga pada token yang sudah diterbitkan. Progres pribadi terikat pada akun, video, dan ID checklist; endpoint tracker lama juga membatasi akses ke pemilik akun.

## Verifikasi

`go test ./...` menjalankan tes yang tidak membutuhkan database. Untuk tes integrasi lengkap, sediakan database PostgreSQL khusus pengujian:

```sh
TEST_DATABASE_URL='postgres://USER@127.0.0.1:PORT/TEST_DB?sslmode=disable' go test ./...
```

Tes membuat dan membersihkan schema tersendiri. Verifikasi Google dimock; pengujian tidak mengakses akun Google sungguhan. Cakupan meliputi login bersamaan, registrasi admin, promosi/demosi, pemisahan progres antar akun/video, validasi checklist, sumber video terkunci, proxy thumbnail, serta persistensi metadata saat startup ulang.
