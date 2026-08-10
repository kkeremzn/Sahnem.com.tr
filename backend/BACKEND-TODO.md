# Sahnem Backend — Eksik Analizi ve Yapılacaklar

> Bu dosya, mevcut backend kod tabanının (`Sahnem.API`, `Sahnem.Business`, `Sahnem.Core`, `Sahnem.DataAccess`) 2026-08-06 tarihli bir incelemesine dayanır. Kod değiştirilmedi, sadece tespitler ve öneriler not edilmiştir. Öncelik sırası: **P0 → P3**.

## P0 — Frontend entegrasyonunu doğrudan engelleyen

### 1. CORS middleware yok
`Sahnem.API/Program.cs` içinde `AddCors` / `UseCors` çağrısı yok. Frontend farklı bir origin'den (Vite dev server, `http://localhost:5173`) istek attığında tarayıcı bu istekleri engelleyecek. `AddCors` ile bir policy tanımlanıp `app.UseCors(...)` çağrılmalı — auth middleware'den önce.

### 2. AdvertController yok
`IAdvertService` / `AdvertService` (`Sahnem.Business/Services/AdvertService.cs`) içinde `CreateAdvert, UpdateAdvert, CancelAdvert, GetAdvertById, GetAllAdvert` metodları **tam implement edilmiş** durumda ama hiçbir controller bunları dışarı açmıyor. `Sahnem.API/Controllers/AdvertController.cs` eklenip şu uçlar tanımlanmalı:
- `POST /api/advert` (Organizer/Venue, ilan oluştur)
- `PUT /api/advert/{id}`
- `DELETE /api/advert/{id}` veya `POST /api/advert/{id}/cancel`
- `GET /api/advert/{id}`
- `GET /api/advert` (liste + filtre)

### 3. OfferController yok
`Offer` entity'si ve `OfferStatus` enum'ı var ama karşılığında ne bir servis ne de bir controller var. Müzisyenin bir ilana teklif göndermesi, işverenin teklifi kabul/red etmesi tamamen eksik. Gerekenler:
- `IOfferService` / `OfferService`: `CreateOffer`, `GetOffersByAdvert`, `GetOffersByMusician`, `UpdateOfferStatus` (Accept/Reject)
- `OfferController`: `POST /api/offer`, `GET /api/offer/mine`, `GET /api/offer/advert/{advertId}`, `PATCH /api/offer/{id}/status`

### 4. Global exception handling / standart hata response'u yok
Şu an hata durumunda muhtemelen ham exception veya varsayılan ASP.NET hata sayfası dönüyor. `UseExceptionHandler` + bir `ProblemDetails`/özel `ApiErrorResponse` middleware'i eklenmeli ki frontend tutarlı bir `{ message, errors }` şekli bekleyebilsin.

---

## P1 — Kısa vadede gerekli

### 5. Refresh token yok
`Jwt:ExpireMinutes = 60`. Access token süresi dolunca kullanıcı yeniden login olmak zorunda. Refresh token akışı (ayrı tablo veya HttpOnly cookie + rotasyon) eklenmeli.

### 6. Rol bazlı yetkilendirme kullanılmıyor
Controller'larda sadece `[Authorize]` var, `[Authorize(Roles = "Musician")]` gibi rol kısıtı hiç kullanılmamış. Örn. `CreateAdvert` sadece Organizer/Venue rolündeki kullanıcılara açık olmalı, `CreateOffer` sadece Musician'a. `AppUser.Role` (`UserType`) claim'e JWT'de zaten ekleniyor (`JwtService`), sadece controller'larda kullanılmıyor.

### 7. `GetAll` uçları pagination'sız
`UserController.GetAllUsers` ve (eklenecek) `AdvertController.GetAllAdvert` sınırsız veri dönüyor/dönecek. `?page=&pageSize=` parametreleriyle sayfalama ve toplam kayıt sayısı eklenmeli.

### 8. Dosya yükleme servisi yok
Profil fotoğrafı, mekan/organizatör logosu, müzisyen demo ses dosyası — hiçbiri için upload endpoint'i yok. `IFileStorageService` (yerel disk veya Azure Blob/S3) + `POST /api/upload` gibi bir uç eklenmeli, entity'lere `AvatarUrl`/`CoverUrl` gibi alanlar eklenmeli (şu an `AppUser`, `MusicianProfile` vb. içinde böyle bir alan yok).

