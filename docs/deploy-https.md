# HTTPS API GCL di AlmaLinux 8 dan Vercel

Alamat publik backend: `https://api.gymnasticcomplevel.com`. Semua route aplikasi tetap memakai awalan `/api`, misalnya `/api/videos`. Frontend di Vercel mengakses alamat tersebut melalui HTTPS.

Frontend dan Docker Compose memakai alamat produksi tersebut secara bawaan. Environment yang sudah terpasang tetap mengoverride nilai bawaan; ubah `NEXT_PUBLIC_API_URL` lama di Vercel dan redeploy agar browser berhenti memakai alamat HTTP lama.

Server menggunakan AlmaLinux 8.10, Nginx pada port 80/443, dan `/usr/bin/certbot`. Gunakan Nginx yang ada. Instruksi Caddy sebelumnya digantikan panduan ini. Jalankan sebagai root; perintah Docker Compose dijalankan dari folder `gls_fik`.

## 1. Pastikan backend siap

```sh
curl -i http://127.0.0.1:8088/api/health
```

Lanjut setelah HTTP 200. Jika container restart dengan `unknown time zone Asia/Jakarta`, Dockerfile perlu build flag `-tags timetzdata`:

```sh
cp -p backend/Dockerfile backend/Dockerfile.before-timezone-fix
sed -i 's/go build -ldflags=/go build -tags timetzdata -ldflags=/' backend/Dockerfile
docker compose up -d --build --no-deps backend
docker compose logs --tail=60 backend
```

Dockerfile repositori sudah menyertakan flag tersebut. Build menyematkan data zona waktu ke binary agar tersedia pada runtime Alpine.

## 2. DNS

Pada DNS Rumahweb, tambahkan record A `api.gymnasticcomplevel.com` ke IP VPS `202.155.17.85`. Domain utama dan `www` tetap ke Vercel. Jangan menambahkan AAAA jika IPv6 VPS belum dikonfigurasi.

```sh
getent ahostsv4 api.gymnasticcomplevel.com
```

Tunggu DNS publik mengarah ke VPS sebelum menerbitkan sertifikat. Pastikan TCP 80/443 diizinkan pada firewall penyedia VPS. `firewall-cmd` tidak tersedia pada server ini; tidak perlu memasang firewall baru.

## 3. Environment backend

Edit `.env` root proyek; pertahankan JWT, kredensial database, dan OAuth yang ada. Atur satu baris per key:

```dotenv
PUBLIC_API_URL=https://api.gymnasticcomplevel.com
FRONTEND_URL=https://gymnasticcomplevel.com,https://www.gymnasticcomplevel.com
```

`PUBLIC_API_URL` tidak memakai akhiran `/api`; backend menambahkannya pada URL thumbnail. Google client ID backend dan frontend harus sama. Port backend dibinding ke loopback agar Nginx menjadi pintu akses publik:

```sh
cp -p docker-compose.yml docker-compose.yml.before-https
sed -i 's/"8088:8080"/"127.0.0.1:8088:8080"/' docker-compose.yml
docker compose up -d --no-deps backend
```

Perubahan environment memerlukan recreate container, bukan hanya restart. Periksa lagi health setelah startup selesai. Jangan menjalankan `docker compose down -v` karena menghapus volume database.

## 4. Tambahkan virtual host HTTP

Backup konfigurasi Nginx:

```sh
cp -a /etc/nginx "/root/nginx-backup-$(date +%Y%m%d-%H%M%S)"
```

Template ada di `deploy/nginx-api.conf`. File itu adalah konfigurasi bootstrap HTTP untuk pemasangan pertama; setelah Certbot menambahkan HTTPS, jangan menimpa konfigurasi VPS dengan template lagi. Untuk membuatnya langsung di VPS:

```sh
cat > /etc/nginx/conf.d/gcl-api.conf <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name api.gymnasticcomplevel.com;

    location / {
        proxy_pass http://127.0.0.1:8088;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}
EOF
nginx -t && systemctl reload nginx
```

Jangan reload jika validasi gagal. Uji virtual host tanpa menunggu DNS resolver lokal:

```sh
curl -i -H 'Host: api.gymnasticcomplevel.com' http://127.0.0.1/api/health
```

Harus HTTP 200. Jika HTTP 502 sementara backend langsung HTTP 200, periksa log:

