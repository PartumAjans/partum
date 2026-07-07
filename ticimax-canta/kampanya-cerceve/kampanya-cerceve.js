/* =====================================================================
   VOUS — Fiyat Altı Kampanya Çerçevesi
   ---------------------------------------------------------------------
   Ürün detay sayfasında fiyatın hemen altına, bir özel alana bağlı
   kampanya çerçevesi basar (örn. "2 AL 1 ÖDE").

   NASIL ÇALIŞIR
   - Aşağıdaki OZEL_ALAN_NO ile hangi Ticimax özel alanının (1-5)
     kullanılacağını seçersiniz.
   - O özel alanı Ticimax panelinden bir ürüne doldurduğunuzda çerçeve
     SADECE o üründe görünür. Boş bırakılan ürünlerde hiç çıkmaz.
   - Özel alana yazdığınız değer:
       * KAMPANYALAR listesindeki bir ANAHTAR ise  -> hazır HTML tasarım,
       * listede yoksa                              -> yazdığınız metnin
         kendisi çerçeve içinde gösterilir.
   - Böylece "çerçeveye ne yazarsam o görünür" + "tasarımı script'te HTML
     ile hazırlarım" birlikte çalışır.

   KURULUM
   - Bu dosyayı Ticimax panelinde tema JS / script alanının SONUNA
     yapıştırın. (jQuery zaten tema tarafından yüklüdür.)
   - CSS'i "kampanya-cerceve.css" dosyasından custom CSS alanına ekleyin.
   ===================================================================== */
(function () {
    "use strict";

    /* 1) Hangi özel alan kullanılacak? (1-5) */
    var OZEL_ALAN_NO = 1;

    /* 2) Anahtar kelime -> çerçeve içeriği (HTML serbest).
       Özel alana soldaki anahtarı yazın, sağdaki tasarım görünsün.
       Yeni kampanya eklemek için buraya satır ekleyin.
       Not: anahtarlar TÜRKÇE büyük harf + boşluksuz karşılaştırılır. */
    var KAMPANYALAR = {
        "2AL1ODE":     "2 AL 1 ÖDE",
        "3AL2ODE":     "3 AL 2 ÖDE",
        "KARGOBEDAVA": "KARGO BEDAVA",
        "SONURUNLER":  "SON ÜRÜNLER"
    };

    /* --- yardımcılar --- */
    function trUpperNoSpace(s) {
        return (s || "")
            .replace(/i/g, "İ")            // tr küçük i -> büyük İ
            .toUpperCase()
            .replace(/\s+/g, "");          // boşlukları at
    }

    function cerceveKur() {
        // Sadece ürün detay sayfası
        if (typeof globalModel === "undefined" ||
            globalModel.pageType !== "productdetail") {
            return;
        }

        var $alan = $("#divOzelAlan" + OZEL_ALAN_NO);
        if ($alan.length === 0) { return; }

        // Alandaki metni al. Ticimax bazı temalarda "Etiket: Değer" basar;
        // ':' varsa sadece değeri kullan.
        var ham = $.trim($alan.text());
        if (ham.indexOf(":") > -1) {
            ham = $.trim(ham.split(":").slice(1).join(":"));
        }
        if (!ham) { return; }              // alan boşsa çerçeve yok

        // Anahtar eşleşmesi: varsa hazır tasarım, yoksa metnin kendisi
        var anahtar = trUpperNoSpace(ham);
        var icerik = KAMPANYALAR.hasOwnProperty(anahtar)
            ? KAMPANYALAR[anahtar]
            : ham;

        // Çerçeveyi fiyatın hemen altına ekle (bir kez)
        if ($(".kampanyaCerceve").length === 0) {
            $("#pnlFiyatlar").after('<div class="kampanyaCerceve"></div>');
        }
        $(".kampanyaCerceve").html(
            '<span class="kampanyaCerceveIc">' + icerik + "</span>"
        );

        // Ham özel alan rozetini gizle (çerçeve olarak gösterildi)
        $alan.hide();
    }

    // Ticimax özel alanları DOM'a bastıktan sonra çalıştır
    $(window).on("load", cerceveKur);
    // Yavaş yüklenen temalar için ufak bir güvence
    $(function () { setTimeout(cerceveKur, 600); });
})();