### 9. Email/telefon doğrulama akışı yok
`AppUser.IsEmailConfirmed`, `IsPhoneNumberConfirmed` alanları tanımlı ama hiçbir yerde set edilmiyor/kullanılmıyor. Kod doğrulama gönderimi (email/SMS) + doğrulama endpoint'i eksik.

---

## P2 — Ürün için gerekli ama hiç modellenmemiş

### 10. Mesajlaşma yok
`Conversation` / `Message` entity'si yok. Yeni frontend şimdilik bunu mock veriyle simüle ediyor. Gerçek implementasyon için en azından: `Conversation(Id, UserAId, UserBId)`, `Message(Id, ConversationId, SenderId, Body, SentAt, ReadAt)` + REST veya SignalR tabanlı gerçek zamanlı iletim düşünülmeli.

### 11. Bildirim (Notification) yok
`Notification(Id, UserId, Type, Title, Body, IsRead, CreatedDate)` gibi bir entity yok. Teklif geldi/kabul edildi, yeni mesaj geldi gibi olaylarda bildirim üretecek bir mekanizma (event/servis) eksik.

### 12. Favoriler yok
İşverenin müzisyenleri kaydedebileceği bir `Favorite(Id, OwnerUserId, MusicianUserId)` tablosu yok.

---

## P3 — Production olgunluğu

- **Health check** endpoint'i yok (`AddHealthChecks()` / `/health`).
- **Request logging** yok (Serilog vb. ile structured logging önerilir).
- **Rate limiting** yok (`.NET 8` built-in `AddRateLimiter` kolayca eklenebilir).
- **API versioning** yok (`/api/v1/...` gibi bir pattern yok, ileride breaking change riski).
- **Unit/Integration test projesi hiç yok.** `Sahnem.Business` ve `Sahnem.API` için test projeleri (xUnit + Moq/FluentAssertions, `WebApplicationFactory`) eklenmesi önerilir.
- **Sırlar appsettings.json içinde hardcoded:** `ConnectionStrings:DefaultConnection` (sa şifresi dahil) ve `Jwt:Key` doğrudan `appsettings.json`'da duruyor ve muhtemelen kaynak kontrolüne gidiyor. `dotnet user-secrets` (dev) ve ortam değişkenleri/Key Vault (prod) kullanılmalı, dosyadan çıkarılmalı.
- **Namespace tutarsızlığı:** `AdvertStatus` enum'ı `Sahnem.Core/Enums/AdvertStatus.cs` dosyasında fiziksel olarak duruyor ama `namespace Sahnem.Business.Enums` yazıyor — diğer tüm enum'lar `Sahnem.Core.Enums` altında. Bu, `MusicianProfile.cs` ve `Advert.cs` gibi dosyalarda hem `Sahnem.Business.Enums` hem `Sahnem.Core.Enums` import edilmesine yol açıyor. Ya dosya `Sahnem.Business/Enums/` altına taşınmalı ya da namespace `Sahnem.Core.Enums` olarak düzeltilmeli.
- **Response compression** ve **caching** (distributed/memory) yok — trafik arttıkça gerekecek.
- **SQL Server `sa` hesabı** kullanılıyor — production için dedicated, düşük yetkili bir DB kullanıcısı önerilir.

---

## Zaten sağlam olan kısımlar (referans için)

- Clean layered architecture (API/Business/Core/DataAccess), Repository + UnitOfWork pattern kurulu.
- JWT auth (`JwtService`, `CurrentUserService`) ve `PasswordHasher` tabanlı şifreleme çalışıyor.
- FluentValidation ile 8 validator mevcut (Register/Login/Update, 3 profil create, 2 advert create/update).
- AutoMapper profilleri (Entity ↔ DTO) düzgün kurulu.
- 3 migration mevcut, EF Core ilişkileri (`DeleteBehavior.Restrict`) doğru tanımlanmış.

## Yol Haritası (sıraya göre)

Frontend'in `src/services/*.ts` katmanı neyi çağırmayı beklediğine göre önceliklendirildi — her fazın sonunda frontend'de karşılığı olan bir akış gerçek veriyle çalışır hale gelir.

