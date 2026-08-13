# Partum Jarvis — VPS'te 7/24 Kurulum (Sıfırdan)

Bu rehber, **Partum Jarvis panelini** (sesli asistan + komuta merkezi) bir
Hostinger VPS üzerinde 7/24 çalışır hale getirir. Laptopun kapalı olsa bile
Jarvis ayakta kalır ve **telefon tarayıcısından** `http://SUNUCU-IP:3000`
adresiyle her yerden erişirsin.

> **Not:** Elimizdeki Jarvis bir **web uygulaması** (sesli mod + dashboard).
> O yüzden terminalde tmux ile Claude Code çalıştırmak yerine, uygulamayı bir
> **systemd servisi** olarak kuruyoruz — sunucu yeniden başlasa bile Jarvis
> otomatik açılır, tmux'a gerek kalmaz.

---

## Gerekenler

- **Hostinger VPS** — KVM2 önerilir (8 GB RAM, 2 çekirdek). İşletim sistemi:
  **Ubuntu 22.04 veya 24.04**. (Rehberdeki "Ubuntu + Claude Code" şablonu da
  olur; biz Node.js'i kendimiz kuracağız.)
- **Anthropic API anahtarı** (AI için) — [console.anthropic.com](https://console.anthropic.com).
  Olmasa da panel "temel mod"da çalışır; sesli asistanın tam beyni için önerilir.
- Telefonuna **Termius** (opsiyonel, SSH için) — panele erişim için gerekmez,
  sadece sunucuyu yönetmek istersen.
- ~30 dakika.

---

## ADIM 1 — Sunucuya bağlan

1. Hostinger **hPanel → VPS → Browser terminal** ile tarayıcıdan bağlan.
2. `root` ve VPS kurulumunda belirlediğin parolayla giriş yap.
   (Parola yazarken ekranda hiçbir şey görünmez — normaldir.)

## ADIM 2 — Güvenliği sağlamlaştır (root iken)

```bash
# 1) Günlük iş için ayrı kullanıcı (root'u sürekli kullanma)
adduser claude                 # güçlü parola belirle ve NOT ET
usermod -aG sudo claude        # yönetici yetkisi

# 2) Güvenlik duvarı: SSH + panel portu
ufw allow OpenSSH
ufw allow 3000/tcp             # panelin çalışacağı port
ufw enable                     # "devam?" sorarsa: y

# 3) Saldırı engelleyici
apt update && apt install -y git fail2ban

# 4) Yeni kullanıcıya geç
su - claude
```

## ADIM 3 — Kodu sunucuya getir (`claude` kullanıcısı iken)

**Depo herkese açıksa:**

```bash
git clone https://github.com/PartumAjans/partum.git
cd partum
```

**Depo gizliyse** — GitHub'da bir **Personal Access Token** oluştur
(Settings → Developer settings → Fine-grained token, sadece bu repoya `Contents: Read`),
sonra:

```bash
git clone https://<TOKEN>@github.com/PartumAjans/partum.git
cd partum
```

> Alternatif: bilgisayarından `scp -r ./partum claude@SUNUCU-IP:~/` ile de
> yükleyebilirsin.

## ADIM 4 — Kur ve derle

```bash
bash deploy/setup.sh
```

Bu betik: Node.js 20'yi kurar, bağımlılıkları yükler, `.env.local`'i
`.env.example`'dan oluşturup rastgele bir `AUTH_SECRET` üretir ve üretim
derlemesini yapar.

Sonra **API anahtarını ekle**:

```bash
nano .env.local
```

Şu satırları düzenle (en azından ANTHROPIC_API_KEY):

```
DEMO_MODE=true                 # hızlı başlangıç; gerçek veri için false + Supabase/Meta
ANTHROPIC_API_KEY=sk-ant-...   # sesli asistanın beyni
ANTHROPIC_MODEL=claude-sonnet-5
```

`Ctrl+O`, `Enter`, `Ctrl+X` ile kaydet.

## ADIM 5 — 7/24 servis olarak başlat

```bash
sudo bash deploy/install-service.sh
```

Bu, uygulamayı bir **systemd servisi** yapar: arka planda çalışır, çökerse
yeniden başlar, sunucu reboot olsa bile otomatik açılır.

Faydalı komutlar:

```bash
sudo systemctl status partum-jarvis      # durum
sudo journalctl -u partum-jarvis -f       # canlı günlük
sudo systemctl restart partum-jarvis      # yeniden başlat
```

## ADIM 6 — Eriş

- **Bilgisayar/telefon tarayıcısı:** `http://SUNUCU-IP:3000`
  (IP'yi Hostinger panelinde görürsün.)
- Demo girişleri: `admin@partum.com` / `admin123` (yönetici → Jarvis).

> **Sesli mod uyarısı (önemli):** Tarayıcının mikrofon/ses özellikleri
> genelde yalnızca **HTTPS** veya `localhost` üzerinde çalışır. Düz
> `http://IP:3000`'de yazılı sohbet sorunsuz çalışır ama **"Hey Jarvis" sesli
> mod çalışmayabilir.** Sesi de istiyorsan ADIM 7'deki alan adı + HTTPS
> kurulumunu yap.

---

## ADIM 7 (Önerilen) — Alan adı + HTTPS (sesli mod ve güvenlik için)

Bir alan adın varsa (örn. `jarvis.partumajans.com`), onu sunucunun IP'sine
yönlendir (DNS **A kaydı**), sonra Nginx + ücretsiz Let's Encrypt sertifikası:

```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/partum >/dev/null <<'NGINX'
server {
    server_name jarvis.partumajans.com;   # kendi alan adın
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/partum /etc/nginx/sites-enabled/partum
sudo nginx -t && sudo systemctl reload nginx

# HTTPS sertifikası
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jarvis.partumajans.com

# Artık 80/443 açık olmalı, 3000'i dışarıya kapatabilirsin
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 3000/tcp
```

Bittiğinde `https://jarvis.partumajans.com` üzerinden **sesli mod dahil** her
şey çalışır.

---

## Güncelleme (yeni sürüm çıktığında)

```bash
cd ~/partum
git pull
npm ci
npm run build
sudo systemctl restart partum-jarvis
```

---

## Sık sorunlar

| Sorun | Çözüm |
| --- | --- |
| Panel açılmıyor | `sudo journalctl -u partum-jarvis -f` ile günlüğe bak; genelde `.env.local` veya port. |
| Port 3000 erişilemez | `sudo ufw allow 3000/tcp` çalıştırdın mı? Hostinger panelinde ekstra firewall var mı? |
| "Hey Jarvis" sesli mod yok | HTTP'de mikrofon kısıtlı — ADIM 7 ile HTTPS kur. |
| `node`/`npm` bulunamadı | `bash deploy/setup.sh` tekrar; NodeSource 20 kurar. |
| AI cevap vermiyor, "temel mod" yazıyor | `.env.local` içine `ANTHROPIC_API_KEY` ekle, `restart`. |
| Sunucu reboot sonrası kapalı | Servis `enable` edilmiş olmalı; `sudo systemctl enable partum-jarvis`. |

---

## Özet akış

```
VPS al (KVM2, Ubuntu)  →  bağlan  →  güvenlik (claude+ufw+fail2ban)
   →  git clone  →  bash deploy/setup.sh  →  .env.local'e API anahtarı
   →  sudo bash deploy/install-service.sh  →  http://IP:3000
   →  (opsiyonel) alan adı + HTTPS  →  sesli mod her yerden 7/24
```
