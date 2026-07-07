# Çanta E-Ticaret Sitesi — Ticimax Tema Analizi (Kalıcı Hafıza)

> Bu klasör **partum panelinden bağımsızdır.** Ticimax altyapılı çanta e-ticaret
> sitesinin tema CSS ve JS dosyalarının analizi ve kalıcı referansıdır.
> CSS/JS ile ilgili bir iş yapılacağında **önce bu notu oku** — kaynak dosyaları
> baştan analiz etmeye gerek yok.

## Kaynak dosyalar
- `reference/style.css` — sitenin tam tema CSS'i (~2145 satır, ~196 KB)
- `reference/theme.js` — sitenin tam tema JS'i (~547 satır, jQuery tabanlı)

Bu dosyalar Ticimax panelinden dışa aktarılan **customcss/ticimax/style.css** ve
tema JS'inin birebir kopyasıdır. Değişiklik yapılacaksa Ticimax panelindeki
custom CSS/JS alanına yapıştırılmak üzere buradan üretilir.

---

## 1. Genel altyapı
- **Platform:** Ticimax (Türk SaaS e-ticaret altyapısı). Sayfa yapısı, class/id
  isimleri ve `globalModel` JS nesnesi Ticimax tarafından üretilir; biz sadece
  **custom CSS + custom JS** ile üzerine yazıyoruz.
- **Font:** `Inter` (Google Fonts, `@import` ile), `sans-serif` fallback.
  Tüm `input/select/textarea` da Inter (`!important`).
- **İkonlar:** FontAwesome (`content:'\fXXX'` + `font-family:'FontAwesome'`),
  ayrıca inline SVG'ler JS ile enjekte ediliyor (ok, e-bülten butonu, back-to-top).
- **Kutu modeli:** her yerde `box-sizing:border-box`, reset CSS başta.
- **CSS mimarisi:** CSS değişkeni **`--theme-color`** tema ana rengidir. Kaynakta
  tanımı YOK — Ticimax panelinden inline enjekte edilir (tema ayarı). Ana rengi
  değiştirmek için Ticimax panelindeki tema rengi ayarı kullanılır; CSS'te
  `var(--theme-color)` her yerde ona bağlıdır.

