#!/usr/bin/env bash
# ============================================================================
# Partum Jarvis — systemd servisini kurar ve başlatır.
# `sudo bash deploy/install-service.sh` şeklinde, proje kök dizininde çalıştır.
# Böylece Jarvis 7/24 çalışır; sunucu yeniden başlasa bile otomatik açılır.
# ============================================================================
set -euo pipefail

# Betiği çağıran gerçek kullanıcı (sudo altında bile)
RUN_USER="${SUDO_USER:-$(whoami)}"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
UNIT_SRC="${APP_DIR}/deploy/partum-jarvis.service"
UNIT_DST="/etc/systemd/system/partum-jarvis.service"
NPM_BIN="$(command -v npm || echo /usr/bin/npm)"

echo "==> Kullanıcı: ${RUN_USER}"
echo "==> Dizin:    ${APP_DIR}"
echo "==> npm:      ${NPM_BIN}"

# Yer tutucuları doldurup servis dosyasını yaz
sed -e "s|__USER__|${RUN_USER}|g" \
    -e "s|__DIR__|${APP_DIR}|g" \
    -e "s|/usr/bin/npm|${NPM_BIN}|g" \
    "${UNIT_SRC}" | sudo tee "${UNIT_DST}" >/dev/null

echo "==> systemd yeniden yükleniyor ve servis başlatılıyor..."
sudo systemctl daemon-reload
sudo systemctl enable partum-jarvis
sudo systemctl restart partum-jarvis

sleep 2
sudo systemctl --no-pager --full status partum-jarvis || true

echo ""
echo "============================================================"
echo " Servis kuruldu. Faydalı komutlar:"
echo "   Durum:   sudo systemctl status partum-jarvis"
echo "   Günlük:  sudo journalctl -u partum-jarvis -f"
echo "   Yeniden: sudo systemctl restart partum-jarvis"
echo " Güvenlik duvarı (bir kez):  sudo ufw allow 3000/tcp"
echo " Panel:   http://SUNUCU-IP:3000"
echo "============================================================"
