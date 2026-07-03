
/* ==================== */
/* ------FE8--UM------- */
/* ==================== */
var urunDuzeniTipi=0; //Urun duzen tipi
var mobilBlokCozunurluk=768; //Mobil dinamikblok
var sliderZoomCozunurluk=768; //mobilOzelSlider
var isHoverCartProduct=false; //Hover da kapatma
var kategoriMenuAcikGetir=true; //Kategorimenu tum kirilim
var urunDetayZoomCozunurluk=1025; //Urun resim slider 
var windowidth = document.documentElement.clientWidth; //window width orani
var urunDetay_varyasyonSecili=true; //varyasyon secme ve secmeme
var sepeteEkleUyariAktif = true; //sepete ekleme popup
documentDomFunction();
if (localStorage.getItem("productListingType")) {
    productTypeList(parseInt(localStorage.getItem("productListingType")));
}
function documentDomFunction(){
    if ($('#mainHolder_divUserLoginContent').length > 0){$('body').addClass('UyeGiris');}
    if ($('div[ng-controller="ctrlUyeOl"]').length > 0){$('body').addClass('UyeOl');}
    if ($('.pageContainer').length > 0) {$('body').addClass('SayfaIcerik');}
    if ($('.magazalarContent').length > 0) {$('body').addClass('Magazalar');}
    if (globalModel.pageType == 'homepage') {$('body').addClass('HomeBody');}
    HeaderIslemleri();
    if ($('#divSayfalamaUst').length > 0) {
        domCategory();   
    }
    if (globalModel.pageType == 'productdetail'){
        domProdcutDetail();
    }
    $('.sliderAyaritems-2 .bannerWrapper,.sliderAyaritems-3 .bannerWrapper,.sliderAyaritems-4 .bannerWrapper,.sliderAyaritems-5 .bannerWrapper,.sliderAyaritems-6 .bannerWrapper').each(function(){
        $(this).find('img').attr('src',$(this).find('img').attr('data-src'));
    });
}
//var ShowListProductInCart = false; // Urun Sepette ve sepet adet ibaresi
//Sayfa Yuklenme sahnesi
function CR(){$("link[href*='style.css']").attr('href','/customcss/ticimax/style.css?v='+Math.random()+''); }//entegre sonrası sil
$(document).ready(function () {
    if(typeof globalBlokModel != 'undefined') {
        blockTypeModule();
    }
    try {var control = globalModel.member.memberRole.split(',')[2]; if (control == 'ticimax') {$('body').before('<a onclick="CR()" style="position:fixed;right:0;top:50%; background:#040a2b;color:#fff;padding:0 15px;line-height:42px; z-index:12154865746;font-size:13px;text-align:center;font-family:sans-serif;margin-top:-21px;"><p style="margin:0;">Css Yenile</p></a>'); } }
    catch(e) {}//entegre sonrası sil
    //sayfaislemleri
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>');
    if ($('#divSayfalamaUst').length > 0) {  }
    if (globalModel.pageType == 'productdetail') { }
    if (globalModel.pageType == 'cart' || globalModel.pageType == 'ordercomplete'|| globalModel.pageType == 'payment'|| globalModel.pageType == 'ordercompleted') { SepetEkrani(); }
    GlobalIslemler();
    HeaderFixed();
    if(windowidth < 768){
        bottomHead();
    }
    $(".newHeaderNavUl li").each(function () {if ($(this).find(".menu-wrap").length > 0) {$(this).addClass("ulVar"); }});
    if (!pageInitialized) {
        $('body').on('mouseenter','.newHeaderNavigation:not(.mobileStyle) .newHeaderNavUl > li.ulVar > a',function() {
            $('#divIcerik').addClass('hoverr');
            $(this).parent().find('.menu-wrap').slideDown();
        });
        $('body').on('mouseleave','.newHeaderNavigation:not(.mobileStyle) .newHeaderNavUl > li',function() {
            $('#divIcerik').removeClass('hoverr');
            $('.menu-wrap').slideUp();
        });
    }
    if(windowidth < 768){
        $('.footerMenuTitle').click(function(){
            $(this).parent().find('ul').slideToggle();
        });
    }
    if ($('body').find('.mobilaf').length == 0) {
        $('body').append('<div class="mobilaf"></div>');
    }
});
function HeaderIslemleri(){
    $('.newSearcBtnClick a').on('click', function() {
        $('#divIcerik').toggleClass('hoverr');
    });
    $('#top-bar').insertBefore('#headerNew');
}
$(window).on('load', function() {//sayfa yuklenmesi
    if ($(".hesabimBolumuTutucu").length > 0) { HesabimTakip(); }
    if ($(".iletisimContent").length > 0) { Iletisimaspx(); }
    $('#langHover').on('click',function(){
        $(this).parent().toggleClass('active');
    });
});
$(window).on("scroll", function() {//sayfa scroll
    SayfaTasarimScrollRun();
    customScrollRun();
});
function GlobalIslemler() {//genel islemler
    if (!pageInitialized && windowidth > 767) {
    }
    if ($('.breadcrumb').length > 0) {
        var breadHtml = $('ul.breadcrumb').html();
        $('ul.breadcrumb').after('<div class="breadList" style="display:none;"><div class="mBread"><ul class="breadcrumbList">'+breadHtml+'</ul></div><div class="clbtn"><i class="far fa-times"></i></div></div>');
        var liS = $(".breadcrumbList li");
        $(".breadcrumbList li").each(function(index){if (index > 0){var ul = $("<ul/>"); $(this).appendTo(ul); ul.appendTo(liS[index-1]); } });
        $('body').on('click' ,'.breadcrumb',function(){$('.breadList').addClass('breadActive').show();$(this).addClass('zindex'); });
        $('body').on('click' ,'.clbtn',function(){$('.breadList').removeClass('breadActive').hide();$('.breadcrumb').removeClass('zindex'); });
    }
    SayfaTasarim();
}
function rightSideCartRefresh(model){//kodlar buraya gelecek
}
function sepetBindRefresh(res){//sepet kontrol
}
function SayfaTasarim() {//sayfada yapilacak islemler
    if ($('#mainHolder_divDesign').length>0) {
        urunKartCallBack();
        if(windowidth < 1240){
            $('.sliderBannerContainer .jCarouselLite ul').owlCarousel({
                autoplay: false,
                loop: false,
                rewind:true,
                lazyLoad:true,
                navClass: ['ProductListprev', 'ProductListnext'],
                margin:20,
                nav: true,
                responsive:{0:{items:1,margin:10},450:{items:2,margin:10},768:{items:3},1025:{items:3},1160:{items: 4}},
                onInitialized: function callback() {
                    lazyLoad();
                }
            });
        }
    }
}
function SayfaTasarimScrollRun() {//sadece ozel owl icin. Kullanim yoksa kaldir.
    if ($('#mainHolder_divDesign').length>0) {
    }
}
function customScrollRun() {//sayfada scroll oluncaki islemler
    if ($('#back-to-top a svg').length==0) {
        $('#back-to-top a').html('<svg viewBox="0 0 24 24" > <path d="M8.53033 10.5303C8.23744 10.8232 7.76256 10.8232 7.46967 10.5303C7.17678 10.2374 7.17678 9.76256 7.46967 9.46967L11.4697 5.46967C11.7626 5.17678 12.2374 5.17678 12.5303 5.46967L16.5303 9.46967C16.8232 9.76256 16.8232 10.2374 16.5303 10.5303C16.2374 10.8232 15.7626 10.8232 15.4697 10.5303L12.75 7.81066L12.75 17.5C12.75 17.9142 12.4142 18.25 12 18.25C11.5858 18.25 11.25 17.9142 11.25 17.5L11.25 7.81066L8.53033 10.5303Z"/> </svg>');
    }
    if ($('.ebultenGelecek #divNewsLetter').length==0) {
        $('#divNewsLetter').prependTo('.ebultenGelecek');
    }
}
function urunKartCallBack() {//urun kartlarindaki islemler
    $(".productItem").find("video").parent().addClass("Videolu");
    $(".productItem").find(".TukendiIco").parent().addClass("StokYok");
    $(".productPrice").find(".regularPrice").parent().addClass("IndirimVar");
    $(".sliderBannerContainer .productItem").find("video").parent().addClass("Videolu");
    $('.productItem').each(function () {
        $(this).find('.itemCategory').prependTo($(this).find('.productDetail'));
        $(this).find('.productIcon').appendTo($(this).find('.productDetail'));
        $(this).find('.boxUrunlerContent').appendTo($(this).find('.productDetail'));
        $(this).find('.productMarkaLogo').prependTo($(this).find('.productDetail'));
        $(this).find('.divVideoPlayButton').appendTo($(this));
        $(this).find('.favori').appendTo($(this));
        if ($(this).find('.productIconEx').length == 0) {
            $(this).append('<div class="productIconEx"></div>');
        }
        $(this).find('.discountIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.newIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.cargoIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.firsatIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.hizliKargoIcon').appendTo($(this).find('.productIconEx'));
        if ($(this).find('.productIconExSpecial').length == 0) {
            $(this).find('.productDetail').append('<div class="productIconExSpecial"></div>');
        }
        $(this).find('.ozelAlan1').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan2').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan3').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan4').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan5').appendTo($(this).find('.productIconExSpecial'));
        if ($(this).find('.productIconExButtons').length == 0) {
            $(this).find('.productDetail').append('<div class="productIconExButtons"></div>');
        }
        $(this).find('.myCollectionProductBtn').appendTo($(this).find('.productIconExButtons'));
        $(this).find('.mycartIcon').appendTo($(this).find('.productIconExButtons'));
        $(this).find('.examineIcon').appendTo($(this).find('.productIconExButtons'));
        $(this).find('.quickViewIco').appendTo($(this).find('.productIconExButtons'));
    });
}
function domCategory() {//kategori ve arama sayfasi
    $("body").addClass("CategoryBody");
    if($('#divLeftBlock').length > 0){
        $('.categoryTitle .categoryTitleText').insertBefore('.leftBlock');
    }
    $('body').on('click' ,'.leftBlock .category-vertical-filters .panel .panel-heading',function() {$(this).parent().find('.list-group, .FiyatSlider,.panel-search,.FiyatTextBox').slideToggle(); $(this).toggleClass('active'); });
}
function domProdcutDetail() {//urundetay sayfasi
    $("body").addClass("ProductBody");
    if (productDetailModel.totalStockAmount < 1) {$('.RightDetail').addClass('StokYok');}
    if (!pageInitialized) {
        $('.ProductDetail > .categoryTitle').insertBefore('#divIcerik');
        $('.ProductDetailMain').prepend('<div class="TopDet"></div>');
        $('.leftImage').appendTo('.TopDet');
        $('.RightDetail').appendTo('.TopDet');
        //ilk bolum
        $('.RightDetail').prepend('<div class="TopList"></div>');
        $('.PriceList').prependTo('.TopList');
        $('.ProductName').prependTo('.TopList');
        //ikinci bolum
        $('.TopList').after('<div class="MiddleList"></div>');
        $('#divSatinAl').appendTo('.MiddleList');
        $('#divUrunEkSecenek').prependTo('.MiddleList');
        $('#divStokYok').prependTo('.MiddleList');
        //ucuncu bolum
        $('.MiddleList').after('<div class="BottomList"></div>');
        $('.ProductIcon').appendTo('.BottomList');
        $('.ProductIcon2 ').appendTo('.BottomList');
        $('#divEkstraBilgiler').appendTo('.BottomList');
        $('.product_social_icon_wrapper').appendTo('.BottomList');
        //ek acilirlar
        $('#divTaksitAciklama').insertBefore('#pnlFiyatlar');
        $('.markaresmi').insertBefore('.ProductName');
        $('#divMagazaStok').insertAfter('.ProductName');
        $('#divIndirimOrani').insertBefore('#pnlFiyatlar');
        $('#divParaPuan').insertAfter('.ProductName');
        $('#divToplamStokAdedi').insertAfter('.ProductName');
        $('#divUrunStokAdedi').insertAfter('.ProductName');
        $('#divTedarikci').insertAfter('.ProductName');
        $('#divBarkod').insertAfter('.ProductName');
        $('#divMarka').insertBefore('.ProductName');
        $('#divUrunKodu').insertAfter('.ProductName');
        $('.puanVer').insertAfter('.ProductName');
        $('#divOnyazi').insertAfter('.ProductName');
        //alt ekler
        $('#divKombinSatinAl').insertAfter('.basketBtn');
        $('.buyfast').insertAfter('.basketBtn');
        $('#divAdetCombo').insertBefore('.basketBtn');
        $('#divAdetCombo .left_line').insertBefore('#divAdetCombo');
        $('.pSatisBirimi').insertBefore('.Basketinp');
        $('#divUrunDetayKombin').insertBefore('#divSatinAl');
        $('.TavsiyeEtBtnContent').appendTo('.ProductIcon');
        $('#divTahminiTeslimatSuresi').insertBefore('#divSatinAl');
        $('#divUrunOzellikAlani').appendTo('.BottomList');
        urunDetayIcon();
        if (windowidth < 768) {
            var urunFiyat = $('#pnlFiyatlar').html();
            var urunEkle = $('.basketBtn').clone().html();
            if ($('body').find('.detayFixed').length == 0) {
                $('body').append('<div class="detayFixed"><div class="fixedPrice">' + urunFiyat + '</div><div class="fixedSepet">' + urunEkle + '</div></div>');
            }
        }
        setTimeout(()=>{
            $('#productDetailRelated > a').each(function() {
                if ($(this).prop('href') == window.location.href) {
                    $(this).addClass('active');
                }
            });
        }
        , 750);
        if ($('.RightDetail').find('.proDetailArea').length == 0) {
            $('#pnlFiyatlar').after('<div class="proDetailArea"></div>');
        }
        $('#divOzelAlan1').appendTo('.proDetailArea');
        $('#divOzelAlan2').appendTo('.proDetailArea');
        $('#divOzelAlan3').appendTo('.proDetailArea');
        $('#divOzelAlan4').appendTo('.proDetailArea');
        $('#divOzelAlan5').appendTo('.proDetailArea');
    }
}
function blockCompleteCallback() {//blokyuklenme
    if (globalModel.pageType == 'homepage') {
    }
    if ($('#divSayfalamaUst').length>0) {
    }
    if (globalModel.pageType == 'productdetail') {
        UrunDetayPaylas();
        if (!pageInitialized) {
            $('#linkOncekiSayfa').appendTo('ul.breadcrumb');
            if (windowidth<768) {
                $('#linkOncekiSayfa').appendTo('.leftImage');
            }
        }
        /*detayTabAccordion*/
        var cList = $('.urunTab ul li'); var cDiv = $('.urunDetayPanel'); for (var i = 0; i <= cList.length; i++) {for (var i = 0; i <= cDiv.length; i++) {$(cDiv[i]).appendTo(cList[i]); } } $(".urunDetayPanel").hide() ;
        $(".urunOzellik").removeAttr('class').addClass("urunOzellikTab");
        $('.urunOzellikTab .urunTab >ul>li').attr('onOffTip','false');
        $('.urunOzellikTab .urunTab >ul>li:nth-child(1)').attr('onOffTip','true');
        $('body').on('click' ,'.urunOzellikTab .urunTab >ul>li>a',function () {
            $('.urunOzellikTab .urunTab >ul>li>a').parent().removeClass('active');
            var openTab = $(this); var tabName = openTab.attr('data-tab') || ""; if (tabName === "Commets") {TabGetComments(); } else if (tabName === "recommendations") {TabGetRecommendations();}
            if ($(this).parent().attr('onOffTip') == 'false'){$('.urunOzellikTab .urunTab >ul>li').attr('onOffTip','false'); $(this).parent().attr('onOffTip','true');}
            else{$(this).parent().attr('onOffTip','false'); }
        });
        if (windowidth<768) {
        }
    }
}
function blockTypeModule() {
    if (globalBlokModel == 1) {
        if (urunDuzeniTipi == 0)
            urunDuzeniTipi = 4;
        let posAr = ['leftBlock','centerCount'];
        blockClassReplace('LeftMiddle', posAr);
    } else if (globalBlokModel == 2) {
        if (urunDuzeniTipi == 0)
            urunDuzeniTipi = 2;
        let posAr = ['leftBlock','centerCount','rightBlock'];
        blockClassReplace('LeftMiddleRight', posAr);
    } else if (globalBlokModel == 3) {
        if (urunDuzeniTipi == 0)
            urunDuzeniTipi = 4;
        let posAr = ['centerCount','rightBlock'];
        blockClassReplace('MiddleRight', posAr);
    } else if (globalBlokModel == 4) {
        if (urunDuzeniTipi == 0)
            urunDuzeniTipi = 4;
        let posAr = ['centerCount'];
        blockClassReplace('Middle', posAr);
    }
}
function blockClassReplace(className,positionDiv) {
    if (positionDiv.length > 0) {
        for (let p = 0; p < positionDiv.length; p++) {
            $('.'+positionDiv[p]+'').removeClass((i,e)=>{
                return e.split(positionDiv[p])[1];
            }).addClass(className);
        }
    }
}
function urunListCallback() {//urunyuklenme
    urunDuzeni(urunDuzeniTipi);
    if (globalModel.pageType != 'homepage'){//Anasayfadan farkli bir sayfa ise
        $('.sliderBannerContainer .jCarouselLite ul').owlCarousel({
            autoplay: false,
            loop: false,
            rewind:true,
            lazyLoad:true,
            navClass: ['ProductListprev', 'ProductListnext'],
            margin:20,
            nav: true,
            responsive:{0:{items:2,margin:10},768:{items:3},1025:{items:3},1160:{items: 4}},
            onInitialized: function callback() {
                lazyLoad();
            }
        });
    }
    if ($('#divSayfalamaUst').length>0) {//kategori ve arama sayfasi
        $('body').on(clickEvent , '.blockSelect .sort_hrz',function(){urunDuzeniTipi = 1;urunDuzeni(urunDuzeniTipi); }); $('body').on(clickEvent , '.blockSelect .sort_2',function(){urunDuzeniTipi = 2;urunDuzeni(urunDuzeniTipi); }); $('body').on(clickEvent , '.blockSelect .sort_3',function(){urunDuzeniTipi = 3;urunDuzeni(urunDuzeniTipi); }); $('body').on(clickEvent , '.blockSelect .sort_4',function(){urunDuzeniTipi = 4;urunDuzeni(urunDuzeniTipi); }); $('body').on(clickEvent , '.blockSelect .sort_5',function(){urunDuzeniTipi = 5;urunDuzeni(urunDuzeniTipi);});
    }
    if (globalModel.pageType == 'productdetail') {//urun detay sayfasi
        if($('#divSatinAl').css('display') == 'none'){$('.RightDetail').addClass('StokYok'); }
        $('#hizliBakisAltAlan .detaySliderContainer .jCarouselLite ul').owlCarousel({
            autoplay: false,
            loop: false,
            rewind:true,
            lazyLoad:true,
            navClass: ['ProductListprev', 'ProductListnext'],
            margin:20,
            nav: true,
            responsive:{0:{items:1,margin:10},450:{items:2,margin:10},768:{items:3},1025:{items:3},1160:{items: 3}},
            onInitialized: function callback() {
                lazyLoad();
            }
        });
        $('.detaySliderContainer .jCarouselLite ul').owlCarousel({
            autoplay: false,
            loop: false,
            rewind:true,
            lazyLoad:true,
            navClass: ['ProductListprev', 'ProductListnext'],
            margin:20,
            nav: true,
            responsive:{0:{items:1,margin:10},450:{items:2,margin:10},768:{items:3},1025:{items:3},1160:{items: 4}},
            onInitialized: function callback() {
                lazyLoad();
            }
        });
    }
    $('#hizliBakisAltAlan .detaySliderContainer .jCarouselLite ul').owlCarousel({
        autoplay: false,
        loop: false,
        rewind:true,
        lazyLoad:true,
        navClass: ['ProductListprev', 'ProductListnext'],
        margin:20,
        nav: true,
        responsive:{0:{items:1,margin:10},450:{items:2,margin:10},768:{items:3},1025:{items:3},1160:{items: 3}},
        onInitialized: function callback() {
            lazyLoad();
        }
    });
    InitTimers();
    urunKartCallBack();
    $(window).on('scroll',function () {
        if ($('.jCarouselLite').attr('data-lazy-function') != undefined) {
            if ($('.jCarouselLite').attr('data-lazy-function').length > 0) { lazyLoad(); }
        }
    });
}
function urunDuzeni(tip) {
    if ($('#divSayfalamaUst').length>0) {
        if ($('.blockSelect .sort_5').length==0) {$('.blockSelect .sort_4').after('<a class="btnCatSorting sort_5"><i class="fas fa-th"></i></a>');}
        if ($('.blockSelect .sort_2').length==0) {$('.blockSelect .sort_3').before('<a class="btnCatSorting sort_2"><i class="fas fa-th"></i></a>');}
        if ($('.brandlistselection select').length > 0) {$('#divSayfalamaUst').addClass('Slct');}
        $('.sort_hrz').removeClass("Active"); 
        $('.sort_2').removeClass("Active");
        $('.sort_3').removeClass("Active");
        $('.sort_4').removeClass("Active");
        $('.sort_5').removeClass("Active");
        productTypeList(tip);
        if ($('.FiltreUst').length == 0) {
            $('body #divSayfalamaUst .category-vertical-filters.top-filters').wrapInner('<div class="FiltreicerikAlan"></div>');
            $('body #divSayfalamaUst .category-vertical-filters.top-filters .FiltreicerikAlan').after('<div class="filtreAlt"><div class="filtreUygulaBtn"><span>'+translateIt("Global_ButtonKaydet")+'</span></div><a class="clear" onclick="clearAllFilters()"><i class="fal fa-trash"></i></a></div>');
            $('body #divSayfalamaUst .category-vertical-filters.top-filters').prepend('<div class="tukgo"><a onclick="sortingClick(1000)" class="filterOrderInStock">'+translateIt("Urunler_Stoktakiler")+'</a></div>');
            $('body #divSayfalamaUst .category-vertical-filters.top-filters').prepend('<div class="FiltreUst"><div class="closeFilt"><i class="fal fa-times"></i></div><span>'+translateIt("UrunFiltreleme_Filtreleme")+'</span><a onclick="clearAllFilters()"><i class="fal fa-trash"></i></a></div>');
            if ($('.moreNum').length==0) {
                $('#divSayfalamaUst .category-vertical-filters.top-filters .panel').find('.panel-heading').append('<div class="moreNum"></div>');
            }
            $('body').on(clickEvent ,'.mobilFilterBtn',function() {
                $('#divSayfalamaUst .filterBlock').addClass('active');
                $('.mobilaf').addClass('acik');
            });
            $('body').on(clickEvent ,'.closeFilt,.filtreUygulaBtn span',function() {
                $('#divSayfalamaUst .filterBlock').removeClass('active');
                $('.mobilaf').removeClass('acik');
                $('.FiltreBtn').removeClass('acik');
            });
        }
        $('#divSayfalamaUst .category-vertical-filters.top-filters .panel').each(function(index, el) {
            if ($(this).find('li').hasClass('selected')) {var numlen = $(this).find('li.selected').length; $(this).addClass('more'); $(this).find('.moreNum').html(numlen);}
            else{$(this).removeClass('more'); $(this).find('.moreNum').html(''); }
        });
        $('#divSayfalamaUst .category-vertical-filters.top-filters .panel').each(function(index, el) {
            if ($('#divSayfalamaUst .category-vertical-filters.top-filters .panel').hasClass('more')) {$('.FiltreUst a').addClass('active'); return false; }
            else{$('.FiltreUst a').removeClass('active'); }
        });
        if ($('.sortingContent .filterOrderInStock').hasClass('selected')) {$('.tukgo .filterOrderInStock').addClass('selected');}else{$('.tukgo .filterOrderInStock').removeClass('selected');}
        if ($('.sortingContent .sortingButton').length > 0) {if ($('.sortingContent .sortingButton > a[onclick="sortingClick(1000)"]').hasClass('selected')) {$('.tukgo .filterOrderInStock').addClass('selected'); }else {$('.tukgo .filterOrderInStock').removeClass('selected'); } }
        if (windowidth > 1041) {
            if ($('.FiltreBtn').length == 0) {
                $('.brandlistselection').append('<div class="FiltreBtn"><img src="../../Uploads/EditorUploads/images/filtre.svg" alt=""><span>Filtreler</span></div>');
            }
            $('.FiltreBtn').on('click', function() {
                $(this).addClass('acik');
                $('.filterBlock').addClass('active');
                $('.mobilaf').addClass('acik');
            });
            $('.mobilaf').on('click', function() {
                $('.mobilaf').removeClass('acik');
                $('.filterBlock').removeClass('active');
                $('.FiltreBtn').removeClass('acik');
            });
        }
    }
    if (globalModel.pageType == 'productdetail') {if ($('#divUrunKodu span').length==0) {$('#divUrunKodu').prepend('<span>'+translateIt("Global_StokKodu")+'</span>'); } }
}
function productTypeList(type) {
    if (type == 1) {
        listTypeShowClass('PlSc_hrz','col-12','sort_hrz');
        if (typeof lazyLoad == 'function')
            lazyLoad();
    }
    else if (type == 2) {
        listTypeShowClass('PlSc_2','col-6','sort_2');
        if (typeof lazyLoad == 'function')
            lazyLoad();
    }
    else if (type == 3) {
        listTypeShowClass('PlSc_3','col-4','sort_3');
        if (typeof lazyLoad == 'function')
            lazyLoad();
    }
    else if (type == 4) {
        listTypeShowClass('PlSc_4','col-3','sort_4');
        if (typeof lazyLoad == 'function')
            lazyLoad();
    }
    else if (type == 5) {
        listTypeShowClass('PlSc_5','col-5li','sort_5');
        if (typeof lazyLoad == 'function')
            lazyLoad();
    }
    else if (type == 6) {
        listTypeShowClass('PlSc_6','col-2','');
        if (typeof lazyLoad == 'function')
            lazyLoad();
    }
}
function listTypeShowClass(plClass, colCLass, buttonClass){
    $('.ProductList:not(.markaSlider)').removeClass().addClass('ProductList '+plClass+'');
    $(".ItemOrj").removeClass((i,e)=>{return e.split('ItemOrj')[1];}).addClass(colCLass);
    if ($('.blockSelect .'+buttonClass+'').length > 0) {
        $('.blockSelect .'+buttonClass+'').addClass("Active");
    }
}
function ekSecenekListesiCallBack(){
    if (globalModel.pageType == 'productdetail') {if ($('#divUrunKodu span').length==0) {$('#divUrunKodu').prepend('<span>'+translateIt("Global_StokKodu")+'</span>'); } }
    FavoriIslemCallback();
}
function bottomHead() {
    if ($('.bottomHead').length == 0 && $('#headerNew').length > 0) {
        $('body:not(.sepetimBody)').append('<div class="bottomHead"> <ul> <li class="homeC"> <a href="/"><svg xmlns="http://www.w3.org/2000/svg" width="16.715" height="18.439" viewBox="0 0 16.715 18.439"> <g id="Icon_feather-home" data-name="Icon feather-home" transform="translate(0.6 0.6)"> <path id="Path_5084" data-name="Path 5084" d="M4.5,9.034,12.258,3l7.758,6.034v9.482a1.724,1.724,0,0,1-1.724,1.724H6.224A1.724,1.724,0,0,1,4.5,18.515Z" transform="translate(-4.5 -3)" fill="none" stroke="#222222" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"/> <path id="Path_5085" data-name="Path 5085" d="M13.5,25.327V18h4.4v7.327" transform="translate(-7.94 -8.087)" fill="none" stroke="#222222" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"/> </g></svg><span>'+translateIt("GlobalMasterPage_Anasayfa")+'</span></a> </li> <li class="cartC"> <a href="/sepetim.aspx"><svg viewBox="0 0 16 16"> <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/> </svg><span>'+translateIt("GlobalMasterPage_Sepetim")+'</span></a> </li><li class="favoC"> <a href="/Hesabim.aspx/#/Favorilerim)"><svg xmlns="http://www.w3.org/2000/svg" width="19.056" height="17.59" viewBox="0 0 19.056 17.59"> <g id="Icon_ionic-md-heart" data-name="Icon ionic-md-heart" transform="translate(-3.375 -4.5)" fill="none"> <path d="M12.9,22.09l-1.382-1.246C6.614,16.339,3.375,13.415,3.375,9.772A5.182,5.182,0,0,1,8.615,4.5,5.637,5.637,0,0,1,12.9,6.513,5.636,5.636,0,0,1,17.191,4.5a5.182,5.182,0,0,1,5.24,5.272c0,3.643-3.24,6.567-8.146,11.072Z" stroke="none"/> <path d="M 12.90314865112305 20.33962631225586 L 13.60336875915527 19.70488548278809 C 15.91777896881104 17.5803050994873 17.91657829284668 15.74544429779053 19.24294853210449 14.09853458404541 C 20.54890823364258 12.47697448730469 21.13129806518555 11.14271450042725 21.13129806518555 9.772324562072754 C 21.13129806518555 8.680794715881348 20.72836875915527 7.6742844581604 19.99671936035156 6.938194751739502 C 19.26717948913574 6.204214572906494 18.27068901062012 5.799994468688965 17.19081878662109 5.799994468688965 C 15.94527912139893 5.799994468688965 14.71432876586914 6.379414558410645 13.89802837371826 7.349934577941895 L 12.90316867828369 8.532744407653809 L 11.90828895568848 7.349954605102539 C 11.09193897247314 6.379414558410645 9.860988616943359 5.799994468688965 8.615478515625 5.799994468688965 C 7.535608768463135 5.799994468688965 6.53912878036499 6.204214572906494 5.809578418731689 6.938194751739502 C 5.07792854309082 7.6742844581604 4.674998760223389 8.680794715881348 4.674998760223389 9.772324562072754 C 4.674998760223389 11.14271450042725 5.25739860534668 12.47697448730469 6.563388824462891 14.09856510162354 C 7.889778614044189 15.7454948425293 9.888628959655762 17.58039474487305 12.20309829711914 19.70503425598145 L 12.39647579193115 19.8825569152832 L 12.90314865112305 20.33962631225586 M 12.90314865112305 22.09042549133301 L 11.52137851715088 20.84393501281738 C 6.614478588104248 16.33881378173828 3.374998569488525 13.41477489471436 3.374998569488525 9.772324562072754 C 3.374998569488525 6.800544738769531 5.66166877746582 4.49999475479126 8.615478515625 4.49999475479126 C 10.28285884857178 4.49999475479126 11.85491847991943 5.266924858093262 12.90314865112305 6.513144493103027 C 13.95133876800537 5.266924858093262 15.52334880828857 4.49999475479126 17.19081878662109 4.49999475479126 C 20.14463806152344 4.49999475479126 22.43129920959473 6.800544738769531 22.43129920959473 9.772324562072754 C 22.43129920959473 13.41482448577881 19.1917781829834 16.33885383605957 14.28491878509521 20.84393501281738 L 12.90314865112305 22.09042549133301 Z" stroke="none" fill="#222"/> </g></svg><span>'+translateIt("Favorilerim_Baslik")+'</span><div class="favNum"></div></a> </li> <li class="welcC"> <a href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" width="16.961" height="16.96" viewBox="0 0 16.961 16.96"> <g id="Group_2215" data-name="Group 2215" transform="translate(0.2 0.2)"> <path id="Path_5462" data-name="Path 5462" d="M104.933,33.6a1.347,1.347,0,0,0-1.34,1.342v4.882a1.347,1.347,0,0,0,1.34,1.342H109.8a1.347,1.347,0,0,0,1.34-1.342V34.944A1.347,1.347,0,0,0,109.8,33.6Zm0,.753H109.8a.586.586,0,0,1,.587.59v4.882a.586.586,0,0,1-.587.59h-4.867a.586.586,0,0,1-.587-.59V34.944A.586.586,0,0,1,104.933,34.355Z" transform="translate(-103.593 -33.602)" fill="#222" stroke="#222" stroke-width="0.4" fill-rule="evenodd"/> <path id="Path_5463" data-name="Path 5463" d="M373.177,33.6a1.347,1.347,0,0,0-1.34,1.342v4.882a1.347,1.347,0,0,0,1.34,1.342h4.869a1.346,1.346,0,0,0,1.338-1.342V34.944a1.346,1.346,0,0,0-1.338-1.342Zm0,.753h4.869a.586.586,0,0,1,.585.59v4.882a.586.586,0,0,1-.585.59h-4.869a.588.588,0,0,1-.587-.59V34.944A.588.588,0,0,1,373.177,34.355Z" transform="translate(-362.823 -33.602)" fill="#222" stroke="#222" stroke-width="0.4" fill-rule="evenodd"/> <path id="Path_5464" data-name="Path 5464" d="M104.933,301.18a1.347,1.347,0,0,0-1.34,1.342v4.883a1.347,1.347,0,0,0,1.34,1.342H109.8a1.347,1.347,0,0,0,1.34-1.342v-4.883a1.347,1.347,0,0,0-1.34-1.342Zm0,.753H109.8a.588.588,0,0,1,.587.59v4.883a.588.588,0,0,1-.587.59h-4.867a.588.588,0,0,1-.587-.59v-4.883A.588.588,0,0,1,104.933,301.933Z" transform="translate(-103.593 -292.188)" fill="#222" stroke="#222" stroke-width="0.4" fill-rule="evenodd"/> <path id="Path_5465" data-name="Path 5465" d="M373.177,301.18a1.347,1.347,0,0,0-1.34,1.342v4.883a1.347,1.347,0,0,0,1.34,1.342h4.869a1.346,1.346,0,0,0,1.338-1.342v-4.883a1.346,1.346,0,0,0-1.338-1.342Zm0,.753h4.869a.588.588,0,0,1,.585.59v4.883a.588.588,0,0,1-.585.59h-4.869a.591.591,0,0,1-.587-.59v-4.883A.591.591,0,0,1,373.177,301.933Z" transform="translate(-362.823 -292.188)" fill="#222" stroke="#222" stroke-width="0.4" fill-rule="evenodd"/> </g></svg><span>Kategoriler</span></a> </li> </ul> </div>');
    }
    $('.welcC a').on('click', function() {
        $('.newMenuBtnClick a').trigger('click');
    });
}
function SepetEkrani() {
}
function HesabimTakip() {
    $('body').addClass('HesabimTakip');
}
function Iletisimaspx() {
    $('body').addClass('Iletisimaspx');
    var uyead = globalModel.member.memberName;
    var uyemail = globalModel.member.memberEMail;
    $('#mainHolder_txtbxAdSoyad').attr('value',uyead);
    $('#mainHolder_txtbxMail').attr('value',uyemail);
    $('.iletisimLeft,.iletisimRight').wrapAll('<div class="AdBan"></div>');
    $('.iletisimForm').insertAfter('.AdBan');
    $('.iletisimLeftAdres').insertAfter('.iletisimLeftFirmaAdi');
}
function UrunDetayPaylas () {
    var title = $(".ProductName h1 span").text();
    var url = window.location.href;
    var image = location.origin + "" + $('.Images #imgUrunResim').attr('src') + "";
    var description = "";
    $("body").on(clickEvent ,'.product_social_icons',function () {
        if ($(this).attr("content") == "facebook") {
            if (isMobileDevice()) {
                window.open("https://m.facebook.com/sharer.php?u=" + url + "");
            } else {
                window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), "sharer", "toolbar=0,status=0,width=630,height=430");
            }
        } else if ($(this).attr("content") == "twitter") {
            window.open("https://twitter.com/intent/tweet?text=" + $.trim(title) + "&url=" + url + "", "sharer", "toolbar=0,status=0,width=630,height=430");
        } else if ($(this).attr("content") == "pinterest") {
            window.open("https://pinterest.com/pin/create/button/?url=" + url + "&media=" + image + "&description=" + $.trim(title) + "", "sharer", "toolbar=0,status=0,width=630,height=430");
        }
    });
    $('.UWhatsApp').insertAfter('.product_social_icon_wrapper li:last-child');
}
function urunDetayIcon(){
    $('.RightDetail .riSingle a.riDown').html('<svg viewBox="0 0 52.161 52.161"><path d="M52.161,26.081c0,3.246-2.63,5.875-5.875,5.875H5.875C2.63,31.956,0,29.327,0,26.081l0,0c0-3.245,2.63-5.875,5.875-5.875 h40.411C49.531,20.206,52.161,22.835,52.161,26.081L52.161,26.081z"/></svg>');
    $('.RightDetail .riSingle a.riUp').html('<svg viewBox="0 0 309.059 309.059"><path d="M280.71,126.181h-97.822V28.338C182.889,12.711,170.172,0,154.529,0S126.17,12.711,126.17,28.338 v97.843H28.359C12.722,126.181,0,138.903,0,154.529c0,15.621,12.717,28.338,28.359,28.338h97.811v97.843 c0,15.632,12.711,28.348,28.359,28.348c15.643,0,28.359-12.717,28.359-28.348v-97.843h97.822 c15.632,0,28.348-12.717,28.348-28.338C309.059,138.903,296.342,126.181,280.71,126.181z"/></svg>');
    $('#divKritikStok .box1').before('<div class="boxIcon"><svg viewBox="0 0 4.996 21.16"><g transform="translate(-37.543 -13.42)"><path d="M42.2,13.42H37.878a.335.335,0,0,0-.335.335V27.941a.335.335,0,0,0,.335.335H42.2a.335.335,0,0,0,.335-.335V13.755A.335.335,0,0,0,42.2,13.42Zm-.335,14.186H38.213V14.09h3.656Z"/><path d="M42.2,61.667H37.878a.335.335,0,0,0-.335.335v4.326a.335.335,0,0,0,.335.335H42.2a.335.335,0,0,0,.335-.335V62A.335.335,0,0,0,42.2,61.667Zm-.335,4.326H38.213V62.337h3.656Z" transform="translate(0 -32.083)"/></g></svg></div>');
    $('.UTelefonlaSiparis .box1').before('<div class="boxIcon"><svg viewBox="0 0 202.592 202.592"><path d="M198.048,160.105l-31.286-31.29c-6.231-6.206-16.552-6.016-23.001,0.433l-15.761,15.761 c-0.995-0.551-2.026-1.124-3.11-1.732c-9.953-5.515-23.577-13.074-37.914-27.421C72.599,101.48,65.03,87.834,59.5,77.874 c-0.587-1.056-1.145-2.072-1.696-3.038l10.579-10.565l5.2-5.207c6.46-6.46,6.639-16.778,0.419-23.001L42.715,4.769 c-6.216-6.216-16.541-6.027-23.001,0.433l-8.818,8.868l0.243,0.24c-2.956,3.772-5.429,8.124-7.265,12.816 c-1.696,4.466-2.752,8.729-3.235,12.998c-4.13,34.25,11.52,65.55,53.994,108.028c58.711,58.707,106.027,54.273,108.067,54.055 c4.449-0.53,8.707-1.593,13.038-3.275c4.652-1.818,9.001-4.284,12.769-7.233l0.193,0.168l8.933-8.747 C204.079,176.661,204.265,166.343,198.048,160.105z M190.683,176.164l-3.937,3.93l-1.568,1.507 c-2.469,2.387-6.743,5.74-12.984,8.181c-3.543,1.364-7.036,2.24-10.59,2.663c-0.447,0.043-44.95,3.84-100.029-51.235 C14.743,94.38,7.238,67.395,10.384,41.259c0.394-3.464,1.263-6.95,2.652-10.593c2.462-6.277,5.812-10.547,8.181-13.02l5.443-5.497 c2.623-2.63,6.714-2.831,9.112-0.433l31.286,31.286c2.394,2.401,2.205,6.492-0.422,9.13L45.507,73.24l1.95,3.282 c1.084,1.829,2.23,3.879,3.454,6.106c5.812,10.482,13.764,24.83,29.121,40.173c15.317,15.325,29.644,23.27,40.094,29.067 c2.258,1.249,4.32,2.398,6.17,3.5l3.289,1.95l21.115-21.122c2.634-2.623,6.739-2.817,9.137-0.426l31.272,31.279 C193.5,169.446,193.31,173.537,190.683,176.164z"/> </svg></div>');
    $('.UFavorilerimeEkle .box1').before('<div class="boxIcon"><svg viewBox="0 -28 512.001 512" ><path d="m256 455.515625c-7.289062 0-14.316406-2.640625-19.792969-7.4375-20.683593-18.085937-40.625-35.082031-58.21875-50.074219l-.089843-.078125c-51.582032-43.957031-96.125-81.917969-127.117188-119.3125-34.644531-41.804687-50.78125-81.441406-50.78125-124.742187 0-42.070313 14.425781-80.882813 40.617188-109.292969 26.503906-28.746094 62.871093-44.578125 102.414062-44.578125 29.554688 0 56.621094 9.34375 80.445312 27.769531 12.023438 9.300781 22.921876 20.683594 32.523438 33.960938 9.605469-13.277344 20.5-24.660157 32.527344-33.960938 23.824218-18.425781 50.890625-27.769531 80.445312-27.769531 39.539063 0 75.910156 15.832031 102.414063 44.578125 26.191406 28.410156 40.613281 67.222656 40.613281 109.292969 0 43.300781-16.132812 82.9375-50.777344 124.738281-30.992187 37.398437-75.53125 75.355469-127.105468 119.308594-17.625 15.015625-37.597657 32.039062-58.328126 50.167969-5.472656 4.789062-12.503906 7.429687-19.789062 7.429687zm-112.96875-425.523437c-31.066406 0-59.605469 12.398437-80.367188 34.914062-21.070312 22.855469-32.675781 54.449219-32.675781 88.964844 0 36.417968 13.535157 68.988281 43.882813 105.605468 29.332031 35.394532 72.960937 72.574219 123.476562 115.625l.09375.078126c17.660156 15.050781 37.679688 32.113281 58.515625 50.332031 20.960938-18.253907 41.011719-35.34375 58.707031-50.417969 50.511719-43.050781 94.136719-80.222656 123.46875-115.617188 30.34375-36.617187 43.878907-69.1875 43.878907-105.605468 0-34.515625-11.605469-66.109375-32.675781-88.964844-20.757813-22.515625-49.300782-34.914062-80.363282-34.914062-22.757812 0-43.652344 7.234374-62.101562 21.5-16.441406 12.71875-27.894532 28.796874-34.609375 40.046874-3.453125 5.785157-9.53125 9.238282-16.261719 9.238282s-12.808594-3.453125-16.261719-9.238282c-6.710937-11.25-18.164062-27.328124-34.609375-40.046874-18.449218-14.265626-39.34375-21.5-62.097656-21.5zm0 0"/></svg></div>');
    $('.UIstekListemeEkle .box1').before('<div class="boxIcon"><svg viewBox="0 0 26.193 20.595"><g transform="translate(-33.5 -38.598)"><path d="M42.961,53.273a.637.637,0,0,1-.454-.363.545.545,0,0,1,.454-.545l12.443-1a2.542,2.542,0,0,0,2.089-1.635l2-5.45c0-.091,0-.272-.091-.272H40.054a.454.454,0,1,1,0-.908H59.219a1.451,1.451,0,0,1,1,.454,1.36,1.36,0,0,1,.091,1.181l-2,5.45A3.451,3.451,0,0,1,55.4,52.274l-12.353,1Z" transform="translate(-0.709 -0.459)"/><path d="M45.943,60.886a2.544,2.544,0,1,1,2.543-2.547v0A2.544,2.544,0,0,1,45.943,60.886Zm0-4.178a1.635,1.635,0,1,0,1.635,1.635h0A1.635,1.635,0,0,0,45.943,56.708Z" transform="translate(-0.971 -1.695)"/><path d="M58.443,60.886A2.544,2.544,0,0,1,55.9,58.343,2.635,2.635,0,0,1,58.443,55.8a2.544,2.544,0,0,1,2.543,2.543,2.452,2.452,0,0,1-2.358,2.543Q58.536,60.89,58.443,60.886Zm0-4.178a1.635,1.635,0,1,0,1.635,1.635h0a1.635,1.635,0,0,0-1.635-1.635Z" transform="translate(-2.204 -1.696)"/><path d="M45.051,55.131a3.156,3.156,0,0,1-2.888-1.817v-.182l-.271-.636h0L37.922,39.508H33.951a.454.454,0,0,1,0-.908h4.332a.45.45,0,0,1,.451.272L42.8,52.315h0l.18.545a2.166,2.166,0,0,0,2.076,1.362h11.19a.454.454,0,0,1,0,.908Z"/></g></svg></div>');
    $('.UKarsilastirma .box1').before('<div class="boxIcon"><svg viewBox="0 0 13.262 17.691"><g transform="translate(-391 -905.499)"><path d="M16.333,11.421a.6.6,0,0,0,0,.848l2.8,2.805H8.469a.6.6,0,0,0,0,1.2H19.124l-2.8,2.805a.606.606,0,0,0,0,.848.6.6,0,0,0,.843,0l3.8-3.823h0a.672.672,0,0,0,.124-.189.572.572,0,0,0,.046-.23.6.6,0,0,0-.17-.419l-3.8-3.823A.587.587,0,0,0,16.333,11.421Z" transform="translate(383.125 894.247)"/><path d="M12.687,11.421a.6.6,0,0,1,0,.848L9.9,15.074H20.55a.6.6,0,0,1,0,1.2H9.9l2.8,2.805a.606.606,0,0,1,0,.848.6.6,0,0,1-.843,0L8.052,16.1h0a.673.673,0,0,1-.124-.189.572.572,0,0,1-.046-.23.6.6,0,0,1,.17-.419l3.8-3.823A.587.587,0,0,1,12.687,11.421Z" transform="translate(383.118 903.093)"/></g></svg></div>');
    $('.UindirimliUrun .box1').before('<div class="boxIcon"><svg viewBox="0 0 487.222 487.222"><path d="M486.554,186.811c-1.6-4.9-5.8-8.4-10.9-9.2l-152-21.6l-68.4-137.5c-2.3-4.6-7-7.5-12.1-7.5l0,0c-5.1,0-9.8,2.9-12.1,7.6 l-67.5,137.9l-152,22.6c-5.1,0.8-9.3,4.3-10.9,9.2s-0.2,10.3,3.5,13.8l110.3,106.9l-25.5,151.4c-0.9,5.1,1.2,10.2,5.4,13.2 c2.3,1.7,5.1,2.6,7.9,2.6c2.2,0,4.3-0.5,6.3-1.6l135.7-71.9l136.1,71.1c2,1,4.1,1.5,6.2,1.5l0,0c7.4,0,13.5-6.1,13.5-13.5 c0-1.1-0.1-2.1-0.4-3.1l-26.3-150.5l109.6-107.5C486.854,197.111,488.154,191.711,486.554,186.811z M349.554,293.911 c-3.2,3.1-4.6,7.6-3.8,12l22.9,131.3l-118.2-61.7c-3.9-2.1-8.6-2-12.6,0l-117.8,62.4l22.1-131.5c0.7-4.4-0.7-8.8-3.9-11.9 l-95.6-92.8l131.9-19.6c4.4-0.7,8.2-3.4,10.1-7.4l58.6-119.7l59.4,119.4c2,4,5.8,6.7,10.2,7.4l132,18.8L349.554,293.911z"/> </svg></div>');
    $('.FiyatHaberVer .box1').before('<div class="boxIcon"><svg xmlns="http://www.w3.org/2000/svg" width="16.89" height="17.914" viewBox="0 0 16.89 17.914"> <path id="Union_3" data-name="Union 3" d="M-5963.635,17.414h-14.34A1.028,1.028,0,0,1-5979,16.39v-2.05a1.028,1.028,0,0,1,1.025-1.023,1.027,1.027,0,0,1,1.025,1.023v1.025h12.292V14.341a1.027,1.027,0,0,1,1.023-1.023,1.027,1.027,0,0,1,1.025,1.023v2.05a1.027,1.027,0,0,1-1.025,1.023Zm-7.764-5.306-4.1-2.889a1.026,1.026,0,0,1-.246-1.424,1.02,1.02,0,0,1,.667-.42,1.016,1.016,0,0,1,.768.174l2.481,1.734c0-.021,0-.042,0-.064V1.025A1.027,1.027,0,0,1-5970.8,0a1.027,1.027,0,0,1,1.023,1.025v8.2l2.458-1.852a1.027,1.027,0,0,1,1.435.206,1.025,1.025,0,0,1-.2,1.433l-4.1,3.073a1.027,1.027,0,0,1-.614.206A1.031,1.031,0,0,1-5971.4,12.108Z" transform="translate(5979.25 0.25)" fill="#231f20" stroke="#fff" stroke-width="0.5"/></svg></div>');
    $('#divTahminiTeslimatSuresi').prepend('<div class="boxIcon"><svg xmlns="http://www.w3.org/2000/svg" width="18.843" height="14.134" viewBox="0 0 18.843 14.134"> <path id="Path_10" data-name="Path 10" d="M19.159,11.534H16.8V8.587A.591.591,0,0,0,16.213,8H3.257a.587.587,0,0,0-.587.587v10.6a.588.588,0,0,0,.587.592h.587V9.179h11.78V16.07a3.592,3.592,0,0,1,.919-.119H16.8V12.713h2.354a1.178,1.178,0,0,1,1.179,1.175v.592H17.98v1.175h2.359V18.6H18.925a2.674,2.674,0,0,0-4.912,0H9.989a2.649,2.649,0,0,0-2.456-1.625,2.579,2.579,0,1,0,2.628,2.8h3.7a2.644,2.644,0,0,0,5.252,0h1.815a.588.588,0,0,0,.587-.592v-5.3A2.354,2.354,0,0,0,19.159,11.534ZM7.533,20.955a1.4,1.4,0,1,1,0-2.8,1.4,1.4,0,1,1,0,2.8Zm8.936,0a1.4,1.4,0,1,1,1.471-1.4A1.432,1.432,0,0,1,16.469,20.955Z" transform="translate(-2.67 -8)"/></svg></div>');
    $('.UrunKargoBedava .box1').before('<div class="boxIcon"><svg xmlns="http://www.w3.org/2000/svg" width="18.843" height="14.134" viewBox="0 0 18.843 14.134"> <path id="Path_10" data-name="Path 10" d="M19.159,11.534H16.8V8.587A.591.591,0,0,0,16.213,8H3.257a.587.587,0,0,0-.587.587v10.6a.588.588,0,0,0,.587.592h.587V9.179h11.78V16.07a3.592,3.592,0,0,1,.919-.119H16.8V12.713h2.354a1.178,1.178,0,0,1,1.179,1.175v.592H17.98v1.175h2.359V18.6H18.925a2.674,2.674,0,0,0-4.912,0H9.989a2.649,2.649,0,0,0-2.456-1.625,2.579,2.579,0,1,0,2.628,2.8h3.7a2.644,2.644,0,0,0,5.252,0h1.815a.588.588,0,0,0,.587-.592v-5.3A2.354,2.354,0,0,0,19.159,11.534ZM7.533,20.955a1.4,1.4,0,1,1,0-2.8,1.4,1.4,0,1,1,0,2.8Zm8.936,0a1.4,1.4,0,1,1,1.471-1.4A1.432,1.432,0,0,1,16.469,20.955Z" transform="translate(-2.67 -8)"/></svg></div>');
    setTimeout(function () {
        $('.UGelinceHaberVer .box1').before('<div class="boxIcon"><svg viewBox="0 0 15.863 19.856"><g transform="translate(-6.775 -3.93)"><path d="M18.7,28.336a.643.643,0,0,0-.63.506,1.244,1.244,0,0,1-.248.541.938.938,0,0,1-.8.293.954.954,0,0,1-.8-.293,1.244,1.244,0,0,1-.248-.541.643.643,0,0,0-.63-.506h0a.647.647,0,0,0-.63.789,2.217,2.217,0,0,0,2.308,1.841,2.213,2.213,0,0,0,2.308-1.841.65.65,0,0,0-.63-.789Z" transform="translate(-2.332 -7.18)"/><path d="M22.439,18.635c-.764-1.007-2.268-1.6-2.268-6.109,0-4.63-2.045-6.491-3.95-6.938-.179-.045-.308-.1-.308-.293V5.151A1.217,1.217,0,0,0,14.722,3.93h-.03A1.217,1.217,0,0,0,13.5,5.151V5.3c0,.184-.129.248-.308.293-1.911.452-3.95,2.308-3.95,6.938,0,4.511-1.5,5.1-2.268,6.109a.985.985,0,0,0,.789,1.578h13.9A.986.986,0,0,0,22.439,18.635Zm-1.935.288H8.931a.218.218,0,0,1-.164-.362A6.012,6.012,0,0,0,9.809,16.9a11.246,11.246,0,0,0,.71-4.377,7.611,7.611,0,0,1,1.037-4.308,3.184,3.184,0,0,1,1.921-1.37,1.739,1.739,0,0,0,.923-.521.392.392,0,0,1,.591-.01,1.8,1.8,0,0,0,.933.531,3.184,3.184,0,0,1,1.921,1.37,7.611,7.611,0,0,1,1.037,4.308,11.246,11.246,0,0,0,.71,4.377,6.081,6.081,0,0,0,1.067,1.682A.205.205,0,0,1,20.5,18.923Z"/></g></svg></div>');
    },200);
    $('div.YorumYazbtnContent > a').prepend('<div class="boxIcon"><svg viewBox="0 0 16.994 16.991"><path d="M22.242,6.82a2.606,2.606,0,0,0-3.682,0l-.612.612L7.933,17.446v.01a.253.253,0,0,0-.05.077.052.052,0,0,0,0,.015h0L6.019,22.662a.294.294,0,0,0,.07.307.285.285,0,0,0,.207.079.292.292,0,0,0,.093-.017l5.11-1.839h.015a.253.253,0,0,0,.077-.05h0L21.627,11.107l.614-.616A2.61,2.61,0,0,0,22.242,6.82ZM18.15,8.044l1.221,1.221-9.6,9.6L8.549,17.639ZM7.16,21.225a3.029,3.029,0,0,1,.665.665l-1.051.386Zm1.229.471a3.741,3.741,0,0,0-.456-.58,3.639,3.639,0,0,0-.58-.456l.9-2.481,1.308,1.308L10.87,20.8ZM11.411,20.5l-1.227-1.221,9.6-9.6L21.005,10.9ZM21.826,10.079l-.406.412L19.993,9.063,18.559,7.629l.406-.406a2.021,2.021,0,0,1,2.861,2.855Z" transform="translate(-6.001 -6.058)"/></svg></div>');
    $('div.TavsiyeEtBtnContent > a').prepend('<div class="boxIcon"><svg viewBox="0 0 22.635 20"><g transform="translate(-0.081 -5.859)"><g transform="translate(0.081 5.859)"><g transform="translate(0 0)"><path d="M22.716,15.54a2.781,2.781,0,0,1-.138.424c-.127.249-.279.487-.41.735a.315.315,0,0,0-.05.227,2.244,2.244,0,0,1-.372,2.292.245.245,0,0,0-.052.277,2.2,2.2,0,0,1-.295,2.14.537.537,0,0,0-.107.492,2.4,2.4,0,0,1-.567,2.356,2.079,2.079,0,0,1-1.134.6,6.549,6.549,0,0,1-1.163.125H9.813a2.639,2.639,0,0,1-1.453-.474.544.544,0,0,0-.431-.109,3.1,3.1,0,0,1-.034.415.907.907,0,0,1-.832.814,1.789,1.789,0,0,1-.2,0H1.132a.97.97,0,0,1-1.047-.888c0-.021,0-.041,0-.062V15.939a1.011,1.011,0,0,1,1.061-1.075H7.617a3.625,3.625,0,0,1,.453.086.308.308,0,0,0,.227-.027,7.034,7.034,0,0,0,.66-.737,30.159,30.159,0,0,0,2.353-3.866,1.392,1.392,0,0,0,.17-.723c-.029-.746-.029-1.494-.057-2.24a1.238,1.238,0,0,1,.655-1.179,2.41,2.41,0,0,1,2.623.145,1.5,1.5,0,0,1,.4.6c.279.68.544,1.376.78,2.077a4.491,4.491,0,0,1,.1,2.353c-.118.6-.2,1.2-.306,1.8-.034.2-.027.227.181.227h4.9a2.1,2.1,0,0,1,1.134.27,1.712,1.712,0,0,1,.755,1.079c.018.07.041.138.061.206v.614Zm-8.209-1.224c.177-1.05.356-2.077.519-3.1a4.569,4.569,0,0,0,.1-1.106,9.085,9.085,0,0,0-.884-2.793.68.68,0,0,0-.506-.453,1.533,1.533,0,0,0-1.134.1.406.406,0,0,0-.247.413q.045,1.238.045,2.476a1.684,1.684,0,0,1-.1.578,3.969,3.969,0,0,1-.331.68c-.68,1.113-1.36,2.231-2.059,3.33A4.266,4.266,0,0,1,8.7,15.8c-.322.209-.646.422-.959.642a.307.307,0,0,0-.125.209v6.724c0,.134.057.147.172.161a3.267,3.267,0,0,1,.644.134,1.778,1.778,0,0,1,.4.243,2,2,0,0,0,1.156.347h8.534a3.887,3.887,0,0,0,.506-.029,1.479,1.479,0,0,0,1.047-.605,1.037,1.037,0,0,0,.059-1.274,2.762,2.762,0,0,0-.524-.4.406.406,0,0,1,.145-.156,1.467,1.467,0,0,0,1.057-1.018.918.918,0,0,0-.29-1.054,3.77,3.77,0,0,0-.508-.279.652.652,0,0,1,.2-.195,1.4,1.4,0,0,0,.862-.614,1,1,0,0,0-.453-1.619.2.2,0,0,1-.118-.122.168.168,0,0,1,.145-.188h0a1.41,1.41,0,0,0,1.081-1.217.907.907,0,0,0-.494-1.045,1.661,1.661,0,0,0-.63-.118h-6.1Zm-7.738,1.51c-.073,0-.127-.011-.179-.011H1.221a.156.156,0,0,0-.193.195v8.713a.172.172,0,0,0,.211.213h5.3c.227,0,.227,0,.227-.238V15.835Z" transform="translate(-0.081 -5.859)"/></g></g></g></svg></div>');
    $('.ProductIcon2 > div.hidden-phone > a').prepend('<div class="boxIcon"><svg viewBox="0 0 360 360"><path d="M300,82.5v-50H60v50H0v200h60v45h240v-45h60v-200H300z M80,82.5v-30h200v30v50H80V82.5z M280,282.5v25H80v-25v-50h200 V282.5z M340,262.5h-40v-50H60v50H20v-160h40v50h240v-50h40V262.5z"/> <rect x="220" y="172.5" width="30" height="20"/> <rect x="270" y="172.5" width="30" height="20"/> </svg></div>');
    $('.SoruSorbtnContent > a').prepend('<div class="boxIcon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15.334" viewBox="0 0 16 15.334"> <path id="Union_514" data-name="Union 514" d="M-3952.8-5065.067l-1.9-2.533a1,1,0,0,0-.8-.4h-2.5a2,2,0,0,1-2-2v-8a2,2,0,0,1,2-2h12a2,2,0,0,1,2,2v8a2,2,0,0,1-2,2h-2.5a1,1,0,0,0-.8.4l-1.9,2.533a.994.994,0,0,1-.8.4A.994.994,0,0,1-3952.8-5065.067ZM-3959-5078v8a1,1,0,0,0,1,1h2.5a2,2,0,0,1,1.6.8l1.9,2.533,1.9-2.533a2,2,0,0,1,1.6-.8h2.5a1,1,0,0,0,1-1v-8a1,1,0,0,0-1-1h-12A1,1,0,0,0-3959-5078Zm2.5,7a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5h5a.5.5,0,0,1,.5.5.5.5,0,0,1-.5.5Zm0-2.5a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5.5.5,0,0,1-.5.5Zm0-2.5a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5.5.5,0,0,1-.5.5Z" transform="translate(3960 5080)"/></svg></div>');
    $('.UAddToCollection > a').prepend('<div class="boxIcon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13"> <path id="Path_10519" data-name="Path 10519" d="M158.235,2.559a.5.5,0,0,0-.47,0l-7.5,4a.5.5,0,0,0,0,.882L153.188,9l-2.923,1.559a.5.5,0,0,0,0,.882l7.5,4a.5.5,0,0,0,.47,0l7.5-4a.5.5,0,0,0,0-.882L162.812,9l2.923-1.559a.5.5,0,0,0,0-.882Zm3.515,7.008L164.438,11,158,14.433,151.562,11l2.688-1.433,3.515,1.875a.5.5,0,0,0,.47,0Zm-3.75.867L151.562,7,158,3.567,164.438,7Z" transform="translate(-150 -2.5)"/></svg></div>');
    $('body').on('click' ,'.UGelinceHaberVer',function(){
        setTimeout(function(){
            $('.UGelinceHaberVer .box1').before('<div class="boxIcon"><svg viewBox="0 0 15.863 19.856"><g transform="translate(-6.775 -3.93)"><path d="M18.7,28.336a.643.643,0,0,0-.63.506,1.244,1.244,0,0,1-.248.541.938.938,0,0,1-.8.293.954.954,0,0,1-.8-.293,1.244,1.244,0,0,1-.248-.541.643.643,0,0,0-.63-.506h0a.647.647,0,0,0-.63.789,2.217,2.217,0,0,0,2.308,1.841,2.213,2.213,0,0,0,2.308-1.841.65.65,0,0,0-.63-.789Z" transform="translate(-2.332 -7.18)"/><path d="M22.439,18.635c-.764-1.007-2.268-1.6-2.268-6.109,0-4.63-2.045-6.491-3.95-6.938-.179-.045-.308-.1-.308-.293V5.151A1.217,1.217,0,0,0,14.722,3.93h-.03A1.217,1.217,0,0,0,13.5,5.151V5.3c0,.184-.129.248-.308.293-1.911.452-3.95,2.308-3.95,6.938,0,4.511-1.5,5.1-2.268,6.109a.985.985,0,0,0,.789,1.578h13.9A.986.986,0,0,0,22.439,18.635Zm-1.935.288H8.931a.218.218,0,0,1-.164-.362A6.012,6.012,0,0,0,9.809,16.9a11.246,11.246,0,0,0,.71-4.377,7.611,7.611,0,0,1,1.037-4.308,3.184,3.184,0,0,1,1.921-1.37,1.739,1.739,0,0,0,.923-.521.392.392,0,0,1,.591-.01,1.8,1.8,0,0,0,.933.531,3.184,3.184,0,0,1,1.921,1.37,7.611,7.611,0,0,1,1.037,4.308,11.246,11.246,0,0,0,.71,4.377,6.081,6.081,0,0,0,1.067,1.682A.205.205,0,0,1,20.5,18.923Z"/></g></svg></div>');
        },200);
    });
    FavoriIslemCallback();
}
function FavoriIslemCallback(){//svg kullanmıyorsa çalıştırma...
    if (globalModel.pageType == 'productdetail') {
        setTimeout(function(){
            var favList = GetFavoriListe().filter((x)=>{return x.productId == productDetailModel.productId})
            if (favList.length > 0) {
                favoriButtonDurumDegister(1,$('.UFavorilerimeEkle > a'))
            }else{
                favoriButtonDurumDegister(0,$('.UFavorilerimeEkle > a'))
            }
            if ($('.UFavorilerimeEkle #aFavoriEkleBtn').length>0) {
                $('.UFavorilerimeEkle .boxIcon').html('<svg viewBox="0 -28 512.001 512" ><path d="m256 455.515625c-7.289062 0-14.316406-2.640625-19.792969-7.4375-20.683593-18.085937-40.625-35.082031-58.21875-50.074219l-.089843-.078125c-51.582032-43.957031-96.125-81.917969-127.117188-119.3125-34.644531-41.804687-50.78125-81.441406-50.78125-124.742187 0-42.070313 14.425781-80.882813 40.617188-109.292969 26.503906-28.746094 62.871093-44.578125 102.414062-44.578125 29.554688 0 56.621094 9.34375 80.445312 27.769531 12.023438 9.300781 22.921876 20.683594 32.523438 33.960938 9.605469-13.277344 20.5-24.660157 32.527344-33.960938 23.824218-18.425781 50.890625-27.769531 80.445312-27.769531 39.539063 0 75.910156 15.832031 102.414063 44.578125 26.191406 28.410156 40.613281 67.222656 40.613281 109.292969 0 43.300781-16.132812 82.9375-50.777344 124.738281-30.992187 37.398437-75.53125 75.355469-127.105468 119.308594-17.625 15.015625-37.597657 32.039062-58.328126 50.167969-5.472656 4.789062-12.503906 7.429687-19.789062 7.429687zm-112.96875-425.523437c-31.066406 0-59.605469 12.398437-80.367188 34.914062-21.070312 22.855469-32.675781 54.449219-32.675781 88.964844 0 36.417968 13.535157 68.988281 43.882813 105.605468 29.332031 35.394532 72.960937 72.574219 123.476562 115.625l.09375.078126c17.660156 15.050781 37.679688 32.113281 58.515625 50.332031 20.960938-18.253907 41.011719-35.34375 58.707031-50.417969 50.511719-43.050781 94.136719-80.222656 123.46875-115.617188 30.34375-36.617187 43.878907-69.1875 43.878907-105.605468 0-34.515625-11.605469-66.109375-32.675781-88.964844-20.757813-22.515625-49.300782-34.914062-80.363282-34.914062-22.757812 0-43.652344 7.234374-62.101562 21.5-16.441406 12.71875-27.894532 28.796874-34.609375 40.046874-3.453125 5.785157-9.53125 9.238282-16.261719 9.238282s-12.808594-3.453125-16.261719-9.238282c-6.710937-11.25-18.164062-27.328124-34.609375-40.046874-18.449218-14.265626-39.34375-21.5-62.097656-21.5zm0 0"/></svg>');
            }else{
                $('.UFavorilerimeEkle .boxIcon').html('<svg viewBox="0 0 18.439 17.175"><path d="M11.719,20.5l-1.264-1.151C5.965,15.277,3,12.592,3,9.3A4.749,4.749,0,0,1,7.8,4.5a5.221,5.221,0,0,1,3.924,1.822A5.221,5.221,0,0,1,15.643,4.5a4.749,4.749,0,0,1,4.8,4.8c0,3.3-2.965,5.981-7.455,10.062Z" transform="translate(-2.5 -4)"/></svg>');
            }
        },500)
    }
}
function HeaderFixed() {
    var sepetsayfakontrol = $("body").find(".BasketPage").length;
    if (sepetsayfakontrol == 0) {
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 100){
                $('#headerNew').addClass('fixed');
                $('body').addClass('margin');
            }
            else {
                $('#headerNew').removeClass('fixed');
                $('body').removeClass('margin');
            }
            if ($(this).scrollTop() > 150){
                $('#headerNew').addClass('gectop');
            }
            else {
                $('#headerNew').removeClass('gectop');
            }
        });
    }
}