## 2. Grid sistemi (Bootstrap benzeri, özel)
- `.row` = flexbox wrapper, `-15px` negatif margin.
- `.col-1 … .col-12` = 8.333%…100% (12'lik grid), `.col` = auto-grow.
- `.col-5li` = %20 (5'li ürün sırası — ürün listesi için, `@media min-width:1042px`).
- `.pull-left/right/center`, `.clearfix` yardımcıları mevcut.

## 3. Responsive breakpoint'ler (mobile-first DEĞİL, masaüstü-öncelikli)
Ana kırılım noktaları:
| Aralık | Amaç |
|---|---|
| `min-width:1042px` | Masaüstü tam düzen (menü açık, 5'li ürün) |
| `1025–1041px` … `1160–1239px` vb. | Ara masaüstü ölçek ayarları (çok sayıda dar aralık) |
| `768–1041px` / `max-width:1041px` | Tablet |
| `max-width:767px` | Mobil (ana mobil stil bloğu, ~satır 1831) |
| `414px` / `375–413px` / `0–374px` | Küçük telefon ince ayarları |
- **Mobil menü kırılımı JS'te:** `mobilBlokCozunurluk = 768`.
- `windowidth = document.documentElement.clientWidth` ile JS tarafında da
  genişlik kontrol ediliyor.

## 4. Renk paleti (kaynakta en sık geçen sabit renkler)
- Siyah tabanlı tasarım: `#000000` (butonlar, filtre paneli, vurgular).
- Nötrler: `#222222`, `#262324`, `#262626`, `#707070`, gri tonları
  `#b7b7b7 #c5c7c9 #d9d9d9 #e5e5e5 #e9e9e9 #f7f7f7 #f8f8f8`.
- Vurgu/aksan: `#de5249` (kırmızımsı), `#15284b` / `#213748` (lacivert — genel
  hover rengi), `#c40000` (uyarı/kırmızı).
- Beyaz zemin `#fff`, açık kutu zemini `#F8F8F8`, radius genelde `10px`.
- **Marka ana rengi = `var(--theme-color)`** (panelden gelir) — buton/sepet/aktif
  durum arka planları buna bağlı.

## 5. Önemli bileşen ↔ CSS bölümleri (style.css içinde)
Bölümler kaynakta `/*----- Başlık -----*/` yorumlarıyla ayrılmış:
| Satır (yaklaşık) | Bölüm |
|---|---|
| 1–90 | Reset + grid + genel form elemanları (`.button .textbox .selectboxx`) |
| 93 | İletişim sayfası (`.iletisimContent`) |
| 145 | Üye Ol / giriş (`.uyeOlContainer .userContainer`) |
| 774 | Etiketler |
| 879–923 | **Sabit Renkler** — `var(--theme-color)` bağlamaları (buton, sepet, tooltip, aktif menü) |
| 969–1035 | Genel Background / Hover / Color / Radius / Padding kuralları (hesabım, sepet, üyelik butonları) |
| 1226–1322 | **Üst filtre paneli** (`.category-vertical-filters.top-filters` — sağdan kayan filtre çekmecesi, siyah tema) |
| 1323–1340 | **Sol filtre paneli** (`.category-vertical-filters`) |
| 1350+ | `@media min-width:1042px` masaüstü düzen (sıralama, `.col-5li`) |
| 1831+ | `@media max-width:767px` mobil |

### Ana yapısal seçiciler
- **Header:** `#header`, `.newHeaderNavigation` / `.newHeaderNavUl` (yeni menü),
  `.menu-wrap` (açılır mega-menü), `.MobileHeaderControl`, `.account-item`,
  `.header-cart-hover` / `.miniCart*` (mini sepet), `.newSearcBtnClick` (arama).
- **Ürün kartı:** `.productItem` > `.productImage`, `.productDetail`,
  `.productPrice` (`.regularPrice` = indirim öncesi), `.productIcon` /
  `.productIconEx` (rozetler), `.itemCategory`, `.productMarkaLogo`,
  `.discountIcon`, `.TukendiIco` (tükendi), `.Videolu` (videolu ürün).
- **Ürün listesi/filtre:** `#divSayfalamaUst`, `.FiltreBtn`, `.filterBlock`,
  `#filterOrderSelect` (sıralama), `.FiyatSlider` (jQuery UI fiyat slider),
  `.appliedFilter` (uygulanan filtre), `.pageNumberContent` (sayfalama).
- **Ürün detay:** `.urunOzellik`, `.urunOzellikTab` / `.urunTab`,
  `#divUrunKodu` (stok kodu), `.proDetailArea` (özel etiket rozetleri,
  `var(--theme-color)` zeminli), `#IlgiliUrunDiv` (ilgili ürünler),
  `.taksitWrapper` (taksit).
- **Sepet:** `.sepetimBody`, `.BasketPage`, `.Basketstep` (adım göstergesi),
  `.BasketRigth` (özet), `.OdemeMenu`, `.basketCompletebtn`, `.mobileAddition`.
- **Footer:** `#footer` > `.socialdiv`, `.store`, `.linkler .blink`,
  `.footerMenuTitle` (mobilde accordion), `.newsletterContent #btnMailKaydet`.
- **Back-to-top:** `#back-to-top a` (SVG JS ile enjekte).

## 6. JS mimarisi (`theme.js`) — jQuery tabanlı
Global değişkenler: `urunDuzeniTipi`, `mobilBlokCozunurluk=768`, `windowidth`.
Ticimax global veri nesnesi: **`globalModel`** — özellikle:
- `globalModel.pageType` → `homepage | productdetail | cart | payment |
  ordercomplete | ordercompleted` (sayfa tipine göre dallanma).
- `globalModel.member` → `memberName`, `memberEMail`, `memberRole` (giriş bilgisi).

### Çalışma akışı
- `$(document).ready` → `documentDomFunction()` body'ye sayfa-tipi class'ları ekler
  (`UyeGiris`, `UyeOl`, `SayfaIcerik`, `Magazalar`, `HomeBody`), viewport meta
  ekler, admin `ticimax` rolündeyse **"Css Yenile"** butonu enjekte eder
  (`CR()` → `style.css?v=random`, canlıda önizleme için).
- `$(window).on('load')` → `HesabimTakip()`, `Iletisimaspx()`.
- `$(window).on('scroll')` → `customScrollRun()` (back-to-top vb.).

### Fonksiyon haritası (theme.js)
| Fonksiyon | Görev |
|---|---|
| `documentDomFunction()` | body class'ları + viewport + admin css-yenile butonu |
| `CR()` | style.css'i cache-bust ederek yeniden yükle (admin önizleme) |
| `HeaderIslemleri()` | Mega-menü hover (`slideDown/Up`), arama toggle, footer accordion, e-bülten SVG butonu |
| `GlobalIslemler()` | Breadcrumb'ı mobil açılır listeye dönüştürme |
| `rightSideCartRefresh(model)` / `sepetBindRefresh(res)` | Sepet AJAX sonrası hook (şu an boş — doldurulacak) |
| `SayfaTasarim()` / `SayfaTasarimScrollRun()` | Anasayfa özel tasarım blokları / owl slider |
| `customScrollRun()` | Scroll'da back-to-top SVG enjekte |
| `urunKartCallBack()` | **Ürün kartı yeniden düzenleme** — kategori/ikon/video/marka öğelerini `.productDetail` içine taşır, rozet kapsayıcısı ekler |
| `domCategory()` | Kategori/liste sayfası DOM düzenlemesi |
| `domProdcutDetail()` | Ürün detay DOM düzenlemesi |
| `UrunDetayIslemleri()` | Ürün detay init (paylaş, ikon, stok kodu) |
| `blockCompleteCallback()` / `blockTypeModule()` / `blockClassReplace()` | Ticimax blok (widget) yükleme callback'leri |
| `urunListCallback()` / `urunDuzeni()` / `productTypeList()` / `listTypeShowClass()` | Ürün listesi render callback'leri, liste/grid görünüm |
| `ekSecenekListesiCallBack()` | Ek seçenek (varyant) listesi |
| `SepetEkrani()` | Sepet/ödeme sayfası init |
| `HesabimTakip()` | Hesabım/sipariş takip |
| `Iletisimaspx()` | İletişim sayfası |
| `UrunDetayPaylas()` / `urunDetayIcon()` | Ürün paylaşım butonları / ikonlar |
| `FavoriIslemCallback()` | Favori ekle/çıkar |
| `HeaderFixed()` | Scroll'da sabit (sticky) header |

### Önemli JS davranış detayları
- `urunKartCallBack()` ürün kartının HTML'ini **yeniden düzenler** — CSS'te
  `.productDetail` altındaki sıralama bu JS'e bağlı. Ürün kartı görünümü
  değiştirilecekse hem CSS hem bu fonksiyona bakılmalı.
- `translateIt("...")` → Ticimax çoklu-dil çeviri fonksiyonu (metinler dil
  anahtarıyla geliyor, örn. `Global_StokKodu`).
- İnline SVG'ler JS ile enjekte ediliyor (ok `#Path_5368`, back-to-top, e-bülten)
  — ikon değişikliği JS'te yapılır.

---

## 6.5 Yapılan özel çalışmalar (bu repoda)
- **`kampanya-cerceve/`** — Ürün detayında fiyat altı kampanya çerçevesi
  (ör. "2 AL 1 ÖDE"). Bir özel alana (`#divOzelAlanN`) bağlıdır: alan doluysa
  fiyatın altına `.kampanyaCerceve` çerçevesi basılır. Değer bir anahtar kelime
  ise script'teki hazır HTML tasarım, değilse yazılan metin gösterilir. Boşsa
  çerçeve çıkmaz. CSS + JS panele yapıştırılır. Detay: `kampanya-cerceve/README.md`.
  Dayandığı yapı: `#pnlFiyatlar` (fiyat paneli), `domProdcutDetail()` içinde
  `#divOzelAlan1..5 → .proDetailArea` taşıması.

## 7. Değişiklik yaparken kurallar (ÖNEMLİ)
1. **Ana renk:** `var(--theme-color)` panelden gelir — global renk değişimi için
   önce onu değerlendir; tek tek hex değiştirme.
2. **Ürün kartı / header / filtre** görünümü hem CSS **hem** ilgili JS
   fonksiyonuna bağlı — ikisini birlikte kontrol et.
3. Ticimax'in ürettiği class/id isimlerini **değiştirme**; sadece stil ver.
4. Değişiklikleri Ticimax panelindeki custom CSS/JS alanına yapıştırmak üzere
   `reference/style.css` ve `reference/theme.js` üzerinden üret.
5. Masaüstü-öncelikli responsive: `min-width:1042px` = tam masaüstü,
   `max-width:767px` = mobil ana blok.
