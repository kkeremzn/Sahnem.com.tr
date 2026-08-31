# Sahnem Backend — Eksik Analizi ve Yapılacaklar

> İlk sürüm 2026-08-06 tarihli incelemeye dayanıyordu. 2026-08-10'da MVP tamamlama, 2026-08-11'de auth/mesajlaşma/bildirim/favori turu yapıldı. Bu dosya en güncel durumu yansıtıyor. **Öncelik sırası: P0 → P3.**

## ✅ 2026-08-11 turunda tamamlananlar

### Auth akışı yeniden kuruldu
- **Register artık token dönüyor** (`AuthResponseDto`, eskiden `AppUserResponseDto`): kullanıcı hesap oluşturur oluşturmaz oturum açmış sayılıyor, profil kurulum sihirbazına bu token ile devam ediyor. Profilini tamamladığında (`CreateMusicianProfile`/`CreateOrganizerProfile`/`CreateVenueProfile`) `Role` ve `IsProfileCompleted=true` claim'lerini taşıyan **ikinci** bir token üretiliyor — uygulamanın asıl ana ekranına o token ile giriliyor. Frontend bu iki aşamayı ayırt etmeli.
- **Refresh token akışı**: `RefreshToken` entity'si (rotasyonlu — her kullanımda eski token iptal edilip yenisi üretiliyor), `POST /api/user/refresh`, `POST /api/user/logout` (iptal). Access token 60 dk, refresh token 30 gün (`Jwt:RefreshTokenExpireDays`).
- **`ProfileCompleted` authorization policy**: `IsProfileCompleted` claim kontrolü artık `[Authorize(Policy = "ProfileCompleted")]` ile tek yerden yönetiliyor (Advert/Offer create uçlarında rol kısıtıyla birlikte kullanılıyor), servis katmanındaki eski manuel kontroller de duruyor (defense-in-depth).
- **Email doğrulama (Resend)**: `IEmailService`/`ResendEmailService` (Resend REST API, `Resend:ApiKey` boşsa gönderim sessizce atlanıp loglanıyor — hesap/domain doğrulaması yapılmadan da register akışı bozulmuyor). Kayıt sırasında 6 haneli kod otomatik üretilip gönderiliyor, `POST /api/user/verify-email`, `POST /api/user/resend-verification-email`.
- **Pagination**: `GetAllUsers`, `GetAllAdvert`, `GetMusicians` artık `PagedResultDto<T>` dönüyor (`?page=&pageSize=`, varsayılan 20, max 100).

### P2 tamamen tamamlandı (daha önce frontend'de sadece mock'tu)
- **Favoriler**: `Favorite` entity'si (Owner+Musician, unique index), `POST /api/favorite/toggle`, `GET /api/favorite/mine`, `GET /api/favorite/mine/ids`. Sadece Organizer/Venue rolü kullanabiliyor.
- **Bildirimler**: `Notification` entity'si, `GET /api/notification/mine`, `PUT /api/notification/{id}/read`, `PUT /api/notification/read-all`. `OfferService` artık event tetikli bildirim üretiyor: yeni teklif → ilan sahibine, teklif kabul/red → müzisyene. `MessageService` de yeni mesajda karşı tarafa bildirim üretiyor.
- **Mesajlaşma**: `Conversation` (UserA/UserB, taraf bazlı okunmamış sayaç) + `Message` entity'leri — frontend'in daha önce mock'ta kullandığı modelin birebir aynısı. `GET /api/message/conversations`, `GET /api/message/conversation/{id}`, `POST /api/message/send` (`conversationId` ya da `recipientUserId` ile — ilk mesajda sohbet otomatik oluşuyor), `PUT /api/message/conversation/{id}/read`.

Tüm bu değişiklikler `dotnet build` ile hatasız derlendi, tek bir migration'la (`AddAuthMessagingNotificationsFavorites`) gerçek SQL Server'a uygulandı ve **uçtan uca curl ile test edildi**: register→token, refresh (rotasyon doğrulandı — eski token tekrar kullanılamıyor), email doğrulama kodu DB'den okunup doğrulandı, favori ekle/çıkar, iki kullanıcı arası mesajlaşma (otomatik sohbet oluşturma + okunmamış sayaç), ve yeni ilan/teklif/kabul akışının doğru bildirimleri ürettiği doğrulandı.

## ✅ 2026-08-10 turunda tamamlananlar

### Bug fix / temizlik
- `GenericRepository.GetAllAsync()` içindeki her çağrıya 1 saniye ekleyen suni `Task.Delay(1000)` kaldırıldı.
- `AdvertStatus` enum'ının yanlış namespace'te (`Sahnem.Business.Enums`) olması düzeltildi → `Sahnem.Core.Enums`, diğer tüm enum'larla tutarlı.
- `MusicBranch.Bağlama` → `Baglama` (ASCII olmayan enum ismi JSON/URL serileştirmede risk taşıyordu).
- `AdvertController..cs` dosya adındaki yazım hatası düzeltildi.
- Profile/Advert/User response DTO'larında eksik olan `Id`, `CreatorId`/`AppUserId`, `VerificationStatus`, `Role`, `IsProfileCompleted` gibi alanlar eklendi.
- `AdvertController`/`AdvertService`'te eksik olan `[Authorize]` ve rol kısıtları (`Organizer,Venue`) eklendi.
- EF Core'un "decimal precision belirtilmemiş" uyarısını gideren açık `HasPrecision(18,2)` (Advert.Budget, Offer.ProposedPrice).
- **Exception middleware sınıflandırma hatası** (smoke test sırasında bulundu/düzeltildi): mesaj metninde anahtar kelime arayan ilk sürüm, listede olmayan geçerli hataları (ör. dosya yükleme validasyonu) yanlışlıkla 500'e düşürüyordu. Artık **exception tipine** bakılıyor: tam `Exception` tipi → 400, her türetilmiş/beklenmeyen tip → 500. Kod tabanındaki her kasıtlı `throw new Exception(...)` bu sayede güvenilir şekilde yakalanıyor.
- **Statik dosya sunumu 404 hatası** (smoke test sırasında bulundu/düzeltildi): `wwwroot/uploads` klasörü uygulama ilk açıldığında yoktu, ASP.NET Core'un statik dosya sağlayıcısı klasör yokken başlatıldığında sonradan oluşan dosyaları bulamıyordu. Klasör artık `.gitkeep` ile repoya önceden ekleniyor.

