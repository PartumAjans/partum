#!/usr/bin/env bash
# ============================================================================
# Partum Jarvis — VPS kurulum betiği (Ubuntu 22.04/24.04)
# `claude` kullanıcısı olarak, projenin kök dizininde çalıştır:
#   bash deploy/setup.sh
# ============================================================================
set -euo pipefail

echo "==> Node.js sürümü kontrol ediliyor..."
NEED_NODE=1
if command -v node >/dev/null 2>&1; then
  MAJOR="$(node -v | sed 's/v//' | cut -d. -f1)"
  if [ "${MAJOR:-0}" -ge 18 ]; then NEED_NODE=0; fi
fi

if [ "$NEED_NODE" -eq 1 ]; then
  echo "==> Node.js 20 kuruluyor (sudo parolası istenebilir)..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "    node $(node -v) / npm $(npm -v)"

echo "==> Bağımlılıklar kuruluyor..."
if [ -f package-lock.json ]; then npm ci; else npm install; fi

if [ ! -f .env.local ]; then
  echo "==> .env.local yok — .env.example'dan kopyalanıyor."
  cp .env.example .env.local
  # Rastgele bir AUTH_SECRET üret
  SECRET="$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)"
  sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=${SECRET}|" .env.local || true
  echo "    .env.local oluşturuldu. ANTHROPIC_API_KEY'i eklemeyi unutma!"
fi

echo "==> Üretim derlemesi (npm run build)..."
npm run build

echo ""
echo "============================================================"
echo " Kurulum tamam. Sırada:"
echo "  1) nano .env.local  → ANTHROPIC_API_KEY=... ekle (AI için)"
echo "  2) Servisi kur:  sudo bash deploy/install-service.sh"
echo "  3) Güvenlik duvarı:  sudo ufw allow 3000/tcp"
echo "  Panel:  http://SUNUCU-IP:3000"
echo "============================================================"
