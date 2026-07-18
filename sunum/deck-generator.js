const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Fi = require("react-icons/fi");

// ---------- Palette ----------
const NAVY   = "0B1240";   // dark background
const NAVY2  = "111A55";   // dark card
const BLUE   = "1E40D6";   // brand cobalt
const BLUEL  = "5B78F0";   // light blue
const RED     = "B02E26";  // meat accent
const COPPER = "C98A3C";   // warm gold accent
const CREAM  = "F5F1E8";   // warm light bg
const WHITE  = "FFFFFF";
const INK    = "1A1D2B";   // dark text
const GRAY   = "6B7280";   // muted text
const LINE   = "E3DED2";   // light divider on cream

// ---------- Icon rasteriser ----------
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
    server: "FiServer", chart: "FiBarChart2", mail: "FiMail",
    truck: "FiTruck", users: "FiUsers", check: "FiCheck",
    calendar: "FiCalendar", star: "FiStar", zap: "FiZap",
    shield: "FiShield", grid: "FiGrid", layers: "FiLayers",
    smartphone: "FiSmartphone", shopping: "FiShoppingBag", eye: "FiEye",
    compass: "FiCompass", refresh: "FiRefreshCw", award: "FiAward",
    phone: "FiPhone", globe: "FiGlobe", instagram: "FiInstagram",
    dollar: "FiDollarSign", pie: "FiPieChart", filter: "FiFilter",
  };
  for (const [k, v] of Object.entries(spec)) {
    for (const c of ["w", "b", "r", "c", "n"]) {
      const hex = c === "w" ? WHITE : c === "b" ? BLUE : c === "r" ? RED : c === "c" ? COPPER : NAVY;
      ICONS[`${k}_${c}`] = await makeIcon(v, hex);
    }
  }
}

