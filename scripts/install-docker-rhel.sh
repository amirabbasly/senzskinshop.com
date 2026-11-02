#!/usr/bin/env bash
# ============================================================
#  نصب Docker Engine + Compose روی خانواده RHEL
#  AlmaLinux / Rocky Linux / CentOS Stream / RHEL 8-9-10
#  usage:  sudo bash scripts/install-docker-rhel.sh
# ============================================================
set -euo pipefail

info()  { printf '\033[1;32m›\033[0m %s\n' "$*"; }
warn()  { printf '\033[1;33m!\033[0m %s\n' "$*"; }
error() { printf '\033[1;31m×\033[0m %s\n' "$*" >&2; }

if [ "$(id -u)" -ne 0 ]; then
  error "این اسکریپت باید با کاربر root اجرا شود (sudo bash $0)."
  exit 1
fi

if ! command -v dnf >/dev/null 2>&1; then
  error "dnf پیدا نشد. این اسکریپت برای AlmaLinux/Rocky/CentOS/RHEL است."
  exit 1
fi

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  info "Docker از قبل نصب است:"
  docker --version
  docker compose version
  exit 0
fi

# shellcheck disable=SC1091
. /etc/os-release
info "سیستم شناسایی شد: ${PRETTY_NAME:-$ID $VERSION_ID}"

info "نصب بسته‌های پایه ..."
dnf -y install dnf-plugins-core curl ca-certificates

# حذف بسته‌های متعارض (Podman wrapper که دستور docker را اشغال می‌کند)
dnf -y remove podman-docker 2>/dev/null || true

info "افزودن مخزن رسمی Docker (سازگار با EL9) ..."
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

set +e
dnf -y install --allowerasing docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
STATUS=$?
set -e

if [ "$STATUS" -ne 0 ]; then
  warn "نصب از مخزن centos ناموفق بود؛ تلاش با مخزن rhel ..."
  dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
  dnf -y install --allowerasing docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

info "فعال‌سازی سرویس Docker ..."
systemctl enable --now docker

info "بررسی نصب:"
docker --version
docker compose version

info "تست اجرای کانتینر:"
docker run --rm hello-world >/dev/null && info "Docker سالم است ✓"

cat <<EOF

مرحله بعد:
  1) فایروال: firewall-cmd --permanent --add-service=http --add-service=https && firewall-cmd --reload
  2) SELinux را Enforcing بگذارید (پروژه با :z سازگار است)
  3) در پوشه پروژه: cp .env.example .env و مقادیر رمز را تنظیم کنید
  4) ./deploy.sh up
EOF