```sh
tail -n 40 /var/log/nginx/error.log
getenforce
```

Jika SELinux `Enforcing` dan log menyebut `Permission denied` saat koneksi upstream, izinkan koneksi jaringan reverse proxy lalu uji ulang:

```sh
setsebool -P httpd_can_network_connect 1
```

## 5. Terbitkan sertifikat dan aktifkan redirect

Setelah DNS publik benar dan HTTP port 80 dapat dijangkau dari luar VPS:

```sh
certbot --nginx --cert-name api.gymnasticcomplevel.com -d api.gymnasticcomplevel.com --redirect
```

Ikuti prompt email dan persetujuan layanan jika diminta. Plugin Nginx Certbot mengatur sertifikat dan redirect HTTP ke HTTPS. Jika plugin tidak tersedia, hentikan dan periksa `certbot plugins`; jangan mengganti instalasi Certbot yang dipakai domain lain tanpa memeriksa metode instalasinya.

```sh
nginx -t && systemctl reload nginx
curl -i https://api.gymnasticcomplevel.com/api/health
curl -sS -o /dev/null -w 'Videos HTTP %{http_code}\n' https://api.gymnasticcomplevel.com/api/videos
curl -sS -D - -o /dev/null -H 'Origin: https://gymnasticcomplevel.com' https://api.gymnasticcomplevel.com/api/health
```

Harus HTTP 200 dan header `Access-Control-Allow-Origin: https://gymnasticcomplevel.com` pada permintaan terakhir. Jangan memakai `curl -k`: sertifikat harus valid. Uji juga dari luar VPS.

## 6. Pembaruan sertifikat

```sh
certbot renew --cert-name api.gymnasticcomplevel.com --dry-run
systemctl list-timers --all | grep -i certbot
grep -R -nE 'certbot|letsencrypt' /etc/cron.d /etc/cron.daily /etc/crontab
```

Dry run harus sukses. Pastikan timer aktif atau cron yang sudah ada menjalankan `certbot renew` untuk sertifikat ini. Jika tidak ada penjadwalan, konfigurasi timer/cron diperlukan; dry run tidak membuat jadwal otomatis. Timer paket AlmaLinux sering bernama `certbot-renew.timer`; jika unit itu tersedia, aktifkan dengan `systemctl enable --now certbot-renew.timer`. Jangan membuat job duplikat jika renewal sudah terjadwal.

## 7. Vercel

Pada proyek frontend, buka Settings → Environment Variables. Ubah key yang sudah ada untuk Production:

```dotenv
NEXT_PUBLIC_API_URL=https://api.gymnasticcomplevel.com/api
```

Backend `PUBLIC_API_URL` memakai origin saja, sedangkan frontend `NEXT_PUBLIC_API_URL` memakai akhiran `/api`. Pertahankan `NEXT_PUBLIC_GOOGLE_CLIENT_ID` yang sesuai backend. JWT dan password database tetap di VPS.

Buka Deployments → deployment Production terbaru → Redeploy. Nonaktifkan Use existing Build Cache jika ditampilkan. Variabel `NEXT_PUBLIC_` masuk ke JavaScript saat build; jangan hanya mempromosikan build lama.

Subdomain `api` tidak perlu ditambahkan ke domain proyek Vercel. Origin login Google tetap domain frontend. Setelah deployment selesai, muat ulang situs dan periksa Network: request video harus menuju `https://api.gymnasticcomplevel.com/api/videos` dengan HTTP 200. Uji katalog, login, video member, tracker, dan thumbnail.

## Pemeliharaan backend

```sh
docker compose up -d --build --no-deps backend
docker compose logs --tail=60 backend
curl -i https://api.gymnasticcomplevel.com/api/health
```

DNS, file Nginx hasil Certbot, dan sertifikat tetap digunakan pada deployment backend berikutnya.

## Sumber

- [Go time/tzdata](https://pkg.go.dev/time/tzdata)
- [Nginx proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Certbot Nginx dan renewal](https://eff-certbot.readthedocs.io/en/stable/using.html)
- [Red Hat: Nginx reverse proxy dan SELinux](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/epub/deploying_different_types_of_servers/configuring-nginx-as-a-web-server-that-provides-different-content-for-different-domains_setting-up-and-configuring-nginx)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
