#!/usr/bin/env bash
# ============================================================
#  SENZ SKIN SHOP — نصب SSL رایگان (Let's Encrypt) روی AlmaLinux / Rocky
#  usage:  sudo ./scripts/ssl-certbot.sh [domain] [email]
#  example: sudo ./scripts/ssl-certbot.sh senzskinshop.com info@senzskinshop.com
#
#  پیش‌نیاز:
#    - دامنه (و www) به IP همین سرور وصل شده باشد (رکورد A)
#    - سایت با ./deploy.sh up بالا باشد (nginx روی پورت ۸۰)
#
#  این اسکریپت: certbot را نصب می‌کند، گواهی می‌گیرد، فایل‌ها را داخل
#  nginx/certs کپی می‌کند، بلاک HTTPS را فعال و ریدایرکت http→https را
#  روشن می‌کند، nginx را reload می‌کند و هوک تمدید خودکار می‌سازد.
#  اجرای دوباره‌ی اسکریپت بی‌خطر است (گواهی موجود تمدید نمی‌شود).
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_DIR="$PWD"
DOMAIN="${1:-senzskinshop.com}"
EMAIL="${2:-${EMAIL:-info@senzskinshop.com}}"
ALT_DOMAIN="www.${DOMAIN}"
WEBROOT="$REPO_DIR/nginx/acme"
CERTS="$REPO_DIR/nginx/certs"
CONF="$REPO_DIR/nginx/conf/default.conf"
SSL_CONF="$REPO_DIR/nginx/conf/ssl.conf"
LIVE_DIR="/etc/letsencrypt/live/$DOMAIN"
HOOK="/etc/letsencrypt/renewal-hooks/deploy/reload-senz.sh"

info()  { printf '\033[1;32m›\033[0m %s\n' "$*"; }
warn()  { printf '\033[1;33m!\033[0m %s\n' "$*"; }
error() { printf '\033[1;31m×\033[0m %s\n' "$*" >&2; }
die()   { error "$*"; exit 1; }

[ "$(id -u)" -eq 0 ] || die "این اسکریپت باید با sudo یا کاربر root اجرا شود:  sudo ./scripts/ssl-certbot.sh"

command -v docker >/dev/null 2>&1 || die "Docker نصب نیست. ابتدا scripts/install-docker-rhel.sh را اجرا کنید."
docker compose ps --status running --services 2>/dev/null | grep -qx nginx \
  || die "کانتینر nginx در حال اجرا نیست. اول  ./deploy.sh up  را اجرا کنید."

mkdir -p "$WEBROOT/.well-known/acme-challenge" "$CERTS"
chmod -R 755 "$WEBROOT" "$CERTS"

# ---------- ۱) نصب certbot ----------
if command -v certbot >/dev/null 2>&1; then
  info "certbot از قبل نصب است: $(certbot --version 2>&1)"
else
  info "نصب certbot با dnf ..."
  dnf -y install epel-release >/dev/null 2>&1 || warn "epel-release نصب نشد؛ ادامه می‌دهیم."
  dnf -y install certbot || die "نصب certbot ناموفق بود. دستی اجرا کنید: dnf -y install epel-release && dnf -y install certbot"
fi

# ---------- ۲) تست دسترسی HTTP و مسیر ACME ----------
info "بررسی دسترسی HTTP به دامنه و مسیر acme-challenge ..."
PROBE_TOKEN="senz-check-$(date +%s)"
printf '%s' "$PROBE_TOKEN" > "$WEBROOT/.well-known/acme-challenge/senz-test"
chmod 644 "$WEBROOT/.well-known/acme-challenge/senz-test"
PROBE_URL="http://${DOMAIN}/.well-known/acme-challenge/senz-test"
PROBE_BODY="$(curl -fsS --max-time 15 "$PROBE_URL" || true)"
rm -f "$WEBROOT/.well-known/acme-challenge/senz-test"

if [ "$PROBE_BODY" != "$PROBE_TOKEN" ]; then
  warn "تست webroot موفق نبود (پاسخ: '${PROBE_BODY:0:40}')."
  warn "بررسی کنید: رکورد A دامنه به IP این سرور اشاره کند، پورت ۸۰ باز باشد (firewall-cmd)، و nginx بالا باشد."
  warn "اگر از CDN/پروکسی (Cloudflare) استفاده می‌کنید، حالت SSL را روی Full (نه Flexible) بگذارید."
  read -rp "برای ادامه با همین شرایط ادامه دهم؟ [y/N] " ans
  [ "${ans:-N}" = "y" ] || [ "${ans:-N}" = "Y" ] || die "متوقف شد."
else
  info "دسترسی HTTP به دامنه تأیید شد."
fi

