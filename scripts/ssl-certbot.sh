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

# بلاک HTTP باید فقط acme-challenge + ریدایرکت باشد؛ چون senz-app.inc
# خودش "location /" دارد و اگر کنار ریدایرکت include شود nginx خطای
# "duplicate location /" می‌دهد. پس include را در بلاک HTTP کامنت می‌کنیم.
BACKUP="$CONF.bak-$(date +%Y%m%d-%H%M%S)"
cp "$CONF" "$BACKUP"
info "پشتیبان کانفیگ: $BACKUP"

python3 - "$CONF" <<'PYEOF'
import sys

path = sys.argv[1]
lines = open(path, encoding='utf-8').read().splitlines()

marker = next((i for i, l in enumerate(lines) if l.startswith('# ---------- HTTPS')), len(lines))
start = next(i for i, l in enumerate(lines[:marker]) if l.strip() == 'server {')

depth, end = 0, None
for i in range(start, marker):
    depth += lines[i].count('{') - lines[i].count('}')
    if depth == 0 and i > start:
        end = i
        break
if end is None:
    raise SystemExit('could not locate the HTTP server block')

REDIRECT = 'location / { return 301 https://$host$request_uri; }'
has_redirect = False

for i in range(start, end + 1):
    stripped = lines[i].strip()
    if stripped.startswith('#') and 'location / {' in stripped and 'return 301' in stripped:
        lines[i] = '  ' + REDIRECT
        has_redirect = True
    elif stripped.startswith('location / {') and 'return 301' in stripped:
        has_redirect = True
    if stripped.startswith('include /etc/nginx/conf.d/senz-app.inc;'):
        lines[i] = '  # include /etc/nginx/conf.d/senz-app.inc;  # SSL فعال است: HTTP فقط ریدایرکت می‌کند'

if not has_redirect:
    lines.insert(end, '  # هدایت همه ترافیک HTTP به HTTPS')
    lines.insert(end + 1, '  ' + REDIRECT)

open(path, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('http block prepared')
PYEOF'
import re, sys

path = sys.argv[1]
text = open(path, encoding='utf-8').read()
marker = '# ---------- HTTPS'
head, sep, tail = text.partition(marker)
if not sep:
    head, sep, tail = text, '', ''

redirect = 'location / { return 301 https://$host$request_uri; }'

# ۱) include اپ در بلاک HTTP غیرفعال شود
head = re.sub(
    r'(?m)^(\s*)include /etc/nginx/conf\.d/senz-app\.inc;[^\n]*$',
    r'\1# include /etc/nginx/conf.d/senz-app.inc;  # SSL فعال است: HTTP فقط ریدایرکت می‌کند',
    head,
    count=1,
)

# ۲) ریدایرکت http→https فعال شود (از کامنت خارج یا اضافه شود)
if 'return 301 https://$host$request_uri;' not in head:
    head = re.sub(
        r'(?m)^\s*#\s*location / \{ return 301 https://\$host\$request_uri; \}\s*$',
        '  ' + redirect,
        head,
        count=1,
    )
if 'return 301 https://$host$request_uri;' not in head:
    idx = head.rstrip().rfind('}')
    head = head[:idx].rstrip('\n') + '\n\n  # هدایت همه ترافیک HTTP به HTTPS\n  ' + redirect + '\n' + head[idx:]

open(path, 'w', encoding='utf-8').write(head + sep + tail)
print('http block prepared')
PYEOF

if ! docker compose exec -T nginx nginx -t; then
  warn "پیکربندی نامعتبر بود؛ بازگردانی تنظیمات قبلی ..."
  cp "$BACKUP" "$CONF"
  rm -f "$SSL_CONF"
  docker compose exec -T nginx nginx -s reload >/dev/null 2>&1 || true
  die "فعال‌سازی HTTPS انجام نشد و تنظیمات قبلی برگردانده شد. سایت روی HTTP سالم است."
fi

docker compose exec -T nginx nginx -s reload
info "nginx با موفقیت reload شد."
info "ریدایرکت http→https فعال شد."

# ---------- ۵.۱) بررسی نهایی HTTPS ----------
sleep 1
HTTPS_CODE="$(curl -fsS -o /dev/null -m 15 -w '%{http_code}' "https://${DOMAIN}" 2>/dev/null || true)"
if [ "$HTTPS_CODE" = "200" ]; then
  info "https://${DOMAIN} با موفقیت پاسخ ۲۰۰ داد."
else
  warn "بررسی HTTPS پاسخ '${HTTPS_CODE:-نامشخص}' داد؛ چند لحظه بعد با curl -I https://${DOMAIN} دوباره چک کنید."
fi

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

# تایمر تمدید systemd — بسته certbot روی EL9 تایمر را نصب می‌کند
# ولی به‌صورت پیش‌فرض استارت نمی‌کند، پس صریحاً فعالش می‌کنیم.
if systemctl list-unit-files 2>/dev/null | grep -q '^certbot-renew.timer'; then
  systemctl enable --now certbot-renew.timer >/dev/null 2>&1 || warn "فعال‌سازی certbot-renew.timer ناموفق بود."
  if systemctl is-active --quiet certbot-renew.timer; then
    info "تایمر تمدید خودکار certbot فعال است (certbot-renew.timer)."
  else
    warn "تایمر certbot فعال نشد؛ از cron استفاده می‌کنیم."
    printf '0 3 * * * root certbot renew --quiet --deploy-hook "%s"\n' "$HOOK" > /etc/cron.d/certbot-senz
    chmod 644 /etc/cron.d/certbot-senz
  fi
else
  warn "تایمر certbot پیدا نشد؛ یک cron ساده اضافه می‌کنیم."
  printf '0 3 * * * root certbot renew --quiet --deploy-hook "%s"\n' "$HOOK" > /etc/cron.d/certbot-senz
  chmod 644 /etc/cron.d/certbot-senz
fi

info "تست تمدید (dry-run) ..."
certbot renew --dry-run --quiet && info "dry-run موفق بود." || warn "dry-run ناموفق بود؛ لاگ certbot را ببینید."

echo
info "SSL فعال شد ✅"
echo "   https://${DOMAIN}    و    https://${ALT_DOMAIN}"
echo "   گواهی‌ها: nginx/certs/{fullchain,privkey}.pem"
echo "   تمدید خودکار با certbot انجام می‌شود و هوک ${HOOK} nginx را reload می‌کند."
