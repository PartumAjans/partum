# Ragyu — Dijital Sistem Analizi & Çözüm Önerisi Sunumu

Ragyu premium kasap+ firmasına yönelik hazırlanan sunum. Yaklaşım: **mevcut sistemdeki eksikleri tespit et → her birine somut çözüm sun → beklenen etkiyi göster.**

## Dosyalar

- **`Ragyu-Dijital-Pazarlama-Sunumu.pptx`** — Sunum dosyası (PowerPoint / Keynote / Google Slides ile açılıp düzenlenebilir). 16:9, 11 slayt. Her slaytta konuşma notları (speaker notes) mevcuttur.
- **`deck-generator.js`** — Sunumu üreten Node.js betiği (pptxgenjs). İçeriği güncellemek için düzenleyip yeniden çalıştırılabilir.

## İçerik akışı (11 slayt)

1. Kapak — Dijital Sistem Analizi & Çözüm Önerisi
2. Yaklaşımımız — güçlü temeli koru + sistemi denetle (+ teşhis notu)
3. Yönetici Özeti — Tespit edilen 8 temel eksik (gap map)
4. Alan 01 — Ölçüm & Dijital Pazarlama: Eksik → Çözüm → Etki
5. Alan 02 — Reklam Yönetimi: Eksik → Çözüm → Etki
6. Alan 03 — İçerik & Dönüşüm: Eksik → Çözüm → Etki
7. Alan 04 — Ticimax Altyapı & Teknik: Eksik → Çözüm → Etki
8. İlk 30 günde hızlı kazanımlar (düşük efor / yüksek etki)
9. Eksikleri kapatma yol haritası — 90 gün
10. Başarıyı nasıl ölçüp kanıtlayacağız (KPI & raporlama)
11. Özet & sonraki adım

## Önemli not

Slaytlardaki eksik tespitleri, herkese açık web (ragyu.com.tr) ve sosyal medya (@ragyu.kasap) incelemesine dayanır. Kesin teşhis, firmanın panel ve reklam/analitik hesap erişimiyle netleştirilmelidir — sunumda da bu şekilde konumlandırılmıştır.

## Yeniden üretmek için

```bash
cd sunum
npm install pptxgenjs react react-dom react-icons sharp
node deck-generator.js
```