### P0 — tamamlandı
- **CORS**, **global exception handling middleware** (`{ message, errors }` şekli), **AdvertController + OfferController** tam dışa açık (ilan CRUD + filtreli listeleme, teklif gönderme/listeleme/kabul-red — kabul edilince ilan otomatik `Closed`), **sırlar** `dotnet user-secrets`'e taşındı.

### P1 — tamamlandı
- Rol bazlı yetkilendirme, ProfileController tamamlandı (tekil/filtreli müzisyen sorgusu, employer otomatik ayrımı, update uçları), dosya yükleme (`IFileStorageService` + yerel disk, `POST /api/upload/avatar`), refresh token, email doğrulama, pagination — hepsi 2026-08-10/11 turlarında bitti.
- **Register akışında rol seçimi**: `AppUserRegisterDto`'da hâlâ `Role` alanı yok — rol, profil oluşturma anında (`CreateMusicianProfile` vb.) atanıyor ve o an ikinci bir token üretiliyor. Bu bilinçli bir tasarım (register → profil sihirbazı akışı); frontend bu iki-aşamalı token modeline göre kurulmalı (register sonrası dönen ilk token'la profil sihirbazına girilir, profil tamamlanınca dönen ikinci token'la asıl uygulamaya geçilir).

---

## Kalan işler (öncelik sırasına göre)

### P3 — production olgunluğu (tek kalan kategori)
1. Health check endpoint'i (`/health`).
2. Structured logging (Serilog vb.) — şu an sadece varsayılan ASP.NET logging var.
3. Rate limiting.
4. API versioning (`/api/v1/...`).
5. Unit/Integration test projesi — hâlâ hiç yok.
6. Response compression, distributed/memory cache.
7. Postgres `sahnem` kullanıcısı şu an DB sahibi — prod için sadece gereken tablolara erişimi olan dedicated, düşük yetkili bir kullanıcıya geçilmeli.
8. Prod ortamında `Jwt:Key`/`ConnectionStrings`/`Resend:ApiKey` için ortam değişkeni veya Key Vault (user-secrets sadece dev'de çalışır).
9. `LocalFileStorageService` MVP için yerel disk kullanıyor — çoklu instance/deploy senaryosunda Azure Blob/S3'e taşınmalı (arayüz zaten hazır, sadece yeni implementasyon + DI kaydı değişecek).
10. Telefon doğrulama (`IsPhoneNumberConfirmed`) — bilinçli olarak bu turda ertelendi, SMS sağlayıcısı seçilince eklenebilir.
11. Mesajlaşmada gerçek zamanlılık (SignalR) — şu an REST + polling'e uygun; istemci tarafı polling ile idare edebilir, gerçek zamanlı bildirim isteniyorsa SignalR hub eklenebilir.
12. Resend gönderimleri şu an "fire and forget" değil ama başarısızlıkları sadece logluyor — kritik e-postalar için retry/kuyruk (ör. Hangfire) düşünülebilir.

---

## Zaten sağlam olan kısımlar (referans için)

- Clean layered architecture (API/Business/Core/DataAccess), Repository + UnitOfWork pattern kurulu.
- JWT auth (`JwtService`, `TokenService`, `CurrentUserService`) ve `PasswordHasher` tabanlı şifreleme çalışıyor.
- FluentValidation ile validator'lar mevcut (Register/Login/Update, 3 profil create, Advert create/update, Offer create).
- AutoMapper profilleri (Entity ↔ DTO) düzgün kurulu, yeni eklenenler de (Offer, Notification, Message) aynı desene uyuyor.
- 6 migration mevcut (InitialCreate, AddIsProfileCompleted, UpdateAdvert, AddAdvertTargetBranchAndPricePrecision, AddUserAvatarUrl, AddAuthMessagingNotificationsFavorites), EF Core ilişkileri (`DeleteBehavior.Restrict`, tüm yeni tablolarda tutarlı) doğru tanımlanmış.
- CORS, global exception handling, dosya yükleme, rol bazlı yetkilendirme, refresh token, email doğrulama, pagination, mesajlaşma, bildirim, favoriler — **hepsi kurulu ve uçtan uca test edilmiş durumda.**

## Önerilen sıra (güncel)

Ürün/özellik anlamında MVP tamam. Kalan tek kategori P3 — production'a çıkmadan önce yapılacaklar (health check, logging, rate limiting, testler, sır yönetimi). Öncelik sırası deploy planına göre değişebilir; en kritik olanlar muhtemelen **8 (prod sır yönetimi)** ve **5 (test projesi)**.