# ---------- ۳) صدور گواهی ----------
if [ -f "$LIVE_DIR/fullchain.pem" ]; then
  info "گواهی موجود است؛ تلاش برای تمدید در صورت نزدیک بودن انقضا ..."
  certbot certonly --webroot -w "$WEBROOT" -d "$DOMAIN" -d "$ALT_DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email --keep-until-expiring --non-interactive \
    || die "تمدید/صدور گواهی ناموفق بود."
else
  info "درخواست گواهی برای $DOMAIN و $ALT_DOMAIN ..."
  certbot certonly --webroot -w "$WEBROOT" -d "$DOMAIN" -d "$ALT_DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive \
    || die "صدور گواهی ناموفق بود. خروجی بالا را بررسی کنید (معمولاً DNS یا پورت ۸۰)."
fi

# ---------- ۴) کپی گواهی‌ها برای nginx ----------
info "کپی گواهی‌ها به nginx/certs ..."
install -m 644 "$LIVE_DIR/fullchain.pem" "$CERTS/fullchain.pem"
install -m 600 "$LIVE_DIR/privkey.pem"   "$CERTS/privkey.pem"
[ -f "$LIVE_DIR/chain.pem" ] && install -m 644 "$LIVE_DIR/chain.pem" "$CERTS/chain.pem"
# داخل کانتینر nginx با کاربر root اجرا می‌شود؛ 600 کافی است.
chmod 644 "$CERTS/privkey.pem"

# ---------- ۵) فعال‌سازی بلاک HTTPS ----------
info "فعال‌سازی بلاک HTTPS در nginx ..."
cat > "$SSL_CONF" <<EOF
# ساخته‌شده به‌صورت خودکار توسط scripts/ssl-certbot.sh — دستی ویرایش نکنید
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  http2 on;
  server_name ${DOMAIN} ${ALT_DOMAIN};

  ssl_certificate     /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers off;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 1d;

  add_header Strict-Transport-Security "max-age=31536000" always;
  client_max_body_size 12m;
  server_tokens off;

  location /.well-known/acme-challenge/ { root /var/www/acme; }
  include /etc/nginx/conf.d/senz-app.inc;
}
EOF

# ریدایرکت http → https را از حالت کامنت خارج کن (فقط یک‌بار)
if grep -q '^  # location / { return 301 https://\$host\$request_uri; }' "$CONF"; then
  sed -i 's|^  # location / { return 301 https://\$host\$request_uri; }|  location / { return 301 https://$host$request_uri; }|' "$CONF"
  info "ریدایرکت http→https فعال شد."
else
  info "ریدایرکت http→https از قبل فعال است."
fi

docker compose exec -T nginx nginx -t || die "پیکربندی nginx معتبر نیست. خروجی بالا را ببینید."
docker compose exec -T nginx nginx -s reload
info "nginx با موفقیت reload شد."

# ---------- ۶) هوک تمدید خودکار ----------
info "ساخت هوک تمدید خودکار: $HOOK"
mkdir -p "$(dirname "$HOOK")"
cat > "$HOOK" <<EOF
#!/usr/bin/env bash
# ساخته‌شده توسط scripts/ssl-certbot.sh — پس از هر تمدید موفق اجرا می‌شود
set -e
cd "${REPO_DIR}"
install -m 644 /etc/letsencrypt/live/${DOMAIN}/fullchain.pem nginx/certs/fullchain.pem
install -m 600 /etc/letsencrypt/live/${DOMAIN}/privkey.pem   nginx/certs/privkey.pem
chmod 644 nginx/certs/privkey.pem
docker compose exec -T nginx nginx -s reload
EOF
chmod +x "$HOOK"

# تایمر تمدید systemd (روی AlmaLinux با بسته certbot معمولاً خودکار است)
if systemctl list-timers --all 2>/dev/null | grep -q certbot; then
  info "تایمر تمدید خودکار certbot فعال است."
else
  warn "تایمر certbot پیدا نشد؛ یک cron ساده اضافه می‌کنیم."
  cat > /etc/cron.d/certbot-senz <<EOF
0 3 * * * root certbot renew --quiet --deploy-hook "${HOOK}"
EOF
  chmod 644 /etc/cron.d/certbot-senz
fi

info "تست تمدید (dry-run) ..."
certbot renew --dry-run --quiet && info "dry-run موفق بود." || warn "dry-run ناموفق بود؛ لاگ certbot را ببینید."

echo
info "SSL فعال شد ✅"
echo "   https://${DOMAIN}    و    https://${ALT_DOMAIN}"
echo "   گواهی‌ها: nginx/certs/{fullchain,privkey}.pem"
echo "   تمدید خودکار با certbot انجام می‌شود و هوک ${HOOK} nginx را reload می‌کند."
