# Partum Panel — Müşteri Reklam Raporlama Paneli

Partum Ajans'ın müşterileri için Meta (Facebook/Instagram) reklam raporlama
paneli. Müşteriler kendi bilgileriyle giriş yapar ve **yalnızca kendi reklam
hesaplarına** ait raporları görür. Reklam verisine erişim ajans tarafından
merkezi olarak (Meta System User token) sağlanır; müşteri hiçbir şey bağlamaz.

## Özellikler

- 🔐 Giriş sistemi (demo modu + üretim için Supabase)
- 📊 **Temel performans:** harcama, gösterim, tıklama, erişim, CTR, CPC, CPM, frekans
- 🎯 **Dönüşüm metrikleri:** dönüşüm sayısı, dönüşüm değeri, CPA, ROAS
- 📈 **Grafik & trend:** tarih aralığına göre zaman serisi grafiği
- 📋 **Kampanya kırılımı:** kampanya bazında detaylı tablo
- 🗓️ Tarih aralığı seçimi (hazır aralıklar + özel tarih)
- 👤 **Yönetici paneli:** müşterileri reklam hesaplarına eşleme + rapor önizleme
- 🤖 **Jarvis komuta merkezi:** tüm ajans işlerini tek ekranda toplayan AI asistan
- 🧩 Büyütmeye uygun mimari (yeni metrik/sayfa eklemek kolay)

## 🤖 Jarvis — Ajans Komuta Merkezi

Yönetici olarak giriş yaptığında karşına **Jarvis** çıkar (`/jarvis`): ajansın
genel durumunu tek ekranda gösteren bir komuta merkezi + doğal dille
konuşabileceğin bir AI asistan.

**Neler yapar:**

- 📊 **Özet şerit:** toplam 7 günlük harcama, ortalama ROAS, riskli müşteri
  sayısı, açık görev sayısı
- 🚦 **Müşteri sağlık kartları:** her müşteri için son 7 günün ROAS'ına göre
  ok / izle / risk sinyali; riskliler en üstte
- ✅ **Görev tahtası:** yapılacakları ekle/tamamla/sil
- 💬 **AI sohbet (Jarvis):** "müşteri durumu", "Örnek Mağaza raporu",
  "şunu görev olarak ekle", "Köşe Kafe'ye haftalık özet WhatsApp taslağı yaz"
  gibi isteklerde araçları otomatik kullanır
- 🎙️ **Sesli mod ("Hey Jarvis"):** tarayıcının yerel ses motoruyla (Web Speech
  API) sesli konuşma — "Hey Jarvis" de, uyansın; sesli komut ver, sesli cevap
  alsın. Ek servis/anahtar gerekmez; **Chrome/Edge** önerilir (yazarak her
  tarayıcıda çalışır). Mikrofon izni istenir. 🎙️ düğmesi = bas-konuş.

**İki çalışma modu:**

| Mod | Koşul | Davranış |
| --- | --- | --- |
| **AI aktif** | `ANTHROPIC_API_KEY` tanımlı | Claude ile serbest sohbet + akıllı araç kullanımı + mesaj taslakları |
| **Temel mod** | anahtar yok | Rapor/görev/müşteri özeti komutları yine çalışır (kural tabanlı) |

