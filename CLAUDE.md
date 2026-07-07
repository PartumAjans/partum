# CLAUDE.md — Proje Rehberi

Bu repoda **iki bağımsız iş** var:

## 1. `partum` paneli (kök dizin — `app/`, `components/`, `lib/`, `supabase/`)
Meta (Facebook/Instagram) reklam raporlama paneli. Next.js 14 (App Router) +
TypeScript + Tailwind + Recharts. Detaylar için `README.md`.

## 2. Çanta e-ticaret sitesi (`ticimax-canta/`) — partum'dan bağımsız
Ticimax altyapılı bir çanta e-ticaret sitesinin tema CSS/JS'i.

> **CSS veya JS ile ilgili herhangi bir iş yapmadan ÖNCE
> `ticimax-canta/NOTES.md` dosyasını oku.** Sitenin tüm tema mimarisi,
> renk sistemi (`var(--theme-color)`), grid, breakpoint'ler, bileşen↔CSS
> eşlemesi ve JS fonksiyon haritası orada özetlenmiştir. Ham kaynak:
> `ticimax-canta/reference/style.css` ve `ticimax-canta/reference/theme.js`.
> Böylece kaynağı her seferinde baştan analiz etmeye gerek kalmaz.
