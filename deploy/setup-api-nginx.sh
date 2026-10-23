#!/usr/bin/env bash
set -euo pipefail

gcl_wait_for_health() {
    local gcl_address="$1"
    shift
    local gcl_attempt
    for gcl_attempt in {1..10}; do
        if curl -fsS --max-time 5 "$@" "$gcl_address"; then
            echo
            return 0
        fi
        sleep 1
    done
    echo "BERHENTI: health belum siap setelah reload: $gcl_address" >&2
    return 1
}

if [ "$EUID" -ne 0 ]; then
    echo 'Jalankan sebagai root.'
    exit 1
fi

if ! curl -fsS --max-time 10 http://127.0.0.1:8088/api/health >/dev/null; then
    echo 'BERHENTI: backend lokal belum siap. Kirim hasil docker compose logs --tail=60 backend.'
    exit 1
fi

nginx -t
gcl_other_configs=$(grep -RlE --include='*.conf' '^[[:space:]]*server_name[[:space:]][^;]*api\.gymnasticcomplevel\.com([[:space:];]|$)' /etc/nginx/conf.d | grep -vFx '/etc/nginx/conf.d/gcl-api.conf' || true)
if [ -n "$gcl_other_configs" ]; then
    echo 'BERHENTI: domain API sudah diatur dalam file berikut. Kirim nama file ini agar tidak membuat virtual host ganda:'
    printf '%s\n' "$gcl_other_configs"
    exit 1
fi

gcl_backup="/root/nginx-backup-gcl-$(date +%Y%m%d-%H%M%S)"
cp -a /etc/nginx "$gcl_backup"
echo "Backup Nginx: $gcl_backup"

cat > /etc/nginx/conf.d/gcl-api.conf <<'NGINX'
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
NGINX

if command -v getenforce >/dev/null && [ "$(getenforce)" = 'Enforcing' ]; then
    setsebool -P httpd_can_network_connect 1
fi

nginx -t
systemctl reload nginx
gcl_wait_for_health http://127.0.0.1/api/health -H 'Host: api.gymnasticcomplevel.com'

certbot --nginx --cert-name api.gymnasticcomplevel.com -d api.gymnasticcomplevel.com --redirect --reinstall
nginx -t
systemctl reload nginx

gcl_wait_for_health https://api.gymnasticcomplevel.com/api/health
curl -fsS --max-time 20 -o /dev/null -w 'Videos HTTP %{http_code}\n' https://api.gymnasticcomplevel.com/api/videos
curl -fsS --max-time 20 -D - -o /dev/null -H 'Origin: https://gymnasticcomplevel.com' https://api.gymnasticcomplevel.com/api/health
echo 'HTTPS dan endpoint publik API berhasil diperiksa. Periksa header CORS di atas.'
