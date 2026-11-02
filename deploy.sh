#!/usr/bin/env bash
# ============================================================
#  SENZ SKIN SHOP — one-command deployment for a Linux server
#  usage: ./deploy.sh up | down | restart | logs | status |
#                      update | backup | restore <file> | seed |
#                      ssl <domain> <email> | help
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

DC="docker compose"
CMD="${1:-up}"

info()  { printf '\033[1;32m›\033[0m %s\n' "$*"; }
warn()  { printf '\033[1;33m!\033[0m %s\n' "$*"; }
error() { printf '\033[1;31m×\033[0m %s\n' "$*" >&2; }

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    error "Docker نصب نیست. ابتدا Docker را نصب کنید (README → پیش‌نیازهای سرور)."
    exit 1
  fi
  if ! docker compose version >/dev/null 2>&1; then
    error "Docker Compose v2 نصب نیست (docker compose)."
    exit 1
  fi
}

ensure_env() {
  if [ ! -f .env ]; then
    info "ساخت فایل .env از روی .env.example ..."
    cp .env.example .env
    local dbpass jwt
    dbpass=$(openssl rand -hex 16 2>/dev/null || head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
    jwt=$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | od -An -tx1 | tr -d ' \n')
    sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=${dbpass}|" .env
    sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${jwt}|" .env
    warn "فایل .env ساخته شد. رمز ادمین پیش‌فرض: ADMIN_PASSWORD داخل .env — حتماً آن را تغییر دهید."
  fi
}

wait_health() {
  local port
  port=$(grep -E '^HTTP_PORT=' .env | cut -d= -f2)
  port=${port:-80}
  info "در انتظار آماده شدن سرویس‌ها ..."
  for i in $(seq 1 60); do
    if curl -fsS "http://127.0.0.1:${port}/api/health" >/dev/null 2>&1; then
      info "سایت بالا آمد ✓"
      curl -fsS "http://127.0.0.1:${port}/api/health" || true
      echo
      return 0
    fi
    sleep 2
  done
  warn "سرویس در ۱۲۰ ثانیه پاسخ نداد. لاگ‌ها را ببینید: ./deploy.sh logs"
  $DC ps
}

case "$CMD" in
  up)
    require_docker
    ensure_env
    info "ساخت ایمیج‌ها و اجرای سرویس‌ها (postgres، api، web، nginx) ..."
    $DC up -d --build
    wait_health
    $DC ps
    ;;
  down)
    require_docker
    $DC down
    ;;
  restart)
    require_docker
    $DC restart
    $DC ps
    ;;
  logs)
    require_docker
    $DC logs -f --tail=200 "${2:-}"
    ;;
  status)
    require_docker
    $DC ps
    ;;
  update)
    require_docker
    if [ -d .git ]; then git pull --ff-only || warn "git pull انجام نشد؛ ادامه با وضعیت فعلی."; fi
    $DC up -d --build
    wait_health
    ;;
  backup)
    require_docker
    mkdir -p backups
    local_file="backups/senz-$(date +%Y%m%d-%H%M%S).sql.gz"
    set -a; . ./.env; set +a
    $DC exec -T db pg_dump -U "${POSTGRES_USER}" "${POSTGRES_DB}" | gzip > "$local_file"
    info "بکاپ ساخته شد: $local_file"
    ;;
  restore)
    require_docker
    [ -z "${2:-}" ] && { error "مسیر فایل بکاپ را بدهید: ./deploy.sh restore backups/xxx.sql.gz"; exit 1; }
    set -a; . ./.env; set +a
    gunzip -c "$2" | $DC exec -T db psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
    info "بکاپ بازگردانی شد."
    ;;
  seed)
    require_docker
    $DC exec api node src/seed.js
    ;;
  ssl)
    require_docker
    ./scripts/ssl-certbot.sh "${2:-senzskinshop.com}" "${3:-info@senzskinshop.com}"
    ;;
  shell)
    require_docker
    $DC exec "${2:-api}" sh
    ;;
  *)
    cat <<EOF
SENZ SKIN SHOP deploy helper

  ./deploy.sh up            ساخت و اجرای کامل سایت (پیش‌فرض)
  ./deploy.sh down          توقف سرویس‌ها
  ./deploy.sh restart       ری‌استارت سرویس‌ها
  ./deploy.sh status        وضعیت کانتینرها
  ./deploy.sh logs [svc]    مشاهده لاگ‌ها (api / web / nginx / db)
  ./deploy.sh update        دریافت آخرین تغییرات و build مجدد
  ./deploy.sh backup        بکاپ دیتابیس در پوشه backups/
  ./deploy.sh restore FILE  بازگردانی بکاپ
  ./deploy.sh ssl [domain] [email]   نصب/تمدید SSL رایگان با certbot
  ./deploy.sh seed          اجرای دوباره داده‌های نمونه
  ./deploy.sh shell [svc]   ورود به شل کانتینر
EOF
    ;;
esac
