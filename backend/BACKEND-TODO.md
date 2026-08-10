# Sahnem Backend — Eksik Analizi ve Yapılacaklar

> İlk sürüm 2026-08-06 tarihli incelemeye dayanıyordu. 2026-08-10'da MVP'yi tamamlamak için ikinci bir çalışma yapıldı — bu dosya o çalışmadan sonraki güncel durumu yansıtıyor. **Öncelik sırası: P0 → P3.**

## ✅ Bu oturumda tamamlananlar (2026-08-10)

### Bug fix / temizlik
- `GenericRepository.GetAllAsync()` içindeki her çağrıya 1 saniye ekleyen suni `Task.Delay(1000)` kaldırıldı.
- `AdvertStatus` enum'ının yanlış namespace'te (`Sahnem.Business.Enums`) olması düzeltildi → `Sahnem.Core.Enums`, diğer tüm enum'larla tutarlı.
- `MusicBranch.Bağlama` → `Baglama` (ASCII olmayan enum ismi JSON/URL serileştirmede risk taşıyordu).
- `AdvertController..cs` dosya adındaki yazım hatası düzeltildi.
- Profile/Advert/User response DTO'larında eksik olan `Id`, `CreatorId`/`AppUserId`, `VerificationStatus`, `Role`, `IsProfileCompleted` gibi alanlar eklendi (frontend'in linkleme/routing için ihtiyaç duyduğu temel alanlar hiç dönmüyordu).
- `AdvertController`/`AdvertService`'te eksik olan `[Authorize]` ve rol kısıtları (`Organizer,Venue`) eklendi.
- EF Core'un "decimal precision belirtilmemiş" uyarısını gideren açık `HasPrecision(18,2)` (Advert.Budget, Offer.ProposedPrice).

### P0 — tamamlandı
- **CORS** eklendi (`http://localhost:5173` ve `4173` için policy).
- **Global exception handling middleware** eklendi — standart `{ message, errors }` response şekli. Servis katmanı hâlâ ayrım gözetmeksizin `throw new Exception(...)` kullandığı için sınıflandırma **exception tipine** göre yapılıyor (tam `Exception` tipi → 400, `ValidationException` → 400 + alan hataları, başka her tip → 500, stack trace sızdırılmaz).
- **AdvertController + OfferController** artık tam dışa açık: ilan CRUD + filtreli listeleme (`city`, `branch`, `status`, `search`, `minBudget`), teklif gönderme/listeleme/kabul-red. Teklif kabul edilince ilan otomatik `Closed` oluyor.
- **Sırlar** `appsettings.json`'dan `dotnet user-secrets`'e taşındı (Development ortamında otomatik yükleniyor, prod için hâlâ ortam değişkeni/Key Vault gerekiyor).

### P1 — kısmen tamamlandı
- **Rol bazlı yetkilendirme**: Advert/Offer/Profile update uçlarında `[Authorize(Roles=...)]` uygulandı.
- **ProfileController tamamlandı**: `GET /api/profile/musician/{id}` (herkese açık), `GET /api/profile/musicians?search=&branch=&city=&travelOnly=` (filtreli liste), `GET /api/profile/employer/{userId}` (Organizer/Venue otomatik ayrımı), üç profil tipi için `PUT` update uçları.
- **Dosya yükleme**: `IFileStorageService` + yerel disk implementasyonu, `POST /api/upload/avatar` (tip/boyut doğrulamalı, max 5MB, sadece jpeg/png/webp/gif), `AppUser.AvatarUrl` alanı + migration, statik dosya sunumu (`wwwroot/uploads`).
- ~~Refresh token~~ — **yapılmadı**, aşağıda duruyor.
- ~~Email/telefon doğrulama~~ — **yapılmadı**, aşağıda duruyor.
- ~~Pagination~~ — **yapılmadı**, aşağıda duruyor.

