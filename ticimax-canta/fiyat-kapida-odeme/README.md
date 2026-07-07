# Satış Fiyatı Büyütme + Kapıda Ödeme Notu

Ürün detay sayfası için iki küçük düzenleme.

## Dosyalar
- `fiyat-kapida-odeme.css` → Ticimax **custom CSS** alanına
- `kapida-odeme.js` → Ticimax **tema JS / script** alanının **sonuna**

## 1) Satış fiyatı puntosu büyütüldü
- Müşterinin ödediği fiyat **16px → 24px** (mobil 20px).
- Üstü çizili **piyasa/eski fiyat** (`.PiyasafiyatiContent`) küçük (16px) kalır.
- Etkilenen fiyat öğeleri: `#divTurkLirasiFiyat`, `#divIndirimsizFiyat`,
  `.IndirimliFiyatContent`, `#divKDVDahilFiyat` (hangisi aktifse).
- Boyutu değiştirmek için CSS'teki `24px` değerini düzenle.

## 2) Kapıda ödeme notu
- Fiyatın altına **"Kapıda Ödeme İmkanı"** notu (para ikonu + açık gri kutu).
- Tüm ürün detaylarında görünür.
- Metni değiştirmek için `kapida-odeme.js` içindeki `METIN` değerini düzenle.
- Kampanya çerçevesi (`.kampanyaCerceve`) varsa not onun **altına**, yoksa
  doğrudan fiyatın altına yerleşir.

## Notlar
- Sadece **ürün detay** sayfası içindir.
- Temada kapıda ödeme için hazır bir öğe olmadığından not **statik** eklenir.
  Belirli ürünlerde gizlemek istersen ayrı bir kural ekleyebiliriz.
- Dayandığı yapı: `#pnlFiyatlar` fiyat paneli ve fiyat alt-öğeleri
  (bkz. `../NOTES.md`, style.css:521-570).