### Faz 0 — Açma/kapama şalterleri (yarım gün)
1. **CORS** — `Program.cs`'e `AddCors`/`UseCors`, dev origin `http://localhost:5173`.
2. **Global exception handling** — `UseExceptionHandler` + standart `{ message, errors }` response şekli.
3. **Namespace düzeltmesi** — `AdvertStatus`'u `Sahnem.Core.Enums` altına al (P3 madde ama şimdi yapmak, yeni kod yazarken referans karmaşasını önler).
4. **Sırları appsettings'ten çıkar** — `dotnet user-secrets init` + connection string/JWT key'i oraya taşı (5 dakikalık iş, hemen alışkanlık haline getir).

### Faz 1 — İlan/Teklif çekirdek akışı (Advert + Offer)
Bu faz bitince: `/jobs`, `/jobs/:id` (teklif gönder), `/my-adverts`, `/my-adverts/:id` (kabul/red) sayfaları gerçek veriyle çalışır.
5. **AdvertController**: `POST /api/advert`, `PUT /api/advert/{id}`, `POST /api/advert/{id}/cancel`, `GET /api/advert/{id}`, `GET /api/advert` (filtre: city, status, search, minBudget), `GET /api/advert/mine` (creatorId'ye göre — `advertService.listAdvertsByCreator`'ın karşılığı).
6. **Advert'e `TargetBranch` (MusicBranch) alanı ekle** — şu an backend'de yok, frontend'de branş filtresi/rozeti için opsiyonel tutuldu (bkz. `frontend/src/types/advert.ts` içindeki not). Entity + DTO'lara ekleyip migration oluştur.
7. **OfferController + OfferService**: `POST /api/offer`, `GET /api/offer/mine` (musicianId), `GET /api/offer/advert/{advertId}`, `GET /api/offer/{id}`, `PATCH /api/offer/{id}/status`. Teklif kabul edildiğinde ilgili Advert'i `Closed` yapan iş kuralını servis içine koy (frontend mock'ta bu davranış zaten var — `offerService.updateOfferStatus`).
8. **Rol bazlı yetki**: `CreateAdvert` → `[Authorize(Roles="Organizer,Venue")]`, `CreateOffer` → `[Authorize(Roles="Musician")]`.

### Faz 2 — ProfileController'ı tamamla
Bu faz bitince: `/explore`, `/musicians/:id`, `/employers/:id`, `/profile/edit` gerçek veriyle çalışır.
9. `GET /api/profile/musician/{id}` — herkese açık tekil profil.
10. `GET /api/profile/musician?search=&branch=&city=&travelOnly=` — filtreli liste (`profileService.listMusicians` karşılığı).
11. `GET /api/profile/employer/{userId}` — Organizer ya da Venue'yu otomatik ayırt edip dönen tek uç (`profileService.getEmployerByUserId` karşılığı).
12. `PUT /api/profile/musician`, `PUT /api/profile/organizer`, `PUT /api/profile/venue` — şu an hiç update ucu yok, sadece create var.

### Faz 3 — Dosya yükleme + avatar/logo alanları
13. `AppUser`/`MusicianProfile`/`OrganizerProfile`/`VenueProfile` entity'lerine `AvatarUrl`/`LogoUrl`/`CoverUrl` alanları + migration.
14. `IFileStorageService` (başlangıç için yerel disk yeterli, ileride Azure Blob/S3'e taşınabilir) + `POST /api/upload`.

### Faz 4 — Kalan P1 sertleştirmeleri
15. Pagination — `GetAllUsers`, `GetAllAdvert` için `?page=&pageSize=`.
16. Refresh token akışı.
17. Email/telefon doğrulama (MVP için şart değil, en sona bırakılabilir).

### Faz 5 — Şu an tamamen mock olan özellikler (P2)
Öncelik sırası kolaydan zora: favoriler tek tablo, bildirimler event tetikli, mesajlaşma en karmaşığı.
18. **Favorite** `(Id, OwnerUserId, MusicianUserId)` + controller — en hızlı kazanım.
19. **Notification** `(Id, UserId, Type, Title, Body, IsRead, CreatedDate)` + controller; teklif geldi/kabul edildi gibi olaylarda otomatik üretim.
20. **Conversation/Message** — `Conversation(Id, UserAId, UserBId)`, `Message(Id, ConversationId, SenderId, Body, SentAt, ReadAt)`. Basit REST ile başla, gerçek zamanlılık istersen sonra SignalR ekle.

### Faz 6 — Production sertleştirme (P3, en sona)
21. Health check, structured logging (Serilog), rate limiting, API versioning, unit/integration test projesi, response compression/caching, dedicated (sa olmayan) DB kullanıcısı.