Anahtarı [console.anthropic.com](https://console.anthropic.com)'dan alıp
`.env.local` içine `ANTHROPIC_API_KEY` olarak girmen yeterli. Model
`ANTHROPIC_MODEL` ile değiştirilebilir (varsayılan `claude-sonnet-5`).

> **Güvenlik notu:** WhatsApp/e-posta araçları şimdilik yalnızca **taslak**
> üretir — hiçbir şey otomatik gönderilmez. Gerçek gönderim ve video editi gibi
> yetenekler sonraki fazda "connector" olarak eklenecek şekilde tasarlandı.

## Teknoloji

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (arayüz)
- **Recharts** (grafikler)
- **Meta Marketing API** (Graph API) — reklam verisi
- **Supabase** (üretimde kullanıcı yönetimi + veritabanı)

## Hızlı Başlangıç (Demo)

Supabase veya Meta hesabı gerekmeden paneli hemen görmek için:

```bash
npm install
cp .env.example .env.local   # DEMO_MODE=true (varsayılan) yeterli
npm run dev
```

Tarayıcıda http://localhost:3000 açın.

**Demo girişleri:**

| Rol      | E-posta             | Parola      |
| -------- | ------------------- | ----------- |
| Müşteri  | musteri@ornek.com   | musteri123  |
| Müşteri  | kafe@ornek.com      | kafe123     |
| Yönetici | admin@partum.com    | admin123    |

Demo modunda tüm veriler örnektir (gerçek Meta verisi değildir) ve eşleştirmeler
kalıcı kaydedilmez.

## Üretime Geçiş (Gerçek Veri)

### 1. Meta Marketing API token'ı

1. [Meta for Developers](https://developers.facebook.com/)'da bir uygulama
   oluşturun ve **Marketing API** ürününü ekleyin.
2. **Business Manager > İş Ayarları > Kullanıcılar > Sistem Kullanıcıları**
   altında bir System User oluşturun.
3. Bu System User'a, yönettiğiniz müşteri **reklam hesaplarına** erişim verin.
4. `ads_read` izniyle **kalıcı bir token** üretin.
5. Token'ı `.env.local` içine `META_ACCESS_TOKEN` olarak girin.

### 2. Supabase

1. [supabase.com](https://supabase.com)'da ücretsiz bir proje açın.
2. **SQL Editor**'da `supabase/schema.sql` dosyasını çalıştırın.
3. Proje ayarlarından URL ve anahtarları `.env.local`'e girin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Authentication > Users**'tan kendinizi ekleyin, sonra SQL ile yönetici
   yapın:
   ```sql
   update public.profiles set role='admin' where email='siz@ajans.com';
   ```

### 3. Ortamı üretim moduna alın

`.env.local` içinde:

```
DEMO_MODE=false
AUTH_SECRET=<openssl rand -base64 32 ile üretin>
```

### 4. Müşteri ekleme akışı

1. Müşteri için Supabase'de kullanıcı oluşturun (veya müşteri kaydolsun).
2. Yönetici olarak panele girin → **Müşteri Yönetimi**.
3. Müşterinin reklam hesabı ID'sini (`act_...`) girip kaydedin.
4. Müşteri giriş yaptığında yalnızca kendi raporunu görür.

## Dağıtım (Deploy)

**Vercel** (en hızlı):

```bash
npm i -g vercel
vercel
```

Ortam değişkenlerini Vercel proje ayarlarından ekleyin (`.env.local`'deki
değerler). `DEMO_MODE=false` yapmayı unutmayın.

**VPS'te 7/24 (Hostinger vb.):** Jarvis'i hiç kapanmayan bir sunucuda çalıştırıp
telefondan erişmek için sıfırdan adım adım rehber → **[DEPLOY.md](DEPLOY.md)**.
Hazır betikler: `deploy/setup.sh` (kur + derle) ve `deploy/install-service.sh`
(systemd ile 7/24 servis).

## Proje Yapısı

```
app/
  login/            Giriş sayfası
  dashboard/        Müşteri rapor ekranı
  admin/            Yönetici: müşteri yönetimi + rapor önizleme
  jarvis/           Jarvis komuta merkezi (AI asistan + dashboard)
  api/jarvis/chat/  Jarvis sohbet uç noktası (araç kullanımı)
  actions/          Sunucu eylemleri (auth, admin, jarvis görevleri)
components/
  jarvis/           ChatPanel, TaskBoard, ClientHealthCards
lib/
  meta.ts           Meta API istemcisi + demo veri üreteci
  auth.ts           Oturum yönetimi
  auth-supabase.ts  Supabase kimlik doğrulama (üretim)
  users.ts          Kullanıcı/eşleştirme işlemleri
  types.ts          Ortak tipler
  jarvis/
    agent.ts        Claude tool-use döngüsü + kural tabanlı yedek mod
    tools.ts        Jarvis araçları (rapor, görev, taslak...)
    context.ts      Müşteri sağlık görünümü toplayıcı
    tasks.ts        Görev deposu (bellek-içi; Supabase'e hazır)
    types.ts        Jarvis tipleri
supabase/
  schema.sql        Veritabanı şeması (profiles + jarvis_tasks)
```

## Sonraki Geliştirme Fikirleri

- Reklam (ad) ve reklam seti (ad set) seviyesinde kırılım
- PDF/Excel rapor dışa aktarma
- Otomatik e-posta raporları
- Reklam görseli/önizleme gösterimi
- Çoklu reklam hesabı olan müşteriler için hesap seçici
- Hedef/uyarı bildirimleri (ROAS düştüğünde vb.)