Tüm değişiklikler `dotnet build` ile hatasız derlendi, migration'lar gerçek bir SQL Server'a uygulandı ve **gerçek bir uçtan uca akış curl ile test edildi**: kayıt → giriş → müzisyen profili oluştur → organizatör profili oluştur → ilan aç (branş filtresiyle listelen) → müzisyen teklif gönder → organizatör teklifi görüp kabul et → ilan otomatik kapandı → avatar yükle → statik dosyadan geri oku. Ayrıca rol ihlali (müzisyenin ilan açmaya çalışması) doğru şekilde 403 döndü ve CORS preflight doğru header'ları verdi.

---

## Kalan işler (öncelik sırasına göre)

### P1 — kısa vadede gerekli
1. **Refresh token akışı** — access token 60 dk, süre dolunca kullanıcı yeniden login olmalı.
2. **Email/telefon doğrulama** — `IsEmailConfirmed`/`IsPhoneNumberConfirmed` alanları var ama hiç set edilmiyor.
3. **Pagination** — `GetAllUsers`, `GetAllAdvert`, `GetMusicians` sınırsız veri dönüyor. `?page=&pageSize=` eklenmeli.
4. **Register akışında rol seçimi yok** — şu an `AppUserRegisterDto`'da `Role` alanı yok, rol ancak profil oluşturulunca (`CreateMusicianProfile` vb.) atanıyor. Bu bilinçli bir tasarım kararı gibi duruyor (register → profil sihirbazı akışı), sadece not düşülüyor; frontend entegrasyonunda bu akışa göre tasarım yapılmalı.

### P2 — ürün için gerekli ama hiç modellenmemiş (frontend hâlâ mock kullanıyor)
5. **Mesajlaşma** — `Conversation`/`Message` entity'si yok.
6. **Bildirim** — `Notification` entity'si yok.
7. **Favoriler** — `Favorite` entity'si yok.

### P3 — production olgunluğu
8. Health check endpoint'i (`/health`).
9. Structured logging (Serilog vb.) — şu an sadece varsayılan ASP.NET logging var, exception middleware `ILogger` kullanıyor ama sink/sağlayıcı ayarlanmadı.
10. Rate limiting.
11. API versioning (`/api/v1/...`).
12. Unit/Integration test projesi — hâlâ hiç yok.
13. Response compression, distributed/memory cache.
14. SQL Server `sa` hesabı yerine dedicated, düşük yetkili kullanıcı (prod için).
15. Prod ortamında `Jwt:Key`/`ConnectionStrings` için ortam değişkeni veya Key Vault (user-secrets sadece dev'de çalışır).
16. `LocalFileStorageService` MVP için yerel disk kullanıyor — birden fazla instance/deploy senaryosunda Azure Blob/S3'e taşınmalı (arayüz zaten hazır, sadece yeni implementasyon + DI kaydı değişecek).

---

## Zaten sağlam olan kısımlar (referans için)

- Clean layered architecture (API/Business/Core/DataAccess), Repository + UnitOfWork pattern kurulu.
- JWT auth (`JwtService`, `CurrentUserService`) ve `PasswordHasher` tabanlı şifreleme çalışıyor.
- FluentValidation ile validator'lar mevcut (Register/Login/Update, 3 profil create, Advert create/update, Offer create).
- AutoMapper profilleri (Entity ↔ DTO) düzgün kurulu, yeni eklenenler de (Offer) aynı desene uyuyor.
- 5 migration mevcut (InitialCreate, AddIsProfileCompleted, UpdateAdvert, AddAdvertTargetBranchAndPricePrecision, AddUserAvatarUrl), EF Core ilişkileri (`DeleteBehavior.Restrict`) doğru tanımlanmış.
- CORS, global exception handling, dosya yükleme, rol bazlı yetkilendirme artık kurulu.

## Önerilen sıra (güncel)

1. Refresh token + pagination (P1 kalanları) — kullanıcı deneyimini doğrudan etkiliyor.
2. Mesaj/bildirim/favori modelleme (P2) — frontend'de tam UI hazır, sadece backend karşılığı bekleniyor.
3. Geri kalan production sertleştirme işleri (P3) — deploy öncesi.
