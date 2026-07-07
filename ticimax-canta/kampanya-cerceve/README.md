# Fiyat Altı Kampanya Çerçevesi

Ürün detay sayfasında **fiyatın hemen altına**, bir özel alana bağlı
kampanya çerçevesi (ör. **2 AL 1 ÖDE**) basar.

## Dosyalar
- `kampanya-cerceve.css` → Ticimax panelinde **custom CSS** alanına
- `kampanya-cerceve.js`  → Ticimax panelinde **tema JS / script** alanının **sonuna**

## Nasıl çalışır
1. `kampanya-cerceve.js` içinde **`OZEL_ALAN_NO`** ile hangi özel alanın
   (1–5) kullanılacağını seçersin. Varsayılan: **1**.
2. Ticimax panelinde bir ürünün **Özel Alan 1** kutusuna değer yazarsın.
   Çerçeve **sadece o üründe** görünür. Boş bırakılan ürünlerde çıkmaz.
3. Özel alana yazdığın değer:
   - **Anahtar kelime** ise (script'teki `KAMPANYALAR` listesinde) → o
     kampanyanın **hazır HTML tasarımı** görünür.
   - Listede **yoksa** → yazdığın **metnin kendisi** çerçevede görünür.

## Kullanım örnekleri
| Özel Alan 1'e yazılan | Çerçevede görünen |
|---|---|
| `2AL1ODE` | 2 AL 1 ÖDE (hazır tasarım) |
| `3AL2ODE` | 3 AL 2 ÖDE (hazır tasarım) |
| `KARGOBEDAVA` | KARGO BEDAVA (hazır tasarım) |
| `Yılbaşına özel %20` | Yılbaşına özel %20 (yazdığın metin) |

## Yeni kampanya eklemek
`kampanya-cerceve.js` içindeki `KAMPANYALAR` nesnesine satır ekle. Sol taraf
özel alana yazacağın **anahtar** (Türkçe büyük harf, boşluksuz karşılaştırılır),
sağ taraf çerçevede görünecek **HTML/metin**:

```js
var KAMPANYALAR = {
    "2AL1ODE":     "2 AL 1 ÖDE",
    "3AL2ODE":     "3 AL 2 ÖDE",
    "KARGOBEDAVA": "KARGO BEDAVA",
    "YENIKAMPANYA":"<b>YENİ</b> SEZON"   // HTML de yazabilirsin
};
```

## Görünüm
- Varsayılan: kesik çizgili (dashed) çerçeve, ana renk `var(--theme-color)`
  (yoksa siyah), Inter font, büyük harf, hediye ikonu.
- Dolgulu (siyah zemin/beyaz yazı) alternatif görünüm CSS dosyasının sonunda
  yorum içinde hazır — istersen onu aç.

## Notlar / sınırlar
- Bu özellik **ürün detay** sayfası içindir (fiyat orada). Aynı çerçeveyi
  **kategori/liste kartlarında** da istersen, özel alanın liste kartına da
  basılması gerekir (Ticimax'te ürün kartı özel alan ayarı) — ayrı bir
  ekleme ile yapılabilir.
- Kod, mevcut temanın `#pnlFiyatlar` (fiyat paneli) ve
  `#divOzelAlan1..5` yapısına dayanır (bkz. `../NOTES.md`). Ham özel alan
  rozeti gizlenir, yerine çerçeve gösterilir.
