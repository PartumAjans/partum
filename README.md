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
- 🧩 Büyütmeye uygun mimari (yeni metrik/sayfa eklemek kolay)

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

Vercel önerilir:

```bash
npm i -g vercel
vercel
```

Ortam değişkenlerini Vercel proje ayarlarından ekleyin (`.env.local`'deki
değerler). `DEMO_MODE=false` yapmayı unutmayın.

## Proje Yapısı

```
app/
  login/            Giriş sayfası
  dashboard/        Müşteri rapor ekranı
  admin/            Yönetici: müşteri yönetimi + rapor önizleme
  actions/          Sunucu eylemleri (auth, admin)
components/          Arayüz bileşenleri (grafik, tablo, kartlar...)
lib/
  meta.ts           Meta API istemcisi + demo veri üreteci
  auth.ts           Oturum yönetimi
  auth-supabase.ts  Supabase kimlik doğrulama (üretim)
  users.ts          Kullanıcı/eşleştirme işlemleri
  types.ts          Ortak tipler
supabase/
  schema.sql        Veritabanı şeması
```

## Sonraki Geliştirme Fikirleri

- Reklam (ad) ve reklam seti (ad set) seviyesinde kırılım
- PDF/Excel rapor dışa aktarma
- Otomatik e-posta raporları
- Reklam görseli/önizleme gösterimi
- Çoklu reklam hesabı olan müşteriler için hesap seçici
- Hedef/uyarı bildirimleri (ROAS düştüğünde vb.)
