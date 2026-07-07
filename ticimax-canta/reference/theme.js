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
    if (globalModel.pageType == 'productdetail') {UrunDetayIslemleri(); }
    if (globalModel.pageType == 'cart' || globalModel.pageType == 'ordercomplete'|| globalModel.pageType == 'payment'|| globalModel.pageType == 'ordercompleted') { SepetEkrani(); }
    GlobalIslemler();
});
function HeaderIslemleri(){
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
    $('.newSearcBtnClick a').on('click', function() {
        $('#divIcerik').toggleClass('hoverr');
    });
    if(windowidth < 768){
        $('.footerMenuTitle').click(function(){
            $(this).parent().find('ul').slideToggle();
        });
    }
    $('body .footerTemp .newsletterContent #btnMailKaydet').html('<svg width="26" height="26" viewBox="0 0 26 26"> <path id="Path_5368" data-name="Path 5368" d="M13,0A13,13,0,1,1,0,13,13,13,0,0,1,13,0ZM7.313,12.188a.813.813,0,0,0,0,1.625h9.413L13.238,17.3a.813.813,0,0,0,1.149,1.149l4.875-4.875a.813.813,0,0,0,0-1.149L14.387,7.55A.812.812,0,1,0,13.238,8.7l3.488,3.488Z" fill="#b7b7b7"/> </svg>');
}
$(window).on('load', function() {//sayfa yuklenmesi
    if ($(".hesabimBolumuTutucu").length > 0) { HesabimTakip(); }
    if ($(".iletisimContent").length > 0) { Iletisimaspx(); }
});
$(window).on("scroll", function() {//sayfa scroll
    SayfaTasarimScrollRun();
    customScrollRun();
    if (windowidth<360) {bottomHead();}
});
function GlobalIslemler() {//genel islemler
    if (!pageInitialized && windowidth > 767) {}
    if ($('.breadcrumb').length > 0) {
        var breadHtml = $('ul.breadcrumb').html();
        $('ul.breadcrumb').after('<div class="breadList" style="display:none;"><div class="mBread"><ul class="breadcrumbList">'+breadHtml+'</ul></div><div class="clbtn"><i class="far fa-times"></i></div></div>');
        var liS = $(".breadcrumbList li");
        $(".breadcrumbList li").each(function(index){if (index > 0){var ul = $("<ul/>"); $(this).appendTo(ul); ul.appendTo(liS[index-1]); } });
        $('body').on('click' ,'.breadcrumb',function(){$('.breadList').addClass('breadActive').show();$(this).addClass('zindex'); });
        $('body').on('click' ,'.clbtn',function(){$('.breadList').removeClass('breadActive').hide();$('.breadcrumb').removeClass('zindex'); });
    }
    HeaderFixed();
    SayfaTasarim();
    if (windowidth>359 && windowidth < 769) { bottomHead(); }
}
function rightSideCartRefresh(model){//kodlar buraya gelecek
}
function sepetBindRefresh(res){//sepet kontrol
}
function SayfaTasarim() {//sayfada yapilacak islemler
    if ($('#mainHolder_divDesign').length>0) {
        urunKartCallBack();
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
        if ($(this).find('.productIconEx').length == 0) {
            $(this).append('<div class="productIconEx"></div>');
        }
        $(this).find('.discountIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.newIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.cargoIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.firsatIcon').appendTo($(this).find('.productIconEx'));
        $(this).find('.hizliKargoIcon').appendTo($(this).find('.productIconEx'));
        if ($(this).find('.productIconExSpecial').length == 0) {
            $(this).append('<div class="productIconExSpecial"></div>');
        }
        $(this).find('.ozelAlan1').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan2').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan3').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan4').appendTo($(this).find('.productIconExSpecial'));
        $(this).find('.ozelAlan5').appendTo($(this).find('.productIconExSpecial'));
        if ($(this).find('.productIconExButtons').length == 0) {
            $(this).find('.productImage').append('<div class="productIconExButtons"></div>');
        }
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
    if (windowidth>1042) {
        setTimeout(function () { $('#divSayfalamaUst').prepend('<div class="categoryPageTitle"><span>'+ productsModel.pageName +'</span></div>'); },500);
    }else{
        setTimeout(function () { $('#divSayfalamaUst').before('<div class="categoryPageTitle"><span>'+ productsModel.pageName +'</span></div>'); },500);
    }
    if ($('body').find('.mobilaf').length == 0) {
        $('body').append('<div class="mobilaf"></div>');
    }
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
        $('.markaresmi').insertBefore('.ProductName');
        $('#divMagazaStok').insertAfter('.ProductName');
        $('#divTahminiTeslimatSuresi').insertAfter('.ProductName');
        $('#divParaPuan').insertAfter('.ProductName');
        $('#divToplamStokAdedi').insertAfter('.ProductName');
        $('#divUrunStokAdedi').insertAfter('.ProductName');
        $('#divTedarikci').insertAfter('.ProductName');
        $('#divBarkod').insertAfter('.ProductName');
        $('.puanVer').insertAfter('.ProductName');
        $('#divMarka').insertAfter('.ProductName');
        $('#divUrunKodu').insertAfter('.ProductName');
        //alt ekler
        $('#divKombinSatinAl').insertAfter('.basketBtn');
        $('.buyfast').insertAfter('.basketBtn');
        $('#divAdetCombo').insertBefore('.basketBtn');
        $('#divTaksitAciklama').insertAfter('#pnlFiyatlar');
        $('#divAdetCombo .left_line').insertBefore('#divAdetCombo');
        $('.pSatisBirimi').insertBefore('.Basketinp');
        urunDetayIcon();
        $('#divIndirimOrani').insertBefore('.PriceList');
        $('.urunOzellik').prependTo('.BottomList');
        if ($('.RightDetail').find('.proDetailArea').length == 0) {
            $('#pnlFiyatlar').after('<div class="proDetailArea"></div>');
        }
        $('#divOzelAlan1').appendTo('.proDetailArea');
        $('#divOzelAlan2').appendTo('.proDetailArea');
        $('#divOzelAlan3').appendTo('.proDetailArea');
        $('#divOzelAlan4').appendTo('.proDetailArea');
        $('#divOzelAlan5').appendTo('.proDetailArea');
        $('#divOnyazi').insertAfter('#pnlFiyatlar');
    }
}
function UrunDetayIslemleri() {//urundetay sayfasi
    setTimeout(()=>{
        $('#productDetailRelated > a').each(function() {
                if ($(this).prop('href') == window.location.href) {
                    $(this).addClass('active');
                }
            });
        }
    , 750);
}
function blockCompleteCallback() {//blokyuklenme
    if (globalModel.pageType == 'homepage') {
    }
    if ($('#divSayfalamaUst').length>0) {
    }
    if (globalModel.pageType == 'productdetail') {
        setTimeout(function(){
            if (windowidth>1025) {
                if ($('#divVideoGoruntulemeAlan video').length>0) {
                    $("#divVideoGoruntulemeAlan").prependTo(".SmallImages");
                }
                $('.SmallImages div img').on('click',function(){
                    setTimeout(function () {
                        $('#imgUrunResim').click();
                        document.getElementById("vdUrunVideo").play();
                    },500);
                });
                $("body").on("click", ".leftImage .thumb-item", function (e) {
                    var sayi = $(this).index();
                    if (typeof e.originalEvent != "undefined") {
                        $(".GalleryArea .owl-item:eq("+sayi+") #thumb0 a").trigger("click");
                    }
                });
            }
        },500);
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
        $('.detaySliderContainer .jCarouselLite ul').owlCarousel({
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
            $('body #divSayfalamaUst .category-vertical-filters.top-filters .FiltreicerikAlan').after('<div class="filtreAlt"><div class="filtreUygulaBtn"><span>'+translateIt("Urunler_FiltrelemeyiKaydet")+'</span></div><a class="clear" onclick="clearAllFilters()"><span>'+translateIt("Urunler_FiltrelemeKaldir")+'</span></a></div>');
            $('body #divSayfalamaUst .category-vertical-filters.top-filters').prepend('<div class="tukgo"><a onclick="sortingClick(1000)" class="filterOrderInStock">'+translateIt("Urunler_Stoktakiler")+'</a></div>');
            $('body #divSayfalamaUst .category-vertical-filters.top-filters').prepend('<div class="FiltreUst"><div class="closeFilt"><i class="fal fa-times"></i></div><span>'+translateIt("UrunFiltreleme_Filtreleme")+'</span><a onclick="clearAllFilters()"><i class="fal fa-trash"></i></a></div>');
            if ($('.moreNum').length==0) {
                $('#divSayfalamaUst .category-vertical-filters.top-filters .panel').find('.panel-heading').append('<div class="moreNum"></div>');
            }
            $('body').on(clickEvent ,'.mobilFilterBtn',function() {
                $('#divSayfalamaUst .filterBlock').addClass('active');
                $('.mobilaf').addClass('acik');
            });
            $('body').on(clickEvent ,'.closeFilt,.filtreUygulaBtn span,.mobilaf',function() {
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
                $('.brandlistselection').append('<div class="FiltreBtn"><svg width="16" height="16" viewBox="0 0 16 16"> <path id="Path_5375" data-name="Path 5375" d="M8,15a7,7,0,1,1,7-7A7,7,0,0,1,8,15Zm0,1A8,8,0,1,0,0,8,8,8,0,0,0,8,16Z" fill="#fff"/> <path id="Path_5376" data-name="Path 5376" d="M7,11.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,0,1h-1A.5.5,0,0,1,7,11.5Z" fill="#fff"/> <path id="Path_5377" data-name="Path 5377" d="M5,8.5A.5.5,0,0,1,5.5,8h5a.5.5,0,0,1,0,1h-5A.5.5,0,0,1,5,8.5Z" fill="#fff"/> <path id="Path_5378" data-name="Path 5378" d="M3,5.5A.5.5,0,0,1,3.5,5h9a.5.5,0,0,1,0,1h-9A.5.5,0,0,1,3,5.5Z" fill="#fff"/> </svg>'+translateIt("UrunFiltreleme_Filtreleme")+'</div>');
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
    if ($('.bottomHead').length==0) {$('body:not(.sepetimBody)').append('<div class="bottomHead"> <ul> <li class="homeC"> <a href="/"><svg viewBox="0 0 486.196 486.196"><path d="M481.708,220.456l-228.8-204.6c-0.4-0.4-0.8-0.7-1.3-1c-5-4.8-13-5-18.3-0.3l-228.8,204.6c-5.6,5-6,13.5-1.1,19.1 c2.7,3,6.4,4.5,10.1,4.5c3.2,0,6.4-1.1,9-3.4l41.2-36.9v7.2v106.8v124.6c0,18.7,15.2,34,34,34c0.3,0,0.5,0,0.8,0s0.5,0,0.8,0h70.6 c17.6,0,31.9-14.3,31.9-31.9v-121.3c0-2.7,2.2-4.9,4.9-4.9h72.9c2.7,0,4.9,2.2,4.9,4.9v121.3c0,17.6,14.3,31.9,31.9,31.9h72.2 c19,0,34-18.7,34-42.6v-111.2v-34v-83.5l41.2,36.9c2.6,2.3,5.8,3.4,9,3.4c3.7,0,7.4-1.5,10.1-4.5 C487.708,233.956,487.208,225.456,481.708,220.456z M395.508,287.156v34v111.1c0,9.7-4.8,15.6-7,15.6h-72.2c-2.7,0-4.9-2.2-4.9-4.9 v-121.1c0-17.6-14.3-31.9-31.9-31.9h-72.9c-17.6,0-31.9,14.3-31.9,31.9v121.3c0,2.7-2.2,4.9-4.9,4.9h-70.6c-0.3,0-0.5,0-0.8,0 s-0.5,0-0.8,0c-3.8,0-7-3.1-7-7v-124.7v-106.8v-31.3l151.8-135.6l153.1,136.9L395.508,287.156L395.508,287.156z"/></svg><span>'+translateIt("GlobalMasterPage_Anasayfa")+'</span></a> </li> <li class="favoC"> <a href="/Hesabim.aspx/#/Favorilerim)"><svg viewBox="0 0 471.701 471.701"> <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3 C444.801,187.101,434.001,213.101,414.401,232.701z"/> </svg><span>'+translateIt("Favorilerim_Baslik")+'</span><div class="favNum"></div></a> </li> <li class="cartC"> <a href="/sepetim.aspx"><svg viewBox="0 0 16 16"> <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/> </svg><span>'+translateIt("GlobalMasterPage_Sepetim")+'</span></a> </li> <li class="welcC"> <a href="javascript:void(0)" onclick="GirisKontrol(0)"><svg viewBox="0 0 20 22.487"><g transform="translate(-92.3 -72)"><path d="M109.006,266.734a10.792,10.792,0,0,0-13.407,0,9.381,9.381,0,0,0-3.3,7.54.858.858,0,0,0,.855.855h18.289a.858.858,0,0,0,.855-.855A9.361,9.361,0,0,0,109.006,266.734Zm-14.959,6.685a7.573,7.573,0,0,1,2.646-5.371,9.091,9.091,0,0,1,11.219,0,7.561,7.561,0,0,1,2.646,5.371Z" transform="translate(0 -180.643)"></path><path d="M169.246,83.292a5.646,5.646,0,1,0-5.646-5.646A5.653,5.653,0,0,0,169.246,83.292Zm0-9.581a3.935,3.935,0,1,1-3.935,3.935A3.94,3.94,0,0,1,169.246,73.711Z" transform="translate(-66.943)"></path></g></svg><span>'+translateIt("GlobalMasterPage_MobilUyeGirisi")+'</span></a> </li> </ul> </div>');}
    if (siteSettings.isAuthenticated == true) {$('.welcC a').attr('href','/hesabim.aspx'); $('.welcC span').html(translateIt("GlobalMasterPage_MobilHesabim")); }
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
    $('.RightDetail .riSingle a.riDown').html('<svg viewBox="0 0 8.68 1.8"> <path id="Path_107" data-name="Path 107" d="M-4.34-5.82H4.34v-1.8H-4.34Z" transform="translate(4.34 7.62)"/> </svg>');
    $('.RightDetail .riSingle a.riUp').html('<svg viewBox="0 0 8.68 8.6"> <path id="Path_106" data-name="Path 106" d="M-4.34-5.82h3.4v3.4H.94v-3.4h3.4v-1.8H.94v-3.4H-.94v3.4h-3.4Z" transform="translate(4.34 11.02)"/> </svg>');
    $('#divKritikStok .box1').before('<div class="boxIcon"><svg viewBox="0 0 4.996 21.16"><g transform="translate(-37.543 -13.42)"><path d="M42.2,13.42H37.878a.335.335,0,0,0-.335.335V27.941a.335.335,0,0,0,.335.335H42.2a.335.335,0,0,0,.335-.335V13.755A.335.335,0,0,0,42.2,13.42Zm-.335,14.186H38.213V14.09h3.656Z"/><path d="M42.2,61.667H37.878a.335.335,0,0,0-.335.335v4.326a.335.335,0,0,0,.335.335H42.2a.335.335,0,0,0,.335-.335V62A.335.335,0,0,0,42.2,61.667Zm-.335,4.326H38.213V62.337h3.656Z" transform="translate(0 -32.083)"/></g></svg></div>');
    $('.UTelefonlaSiparis .box1').before('<div class="boxIcon"><svg viewBox="0 0 202.592 202.592"><path d="M198.048,160.105l-31.286-31.29c-6.231-6.206-16.552-6.016-23.001,0.433l-15.761,15.761 c-0.995-0.551-2.026-1.124-3.11-1.732c-9.953-5.515-23.577-13.074-37.914-27.421C72.599,101.48,65.03,87.834,59.5,77.874 c-0.587-1.056-1.145-2.072-1.696-3.038l10.579-10.565l5.2-5.207c6.46-6.46,6.639-16.778,0.419-23.001L42.715,4.769 c-6.216-6.216-16.541-6.027-23.001,0.433l-8.818,8.868l0.243,0.24c-2.956,3.772-5.429,8.124-7.265,12.816 c-1.696,4.466-2.752,8.729-3.235,12.998c-4.13,34.25,11.52,65.55,53.994,108.028c58.711,58.707,106.027,54.273,108.067,54.055 c4.449-0.53,8.707-1.593,13.038-3.275c4.652-1.818,9.001-4.284,12.769-7.233l0.193,0.168l8.933-8.747 C204.079,176.661,204.265,166.343,198.048,160.105z M190.683,176.164l-3.937,3.93l-1.568,1.507 c-2.469,2.387-6.743,5.74-12.984,8.181c-3.543,1.364-7.036,2.24-10.59,2.663c-0.447,0.043-44.95,3.84-100.029-51.235 C14.743,94.38,7.238,67.395,10.384,41.259c0.394-3.464,1.263-6.95,2.652-10.593c2.462-6.277,5.812-10.547,8.181-13.02l5.443-5.497 c2.623-2.63,6.714-2.831,9.112-0.433l31.286,31.286c2.394,2.401,2.205,6.492-0.422,9.13L45.507,73.24l1.95,3.282 c1.084,1.829,2.23,3.879,3.454,6.106c5.812,10.482,13.764,24.83,29.121,40.173c15.317,15.325,29.644,23.27,40.094,29.067 c2.258,1.249,4.32,2.398,6.17,3.5l3.289,1.95l21.115-21.122c2.634-2.623,6.739-2.817,9.137-0.426l31.272,31.279 C193.5,169.446,193.31,173.537,190.683,176.164z"/> </svg></div>');
    $('.UFavorilerimeEkle .box1').before('<div class="boxIcon"><svg viewBox="0 -28 512.001 512" ><path d="m256 455.515625c-7.289062 0-14.316406-2.640625-19.792969-7.4375-20.683593-18.085937-40.625-35.082031-58.21875-50.074219l-.089843-.078125c-51.582032-43.957031-96.125-81.917969-127.117188-119.3125-34.644531-41.804687-50.78125-81.441406-50.78125-124.742187 0-42.070313 14.425781-80.882813 40.617188-109.292969 26.503906-28.746094 62.871093-44.578125 102.414062-44.578125 29.554688 0 56.621094 9.34375 80.445312 27.769531 12.023438 9.300781 22.921876 20.683594 32.523438 33.960938 9.605469-13.277344 20.5-24.660157 32.527344-33.960938 23.824218-18.425781 50.890625-27.769531 80.445312-27.769531 39.539063 0 75.910156 15.832031 102.414063 44.578125 26.191406 28.410156 40.613281 67.222656 40.613281 109.292969 0 43.300781-16.132812 82.9375-50.777344 124.738281-30.992187 37.398437-75.53125 75.355469-127.105468 119.308594-17.625 15.015625-37.597657 32.039062-58.328126 50.167969-5.472656 4.789062-12.503906 7.429687-19.789062 7.429687zm-112.96875-425.523437c-31.066406 0-59.605469 12.398437-80.367188 34.914062-21.070312 22.855469-32.675781 54.449219-32.675781 88.964844 0 36.417968 13.535157 68.988281 43.882813 105.605468 29.332031 35.394532 72.960937 72.574219 123.476562 115.625l.09375.078126c17.660156 15.050781 37.679688 32.113281 58.515625 50.332031 20.960938-18.253907 41.011719-35.34375 58.707031-50.417969 50.511719-43.050781 94.136719-80.222656 123.46875-115.617188 30.34375-36.617187 43.878907-69.1875 43.878907-105.605468 0-34.515625-11.605469-66.109375-32.675781-88.964844-20.757813-22.515625-49.300782-34.914062-80.363282-34.914062-22.757812 0-43.652344 7.234374-62.101562 21.5-16.441406 12.71875-27.894532 28.796874-34.609375 40.046874-3.453125 5.785157-9.53125 9.238282-16.261719 9.238282s-12.808594-3.453125-16.261719-9.238282c-6.710937-11.25-18.164062-27.328124-34.609375-40.046874-18.449218-14.265626-39.34375-21.5-62.097656-21.5zm0 0"/></svg></div>');
    $('.UIstekListemeEkle .box1').before('<div class="boxIcon"><svg viewBox="0 0 26.193 20.595"><g transform="translate(-33.5 -38.598)"><path d="M42.961,53.273a.637.637,0,0,1-.454-.363.545.545,0,0,1,.454-.545l12.443-1a2.542,2.542,0,0,0,2.089-1.635l2-5.45c0-.091,0-.272-.091-.272H40.054a.454.454,0,1,1,0-.908H59.219a1.451,1.451,0,0,1,1,.454,1.36,1.36,0,0,1,.091,1.181l-2,5.45A3.451,3.451,0,0,1,55.4,52.274l-12.353,1Z" transform="translate(-0.709 -0.459)"/><path d="M45.943,60.886a2.544,2.544,0,1,1,2.543-2.547v0A2.544,2.544,0,0,1,45.943,60.886Zm0-4.178a1.635,1.635,0,1,0,1.635,1.635h0A1.635,1.635,0,0,0,45.943,56.708Z" transform="translate(-0.971 -1.695)"/><path d="M58.443,60.886A2.544,2.544,0,0,1,55.9,58.343,2.635,2.635,0,0,1,58.443,55.8a2.544,2.544,0,0,1,2.543,2.543,2.452,2.452,0,0,1-2.358,2.543Q58.536,60.89,58.443,60.886Zm0-4.178a1.635,1.635,0,1,0,1.635,1.635h0a1.635,1.635,0,0,0-1.635-1.635Z" transform="translate(-2.204 -1.696)"/><path d="M45.051,55.131a3.156,3.156,0,0,1-2.888-1.817v-.182l-.271-.636h0L37.922,39.508H33.951a.454.454,0,0,1,0-.908h4.332a.45.45,0,0,1,.451.272L42.8,52.315h0l.18.545a2.166,2.166,0,0,0,2.076,1.362h11.19a.454.454,0,0,1,0,.908Z"/></g></svg></div>');
    $('.UKarsilastirma .box1').before('<div class="boxIcon"><svg viewBox="0 0 13.262 17.691"><g transform="translate(-391 -905.499)"><path d="M16.333,11.421a.6.6,0,0,0,0,.848l2.8,2.805H8.469a.6.6,0,0,0,0,1.2H19.124l-2.8,2.805a.606.606,0,0,0,0,.848.6.6,0,0,0,.843,0l3.8-3.823h0a.672.672,0,0,0,.124-.189.572.572,0,0,0,.046-.23.6.6,0,0,0-.17-.419l-3.8-3.823A.587.587,0,0,0,16.333,11.421Z" transform="translate(383.125 894.247)"/><path d="M12.687,11.421a.6.6,0,0,1,0,.848L9.9,15.074H20.55a.6.6,0,0,1,0,1.2H9.9l2.8,2.805a.606.606,0,0,1,0,.848.6.6,0,0,1-.843,0L8.052,16.1h0a.673.673,0,0,1-.124-.189.572.572,0,0,1-.046-.23.6.6,0,0,1,.17-.419l3.8-3.823A.587.587,0,0,1,12.687,11.421Z" transform="translate(383.118 903.093)"/></g></svg></div>');
    $('.UindirimliUrun .box1').before('<div class="boxIcon"><svg viewBox="0 0 487.222 487.222"><path d="M486.554,186.811c-1.6-4.9-5.8-8.4-10.9-9.2l-152-21.6l-68.4-137.5c-2.3-4.6-7-7.5-12.1-7.5l0,0c-5.1,0-9.8,2.9-12.1,7.6 l-67.5,137.9l-152,22.6c-5.1,0.8-9.3,4.3-10.9,9.2s-0.2,10.3,3.5,13.8l110.3,106.9l-25.5,151.4c-0.9,5.1,1.2,10.2,5.4,13.2 c2.3,1.7,5.1,2.6,7.9,2.6c2.2,0,4.3-0.5,6.3-1.6l135.7-71.9l136.1,71.1c2,1,4.1,1.5,6.2,1.5l0,0c7.4,0,13.5-6.1,13.5-13.5 c0-1.1-0.1-2.1-0.4-3.1l-26.3-150.5l109.6-107.5C486.854,197.111,488.154,191.711,486.554,186.811z M349.554,293.911 c-3.2,3.1-4.6,7.6-3.8,12l22.9,131.3l-118.2-61.7c-3.9-2.1-8.6-2-12.6,0l-117.8,62.4l22.1-131.5c0.7-4.4-0.7-8.8-3.9-11.9 l-95.6-92.8l131.9-19.6c4.4-0.7,8.2-3.4,10.1-7.4l58.6-119.7l59.4,119.4c2,4,5.8,6.7,10.2,7.4l132,18.8L349.554,293.911z"/> </svg></div>');
    $('.UAddToCollection .box1').before('<div class="boxIcon"><svg viewBox="0 0 487.222 487.222"><path d="M486.554,186.811c-1.6-4.9-5.8-8.4-10.9-9.2l-152-21.6l-68.4-137.5c-2.3-4.6-7-7.5-12.1-7.5l0,0c-5.1,0-9.8,2.9-12.1,7.6 l-67.5,137.9l-152,22.6c-5.1,0.8-9.3,4.3-10.9,9.2s-0.2,10.3,3.5,13.8l110.3,106.9l-25.5,151.4c-0.9,5.1,1.2,10.2,5.4,13.2 c2.3,1.7,5.1,2.6,7.9,2.6c2.2,0,4.3-0.5,6.3-1.6l135.7-71.9l136.1,71.1c2,1,4.1,1.5,6.2,1.5l0,0c7.4,0,13.5-6.1,13.5-13.5 c0-1.1-0.1-2.1-0.4-3.1l-26.3-150.5l109.6-107.5C486.854,197.111,488.154,191.711,486.554,186.811z M349.554,293.911 c-3.2,3.1-4.6,7.6-3.8,12l22.9,131.3l-118.2-61.7c-3.9-2.1-8.6-2-12.6,0l-117.8,62.4l22.1-131.5c0.7-4.4-0.7-8.8-3.9-11.9 l-95.6-92.8l131.9-19.6c4.4-0.7,8.2-3.4,10.1-7.4l58.6-119.7l59.4,119.4c2,4,5.8,6.7,10.2,7.4l132,18.8L349.554,293.911z"/> </svg></div>');
    $('.FiyatHaberVer .box1').before('<div class="boxIcon"><svg viewBox="0 0 27.585 27.204"><g transform="translate(-17.463 -17.896)"><path d="M45.031,34.429l-1.268-3.324,1.006-3.367a.494.494,0,0,0-.131-.481l-2.8-2.274-.831-3.455a.424.424,0,0,0-.35-.306l-3.542-.612-2.493-2.58a.4.4,0,0,0-.481-.087l-3.367,1.225-3.411-1.05a.52.52,0,0,0-.481.175L24.607,21l-3.5.831a.371.371,0,0,0-.306.35l-.612,3.455-2.58,2.449a.494.494,0,0,0-.131.481l1.268,3.324L17.741,35.26a.494.494,0,0,0,.131.481l2.8,2.274L21.5,41.47a.424.424,0,0,0,.35.306l3.542.612,2.493,2.58a.4.4,0,0,0,.306.131h.175l3.367-1.225,3.411,1.05a.52.52,0,0,0,.481-.175L37.9,41.995l3.5-.831a.371.371,0,0,0,.306-.35l.612-3.455L44.9,34.91A.494.494,0,0,0,45.031,34.429ZM41.62,36.834a.378.378,0,0,0-.131.262l-.569,3.367-3.367.787a.24.24,0,0,0-.219.131l-2.187,2.624L31.824,43h-.262l-3.236,1.137-2.405-2.449a.241.241,0,0,0-.219-.131l-3.411-.569-.831-3.324a.241.241,0,0,0-.131-.219L18.66,35.26l.962-3.28a.279.279,0,0,0,0-.262L18.4,28.525l2.493-2.318a.378.378,0,0,0,.131-.262l.569-3.367,3.367-.787a.24.24,0,0,0,.219-.131l2.187-2.624,3.324,1.006h.262L34.185,18.9l2.405,2.449a.241.241,0,0,0,.219.131l3.411.569.831,3.324a.241.241,0,0,0,.131.219l2.668,2.187-.962,3.28a.279.279,0,0,0,0,.262l1.225,3.193Z"/><path d="M38.749,32.336a.443.443,0,0,0-.743.481L46.8,46.681a.459.459,0,0,0,.394.219l.219-.087a.43.43,0,0,0,.131-.612Z" transform="translate(-11.517 -8.01)"/><path d="M33.949,47.3A3.149,3.149,0,1,0,37.1,50.449,3.164,3.164,0,0,0,33.949,47.3Zm0,5.423a2.286,2.286,0,0,1-2.274-2.274,2.274,2.274,0,0,1,4.548,0A2.286,2.286,0,0,1,33.949,52.723Z" transform="translate(-7.505 -16.545)"/><path d="M55.949,36.3A3.149,3.149,0,1,0,59.1,39.449,3.164,3.164,0,0,0,55.949,36.3Zm0,5.423a2.286,2.286,0,0,1-2.274-2.274,2.274,2.274,0,1,1,4.548,0A2.286,2.286,0,0,1,55.949,41.723Z" transform="translate(-19.883 -10.355)"/></g></svg></div>');
    $('.UrunKargoBedava .box1').before('<div class="boxIcon"><svg viewBox="0 0 27.34 21.359"><g transform="translate(-2 -9)"><path d="M52.971,36.961H51.262a.427.427,0,0,1,0-.854h1.282V29.836l-1.632-2.328a3.845,3.845,0,0,0-3.165-1.653H44.854v10.68a.427.427,0,0,1-.854,0V25.427A.427.427,0,0,1,44.427,25h3.319a4.7,4.7,0,0,1,3.845,2.016L53.3,29.456a.427.427,0,0,1,.1.243v6.835A.427.427,0,0,1,52.971,36.961Z" transform="translate(-24.058 -9.165)"/><path d="M4.136,36.961H2.427A.427.427,0,0,1,2,36.534V25.427a.427.427,0,0,1,.854,0v10.68H4.136a.427.427,0,0,1,0,.854Z" transform="translate(0 -9.165)"/><path d="M31.243,51.854H18.427a.427.427,0,0,1,0-.854H31.243a.427.427,0,0,1,0,.854Z" transform="translate(-9.165 -24.058)"/><path d="M20.369,27.8H9.262a.427.427,0,0,1,0-.854h10.68V9.854H2.854V26.942H4.136a.427.427,0,0,1,0,.854H2.427A.427.427,0,0,1,2,27.369V9.427A.427.427,0,0,1,2.427,9H20.369a.427.427,0,0,1,.427.427V27.369A.427.427,0,0,1,20.369,27.8Z"/><path d="M8.99,50.981a2.99,2.99,0,1,1,2.99-2.99A2.99,2.99,0,0,1,8.99,50.981Zm0-5.126a2.136,2.136,0,1,0,2.136,2.136A2.136,2.136,0,0,0,8.99,45.854Z" transform="translate(-2.291 -20.621)"/><path d="M50.99,50.981a2.99,2.99,0,1,1,2.99-2.99A2.99,2.99,0,0,1,50.99,50.981Zm0-5.126a2.136,2.136,0,1,0,2.136,2.136A2.136,2.136,0,0,0,50.99,45.854Z" transform="translate(-26.349 -20.621)"/><path d="M53.553,35.272H48.427A.427.427,0,0,1,48,34.845V31.427A.427.427,0,0,1,48.427,31h3.417a.427.427,0,0,1,.38.235l1.709,3.417a.427.427,0,0,1-.38.619Zm-4.7-.854h4.007L51.58,31.854H48.854Z" transform="translate(-26.349 -12.602)"/></g></svg></div>');
    setTimeout(function () {
        $('.UGelinceHaberVer .box1').before('<div class="boxIcon"><svg viewBox="0 0 15.863 19.856"><g transform="translate(-6.775 -3.93)"><path d="M18.7,28.336a.643.643,0,0,0-.63.506,1.244,1.244,0,0,1-.248.541.938.938,0,0,1-.8.293.954.954,0,0,1-.8-.293,1.244,1.244,0,0,1-.248-.541.643.643,0,0,0-.63-.506h0a.647.647,0,0,0-.63.789,2.217,2.217,0,0,0,2.308,1.841,2.213,2.213,0,0,0,2.308-1.841.65.65,0,0,0-.63-.789Z" transform="translate(-2.332 -7.18)"/><path d="M22.439,18.635c-.764-1.007-2.268-1.6-2.268-6.109,0-4.63-2.045-6.491-3.95-6.938-.179-.045-.308-.1-.308-.293V5.151A1.217,1.217,0,0,0,14.722,3.93h-.03A1.217,1.217,0,0,0,13.5,5.151V5.3c0,.184-.129.248-.308.293-1.911.452-3.95,2.308-3.95,6.938,0,4.511-1.5,5.1-2.268,6.109a.985.985,0,0,0,.789,1.578h13.9A.986.986,0,0,0,22.439,18.635Zm-1.935.288H8.931a.218.218,0,0,1-.164-.362A6.012,6.012,0,0,0,9.809,16.9a11.246,11.246,0,0,0,.71-4.377,7.611,7.611,0,0,1,1.037-4.308,3.184,3.184,0,0,1,1.921-1.37,1.739,1.739,0,0,0,.923-.521.392.392,0,0,1,.591-.01,1.8,1.8,0,0,0,.933.531,3.184,3.184,0,0,1,1.921,1.37,7.611,7.611,0,0,1,1.037,4.308,11.246,11.246,0,0,0,.71,4.377,6.081,6.081,0,0,0,1.067,1.682A.205.205,0,0,1,20.5,18.923Z"/></g></svg></div>');
    },200);
    $('div.YorumYazbtnContent > a').prepend('<div class="boxIcon"><svg viewBox="0 0 16.994 16.991"><path d="M22.242,6.82a2.606,2.606,0,0,0-3.682,0l-.612.612L7.933,17.446v.01a.253.253,0,0,0-.05.077.052.052,0,0,0,0,.015h0L6.019,22.662a.294.294,0,0,0,.07.307.285.285,0,0,0,.207.079.292.292,0,0,0,.093-.017l5.11-1.839h.015a.253.253,0,0,0,.077-.05h0L21.627,11.107l.614-.616A2.61,2.61,0,0,0,22.242,6.82ZM18.15,8.044l1.221,1.221-9.6,9.6L8.549,17.639ZM7.16,21.225a3.029,3.029,0,0,1,.665.665l-1.051.386Zm1.229.471a3.741,3.741,0,0,0-.456-.58,3.639,3.639,0,0,0-.58-.456l.9-2.481,1.308,1.308L10.87,20.8ZM11.411,20.5l-1.227-1.221,9.6-9.6L21.005,10.9ZM21.826,10.079l-.406.412L19.993,9.063,18.559,7.629l.406-.406a2.021,2.021,0,0,1,2.861,2.855Z" transform="translate(-6.001 -6.058)"/></svg></div>');
    $('div.TavsiyeEtBtnContent > a').prepend('<div class="boxIcon"><svg viewBox="0 0 22.635 20"><g transform="translate(-0.081 -5.859)"><g transform="translate(0.081 5.859)"><g transform="translate(0 0)"><path d="M22.716,15.54a2.781,2.781,0,0,1-.138.424c-.127.249-.279.487-.41.735a.315.315,0,0,0-.05.227,2.244,2.244,0,0,1-.372,2.292.245.245,0,0,0-.052.277,2.2,2.2,0,0,1-.295,2.14.537.537,0,0,0-.107.492,2.4,2.4,0,0,1-.567,2.356,2.079,2.079,0,0,1-1.134.6,6.549,6.549,0,0,1-1.163.125H9.813a2.639,2.639,0,0,1-1.453-.474.544.544,0,0,0-.431-.109,3.1,3.1,0,0,1-.034.415.907.907,0,0,1-.832.814,1.789,1.789,0,0,1-.2,0H1.132a.97.97,0,0,1-1.047-.888c0-.021,0-.041,0-.062V15.939a1.011,1.011,0,0,1,1.061-1.075H7.617a3.625,3.625,0,0,1,.453.086.308.308,0,0,0,.227-.027,7.034,7.034,0,0,0,.66-.737,30.159,30.159,0,0,0,2.353-3.866,1.392,1.392,0,0,0,.17-.723c-.029-.746-.029-1.494-.057-2.24a1.238,1.238,0,0,1,.655-1.179,2.41,2.41,0,0,1,2.623.145,1.5,1.5,0,0,1,.4.6c.279.68.544,1.376.78,2.077a4.491,4.491,0,0,1,.1,2.353c-.118.6-.2,1.2-.306,1.8-.034.2-.027.227.181.227h4.9a2.1,2.1,0,0,1,1.134.27,1.712,1.712,0,0,1,.755,1.079c.018.07.041.138.061.206v.614Zm-8.209-1.224c.177-1.05.356-2.077.519-3.1a4.569,4.569,0,0,0,.1-1.106,9.085,9.085,0,0,0-.884-2.793.68.68,0,0,0-.506-.453,1.533,1.533,0,0,0-1.134.1.406.406,0,0,0-.247.413q.045,1.238.045,2.476a1.684,1.684,0,0,1-.1.578,3.969,3.969,0,0,1-.331.68c-.68,1.113-1.36,2.231-2.059,3.33A4.266,4.266,0,0,1,8.7,15.8c-.322.209-.646.422-.959.642a.307.307,0,0,0-.125.209v6.724c0,.134.057.147.172.161a3.267,3.267,0,0,1,.644.134,1.778,1.778,0,0,1,.4.243,2,2,0,0,0,1.156.347h8.534a3.887,3.887,0,0,0,.506-.029,1.479,1.479,0,0,0,1.047-.605,1.037,1.037,0,0,0,.059-1.274,2.762,2.762,0,0,0-.524-.4.406.406,0,0,1,.145-.156,1.467,1.467,0,0,0,1.057-1.018.918.918,0,0,0-.29-1.054,3.77,3.77,0,0,0-.508-.279.652.652,0,0,1,.2-.195,1.4,1.4,0,0,0,.862-.614,1,1,0,0,0-.453-1.619.2.2,0,0,1-.118-.122.168.168,0,0,1,.145-.188h0a1.41,1.41,0,0,0,1.081-1.217.907.907,0,0,0-.494-1.045,1.661,1.661,0,0,0-.63-.118h-6.1Zm-7.738,1.51c-.073,0-.127-.011-.179-.011H1.221a.156.156,0,0,0-.193.195v8.713a.172.172,0,0,0,.211.213h5.3c.227,0,.227,0,.227-.238V15.835Z" transform="translate(-0.081 -5.859)"/></g></g></g></svg></div>');
    $('.ProductIcon2 > div.hidden-phone > a').prepend('<div class="boxIcon"><svg viewBox="0 0 360 360"><path d="M300,82.5v-50H60v50H0v200h60v45h240v-45h60v-200H300z M80,82.5v-30h200v30v50H80V82.5z M280,282.5v25H80v-25v-50h200 V282.5z M340,262.5h-40v-50H60v50H20v-160h40v50h240v-50h40V262.5z"/> <rect x="220" y="172.5" width="30" height="20"/> <rect x="270" y="172.5" width="30" height="20"/> </svg></div>');
    $('.SoruSorbtnContent > a').prepend('<div class="boxIcon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"> <g id="Group_3866" data-name="Group 3866" transform="translate(-1432 -1006)"> <rect id="Rectangle_2427" data-name="Rectangle 2427" width="20" height="20" transform="translate(1432 1006)" fill="none"/> <path id="Path_3559" data-name="Path 3559" d="M-3918.6,16.4a.306.306,0,0,1-.19-.077l-2.536-2.626h-7a.257.257,0,0,1-.272-.258V.661a.258.258,0,0,1,.272-.26h19.456a.257.257,0,0,1,.271.26V13.437a.256.256,0,0,1-.271.258l-7.022,0-2.5,2.609-.013.016A.238.238,0,0,1-3918.6,16.4ZM-3928.056.919v12.26h6.84a.307.307,0,0,1,.185.07l2.433,2.506,2.388-2.482.013-.017a.234.234,0,0,1,.191-.078h6.865V.919Zm16.872,9.481h-14.808a.257.257,0,0,1-.272-.258.257.257,0,0,1,.272-.258h14.808a.251.251,0,0,1,.271.258A.256.256,0,0,1-3911.184,10.4Zm0-2.048h-14.808a.257.257,0,0,1-.272-.258.257.257,0,0,1,.272-.258h14.808a.251.251,0,0,1,.271.258A.256.256,0,0,1-3911.184,8.352Zm0-2.048h-14.808a.257.257,0,0,1-.272-.258.257.257,0,0,1,.272-.259h14.808a.257.257,0,0,1,.271.259A.256.256,0,0,1-3911.184,6.3Zm0-2.048h-14.808a.257.257,0,0,1-.272-.258.257.257,0,0,1,.272-.259h14.808a.257.257,0,0,1,.271.259A.251.251,0,0,1-3911.184,4.255Z" transform="translate(5360.6 1007.6)" fill="#898989"/> </g></svg></div>');
    $('body').on('click' ,'.UGelinceHaberVer',function(){
        setTimeout(function(){
            $('.UGelinceHaberVer .box1').before('<div class="boxIcon"><svg viewBox="0 0 15.863 19.856"><g transform="translate(-6.775 -3.93)"><path d="M18.7,28.336a.643.643,0,0,0-.63.506,1.244,1.244,0,0,1-.248.541.938.938,0,0,1-.8.293.954.954,0,0,1-.8-.293,1.244,1.244,0,0,1-.248-.541.643.643,0,0,0-.63-.506h0a.647.647,0,0,0-.63.789,2.217,2.217,0,0,0,2.308,1.841,2.213,2.213,0,0,0,2.308-1.841.65.65,0,0,0-.63-.789Z" transform="translate(-2.332 -7.18)"/><path d="M22.439,18.635c-.764-1.007-2.268-1.6-2.268-6.109,0-4.63-2.045-6.491-3.95-6.938-.179-.045-.308-.1-.308-.293V5.151A1.217,1.217,0,0,0,14.722,3.93h-.03A1.217,1.217,0,0,0,13.5,5.151V5.3c0,.184-.129.248-.308.293-1.911.452-3.95,2.308-3.95,6.938,0,4.511-1.5,5.1-2.268,6.109a.985.985,0,0,0,.789,1.578h13.9A.986.986,0,0,0,22.439,18.635Zm-1.935.288H8.931a.218.218,0,0,1-.164-.362A6.012,6.012,0,0,0,9.809,16.9a11.246,11.246,0,0,0,.71-4.377,7.611,7.611,0,0,1,1.037-4.308,3.184,3.184,0,0,1,1.921-1.37,1.739,1.739,0,0,0,.923-.521.392.392,0,0,1,.591-.01,1.8,1.8,0,0,0,.933.531,3.184,3.184,0,0,1,1.921,1.37,7.611,7.611,0,0,1,1.037,4.308,11.246,11.246,0,0,0,.71,4.377,6.081,6.081,0,0,0,1.067,1.682A.205.205,0,0,1,20.5,18.923Z"/></g></svg></div>');
        },200);
    });
    FavoriIslemCallback();
}
$('body').on('click','.detayFavoriListItem button, #btnFavoriGrupKaydet',function(){//gruplu favori işlemleri için
    if (!siteSettings.urunAyar.favoriGrupsuzEkleme) {
        FavoriIslemCallback();
    }
});
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
        var conTFal = false;
        var hhE;
        $(window).scroll(function () {
            if (!conTFal) {
                hhE = $('#headerNew').height();
                conTFal = true;
            }
            if ($(this).scrollTop() > hhE) {
                $('#headerNew').addClass('fixed');
            }
            else {
                $('#headerNew').removeClass('fixed');
            }
        });
    }
}