(async () => {
  await loadIcons();
  const p = new pptxgen();
  p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
  p.layout = "W";
  const W = 13.333, H = 7.5;
  const SANS = "Calibri", SERIF = "Cambria";

  // ---------- helpers ----------
  const bg = (s, c) => s.background = { color: c };
  const rect = (s, o) => s.addShape(p.ShapeType.rect, o);
  const rrect = (s, o) => s.addShape(p.ShapeType.roundRect, o);
  function iconCircle(s, x, y, d, circleColor, iconKey) {
    s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: circleColor } });
    const pad = d * 0.26;
    s.addImage({ data: ICONS[iconKey], x: x + pad, y: y + pad, w: d - pad * 2, h: d - pad * 2 });
  }
  const trUpper = (t) => t.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase();
  function kicker(s, text, x, y, color) {
    s.addText(trUpper(text), { x, y, w: 8, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color, charSpacing: 3, align: "left" });
  }

  // ============================================================ 1. COVER
  let s = p.addSlide(); bg(s, NAVY);
  rect(s, { x: 0, y: 0, w: W, h: H, fill: { color: NAVY } });
  // faint geometric accent blocks
  s.addShape(p.ShapeType.ellipse, { x: 9.7, y: -2.2, w: 6.2, h: 6.2, fill: { color: NAVY2 } });
  s.addShape(p.ShapeType.ellipse, { x: 11.4, y: 3.7, w: 4.6, h: 4.6, fill: { color: BLUE } });
  iconCircle(s, 0.9, 0.85, 0.9, BLUE, "shopping_w");
  s.addText("RAGYU  premium kasap+", { x: 1.95, y: 0.95, w: 8, h: 0.7, fontFace: SERIF, fontSize: 21, bold: true, color: WHITE });
  s.addText("DİJİTAL BÜYÜME ORTAKLIĞI SUNUMU", { x: 0.95, y: 2.55, w: 9, h: 0.35, fontFace: SANS, fontSize: 13, bold: true, color: BLUEL, charSpacing: 4 });
  s.addText("Dijital Pazarlama, Reklam Yönetimi\nİçerik Üretimi & Ticimax Teknik Destek", { x: 0.9, y: 2.95, w: 9.6, h: 2.0, fontFace: SERIF, fontSize: 44, bold: true, color: WHITE, lineSpacingMultiple: 1.02 });
  s.addText("Markanızı premium konumundan dijitalde ölçeklenebilir satışa taşıyan uçtan uca büyüme planı.",
    { x: 0.95, y: 5.05, w: 8.6, h: 0.8, fontFace: SANS, fontSize: 15, color: "C9CEEB" });
  s.addShape(p.ShapeType.line, { x: 0.95, y: 6.15, w: 4.0, h: 0, line: { color: BLUE, width: 2 } });
  s.addText("Hazırlayan: Partum Ajans", { x: 0.95, y: 6.35, w: 6, h: 0.35, fontFace: SANS, fontSize: 14, bold: true, color: WHITE });
  s.addText("Firma Sunumu  ·  Salı  ·  2026", { x: 0.95, y: 6.72, w: 6, h: 0.35, fontFace: SANS, fontSize: 12, color: "9AA2CC" });
  s.addNotes("Açılış: Ragyu'nun güçlü marka ve premium ürün konumunu tebrik ederek başla. Bugün 4 başlıkta uçtan uca bir dijital büyüme planı sunacağımı belirt: dijital pazarlama, reklam yönetimi, içerik üretimi ve Ticimax teknik destek.");

  // ============================================================ 2. MARKA ANALİZİ
  s = p.addSlide(); bg(s, WHITE);
  kicker(s, "01 · Nereden başlıyoruz", 0.7, 0.55, BLUE);
  s.addText("Marka Analizi — Güçlü Bir Temel", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 34, bold: true, color: INK });
  s.addText("Ragyu, dijitalde çoğu markanın sıfırdan kurmaya çalıştığı değerlere zaten sahip. Biz bu temeli ölçeklendireceğiz.",
    { x: 0.7, y: 1.65, w: 11.9, h: 0.5, fontFace: SANS, fontSize: 14, color: GRAY });
  const strengths = [
    ["award_b", "Premium Ürün", "Wagyu, dry-aged, tomahawk, T-bone; katkısız fermente şarküteri ve özel soslar."],
    ["shield_b", "Kendi Çiftliği", "İzmir Menderes'te 70 hektar; Angus & Hereford, İyi Tarım standartları."],
    ["truck_b", "Türkiye Geneli", "Soğuk zincir kargo ile tüm Türkiye; İzmir içi hızlı teslimat."],
    ["instagram_b", "Güçlü Marka Kimliği", "Tutarlı mavi kimlik, güçlü görsel dil, sadık topluluk ve merch."],
    ["shopping_b", "Hazır E-ticaret", "Ticimax altyapısı, paket ürünler (Box, Seçki, Barbekü) ve kampanya düzeni."],
    ["star_b", "Niş Konumlama", "\"Made for Meat Lovers\" — net hedef kitle ve premium fiyat algısı."],
  ];
  let gx = 0.7, gy = 2.45, cw = 3.85, ch = 1.9, gapx = 0.19, gapy = 0.22;
  strengths.forEach((it, i) => {
    const x = gx + (i % 3) * (cw + gapx), y = gy + Math.floor(i / 3) * (ch + gapy);
    rrect(s, { x, y, w: cw, h: ch, rectRadius: 0.09, fill: { color: CREAM }, line: { color: LINE, width: 1 } });
    iconCircle(s, x + 0.28, y + 0.28, 0.7, WHITE, it[0]);
    s.addShape(p.ShapeType.ellipse, { x: x + 0.28, y: y + 0.28, w: 0.7, h: 0.7, fill: { color: "E7EBFB" } });
    s.addImage({ data: ICONS[it[0]], x: x + 0.28 + 0.18, y: y + 0.28 + 0.18, w: 0.34, h: 0.34 });
    s.addText(it[1], { x: x + 1.15, y: y + 0.32, w: cw - 1.35, h: 0.6, fontFace: SANS, fontSize: 15, bold: true, color: INK, valign: "middle" });
    s.addText(it[2], { x: x + 0.28, y: y + 1.02, w: cw - 0.55, h: 0.75, fontFace: SANS, fontSize: 11.5, color: GRAY, lineSpacingMultiple: 1.02 });
  });
  s.addNotes("Amaç: firmayı 'zaten çok iyisiniz' mesajıyla rahatlatmak. Bu 6 güç noktası, reklamda ve içerikte kullanacağımız hammaddedir. Premium ürün + kendi çiftliği hikayesi, rakiplerden ayrışmanın en güçlü kozu.");

  // ============================================================ 3. FIRSATLAR
  s = p.addSlide(); bg(s, NAVY);
  kicker(s, "02 · Neyi büyüteceğiz", 0.7, 0.55, BLUEL);
  s.addText("Fırsatlar & Dijital Öncelikler", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 34, bold: true, color: WHITE });
  s.addText("Güçlü marka + hazır altyapı = ölçeklemeye hazır zemin. Aşağıdaki 4 kaldıraç, satışı katlamak için önceliğimiz.",
    { x: 0.7, y: 1.65, w: 12, h: 0.5, fontFace: SANS, fontSize: 14, color: "C9CEEB" });
  const opp = [
    ["target_w", "Performanslı Reklam", "Sosyal ve arama reklamlarını satın alan-odaklı, katalog ve remarketing kurgusuyla ölçeklemek."],
    ["filter_w", "Satış Hunisi & CRM", "Ziyaretçiyi ilk siparişe, ilk siparişi düzenli müşteriye dönüştüren otomatik akışlar."],
    ["search_w", "SEO & Organik Trafik", "Ürün + blog içerikleriyle Google'da 'online kasap, wagyu, dry age' aramalarında görünürlük."],
    ["refresh_w", "Ölçüm & Optimizasyon", "Piksel/GA4 kurulumu ile her lirayı izlenebilir kılıp sürekli iyileştirme döngüsü."],
  ];
  let ox = 0.7, oy = 2.55, ocw = 5.95, och = 1.95, ogx = 0.25, ogy = 0.28;
  opp.forEach((it, i) => {
    const x = ox + (i % 2) * (ocw + ogx), y = oy + Math.floor(i / 2) * (och + ogy);
    rrect(s, { x, y, w: ocw, h: och, rectRadius: 0.09, fill: { color: NAVY2 } });
    iconCircle(s, x + 0.32, y + 0.34, 0.85, BLUE, it[0]);
    s.addText(it[1], { x: x + 1.4, y: y + 0.32, w: ocw - 1.6, h: 0.55, fontFace: SANS, fontSize: 17, bold: true, color: WHITE, valign: "middle" });
    s.addText(it[2], { x: x + 1.4, y: y + 0.9, w: ocw - 1.7, h: 0.9, fontFace: SANS, fontSize: 12.5, color: "C9CEEB", lineSpacingMultiple: 1.03 });
  });
  s.addNotes("Bu 4 kaldıraç sunumun geri kalanının iskeleti. Her birini ilerleyen slaytlarda detaylandıracağımızı söyle. Mesaj: eksik değil, 'büyütülecek' alanlar.");

  // ============================================================ 4. YAKLAŞIM / 4 PILLAR
  s = p.addSlide(); bg(s, CREAM);
  kicker(s, "03 · Çalışma modeli", 0.7, 0.55, BLUE);
  s.addText("Dört Sütunlu Büyüme Yaklaşımımız", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 34, bold: true, color: INK });
  s.addText("Birbirini besleyen dört alanı tek elden, tek strateji altında yönetiyoruz.",
    { x: 0.7, y: 1.65, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: GRAY });
  const pillars = [
    ["trend_w", BLUE, "Dijital\nPazarlama", "Strateji, SEO, e-posta/SMS, CRM ve satış hunisi yönetimi."],
    ["target_w", RED, "Reklam\nYönetimi", "Meta & Google reklamları, katalog, remarketing, bütçe optimizasyonu."],
    ["camera_w", COPPER, "İçerik\nÜretimi", "Ürün fotoğrafı, reels/video, UGC ve içerik takvimi."],
    ["settings_w", NAVY, "Ticimax\nTeknik Destek", "Altyapı, entegrasyon, hız, SEO ayarları ve dönüşüm optimizasyonu."],
  ];
  let px = 0.7, pw = 2.95, pgap = 0.13, py = 2.5, ph = 4.15;
  pillars.forEach((it, i) => {
    const x = px + i * (pw + pgap);
    rrect(s, { x, y: py, w: pw, h: ph, rectRadius: 0.1, fill: { color: WHITE }, line: { color: LINE, width: 1 } });
    rrect(s, { x, y: py, w: pw, h: 1.55, rectRadius: 0.1, fill: { color: it[1] } });
    rect(s, { x, y: py + 0.9, w: pw, h: 0.65, fill: { color: it[1] } });
    const cl = ["b", "r", "c", "n"][i];
    s.addShape(p.ShapeType.ellipse, { x: x + pw / 2 - 0.45, y: py + 0.3, w: 0.9, h: 0.9, fill: { color: WHITE } });
    s.addImage({ data: ICONS[it[0].replace("_w", "_" + cl)], x: x + pw / 2 - 0.45 + 0.24, y: py + 0.3 + 0.24, w: 0.42, h: 0.42 });
    s.addText(`0${i + 1}`, { x: x + 0.25, y: py + 0.2, w: 1, h: 0.4, fontFace: SERIF, fontSize: 15, bold: true, color: "DDE3FB" });
    s.addText(it[2], { x: x + 0.2, y: py + 1.7, w: pw - 0.4, h: 1.0, fontFace: SERIF, fontSize: 20, bold: true, color: INK, align: "center", lineSpacingMultiple: 0.95 });
    s.addText(it[3], { x: x + 0.28, y: py + 2.75, w: pw - 0.56, h: 1.25, fontFace: SANS, fontSize: 12.5, color: GRAY, align: "center", lineSpacingMultiple: 1.08 });
  });
  s.addNotes("Bu slayt sunumun haritası. Her sütun bir sonraki slaytta tek tek açılacak. Vurgu: dört alan ayrı ajanslara değil, tek stratejiye bağlı — bu tutarlılık ve hız kazandırır.");

  // ============================================================ 5. DİJİTAL PAZARLAMA
  s = p.addSlide(); bg(s, WHITE);
  rrect(s, { x: 0.7, y: 0.5, w: 4.6, h: 6.5, rectRadius: 0.12, fill: { color: BLUE } });
  s.addShape(p.ShapeType.ellipse, { x: 3.4, y: 5.2, w: 3.4, h: 3.4, fill: { color: BLUEL } });
  s.addShape(p.ShapeType.ellipse, { x: 3.9, y: 5.7, w: 2.4, h: 2.4, fill: { color: BLUE } });
  iconCircle(s, 1.05, 0.95, 1.05, WHITE, "trend_b");
  s.addText("01", { x: 1.05, y: 2.15, w: 3, h: 0.6, fontFace: SERIF, fontSize: 20, bold: true, color: "DDE3FB" });
  s.addText("Dijital Pazarlama Süreçleri", { x: 1.05, y: 2.6, w: 3.9, h: 1.7, fontFace: SERIF, fontSize: 30, bold: true, color: WHITE, lineSpacingMultiple: 0.98 });
  s.addText("Reklamı besleyen strateji ve müşteri sadakati katmanı.", { x: 1.05, y: 4.35, w: 3.9, h: 1.0, fontFace: SANS, fontSize: 13.5, color: "DDE3FB" });
  const dm = [
    ["compass_b", "Strateji & Konumlama", "Hedef kitle, mesaj ve fiyat konumunun netleştirilmesi; aylık yol haritası."],
    ["search_b", "SEO & İçerik Planı", "Ürün ve blog SEO'su ile organik trafik; 'wagyu, dry age, online kasap' hedefleme."],
    ["mail_b", "E-posta & SMS Otomasyonu", "Sepet hatırlatma, ilk sipariş serisi, kampanya ve doğum günü akışları."],
    ["users_b", "CRM & Sadakat", "Müşteri segmentasyonu, tekrar satış, VIP ve abonelik senaryoları."],
    ["pie_b", "Analitik & Raporlama", "GA4, piksel, dönüşüm takibi ve şeffaf aylık performans raporu."],
  ];
  let dx = 5.7, dy = 0.95, dw = 6.9, dh = 1.12, dgap = 0.12;
  dm.forEach((it, i) => {
    const y = dy + i * (dh + dgap);
    rrect(s, { x: dx, y, w: dw, h: dh, rectRadius: 0.08, fill: { color: CREAM }, line: { color: LINE, width: 1 } });
    s.addShape(p.ShapeType.ellipse, { x: dx + 0.24, y: y + 0.26, w: 0.6, h: 0.6, fill: { color: "E7EBFB" } });
    s.addImage({ data: ICONS[it[0]], x: dx + 0.24 + 0.15, y: y + 0.26 + 0.15, w: 0.3, h: 0.3 });
    s.addText(it[1], { x: dx + 1.05, y: y + 0.16, w: dw - 1.25, h: 0.4, fontFace: SANS, fontSize: 14.5, bold: true, color: INK });
    s.addText(it[2], { x: dx + 1.05, y: y + 0.56, w: dw - 1.3, h: 0.5, fontFace: SANS, fontSize: 11.5, color: GRAY, lineSpacingMultiple: 1.0 });
  });
  s.addNotes("Mesaj: reklam tek başına yeterli değil. SEO organik trafiği, e-posta/SMS ve CRM ise mevcut müşteriden tekrar satışı getirir — reklam maliyetini düşürür. Bu katman markanın 'kendi kanalını' güçlendirir.");

  // ============================================================ 6. REKLAM YÖNETİMİ
  s = p.addSlide(); bg(s, NAVY);
  kicker(s, "02 · Performans Pazarlaması", 0.7, 0.55, BLUEL);
  s.addText("Reklam Yönetimi", { x: 0.7, y: 0.85, w: 8, h: 0.8, fontFace: SERIF, fontSize: 34, bold: true, color: WHITE });
  iconCircle(s, 11.5, 0.7, 1.05, RED, "target_w");
  s.addText("Her lirayı ölçülebilir satışa çeviren, katalog ve remarketing odaklı reklam kurgusu.",
    { x: 0.7, y: 1.65, w: 10, h: 0.5, fontFace: SANS, fontSize: 14, color: "C9CEEB" });
  const ads = [
    ["instagram_w", "Meta Ads", "Instagram & Facebook: dinamik ürün katalog reklamları, video/reels reklamları."],
    ["search_w", "Google Ads", "Arama, Performance Max ve Shopping ile satın alma niyetli trafik."],
    ["refresh_w", "Remarketing", "Siteyi gezen, sepette bırakan ve eski müşterilere özel geri kazanım."],
    ["users_w", "Kitle Stratejisi", "Benzer kitleler, ilgi & davranış hedefleme, VIP müşteri kitleleri."],
    ["dollar_w", "Bütçe & Teklif", "ROAS hedefli bütçe dağılımı, ölçekleme ve kampanya takvimi."],
    ["eye_w", "Kreatif Testi", "A/B görsel-metin testleri; en iyi performanslı kreatifi büyütme."],
  ];
  let ax = 0.7, ay = 2.5, acw = 3.9, ach = 1.75, agx = 0.16, agy = 0.2;
  ads.forEach((it, i) => {
    const x = ax + (i % 3) * (acw + agx), y = ay + Math.floor(i / 3) * (ach + agy);
    rrect(s, { x, y, w: acw, h: ach, rectRadius: 0.09, fill: { color: NAVY2 } });
    iconCircle(s, x + 0.28, y + 0.28, 0.72, RED, it[0]);
    s.addText(it[1], { x: x + 1.15, y: y + 0.34, w: acw - 1.3, h: 0.6, fontFace: SANS, fontSize: 16, bold: true, color: WHITE, valign: "middle" });
    s.addText(it[2], { x: x + 0.28, y: y + 1.02, w: acw - 0.55, h: 0.65, fontFace: SANS, fontSize: 11.5, color: "C9CEEB", lineSpacingMultiple: 1.02 });
  });
  // KPI strip
  rrect(s, { x: 0.7, y: 6.55, w: 11.93, h: 0.72, rectRadius: 0.08, fill: { color: BLUE } });
  const kpis = [["Hedef", "ROAS & Sipariş"], ["Takip", "GA4 + Meta Piksel"], ["Optimizasyon", "Haftalık"], ["Raporlama", "Aylık Şeffaf"]];
  kpis.forEach((k, i) => {
    const x = 0.7 + i * (11.93 / 4);
    s.addText([{ text: k[0] + "  ", options: { color: "BFD0FF", fontSize: 11, bold: true } }, { text: k[1], options: { color: WHITE, fontSize: 12.5, bold: true } }],
      { x: x + 0.3, y: 6.55, w: 11.93 / 4 - 0.3, h: 0.72, fontFace: SANS, valign: "middle" });
  });
  s.addNotes("En kritik gelir slaytı. Vurgu: reklam 'gösterim' değil 'sipariş' için kurulur. Katalog + remarketing e-ticaret için en yüksek getiriyi verir. ROAS hedefli çalışırız, harcamayı sonuca göre ölçekleriz.");

  // ============================================================ 7. İÇERİK ÜRETİMİ
  s = p.addSlide(); bg(s, CREAM);
  kicker(s, "03 · Marka & Talep Üretimi", 0.7, 0.55, COPPER);
  s.addText("İçerik Üretimi", { x: 0.7, y: 0.85, w: 8, h: 0.8, fontFace: SERIF, fontSize: 34, bold: true, color: INK });
  s.addText("Ragyu'nun güçlü görsel dilini besleyen, satışa hizmet eden düzenli içerik akışı.",
    { x: 0.7, y: 1.65, w: 11, h: 0.4, fontFace: SANS, fontSize: 14, color: GRAY });
  const content = [
    ["camera_c", "Ürün Fotoğrafı", "Etin dokusunu öne çıkaran premium ürün ve paket çekimleri."],
    ["video_c", "Reels & Video", "Kısa kesim, hazırlık ve pişirme videoları; keşfet odaklı reels."],
    ["star_c", "UGC & Topluluk", "Müşteri içerikleri, 'sizden gelenler' ve influencer iş birlikleri."],
    ["grid_c", "Tarif İçerikleri", "'Evde fast food', barbekü ve pişirme rehberleri ile değer katma."],
    ["calendar_c", "İçerik Takvimi", "Aylık plan: kampanya, ürün lansmanı ve sezon temalarıyla senkron."],
    ["smartphone_c", "Sosyal Yönetim", "Paylaşım, story, öne çıkanlar ve topluluk/mesaj yönetimi."],
  ];
  let cx = 0.7, cy = 2.35, ccw = 3.85, cch = 1.98, cgx = 0.19, cgy = 0.22;
  content.forEach((it, i) => {
    const x = cx + (i % 3) * (ccw + cgx), y = cy + Math.floor(i / 3) * (cch + cgy);
    rrect(s, { x, y, w: ccw, h: cch, rectRadius: 0.09, fill: { color: WHITE }, line: { color: LINE, width: 1 } });
    iconCircle(s, x + 0.3, y + 0.3, 0.78, "F1E6D2", it[0]);
    s.addText(it[1], { x: x + 0.3, y: y + 1.15, w: ccw - 0.6, h: 0.4, fontFace: SANS, fontSize: 15.5, bold: true, color: INK });
    s.addText(it[2], { x: x + 0.3, y: y + 1.5, w: ccw - 0.55, h: 0.42, fontFace: SANS, fontSize: 11.5, color: GRAY, lineSpacingMultiple: 1.02 });
  });
  s.addNotes("İçerik = reklamın yakıtı. Bol ve kaliteli kreatif olmadan reklam yorulur. UGC ve tarif içerikleri hem güven hem organik erişim getirir. İçerik takvimini kampanya ve reklamla senkron kurgularız.");

  // ============================================================ 8. TİCİMAX TEKNİK
  s = p.addSlide(); bg(s, WHITE);
  rrect(s, { x: 8.03, y: 0.5, w: 4.6, h: 6.5, rectRadius: 0.12, fill: { color: NAVY } });
  s.addShape(p.ShapeType.ellipse, { x: 7.0, y: -1.4, w: 3.2, h: 3.2, fill: { color: NAVY2 } });
  iconCircle(s, 10.9, 0.95, 1.05, BLUE, "settings_w");
  s.addText("04", { x: 8.4, y: 2.15, w: 3, h: 0.6, fontFace: SERIF, fontSize: 20, bold: true, color: "DDE3FB" });
  s.addText("Ticimax\nTeknik Destek", { x: 8.4, y: 2.6, w: 3.9, h: 1.6, fontFace: SERIF, fontSize: 29, bold: true, color: WHITE, lineSpacingMultiple: 0.98 });
  s.addText("Mevcut altyapıyı satışa ve reklama hazır hale getiren teknik yönetim.", { x: 8.4, y: 4.2, w: 3.8, h: 1.1, fontFace: SANS, fontSize: 13.5, color: "C9CEEB" });
  kicker(s, "04 · Altyapı Yönetimi", 0.7, 0.55, BLUE);
  s.addText("Ticimax Altyapı & Teknik Destek", { x: 0.7, y: 0.85, w: 7.2, h: 1.3, fontFace: SERIF, fontSize: 28, bold: true, color: INK, lineSpacingMultiple: 0.98 });
  const tic = [
    ["settings_b", "Panel Yönetimi", "Ürün, kategori, kampanya ve stok kurgusunun düzenli yönetimi."],
    ["search_b", "Site İçi SEO", "Meta başlık/açıklama, URL, ürün açıklaması ve sitemap optimizasyonu."],
    ["layers_b", "Entegrasyonlar", "Meta katalog, GA4, piksel, e-posta/SMS ve pazaryeri bağlantıları."],
    ["zap_b", "Hız & Performans", "Görsel optimizasyonu ve sayfa hızı ile daha yüksek dönüşüm."],
    ["shopping_b", "Dönüşüm Optimizasyonu", "Ürün sayfası, sepet ve ödeme akışının satışa göre iyileştirilmesi."],
    ["shield_b", "Süreç Desteği", "Ticimax destek hattıyla koordinasyon, güncelleme ve sorun takibi."],
  ];
  let tx = 0.7, ty = 2.25, tw = 6.95, th = 0.78, tg = 0.075;
  tic.forEach((it, i) => {
    const y = ty + i * (th + tg);
    rrect(s, { x: tx, y, w: tw, h: th, rectRadius: 0.07, fill: { color: CREAM }, line: { color: LINE, width: 1 } });
    s.addShape(p.ShapeType.ellipse, { x: tx + 0.2, y: y + 0.16, w: 0.46, h: 0.46, fill: { color: "E7EBFB" } });
    s.addImage({ data: ICONS[it[0]], x: tx + 0.2 + 0.12, y: y + 0.16 + 0.12, w: 0.22, h: 0.22 });
    s.addText([{ text: it[1] + "  —  ", options: { bold: true, color: INK, fontSize: 13 } }, { text: it[2], options: { color: GRAY, fontSize: 11.5 } }],
      { x: tx + 0.85, y, w: tw - 1.05, h: th, fontFace: SANS, valign: "middle", lineSpacingMultiple: 0.98 });
  });
  s.addNotes("Farklılaştırıcı nokta: çoğu ajans sadece reklam yapar, siteye dokunmaz. Biz Ticimax panelini de yönetiriz — SEO, hız, entegrasyon ve dönüşüm. Böylece reklam trafiği boşa gitmez, satışa döner.");

  // ============================================================ 9. ZAMAN ÇİZELGESİ
  s = p.addSlide(); bg(s, NAVY);
  kicker(s, "Yol Haritası", 0.7, 0.55, BLUEL);
  s.addText("İlk 90 Günlük Çalışma Planı", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 34, bold: true, color: WHITE });
  s.addText("Hızlı kazanımlarla başlayıp sürdürülebilir büyümeye geçen aşamalı bir kurulum.",
    { x: 0.7, y: 1.65, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: "C9CEEB" });
  const phases = [
    ["0–30 GÜN", "Kurulum & Temel", ["Analiz, strateji ve hedef belirleme", "Piksel, GA4, katalog kurulumu", "Ticimax SEO & hız denetimi", "İlk reklam kampanyaları"], BLUE],
    ["30–60 GÜN", "Ölçekleme", ["Reklam bütçe optimizasyonu", "Remarketing & huni kurulumu", "Düzenli içerik akışı", "E-posta/SMS otomasyonu"], RED],
    ["60–90 GÜN", "Büyüme & Sadakat", ["Kazanan kreatifleri büyütme", "CRM & tekrar satış senaryoları", "SEO içerik üretimi", "Performans raporu & yeni hedefler"], COPPER],
  ];
  let phx = 0.7, phw = 3.95, phgap = 0.14, phy = 2.45, phh = 4.35;
  phases.forEach((ph, i) => {
    const x = phx + i * (phw + phgap);
    rrect(s, { x, y: phy, w: phw, h: phh, rectRadius: 0.1, fill: { color: NAVY2 } });
    rrect(s, { x, y: phy, w: phw, h: 1.0, rectRadius: 0.1, fill: { color: ph[3] } });
    rect(s, { x, y: phy + 0.55, w: phw, h: 0.45, fill: { color: ph[3] } });
    s.addText(ph[0], { x: x + 0.3, y: phy + 0.14, w: phw - 0.6, h: 0.35, fontFace: SANS, fontSize: 13, bold: true, color: "FFFFFF", charSpacing: 2 });
    s.addText(ph[1], { x: x + 0.3, y: phy + 0.5, w: phw - 0.6, h: 0.45, fontFace: SERIF, fontSize: 18, bold: true, color: WHITE });
    ph[2].forEach((li, j) => {
      const ly = phy + 1.3 + j * 0.73;
      s.addShape(p.ShapeType.ellipse, { x: x + 0.32, y: ly + 0.03, w: 0.28, h: 0.28, fill: { color: ph[3] } });
      s.addImage({ data: ICONS["check_w"], x: x + 0.32 + 0.06, y: ly + 0.03 + 0.06, w: 0.16, h: 0.16 });
      s.addText(li, { x: x + 0.75, y: ly - 0.05, w: phw - 1.0, h: 0.7, fontFace: SANS, fontSize: 12, color: "DDE3FB", valign: "middle", lineSpacingMultiple: 0.98 });
    });
  });
  s.addNotes("Beklentiyi yönet: 1. ay kurulum ve hızlı kazanımlar, gerçek ivme 2–3. ayda gelir. Bu plan ölçülebilir dönüm noktaları verir; her ay sonunda birlikte değerlendiririz.");

  // ============================================================ 10. KPI & RAPORLAMA
  s = p.addSlide(); bg(s, WHITE);
  kicker(s, "Şeffaflık & Güven", 0.7, 0.55, BLUE);
  s.addText("Ölçüm, KPI & Raporlama", { x: 0.7, y: 0.85, w: 12, h: 0.8, fontFace: SERIF, fontSize: 34, bold: true, color: INK });
  s.addText("Her çalışma ölçülebilir hedeflere bağlıdır. Neyi takip edeceğimizi baştan netleştiriyoruz.",
    { x: 0.7, y: 1.65, w: 12, h: 0.4, fontFace: SANS, fontSize: 14, color: GRAY });
  const stats = [
    ["ROAS", "Reklam Getirisi", "Harcanan her liranın kaç lira satışa döndüğü.", BLUE],
    ["CR", "Dönüşüm Oranı", "Ziyaretçinin siparişe dönüşme yüzdesi.", RED],
    ["CAC", "Müşteri Maliyeti", "Yeni bir müşteri kazanmanın ortalama maliyeti.", COPPER],
    ["AOV", "Sepet Tutarı", "Ortalama sipariş değeri ve büyüme hedefi.", NAVY],
  ];
  let sx = 0.7, sw = 2.92, sgap = 0.13, sy = 2.45, sh = 2.35;
  stats.forEach((st, i) => {
    const x = sx + i * (sw + sgap);
    rrect(s, { x, y: sy, w: sw, h: sh, rectRadius: 0.1, fill: { color: CREAM }, line: { color: LINE, width: 1 } });
    s.addText(st[0], { x: x + 0.25, y: sy + 0.32, w: sw - 0.5, h: 0.9, fontFace: SERIF, fontSize: 40, bold: true, color: st[3] });
    s.addText(st[1], { x: x + 0.28, y: sy + 1.3, w: sw - 0.5, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: INK });
    s.addText(st[2], { x: x + 0.28, y: sy + 1.72, w: sw - 0.5, h: 0.55, fontFace: SANS, fontSize: 11, color: GRAY, lineSpacingMultiple: 1.0 });
  });
  // reporting cadence bar
  rrect(s, { x: 0.7, y: 5.25, w: 11.93, h: 1.55, rectRadius: 0.1, fill: { color: NAVY } });
  iconCircle(s, 1.05, 5.6, 0.85, BLUE, "pie_w");
  s.addText("Şeffaf Raporlama Ritmi", { x: 2.15, y: 5.5, w: 10, h: 0.45, fontFace: SANS, fontSize: 17, bold: true, color: WHITE });
  s.addText([
    { text: "Haftalık:  ", options: { bold: true, color: BLUEL, fontSize: 12.5 } },
    { text: "reklam optimizasyonu    ", options: { color: "DDE3FB", fontSize: 12.5 } },
    { text: "Aylık:  ", options: { bold: true, color: BLUEL, fontSize: 12.5 } },
    { text: "detaylı performans raporu + toplantı    ", options: { color: "DDE3FB", fontSize: 12.5 } },
    { text: "Canlı:  ", options: { bold: true, color: BLUEL, fontSize: 12.5 } },
    { text: "GA4 & reklam paneli erişimi", options: { color: "DDE3FB", fontSize: 12.5 } },
  ], { x: 2.15, y: 5.95, w: 10.2, h: 0.7, fontFace: SANS, valign: "top", lineSpacingMultiple: 1.1 });
  s.addNotes("Güven mesajı: her şey ölçülür ve şeffaf paylaşılır. Firma panellere kendi erişimini alır. KPI'ları birlikte belirleyelim ki başarı ortak tanımlansın.");

  // ============================================================ 11. NEDEN BİZ / KAPANIŞ
  s = p.addSlide(); bg(s, NAVY);
  s.addShape(p.ShapeType.ellipse, { x: 9.9, y: -2.4, w: 6.6, h: 6.6, fill: { color: NAVY2 } });
  s.addShape(p.ShapeType.ellipse, { x: 11.6, y: 3.9, w: 4.4, h: 4.4, fill: { color: BLUE } });
  kicker(s, "Özet", 0.9, 0.7, BLUEL);
  s.addText("Tek Ekip, Uçtan Uca Büyüme", { x: 0.9, y: 1.05, w: 9, h: 1.4, fontFace: SERIF, fontSize: 40, bold: true, color: WHITE, lineSpacingMultiple: 0.98 });
  const why = [
    ["target_w", "Satış Odaklı", "Beğeni değil, sipariş ve ciro hedefleriz."],
    ["layers_w", "Bütünsel Yaklaşım", "Reklam, içerik ve altyapı tek stratejide."],
    ["settings_w", "Ticimax Uzmanlığı", "Sadece reklam değil, altyapıyı da yönetiriz."],
    ["eye_w", "Tam Şeffaflık", "Ölçülebilir hedefler ve düzenli raporlama."],
  ];
  let wx = 0.9, wy = 2.75, wcw = 5.55, wch = 1.4, wgx = 0.3, wgy = 0.25;
  why.forEach((it, i) => {
    const x = wx + (i % 2) * (wcw + wgx), y = wy + Math.floor(i / 2) * (wch + wgy);
    rrect(s, { x, y, w: wcw, h: wch, rectRadius: 0.09, fill: { color: NAVY2 } });
    iconCircle(s, x + 0.28, y + 0.35, 0.72, BLUE, it[0]);
    s.addText(it[1], { x: x + 1.15, y: y + 0.22, w: wcw - 1.35, h: 0.4, fontFace: SANS, fontSize: 15.5, bold: true, color: WHITE });
    s.addText(it[2], { x: x + 1.15, y: y + 0.66, w: wcw - 1.35, h: 0.55, fontFace: SANS, fontSize: 11.5, color: "C9CEEB", lineSpacingMultiple: 1.0 });
  });
  rrect(s, { x: 0.9, y: 6.15, w: 11.55, h: 0.92, rectRadius: 0.1, fill: { color: BLUE } });
  s.addText("Bir sonraki adım: hedefleri netleştirip 30 günlük kurulum planını başlatmak.",
    { x: 1.2, y: 6.15, w: 7.6, h: 0.92, fontFace: SANS, fontSize: 14.5, bold: true, color: WHITE, valign: "middle" });
  s.addText([{ text: "Partum Ajans   ·   ", options: { bold: true, color: WHITE, fontSize: 13 } }, { text: "partumajans@gmail.com", options: { color: "DDE3FB", fontSize: 13 } }],
    { x: 8.5, y: 6.15, w: 3.75, h: 0.92, fontFace: SANS, valign: "middle", align: "right" });
  s.addNotes("Kapanış: net bir sonraki adım öner — küçük bir başlangıç (kurulum + ilk kampanyalar) ile başlayıp sonuçlara göre büyütmeyi teklif et. Soruları al, hedefleri birlikte tanımla.");

  const out = "Ragyu-Dijital-Pazarlama-Sunumu.pptx";
  await p.writeFile({ fileName: out });
  console.log("WROTE " + out);
})();
