const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Fi = require("react-icons/fi");

// ---------- Palette ----------
const NAVY   = "0B1240";
const NAVY2  = "111A55";
const BLUE   = "1E40D6";
const BLUEL  = "5B78F0";
const RED    = "C0392B";   // "eksik / sorun"
const GREEN  = "1F7A55";   // "beklenen etki"
const COPPER = "C98A3C";
const CREAM  = "F5F1E8";
const WHITE  = "FFFFFF";
const INK    = "1A1D2B";
const GRAY   = "6B7280";
const LINE   = "E3DED2";
const REDBG  = "FBEBE9";
const BLUEBG = "EEF1FD";

// ---------- Icons ----------
async function makeIcon(name, hex, size = 256) {
  const el = React.createElement(Fi[name], { size });
  let svg = ReactDOMServer.renderToStaticMarkup(el);
  svg = svg.replace(/currentColor/g, "#" + hex);
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
const ICONS = {};
async function loadIcons() {
  const spec = {
    trend: "FiTrendingUp", search: "FiSearch", target: "FiTarget",
    camera: "FiCamera", video: "FiVideo", settings: "FiSettings",
    chart: "FiBarChart2", mail: "FiMail", truck: "FiTruck",
    users: "FiUsers", check: "FiCheck", calendar: "FiCalendar",
    star: "FiStar", zap: "FiZap", shield: "FiShield", grid: "FiGrid",
    layers: "FiLayers", smartphone: "FiSmartphone", shopping: "FiShoppingBag",
    eye: "FiEye", compass: "FiCompass", refresh: "FiRefreshCw", award: "FiAward",
    instagram: "FiInstagram", dollar: "FiDollarSign", pie: "FiPieChart",
    filter: "FiFilter", alert: "FiAlertTriangle", clock: "FiClock",
    arrow: "FiArrowRight", thumbsUp: "FiThumbsUp", activity: "FiActivity",
  };
  for (const [k, v] of Object.entries(spec)) {
    for (const c of ["w", "b", "r", "g", "c", "n"]) {
      const hex = c === "w" ? WHITE : c === "b" ? BLUE : c === "r" ? RED : c === "g" ? GREEN : c === "c" ? COPPER : NAVY;
      ICONS[`${k}_${c}`] = await makeIcon(v, hex);
    }
  }
}

(async () => {
  await loadIcons();
  const p = new pptxgen();
  p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
  p.layout = "W";
  const W = 13.333;
  const SANS = "Calibri", SERIF = "Cambria";

  const bg = (s, c) => (s.background = { color: c });
  const rect = (s, o) => s.addShape(p.ShapeType.rect, o);
  const rrect = (s, o) => s.addShape(p.ShapeType.roundRect, o);
  const oval = (s, o) => s.addShape(p.ShapeType.ellipse, o);
  function iconCircle(s, x, y, d, circleColor, iconKey) {
    oval(s, { x, y, w: d, h: d, fill: { color: circleColor } });
    const pad = d * 0.26;
    s.addImage({ data: ICONS[iconKey], x: x + pad, y: y + pad, w: d - pad * 2, h: d - pad * 2 });
  }
  const trUpper = (t) => t.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase();
  function kicker(s, text, x, y, color) {
    s.addText(trUpper(text), { x, y, w: 9, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color, charSpacing: 3 });
  }
  // header band on top of a white card (squared bottom corners)
  function headerBand(s, x, y, w, label, color, iconKey) {
    rrect(s, { x, y, w, h: 0.64, rectRadius: 0.09, fill: { color } });
    rect(s, { x, y: y + 0.32, w, h: 0.32, fill: { color } });
    oval(s, { x: x + 0.2, y: y + 0.13, w: 0.38, h: 0.38, fill: { color: "FFFFFF" } });
    s.addImage({ data: ICONS[iconKey.replace(/_.$/, color === RED ? "_r" : color === BLUE ? "_b" : "_g")], x: x + 0.29, y: y + 0.22, w: 0.2, h: 0.2 });
    s.addText(trUpper(label), { x: x + 0.72, y, w: w - 0.9, h: 0.64, fontFace: SANS, fontSize: 12.5, bold: true, color: WHITE, charSpacing: 2, valign: "middle" });
  }
  // bullet rows inside a card
  function bullets(s, items, x, y, w, dotIcon, textColor, rowH = 0.7) {
    items.forEach((it, i) => {
      const ry = y + i * rowH;
      oval(s, { x, y: ry + 0.03, w: 0.3, h: 0.3, fill: { color: dotIcon.endsWith("_r") ? REDBG : BLUEBG } });
      s.addImage({ data: ICONS[dotIcon], x: x + 0.07, y: ry + 0.1, w: 0.16, h: 0.16 });
      s.addText(it, { x: x + 0.45, y: ry - 0.08, w: w - 0.45, h: rowH, fontFace: SANS, fontSize: 12.5, color: textColor, valign: "middle", lineSpacingMultiple: 0.98 });
    });
  }

  // ============ Reusable domain slide: Eksik -> Çözüm -> Etki ============
  function gapSlide(o) {
    const s = p.addSlide();
    bg(s, o.bgCream ? CREAM : WHITE);
    kicker(s, o.kicker, 0.7, 0.5, BLUE);
    s.addText(o.title, { x: 0.7, y: 0.78, w: 12, h: 0.7, fontFace: SERIF, fontSize: 31, bold: true, color: INK });
    s.addText(o.sub, { x: 0.7, y: 1.5, w: 12.2, h: 0.4, fontFace: SANS, fontSize: 13.5, color: GRAY });
    const cy = 2.02, ch = 3.72;
    // left: gaps
    const lx = 0.7, lw = 5.95;
    rrect(s, { x: lx, y: cy, w: lw, h: ch, rectRadius: 0.1, fill: { color: WHITE }, line: { color: LINE, width: 1 } });
    headerBand(s, lx, cy, lw, "Tespit Edilen Eksik", RED, "alert_w");
    bullets(s, o.gaps, lx + 0.32, cy + 0.92, lw - 0.62, "alert_r", INK);
    // right: solutions
    const rx = 6.88, rw = 5.75;
    rrect(s, { x: rx, y: cy, w: rw, h: ch, rectRadius: 0.1, fill: { color: WHITE }, line: { color: LINE, width: 1 } });
    headerBand(s, rx, cy, rw, "Bizim Çözümümüz", BLUE, "check_w");
    bullets(s, o.sols, rx + 0.32, cy + 0.92, rw - 0.62, "check_b", INK);
    // impact strip
    const iy = 5.95;
    rrect(s, { x: 0.7, y: iy, w: 11.93, h: 0.95, rectRadius: 0.1, fill: { color: GREEN } });
    iconCircle(s, 1.0, iy + 0.22, 0.52, "2E9068", "trend_w");
    s.addText([
      { text: "BEKLENEN ETKİ   ", options: { bold: true, color: "BFEBD6", fontSize: 11.5, charSpacing: 1 } },
      { text: o.impact, options: { color: WHITE, fontSize: 13.5, bold: true } },
    ], { x: 1.75, y: iy, w: 10.7, h: 0.95, fontFace: SANS, valign: "middle", lineSpacingMultiple: 0.98 });
    if (o.notes) s.addNotes(o.notes);
    return s;
  }

  // ==================================================== 1. KAPAK
  let s = p.addSlide(); bg(s, NAVY);
  oval(s, { x: 9.6, y: -2.3, w: 6.4, h: 6.4, fill: { color: NAVY2 } });
  oval(s, { x: 11.4, y: 3.7, w: 4.6, h: 4.6, fill: { color: BLUE } });
  iconCircle(s, 0.9, 0.85, 0.9, BLUE, "activity_w");
  s.addText("RAGYU  premium kasap+", { x: 1.95, y: 0.95, w: 8, h: 0.7, fontFace: SERIF, fontSize: 21, bold: true, color: WHITE });
  s.addText("DİJİTAL SİSTEM ANALİZİ & ÇÖZÜM ÖNERİSİ", { x: 0.95, y: 2.5, w: 10, h: 0.35, fontFace: SANS, fontSize: 13, bold: true, color: BLUEL, charSpacing: 3 });
  s.addText("Mevcut Sistemdeki Eksikler\nve Bizim Çözüm Planımız", { x: 0.9, y: 2.9, w: 9.6, h: 2.0, fontFace: SERIF, fontSize: 44, bold: true, color: WHITE, lineSpacingMultiple: 1.02 });
  s.addText("Dijital pazarlama, reklam yönetimi, içerik üretimi ve Ticimax altyapısını tek tek inceledik — her eksiği çözüm ve ölçülebilir etkiyle eşleştirdik.",
    { x: 0.95, y: 4.95, w: 8.7, h: 0.9, fontFace: SANS, fontSize: 15, color: "C9CEEB", lineSpacingMultiple: 1.05 });
  s.addShape(p.ShapeType.line, { x: 0.95, y: 6.15, w: 4.0, h: 0, line: { color: BLUE, width: 2 } });
  s.addText("Hazırlayan: Partum Ajans", { x: 0.95, y: 6.32, w: 6, h: 0.35, fontFace: SANS, fontSize: 14, bold: true, color: WHITE });
  s.addText("Firma Sunumu  ·  Salı  ·  2026", { x: 0.95, y: 6.69, w: 6, h: 0.35, fontFace: SANS, fontSize: 12, color: "9AA2CC" });
  s.addNotes("Açılış: 'Markanız güçlü; biz bugün sistemlerinizi tek tek inceleyip nerede satış ve verim kaybı olduğunu, her birini nasıl çözeceğimizi göstereceğiz.' Ton: eleştiri değil, fırsat.");

  // ==================================================== 2. YAKLAŞIM
  s = p.addSlide(); bg(s, WHITE);
  kicker(s, "Nasıl İnceledik", 0.7, 0.55, BLUE);
  s.addText("Yaklaşımımız: Güçlü Temel + Sistem Denetimi", { x: 0.7, y: 0.85, w: 12.2, h: 0.8, fontFace: SERIF, fontSize: 31, bold: true, color: INK });
  s.addText("Ragyu'nun güçlü marka ve premium ürün temeli üzerine, satışı hızlandıracak dijital sistemi kuruyoruz.",
    { x: 0.7, y: 1.6, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: GRAY });
  const steps = [
    ["award_b", "Güçlü Temeli Koruyoruz", "Premium ürün, kendi çiftliği, Türkiye geneli kargo ve güçlü mavi marka kimliği — hepsi büyük avantaj. Bunlara dokunmuyoruz."],
    ["search_b", "Sistemi Uçtan Uca İnceledik", "Web sitesi, sosyal medya ve Ticimax altyapısını; ölçüm, reklam, içerik ve dönüşüm açısından değerlendirdik."],
    ["arrow_b", "Her Eksiği Çözüme Bağladık", "Tespit ettiğimiz her eksiği somut bir çözüm ve ölçülebilir bir etki (satış, dönüşüm, verim) ile eşleştirdik."],
  ];
  let sy = 2.35;
  steps.forEach((it, i) => {
    const y = sy + i * 1.35;
    rrect(s, { x: 0.7, y, w: 11.93, h: 1.2, rectRadius: 0.09, fill: { color: CREAM }, line: { color: LINE, width: 1 } });
    iconCircle(s, 1.0, y + 0.32, 0.56, BLUE, it[0]);
    s.addText(`0${i + 1}`, { x: 1.75, y: y + 0.16, w: 0.8, h: 0.9, fontFace: SERIF, fontSize: 30, bold: true, color: "D3D9EC" });
    s.addText(it[1], { x: 2.55, y: y + 0.2, w: 9.9, h: 0.4, fontFace: SANS, fontSize: 16, bold: true, color: INK });
    s.addText(it[2], { x: 2.55, y: y + 0.6, w: 9.9, h: 0.5, fontFace: SANS, fontSize: 12.5, color: GRAY, lineSpacingMultiple: 1.0 });
  });
  s.addText("Not: Aşağıdaki tespitler herkese açık web/sosyal incelemesine dayanır; kesin teşhis panel ve reklam/analitik hesap erişimiyle netleştirilecektir.",
    { x: 0.7, y: 6.55, w: 11.93, h: 0.5, fontFace: SANS, fontSize: 11, italic: true, color: GRAY });
  s.addNotes("Diplomatik çerçeve: önce güçlü yönleri onayla, sonra 'eksik' kelimesini yumuşatarak sistem denetimi olarak sun. Alttaki notu mutlaka söyle — tespitleri kesin teşhis değil, erişim sonrası netleşecek gözlemler olarak konumla. Bu güvenilirliği korur.");

  // ==================================================== 3. YÖNETİCİ ÖZETİ — GAP MAP
  s = p.addSlide(); bg(s, NAVY);
  kicker(s, "Yönetici Özeti", 0.7, 0.55, BLUEL);
  s.addText("Tespit Edilen Başlıca Eksikler", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 32, bold: true, color: WHITE });
  s.addText("Satış ve verim kaybına yol açan, çözülebilir sekiz temel açık:",
    { x: 0.7, y: 1.6, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: "C9CEEB" });
  const gapmap = [
    ["activity_w", "Dönüşüm Takibi Eksik", "GA4 / Meta Pixel / CAPI — hangi kanalın sattığı ölçülemiyor."],
    ["mail_w", "E-posta & SMS Yok", "Sepet terk, hoş geldin ve geri kazanım akışları kullanılmıyor."],
    ["users_w", "Zayıf Tekrar Satış", "CRM & segmentasyon yok; alıcılar tek seferlik kalıyor."],
    ["target_w", "Yetersiz Performans Reklamı", "Güçlü organik var; katalog/dinamik reklam kurgusu eksik."],
    ["refresh_w", "Google & Remarketing Yok", "Niyetli arama trafiği ve geri kazanım fırsatı kaçıyor."],
    ["camera_w", "Düzensiz Reklam Kreatifi", "Reklam için sürekli üretilen taze içerik/UGC deposu yok."],
    ["zap_w", "Site Hızı & CRO Eksik", "Ürün sayfası / sepet / ödeme dönüşüme göre optimize değil."],
    ["settings_w", "SEO & Entegrasyon Eksik", "Site içi SEO ayarları ve panel entegrasyonları tamamlanmamış."],
  ];
  let mx = 0.7, mw = 2.9, mgx = 0.18, my = 2.35, mh = 2.0, mgy = 0.2;
  gapmap.forEach((it, i) => {
    const x = mx + (i % 4) * (mw + mgx), y = my + Math.floor(i / 4) * (mh + mgy);
    rrect(s, { x, y, w: mw, h: mh, rectRadius: 0.09, fill: { color: NAVY2 } });
    iconCircle(s, x + 0.28, y + 0.28, 0.6, RED, it[0]);
    s.addText(it[1], { x: x + 0.28, y: y + 1.0, w: mw - 0.5, h: 0.55, fontFace: SANS, fontSize: 13.5, bold: true, color: WHITE, lineSpacingMultiple: 0.95 });
    s.addText(it[2], { x: x + 0.28, y: y + 1.42, w: mw - 0.5, h: 0.5, fontFace: SANS, fontSize: 10.5, color: "AEB6DE", lineSpacingMultiple: 0.98 });
  });
  s.addNotes("Bu, sunumun kalbi: tek bakışta 8 açık. Her birinin ilerleyen slaytlarda çözüm+etki ile açılacağını söyle. Sıralama önem sırası değil; önceliki 8. slaytta veriyoruz.");

  // ==================================================== 4. ALAN 1
  gapSlide({
    bgCream: false,
    kicker: "Alan 01 · Ölçüm & Dijital Pazarlama",
    title: "Ölçüm ve Müşteri Sadakati Altyapısı",
    sub: "Veri olmadan büyüme tahmine dayanır; mevcut müşteri ise yeterince kullanılmıyor.",
    gaps: [
      "Dönüşüm takibi eksik: GA4, Meta Pixel ve Conversions API olmadan hangi reklamın sattığı bilinmiyor.",
      "E-posta/SMS otomasyonu yok: sepette bırakılan siparişler ve eski müşteriler geri kazanılmıyor.",
      "CRM & segmentasyon yok: müşteriler tek seferlik kalıyor, tekrar satış düşük.",
      "SEO altyapısı zayıf: 'online kasap, wagyu, dry age' aramalarından organik trafik kaçıyor.",
    ],
    sols: [
      "GA4 + Pixel + Conversions API kurulumu ve tam dönüşüm takibi.",
      "Sepet terk, hoş geldin ve geri kazanım e-posta/SMS otomasyonları.",
      "Müşteri segmentasyonu, sadakat ve tekrar sipariş senaryoları.",
      "Ürün + blog SEO planı ve site içi teknik SEO düzeltmeleri.",
    ],
    impact: "Her lira ölçülebilir hale gelir; tekrar satış ve organik trafik artar, reklam bağımlılığı azalır.",
    notes: "Vurgu: ölçüm olmadan reklam bütçesi karanlıkta harcanır. E-posta/SMS ve CRM, bedava trafik olan mevcut müşteriden gelir üretir — en hızlı geri dönüş burada.",
  });

  // ==================================================== 5. ALAN 2
  gapSlide({
    bgCream: true,
    kicker: "Alan 02 · Reklam Yönetimi",
    title: "Reklam: Organik Güçlü, Performans Eksik",
    sub: "Instagram'da güçlü bir organik varlık var; ancak ölçeklenebilir performans reklamı kurgusu eksik.",
    gaps: [
      "Performans reklamı yetersiz: satın alma-odaklı, dinamik katalog reklam yapısı kurulu değil.",
      "Meta katalog / dinamik ürün reklamları eksik: gezilen ürünler otomatik gösterilemiyor.",
      "Google Ads (Arama, Shopping, PMax) kullanılmıyor: satın alma niyetli trafik kaçıyor.",
      "Remarketing yok: siteyi gezip almayanlar ve eski müşteriler geri getirilmiyor.",
    ],
    sols: [
      "Satın alma-odaklı Meta kampanya yapısı + ürün katalog (dinamik) reklamları.",
      "Google Arama / Shopping / PMax ile niyetli trafik yakalama.",
      "Remarketing ve müşteri geri kazanım kampanyaları.",
      "ROAS hedefli bütçe yönetimi ve düzenli A/B kreatif testleri.",
    ],
    impact: "Ölçeklenebilir, ROAS hedefli satış; reklamdan gelen her ziyaretçi izlenir ve geri kazanılır.",
    notes: "Kilit gelir slaytı. Organik güçleri övgüyle başla, sonra 'ama bunu satışa çeviren performans katmanı eksik' de. Katalog + remarketing e-ticarette en yüksek getiriyi verir.",
  });

  // ==================================================== 6. ALAN 3
  gapSlide({
    bgCream: false,
    kicker: "Alan 03 · İçerik & Dönüşüm",
    title: "İçerik: Estetik Güçlü, Satışa Bağlı Değil",
    sub: "Görsel dil çok iyi; fakat içerik reklamı besleyecek ve dönüşüm sağlayacak sisteme bağlı değil.",
    gaps: [
      "İçerik marka odaklı; kampanya, ürün ve dönüşüm çağrısına (CTA) yeterince bağlı değil.",
      "Reklam için sürekli kreatif üretimi yok: reels/video/UGC varyasyonları olmadan reklamlar yorulur.",
      "Sosyal kanıt (UGC, yorum, 'sizden gelenler') sistematik toplanmıyor.",
      "İçerik takvimi kampanya ve sezonlarla senkron çalışmıyor.",
    ],
    sols: [
      "Dönüşüm odaklı içerik + kampanya senkronlu aylık içerik takvimi.",
      "Reklam kreatif deposu: düzenli reels/video, UGC ve A/B test varyasyonları.",
      "Sistematik UGC toplama ve influencer iş birliği programı.",
      "Ürün fotoğraf/video çekim planı ve marka içerik serileri.",
    ],
    impact: "Taze kreatifle reklam performansı artar; güven ve organik erişim büyür, içerik doğrudan satışa hizmet eder.",
    notes: "Mesaj: içerik reklamın yakıtıdır. Sürekli taze kreatif olmadan reklam ölçeklenemez. UGC hem güven hem ücretsiz erişim getirir.",
  });

  // ==================================================== 7. ALAN 4
  gapSlide({
    bgCream: true,
    kicker: "Alan 04 · Ticimax Altyapı & Teknik",
    title: "Ticimax: Trafiği Satışa Çeviren Katman",
    sub: "Reklam ve içerik trafiği getirir; ancak altyapı optimize değilse bu trafik siparişe dönmez.",
    gaps: [
      "Site hızı & görsel optimizasyonu: yavaş sayfalar dönüşümü ve SEO'yu düşürür.",
      "Ürün sayfası / sepet / ödeme akışı dönüşüme göre optimize değil (güven unsuru, açıklama, cross-sell).",
      "Entegrasyon eksikleri: Meta katalog, GA4, Pixel/CAPI, e-posta/SMS ve pazaryeri bağlantıları.",
      "Site içi SEO eksik: meta başlık/açıklama, URL, schema ve sitemap ayarları tamamlanmamış.",
    ],
    sols: [
      "Görsel optimizasyonu ve sayfa hızı iyileştirmeleri.",
      "Ürün sayfası, sepet ve ödeme akışı için dönüşüm optimizasyonu (CRO).",
      "Ticimax paneli üzerinden tüm entegrasyonların kurulumu ve yönetimi.",
      "Site içi teknik SEO düzenlemeleri ve düzenli bakım/güncelleme.",
    ],
    impact: "Aynı trafikten daha çok sipariş; reklam ve içerik trafiği boşa gitmeden satışa dönüşür.",
    notes: "Farklılaştırıcı nokta: çoğu ajans siteye dokunmaz, sadece reklam yapar. Biz Ticimax panelini de yönetiriz — böylece kazanılan trafik gerçekten satışa döner. Bu bizim en güçlü ayrışma noktamız.",
  });

  // ==================================================== 8. HIZLI KAZANIMLAR
  s = p.addSlide(); bg(s, WHITE);
  kicker(s, "Öncelik · Hızlı Kazanımlar", 0.7, 0.55, BLUE);
  s.addText("İlk 30 Günde Hızlı Kazanımlar", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 32, bold: true, color: INK });
  s.addText("Düşük eforla en yüksek etkiyi getiren, hemen başlanabilecek adımlar — güveni erken kazanmak için.",
    { x: 0.7, y: 1.6, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: GRAY });
  const quick = [
    ["activity_b", "Ölçümü Aç", "GA4 + Pixel + CAPI kurulumu; tüm siparişlerin izlenmesi."],
    ["layers_b", "Katalog + Dinamik Reklam", "Meta katalog kurulup dinamik ürün reklamlarının başlatılması."],
    ["mail_b", "Sepet Terk Akışı", "Sepette bırakılan siparişler için otomatik e-posta/SMS."],
    ["refresh_b", "Remarketing Başlat", "Siteyi gezenlere ve eski müşterilere geri kazanım reklamı."],
    ["shield_b", "Ürün Sayfası Güveni", "Güven rozetleri, net kargo/iade bilgisi ve güçlü ürün açıklaması."],
  ];
  let qx = 0.7, qw = 2.3, qgx = 0.11, qy = 2.45, qh = 2.75;
  quick.forEach((it, i) => {
    const x = qx + i * (qw + qgx);
    rrect(s, { x, y: qy, w: qw, h: qh, rectRadius: 0.1, fill: { color: CREAM }, line: { color: LINE, width: 1 } });
    rrect(s, { x, y: qy, w: qw, h: 0.68, rectRadius: 0.1, fill: { color: BLUE } });
    rect(s, { x, y: qy + 0.34, w: qw, h: 0.34, fill: { color: BLUE } });
    s.addText(`0${i + 1}`, { x: x + 0.2, y: qy + 0.08, w: 1, h: 0.5, fontFace: SERIF, fontSize: 20, bold: true, color: "FFFFFF" });
    iconCircle(s, x + qw - 0.72, qy + 0.9, 0.62, "E7EBFB", it[0]);
    s.addText(it[1], { x: x + 0.22, y: qy + 1.6, w: qw - 0.44, h: 0.5, fontFace: SANS, fontSize: 14, bold: true, color: INK, lineSpacingMultiple: 0.95 });
    s.addText(it[2], { x: x + 0.22, y: qy + 2.08, w: qw - 0.4, h: 0.6, fontFace: SANS, fontSize: 10.5, color: GRAY, lineSpacingMultiple: 0.98 });
  });
  rrect(s, { x: 0.7, y: 5.55, w: 11.93, h: 1.25, rectRadius: 0.1, fill: { color: GREEN } });
  iconCircle(s, 1.05, 5.87, 0.6, "2E9068", "thumbsUp_w");
  s.addText("Neden buradan başlıyoruz?", { x: 1.85, y: 5.7, w: 10.5, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: WHITE });
  s.addText("Bu beş adım hızlı kurulur, düşük maliyetlidir ve ilk haftalarda ölçülebilir satış artışı ile veri sağlar — sonraki yatırımların yönünü netleştirir.",
    { x: 1.85, y: 6.08, w: 10.5, h: 0.65, fontFace: SANS, fontSize: 12.5, color: "E4F5EC", lineSpacingMultiple: 1.0 });
  s.addNotes("Bu slayt güven inşa eder: 'büyük bütçe taahhüdü istemeden, ilk ayda somut sonuç' mesajı. Hızlı kazanımlar riski düşürür ve ilişkiyi başlatır.");

  // ==================================================== 9. YOL HARİTASI
  s = p.addSlide(); bg(s, NAVY);
  kicker(s, "Çözüm Yol Haritası", 0.7, 0.55, BLUEL);
  s.addText("Eksikleri Kapatma Planı — 90 Gün", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 32, bold: true, color: WHITE });
  s.addText("Hızlı kazanımlarla başlayıp sürdürülebilir büyümeye geçen aşamalı bir kurulum.",
    { x: 0.7, y: 1.6, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: "C9CEEB" });
  const phases = [
    ["0–30 GÜN", "Temeli Kur", ["Ölçüm kurulumu (GA4/Pixel/CAPI)", "Katalog + dinamik reklam", "Sepet terk otomasyonu", "Ticimax SEO & hız denetimi"], BLUE],
    ["30–60 GÜN", "Ölçekle", ["Google Ads & remarketing", "Bütçe & kreatif optimizasyonu", "Düzenli içerik/UGC akışı", "Ürün sayfası CRO"], RED],
    ["60–90 GÜN", "Büyüt & Sadık Kıl", ["CRM & tekrar satış senaryoları", "SEO içerik üretimi", "Kazanan kreatifleri büyütme", "Performans raporu & yeni hedefler"], COPPER],
  ];
  let phx = 0.7, phw = 3.95, phgap = 0.14, phy = 2.4, phh = 4.4;
  phases.forEach((ph, i) => {
    const x = phx + i * (phw + phgap);
    rrect(s, { x, y: phy, w: phw, h: phh, rectRadius: 0.1, fill: { color: NAVY2 } });
    rrect(s, { x, y: phy, w: phw, h: 1.0, rectRadius: 0.1, fill: { color: ph[3] } });
    rect(s, { x, y: phy + 0.55, w: phw, h: 0.45, fill: { color: ph[3] } });
    s.addText(ph[0], { x: x + 0.3, y: phy + 0.14, w: phw - 0.6, h: 0.35, fontFace: SANS, fontSize: 13, bold: true, color: WHITE, charSpacing: 2 });
    s.addText(ph[1], { x: x + 0.3, y: phy + 0.5, w: phw - 0.6, h: 0.45, fontFace: SERIF, fontSize: 18, bold: true, color: WHITE });
    ph[2].forEach((li, j) => {
      const ly = phy + 1.28 + j * 0.75;
      oval(s, { x: x + 0.32, y: ly + 0.03, w: 0.28, h: 0.28, fill: { color: ph[3] } });
      s.addImage({ data: ICONS["check_w"], x: x + 0.38, y: ly + 0.09, w: 0.16, h: 0.16 });
      s.addText(li, { x: x + 0.75, y: ly - 0.05, w: phw - 1.0, h: 0.7, fontFace: SANS, fontSize: 12, color: "DDE3FB", valign: "middle", lineSpacingMultiple: 0.98 });
    });
  });
  s.addNotes("Beklenti yönetimi: 1. ay kurulum ve hızlı kazanımlar, gerçek ivme 2-3. ayda. Her ay sonunda birlikte değerlendirme yaparız.");

  // ==================================================== 10. KPI
  s = p.addSlide(); bg(s, WHITE);
  kicker(s, "Ölçüm & Kanıt", 0.7, 0.55, BLUE);
  s.addText("Başarıyı Nasıl Ölçüp Kanıtlayacağız", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 32, bold: true, color: INK });
  s.addText("Başlangıç değerlerini (baseline) ölçer, her ay hedefe göre ilerlemeyi şeffaf raporlarız.",
    { x: 0.7, y: 1.6, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: GRAY });
  const stats = [
    ["ROAS", "Reklam Getirisi", "Harcanan her liranın kaç lira satışa döndüğü.", BLUE],
    ["CR", "Dönüşüm Oranı", "Ziyaretçinin siparişe dönüşme yüzdesi.", RED],
    ["CAC", "Müşteri Maliyeti", "Yeni bir müşteri kazanmanın ortalama maliyeti.", COPPER],
    ["AOV", "Sepet Tutarı", "Ortalama sipariş değeri ve büyüme hedefi.", GREEN],
  ];
  let stx = 0.7, stw = 2.92, stg = 0.13, sty = 2.4, sth = 2.4;
  stats.forEach((st, i) => {
    const x = stx + i * (stw + stg);
    rrect(s, { x, y: sty, w: stw, h: sth, rectRadius: 0.1, fill: { color: CREAM }, line: { color: LINE, width: 1 } });
    s.addText(st[0], { x: x + 0.25, y: sty + 0.32, w: stw - 0.5, h: 0.9, fontFace: SERIF, fontSize: 40, bold: true, color: st[3] });
    s.addText(st[1], { x: x + 0.28, y: sty + 1.32, w: stw - 0.5, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: INK });
    s.addText(st[2], { x: x + 0.28, y: sty + 1.74, w: stw - 0.5, h: 0.55, fontFace: SANS, fontSize: 11, color: GRAY, lineSpacingMultiple: 1.0 });
  });
  rrect(s, { x: 0.7, y: 5.2, w: 11.93, h: 1.55, rectRadius: 0.1, fill: { color: NAVY } });
  iconCircle(s, 1.05, 5.55, 0.85, BLUE, "pie_w");
  s.addText("Şeffaf Raporlama Ritmi", { x: 2.15, y: 5.45, w: 10, h: 0.45, fontFace: SANS, fontSize: 17, bold: true, color: WHITE });
  s.addText([
    { text: "Haftalık:  ", options: { bold: true, color: BLUEL, fontSize: 12.5 } },
    { text: "reklam optimizasyonu     ", options: { color: "DDE3FB", fontSize: 12.5 } },
    { text: "Aylık:  ", options: { bold: true, color: BLUEL, fontSize: 12.5 } },
    { text: "detaylı performans raporu + toplantı     ", options: { color: "DDE3FB", fontSize: 12.5 } },
    { text: "Canlı:  ", options: { bold: true, color: BLUEL, fontSize: 12.5 } },
    { text: "GA4 & reklam paneli erişimi", options: { color: "DDE3FB", fontSize: 12.5 } },
  ], { x: 2.15, y: 5.9, w: 10.2, h: 0.7, fontFace: SANS, valign: "top", lineSpacingMultiple: 1.1 });
  s.addNotes("Güven mesajı: her şey ölçülür, baseline'dan hedefe ilerleme şeffaf paylaşılır. Firma panellere kendi erişimini alır. KPI'ları birlikte tanımlarız.");

  // ==================================================== 11. ÖZET & SONRAKİ ADIM
  s = p.addSlide(); bg(s, NAVY);
  oval(s, { x: 9.9, y: -2.4, w: 6.6, h: 6.6, fill: { color: NAVY2 } });
  oval(s, { x: 11.6, y: 3.9, w: 4.4, h: 4.4, fill: { color: BLUE } });
  kicker(s, "Özet", 0.9, 0.7, BLUEL);
  s.addText("Eksikleri Fırsata Çeviriyoruz", { x: 0.9, y: 1.05, w: 9, h: 1.3, fontFace: SERIF, fontSize: 38, bold: true, color: WHITE, lineSpacingMultiple: 0.98 });
  const why = [
    ["target_w", "Satış Odaklı", "Beğeni değil; sipariş, ciro ve ROAS hedefleriz."],
    ["layers_w", "Bütünsel Çözüm", "Ölçüm, reklam, içerik ve altyapı tek stratejide."],
    ["settings_w", "Ticimax Uzmanlığı", "Sadece reklam değil, altyapıyı da biz yönetiriz."],
    ["eye_w", "Tam Şeffaflık", "Baseline'dan hedefe ölçülebilir, raporlu ilerleme."],
  ];
  let wx = 0.9, wcw = 5.55, wgx = 0.3, wy = 2.6, wch = 1.4, wgy = 0.25;
  why.forEach((it, i) => {
    const x = wx + (i % 2) * (wcw + wgx), y = wy + Math.floor(i / 2) * (wch + wgy);
    rrect(s, { x, y, w: wcw, h: wch, rectRadius: 0.09, fill: { color: NAVY2 } });
    iconCircle(s, x + 0.28, y + 0.35, 0.72, BLUE, it[0]);
    s.addText(it[1], { x: x + 1.15, y: y + 0.22, w: wcw - 1.35, h: 0.4, fontFace: SANS, fontSize: 15.5, bold: true, color: WHITE });
    s.addText(it[2], { x: x + 1.15, y: y + 0.66, w: wcw - 1.35, h: 0.55, fontFace: SANS, fontSize: 11.5, color: "C9CEEB", lineSpacingMultiple: 1.0 });
  });
  rrect(s, { x: 0.9, y: 6.05, w: 11.55, h: 0.95, rectRadius: 0.1, fill: { color: BLUE } });
  s.addText("Sonraki adım: panel + analitik erişimiyle teşhisi kesinleştirip 30 günlük hızlı kazanım paketini başlatmak.",
    { x: 1.2, y: 6.05, w: 7.9, h: 0.95, fontFace: SANS, fontSize: 13.5, bold: true, color: WHITE, valign: "middle", lineSpacingMultiple: 0.95 });
  s.addText([{ text: "Partum Ajans   ·   ", options: { bold: true, color: WHITE, fontSize: 12.5 } }, { text: "partumajans@gmail.com", options: { color: "DDE3FB", fontSize: 12.5 } }],
    { x: 9.1, y: 6.05, w: 3.15, h: 0.95, fontFace: SANS, valign: "middle", align: "right" });
  s.addNotes("Kapanış: net ve düşük riskli bir sonraki adım öner — erişim + 30 günlük hızlı kazanım paketi. Sonuçlara göre büyütmeyi teklif et. Soruları al, hedefleri birlikte tanımla.");

  await p.writeFile({ fileName: "Ragyu-Dijital-Pazarlama-Sunumu.pptx" });
  console.log("WROTE Ragyu-Dijital-Pazarlama-Sunumu.pptx");
})();
