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

## ✅ 2026-09-02 turunda tamamlananlar (production'a çıkış + güvenlik/altyapı sertleştirme)

- PostgreSQL'e geçiş (Render managed Postgres), Render (backend) + Vercel (frontend) canlıya alındı, custom domain'ler bağlandı.
- Health check endpoint'i (`/health`), rate limiting (`Microsoft.AspNetCore.RateLimiting`, auth uçlarında), güvenlik başlıkları (CSP/HSTS/X-Frame-Options vb.), dosya yükleme extension spoofing açığı kapatıldı (magic-byte doğrulama).
- Dosya depolama Cloudflare R2'ye taşındı (Render'ın diski deploy'da sıfırlanıyordu) — madde 9 tamamlandı.
- E-posta Resend'den Zoho'ya taşındı — ama SMTP değil, **Zoho Mail'in HTTPS API'si** üzerinden (Render'ın SMTP portlarını (465/587) tamamen engellediği canlıda TCP testiyle doğrulandı; OAuth2 refresh token ile çalışıyor, `support@sahnem.com.tr`'den gönderiyor).
- E-posta doğrulama artık kayıt akışına gerçekten entegre (`/verify-email` sayfası, profil kurulumundan önce zorunlu), 60sn resend cooldown + rate limit.
- Şifremi unuttum akışı sıfırdan gerçek backend'e bağlandı (e-posta kontrolü → kod → doğrulama → yeni şifre, eski şifreyle aynı olamaz kontrolü, reset sonrası tüm refresh token'lar iptal).
- Migration'lar artık deploy'da otomatik uygulanıyor (`db.Database.Migrate()` startup'ta) — elle `dotnet ef database update` gerekmiyor.
- `DeleteUser` düzeltildi — daha önce ilişkili kayıtları (teklif/ilan/mesaj/favori/bildirim/refresh token) temizlemediği için her zaman 500 veriyordu.

## Kalan işler (öncelik sırasına göre)

### P3 — production olgunluğu
1. Structured logging (Serilog vb.) — şu an sadece varsayılan ASP.NET logging var.
2. API versioning (`/api/v1/...`).
3. Unit/Integration test projesi — hâlâ hiç yok.
4. Response compression, distributed/memory cache.
5. Postgres kullanıcısı şu an DB sahibi — prod için sadece gereken tablolara erişimi olan dedicated, düşük yetkili bir kullanıcıya geçilmeli.
6. Telefon doğrulama (`IsPhoneNumberConfirmed`) — kullanıcı şu an için sadece e-posta doğrulaması istedi, SMS bilinçli olarak ertelendi.
7. Mesajlaşmada gerçek zamanlılık (SignalR) — şu an REST + polling'e uygun; istemci tarafı polling ile idare edebilir, gerçek zamanlı bildirim isteniyorsa SignalR hub eklenebilir.
8. Zoho Mail API gönderimleri "fire and forget" değil ama başarısızlıkları sadece logluyor — kritik e-postalar için retry/kuyruk (ör. Hangfire) düşünülebilir.
9. Render/GitHub'a özel: JWT key'in production'da güçlü/rastgele olduğu teyit edilmeli, Postgres backup/retention ayarı kontrol edilmeli, GitHub reposu şu an public — bilinçli bir tercih değilse private'a alınmalı.

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
