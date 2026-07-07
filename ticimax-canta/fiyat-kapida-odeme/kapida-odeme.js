/* =====================================================================
   VOUS — Kapıda Ödeme Notu (fiyat altı)
   ---------------------------------------------------------------------
   Ürün detay sayfasında fiyatın altına "Kapıda Ödeme İmkanı" notu ekler.
   Tüm ürün detaylarında görünür (kapıda ödeme site geneli bir seçenek).

   KURULUM
   - Bu bloğu tema JS / script alanının sonuna yapıştırın.
   - Stili "fiyat-kapida-odeme.css" içinden custom CSS alanına ekleyin.

   NOTLAR
   - Metni değiştirmek için aşağıdaki METIN değerini düzenleyin.
   - Kampanya çerçevesi (.kampanyaCerceve) varsa not onun ALTINA,
     yoksa doğrudan fiyatın altına yerleşir.
   ===================================================================== */
(function () {
    "use strict";

    var METIN = "Kapıda Ödeme İmkanı";

    function kapidaOdemeKur() {
        if (typeof globalModel === "undefined" ||
            globalModel.pageType !== "productdetail") {
            return;
        }
        if ($("#pnlFiyatlar").length === 0) { return; }

        // Not öğesini oluştur ya da mevcutsa yerini düzeltmek için ayır
        var $el = $(".kapidaOdemeNot");
        if ($el.length === 0) {
            $el = $('<div class="kapidaOdemeNot"><span>' + METIN + "</span></div>");
        } else {
            $el.detach();
        }

        // Kampanya çerçevesi varsa onun altına, yoksa fiyatın altına
        if ($(".kampanyaCerceve").length) {
            $(".kampanyaCerceve").after($el);
        } else {
            $("#pnlFiyatlar").after($el);
        }
    }

    $(window).on("load", kapidaOdemeKur);
    // Kampanya çerçevesinden (600ms) sonra çalışıp sırayı düzeltsin
    $(function () { setTimeout(kapidaOdemeKur, 700); });
})();
