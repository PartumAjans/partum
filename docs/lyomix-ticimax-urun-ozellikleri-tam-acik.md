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

## Tespit (canlı DOM)

Açıklama içeriği **`.urunTabAlt`** kutusunun içinde duruyor:

```html
<div class="urunTabAlt">
  <h1>&nbsp;</h1>
  <style> ... </style>
  <div style="max-width:860px; ...">...açıklama...</div>
  <h2>&nbsp;</h2>
  <div class="teknikDetay"></div>
</div>
```

İçten kaydırmalı kutu **`.urunTabAlt`** ya da onun bir üst sarmalayıcısı.
Önceki CSS denemesinde bu sınıf eksikti; eklenince çözülür.

## Çözüm 1 — Özel CSS (öncelikli)

Tema & Tasarım → Özel CSS alanına yapıştırın:

```css
<style>
/* === Ürün Özellikleri / Açıklama alanını tam açık göster (kaydırmasız) === */

/* Açıklama içeriği .urunTabAlt içinde; kutu burada veya bir üst sarmalayıcıda */
.urunTabAlt, .urunTabAlt > div,
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
.urunTabAlt *, .urunTab *, .urunDetayPanel *, .urunOzellik *,
.urunOzellikTab *, .urunBilgiIcerik *, .Aciklama *,
.UrunAciklama *, .proDetailArea * {
  max-height: none !important;
  overflow: visible !important;
}
</style>
```

`!important`, temadan gelen inline `style="height:..."` değerlerini de ezer.
Bu blok, açıklama editörünün içine yapıştırılsa bile global çalışır (gövdedeki
`<style>` tüm sayfaya uygulanır).

## Çözüm 2 — Opsiyonel JS (CSS yakalamazsa)

Tema kutuyu sınıf adı tahmin edilemeyen bir elemana veriyorsa, Özel JS alanına
ekleyin. Sayfada **gerçekten kayan** elemanı otomatik bulup açar:

> ⚠️ Bu `<script>` bloğunu **temanın Özel JS / footer alanına** koyun.
> Ürün açıklaması (zengin metin) editörüne yapıştırılan `<script>` tarayıcıda
> **çalışmaz** (innerHTML ile eklenen script çalıştırılmaz).

```javascript
<script>
(function () {
  function acAyari() {
    var c = document.querySelector('.urunTabAlt');
    if (!c) return;
    // 1) .urunTabAlt'tan YUKARI doğru tüm ataları aç (kutu üstte olabilir)
    var el = c;
    while (el && el !== document.body) {
      var s = getComputedStyle(el);
      var kayar = /(auto|scroll|hidden)/.test(s.overflowY) || parseInt(s.maxHeight) > 0;
      if (kayar) {
        el.style.setProperty('max-height', 'none', 'important');
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
      }
      el = el.parentElement;
    }
    // 2) İçeride gerçekten kayan bir alt eleman varsa onu da aç
    c.parentElement && c.parentElement.querySelectorAll('*').forEach(function (n) {
      var st = getComputedStyle(n);
      if ((/(auto|scroll)/.test(st.overflowY) || /(auto|scroll)/.test(st.overflow))
          && n.scrollHeight > n.clientHeight + 2) {
        n.style.setProperty('max-height', 'none', 'important');
        n.style.setProperty('height', 'auto', 'important');
        n.style.setProperty('overflow', 'visible', 'important');
      }
    });
  }
  document.addEventListener('DOMContentLoaded', acAyari);
  setTimeout(acAyari, 600);   // sekme/AJAX sonrası
  setTimeout(acAyari, 1500);
})();
</script>
```

## Selector kesinleştirme

CSS tutmazsa: açıklama metnine **sağ tık → İncele (F12)** yapıp, sağda dikey
kaydırma çubuğu olan `div`'in `class`/`id` değerini alın ve yukarıdaki listeye
ekleyin (ör. `.SENIN_SINIF { max-height:none !important; overflow:visible !important; }`).
