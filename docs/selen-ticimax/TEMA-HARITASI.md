# selenbaspinar.com — Ticimax Tema Haritası (Bellek / Referans)

Bu klasör, selenbaspinar.com (Ticimax altyapısı, **"FE8-UM"** özel teması) tema
kodlarının çıkarılmış hâlini ve tekrar tekrar taramaya gerek kalmaması için
özet haritayı içerir.

- `selen-style.css` → temanın tam CSS'i (2647 satır, Word .docx'ten düz metne çevrildi)
- `selen-script.js` → temanın tam JS'i (595 satır, jQuery tabanlı)
- Bu dosya → hızlı başvuru: hangi seçici ne işe yarıyor, sık yapılacak işler.

> Not: Bu repo aslında bir Meta Ads paneli. Ticimax kodları burada sadece
> **referans/bellek** amacıyla tutuluyor; canlı site bu repodan çalışmıyor.
> Değişiklikler Ticimax yönetim paneline elle yapıştırılır.

---

## 1) Genel yapı

- Altyapı: **Ticimax**, tema kodu tek büyük CSS + tek büyük JS dosyası.
- Font: **Archivo** (Google Fonts).
- JS **jQuery** kullanır (`$`), `globalModel`, `globalBlokModel`,
  `productDetailModel`, `globalBlokModel` gibi Ticimax global değişkenlerine bağlı.
- **Layout büyük ölçüde JS ile kuruluyor.** Sayfa yüklenince
  `documentDomFunction()` çağrılır; ürün detayında `domProdcutDetail()` DOM'u
  baştan diziyor (blok blok taşıma). Bloklar asenkron gelir
  (`blockTypeModule` / `blockCompleteCallback`).

### ⚠️ BEYAZ EKRAN SEBEBİ (önemli!)

