# LyoMix (Ticimax) — Ürün Özellikleri alanını tam açık gösterme

> Bu not, **LyoMix** Ticimax sitesinin ürün detay sayfasındaki "Ürün
> Özellikleri / Açıklama" alanının sabit yükseklikli, içten kaydırmalı
> (overflow) kutu yerine **tam açık** gelmesi için kullanılacak kodları
> içerir. Kodlar Ticimax yönetim panelindeki **Özel CSS / Özel JS**
> alanlarına yapıştırılmak içindir; bu repodaki uygulamayla ilgisi yoktur.

## Sorun

Ürün detay sayfasında açıklama metni sabit yükseklikli bir kutuya konuyor ve
içerik o kutunun içinde kayıyor (sağdaki ince siyah kaydırma çubuğu bunun
göstergesi). Sınırlama **Ticimax temasının kendi CSS'inden** geliyor; açıklama
kapsayıcısına `max-height` + `overflow:auto` veriliyor. Sitenin mevcut özel
JS'i bu kutuyu **oluşturmuyor**; açıklama alanı `.urunTab`, `.urunDetayPanel`,
`.urunOzellik / .urunOzellikTab` sınıflarıyla yönetiliyor.

## Çözüm 1 — Özel CSS (öncelikli)

Tema & Tasarım → Özel CSS alanına yapıştırın:

```css
<style>
/* === Ürün Özellikleri / Açıklama alanını tam açık göster (kaydırmasız) === */

/* Açıklama sekmesi + olası tüm kapsayıcılar */
.urunTab, .urunTab .tab-content, .urunTab .tab-pane,
.urunDetayPanel, .urunOzellik, .urunOzellikTab,
.urunBilgi, .urunBilgiIcerik, .urunBilgiTab,
.Aciklama, .UrunAciklama, .urun-aciklama,
.proDetailArea, .tab-content, .tab-pane,
[id*="Aciklama"], [class*="Aciklama"],
[id*="ciklama"], [class*="ciklama"] {
  height: auto !important;
  max-height: none !important;
  min-height: 0 !important;
  overflow: visible !important;
}

/* Bu alanların İÇİNDEKİ tüm sarmalayıcılar da kaydırmasız olsun
   (asıl scroll kutusu çoğu zaman bir iç div'dedir) */
.urunTab *, .urunDetayPanel *, .urunOzellik *, .urunOzellikTab *,
.urunBilgiIcerik *, .Aciklama *, .UrunAciklama *, .proDetailArea * {
  max-height: none !important;
  overflow: visible !important;
}
</style>
```

`!important`, temadan gelen inline `style="height:..."` değerlerini de ezer.

## Çözüm 2 — Opsiyonel JS (CSS yakalamazsa)

Tema kutuyu sınıf adı tahmin edilemeyen bir elemana veriyorsa, Özel JS alanına
ekleyin. Sayfada **gerçekten kayan** elemanı otomatik bulup açar:

```javascript
<script>
document.addEventListener('DOMContentLoaded', function () {
  function acAyari() {
    var alan = document.querySelector('.urunOzellik, .urunOzellikTab, .urunTab, .ProductDetailMain, .ProductDetail');
    if (!alan) return;
    alan.querySelectorAll('*').forEach(function (el) {
      var s = getComputedStyle(el);
      var kayar = /(auto|scroll)/.test(s.overflowY) || /(auto|scroll)/.test(s.overflow);
      if (kayar && el.scrollHeight > el.clientHeight + 2) {
        el.style.setProperty('max-height', 'none', 'important');
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
      }
    });
  }
  acAyari();
  setTimeout(acAyari, 800);   // sekme/AJAX sonrası
  setTimeout(acAyari, 2000);
});
</script>
```

## Selector kesinleştirme

CSS tutmazsa: açıklama metnine **sağ tık → İncele (F12)** yapıp, sağda dikey
kaydırma çubuğu olan `div`'in `class`/`id` değerini alın ve yukarıdaki listeye
ekleyin (ör. `.SENIN_SINIF { max-height:none !important; overflow:visible !important; }`).
