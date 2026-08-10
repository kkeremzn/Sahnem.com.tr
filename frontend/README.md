# Sahnem Frontend

Sahnem'i müzisyenlerle organizatör/mekanları buluşturan platformun web arayüzü. **React 19 + TypeScript + Vite + Tailwind CSS v4** ile yazılmıştır.

## Çalıştırma

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (dist/)
```

## Demo giriş bilgileri

Backend henüz hazır olmadığı için tüm veriler `localStorage` destekli bir mock katmanından geliyor (bkz. "Mimari" bölümü). Seed'lenmiş kullanıcılardan biriyle giriş yapabilirsin:

- **Müzisyen:** `elif@sahnem.com`
- **Organizatör:** `bosphorus@sahnem.com`
- **Mekan:** `zorlupsm@sahnem.com`
- **Şifre (hepsi için):** `sahnem123`

Veya `/register` üzerinden yeni bir hesap oluşturup profil kurulum sihirbazını deneyebilirsin. Farklı bir seed durumuyla baştan başlamak istersen tarayıcı konsolunda `localStorage.clear()` çalıştırıp sayfayı yenilemen yeterli.

## Mimari

```
src/
  types/       Backend enum/DTO'larıyla birebir eşleşen TypeScript tipleri
  mocks/       Zengin, gerçekçi Türkçe seed veri (81 il, 18 müzik dalı, ...)
  services/    Async fonksiyonlar (authService, advertService, offerService, ...) —
               şu an mock veriyi localStorage'a okuyup yazıyor, backend hazır olunca
               içleri fetch() ile değiştirilecek; dışa açık imzalar aynı kalacak
  context/     AuthContext (oturum), ToastContext (bildirimler)
  components/  layout/ (Navbar, Footer, Sidebar, layout kabukları) + ui/ (buton, kart,
               form alanları, modal, sekme vb. tekrar kullanılabilir bileşenler)
  pages/       Sayfa bileşenleri (public sayfalar, auth/, app/ altında panel sayfaları)
  router.tsx   Tüm route tanımları
```

Marka kimliği (mor #B14EFF + cyan #5CC8DB, Syne + Inter, dark tema) `src/index.css` içindeki Tailwind `@theme` bloğunda tanımlı.

## Backend entegrasyonu

Backend'de eksik olan uçlar ve öncelik sırası için bkz. [`backend/BACKEND-TODO.md`](../backend/BACKEND-TODO.md). Backend'de CORS + `AdvertController`/`OfferController` hazır olduğunda `src/services/*.ts` içindeki mock okuma/yazma çağrıları `fetch(...)` ile değiştirilecek; sayfa bileşenlerinde değişiklik gerekmeyecek şekilde tasarlandı.