Layout JS ile kurulduğu için, **temanın ana JS dosyasının sonuna** eklenen
herhangi bir kod **syntax hatası** içerirse (emoji 🚚 gibi BMP dışı karakter,
Word'ün eklediği **akıllı tırnak** `" "` `' '`, kapanmayan `{` `(` ), TÜM tema
JS'i parse edilemez → `documentDomFunction`/`domProdcutDetail`/blok yükleyici hiç
çalışmaz → sayfa **bomboş/beyaz** kalır.

**Kural:** Kapıda ödeme / özel kodları **ana tema JS dosyasının içine
EKLEME.** Ayrı bir `<script>` bloğu olarak (Head/Body özel kod alanı) ekle,
`try/catch` ile sar, emoji ve akıllı tırnak kullanma.

Referans dosyada doğrulandı: orijinal temada emoji yok, akıllı tırnak yok,
`{}` dengeli. Yani bozulma, sonradan yapıştırılan koddan geliyor.

---

## 2) Ürün detay — kritik seçiciler

`domProdcutDetail()` (selen-script.js ~183. satır) DOM'u şöyle diziyor:

| Seçici | Ne |
|---|---|
| `.RightDetail` | Sağ kolon (sticky, genişlik %34, masaüstü) |
| `.RightDetail .TopList` | Üst blok: `.ProductName` + `.PriceList` |
| `.PriceList` | Fiyat alanı (`#pnlFiyatlar` burada) |
| `.RightDetail .MiddleList` | Orta blok: `#divSatinAl` + `#divUrunEkSecenek` |
| `#divUrunEkSecenek` | **Beden/renk (varyasyon) seçici alanı** (margin-bottom:20px) |
| `#divSatinAl` | Satın al kutusu (adet + buton) |
| `.basketBtn` | **Gerçek "SEPETE EKLE" butonu** — en güvenilir seçici |
| `.buyfast` | "HEMEN AL" butonu (`.basketBtn`'den sonra) |
| `#divAdetCombo` | Adet seçici (`.basketBtn`'den önce) |
| `.RightDetail .BottomList` | Alt blok: ikonlar, ek bilgiler, `.proDetailArea` |
| `.proDetailArea` | `#pnlFiyatlar`'dan sonra oluşturulur |
| `#divOzelAlan1` … `#divOzelAlan5` | **Ticimax "Özel Alan" HTML kutuları** → `.proDetailArea`'ya eklenir (fiyatın altı) |

**Mobil (<768):** `.basketBtn` klonlanıp sayfa altına sabit bar olarak eklenir:
`.detayFixed` > `.fixedPrice` + `.fixedSepet`. (CSS ~2449. satır.)

---

## 2.5) PANEL: Kod nereye yapıştırılır (DOĞRULANDI)

Ticimax panel → sol menü **Modüller → Script Yönetimi**
(`/Admin/DinamikScriptYonetimi.aspx`). Sayfa bazında script enjekte eden bir
tablo var:

| ID | Tanım | Not |
|---|---|---|
| 1 | Tüm Sayfalar | her sayfada çalışır |
| 2 | Anasayfa | |
| 3 | Kategori | |
| 4 | Marka | |
| **5** | **Ürün Detay** | **← kapıda ödeme rozeti BURAYA** (sadece ürün sayfası, tüm ürünler) |
| 6 | Sipariş Tamamlandı | |
| 7 | Sepet | |
| 8 | Üye Ol Sayfası | |
| 9 | Üyelik Tamamlandı | |

Meta Pixel / Google kodları da burada duruyor → `<script>`/`<style>` blokları
kabul ediliyor. Yapılacak: satır **5 (Ürün Detay)** → kalem/düzenle →
`kapida-odeme-rozet.html` içeriğini etiketleriyle yapıştır → kaydet.

**"Body kod alanı" YOK** bu panelde; Script Yönetimi bunun yerine geçiyor.
Ana tema JS/CSS ise ayrı editörde (oraya DOKUNMA — beyaz ekran sebebi).

Panel sürümü: `0.25.0702.1124` · Website: `8.13.750.0` · Yetkili: ANIL AYDIN.

## 3) "Kapıda Ödeme" — yapılacak işlem

Amaç: ürün detayında **BEDEN alanı ile SEPETE EKLE butonu arasına** güven rozeti.
İki yol, tercih sırasıyla:

### Yol A (EN GÜVENLİ — JS yok): Ticimax "Özel Alan"
Panelden bir **Özel Alan (`#divOzelAlan1`)** HTML kutusuna rozet HTML'i yapıştır.
Tema bunu otomatik `.proDetailArea`'ya (fiyat altı) koyar. JS'i bozma riski = sıfır.
Konum fiyatın hemen altı olur (buton arası değil) — çoğu durumda yeterli.

### Yol B: Script Yönetimi → Ürün Detay (KULLANILDI, çalışıyor)
`kapida-odeme-rozet.html` içeriği **Script Yönetimi → satır 5 (Ürün Detay)**
kutusuna yapıştırıldı. Rozet **`#divSatinAl` bloğunun üstüne** giriyor =
fiyatın altı, adet/SEPETE EKLE satırının üstü, tam genişlik.

- Konum seçici: `#divSatinAl` (yoksa fallback `.basketBtn`). `insertBefore` ile üstüne.
- `clear:both; width:100%` → tema float düzeninde yan yana kaymaz (aksi halde
  adet kutusunun yanına sıkışıyordu).
- Türkçe: düz karakter çalışıyor; panel bozarsa `\u` kaçışı (Kapıda Ödeme).
- Retry (~10 sn) çünkü bloklar asenkron; emoji yok, düz tırnak, try/catch.

### Yol C: Gerçek tahsilat (ödeme yöntemi)
Görsel rozetten bağımsız. Ticimax panel → **Ödeme Yöntemleri → Kapıda Ödeme**
aktifleştirilir. Kod gerektirmez; checkout'ta seçenek çıkar.

---

## 4) Hızlı hatırlatma (bir dahaki iş için)

- Sepete ekle butonu = **`.basketBtn`**. Beden alanı = **`#divUrunEkSecenek`**.
  Fiyat = **`.PriceList` / `#pnlFiyatlar`**. Sağ kolon = **`.RightDetail`**.
- Özel HTML eklemek için en temiz kanca = **`#divOzelAlan1..5`** (Ticimax Özel Alan).
- Yeni kod eklerken: ayrı `<script>`, `try/catch`, emoji YOK, akıllı tırnak YOK.
- Layout JS ile kurulduğu için DOM `DOMContentLoaded`'da hazır olmayabilir → retry/gözlem gerekir.
