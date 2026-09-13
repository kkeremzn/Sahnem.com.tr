# Sahnem Frontend

Sahnem'i müzisyenlerle organizatör/mekanları buluşturan platformun web arayüzü. **React 19 + TypeScript + Vite + Tailwind CSS v4** ile yazılmıştır.

## Çalıştırma

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL'i kendi backend adresine göre ayarla
npm run dev      # http://localhost:5173
npm run build    # production build (dist/)
```

## Backend entegrasyonu

Mock/localStorage katmanı kaldırıldı — uygulama gerçek backend API'sine (`.env`'deki `VITE_API_URL`) bağlanır. Yerel geliştirme için backend'i ayrıca çalıştırman gerekir (bkz. `backend/README` yoksa proje kökündeki `LAUNCH-READINESS.md`); üretimde `VITE_API_URL` canlı API adresine (`https://api.sahnem.com.tr/api`) işaret eder.

Yeni bir hesap oluşturmak için `/register` üzerinden kayıt olup e-postanı doğrulayarak profil kurulum sihirbazını tamamlayabilirsin.

## Mimari

```
src/
  types/       Backend enum/DTO'larıyla birebir eşleşen TypeScript tipleri
  services/    Backend API'sine fetch() ile bağlanan servis fonksiyonları
               (authService, advertService, offerService, profileService, ...)
  context/     AuthContext (oturum), ToastContext, NotificationContext
  components/  layout/ (Navbar, Footer, Sidebar) + ui/ (buton, kart, form
               alanları, modal, sekme vb. tekrar kullanılabilir bileşenler)
  pages/       Sayfa bileşenleri (public sayfalar, auth/, app/ altında panel
               sayfaları, admin/ altında yönetim paneli)
  router.tsx   Tüm route tanımları
```

Marka kimliği (mor #B14EFF + cyan #5CC8DB, Syne + Inter, dark tema) `src/index.css` içindeki Tailwind `@theme` bloğunda tanımlı.

## Yönetim paneli

Admin panelinin kendi ayrı girişi var: `/backstage/login`. Tüketici (musician/organizer/venue) hesaplarından tamamen bağımsız bir kimlik doğrulama şeması kullanır.
