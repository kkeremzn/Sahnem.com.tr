# Sahnem — Canlıya Alma Durum Raporu

> 2026-08-11 itibarıyla kod tabanının tam taraması. Amaç: "gerçek kullanıcılar uygulamayı kullanmaya başlasın" hedefine göre ne var, ne eksik, ne acil.

## Özet

Ürün/özellik anlamında **backend MVP tamamlandı** (auth, ilan/teklif, profil, mesajlaşma, bildirim, favoriler — hepsi uçtan uca çalışıyor ve test edildi) ve **frontend'in 25 sayfası eksiksiz yazıldı**. Ama şu an elimizde iki ayrı, birbirine hiç bağlı olmayan sistem var:

> **🔴 EN KRİTİK BULGU: Frontend, backend'e hiç bağlı değil.** Tüm ekranlar `localStorage`'a yazan mock bir veri katmanı kullanıyor. Gerçek bir kullanıcı frontend'i açtığında kayıt olduğunu, ilan açtığını sanır ama hiçbir şey gerçek veritabanına yazılmaz. **Bu tek başına, aşağıdaki her şeyden önce çözülmesi gereken şey.**

Bunun dışında, canlıya çıkmadan önce halletmemiz gereken üç ayrı katman daha var: **backend'in production sertleştirmesi** (P3 maddeleri, çoğu henüz yapılmadı), **altyapı/deployment** (şu an hiçbir şey — kod sadece senin makinende çalışıyor), ve **moderasyon/yönetim** (doğrulama rozetleri var ama kimseyi doğrulayacak bir mekanizma yok).

Aşağıda hepsi öncelik sırasıyla.

---

## 🔴 Bloker #1 — Frontend ↔ Backend entegrasyonu (hiç yok)

Bu, "canlıya alalım" dediğimizde yapılacak **en büyük ve en önce gelen iş**. Şu an durum:

- `frontend/src/services/*.ts` içindeki her fonksiyon (authService, advertService, offerService, profileService, messageService, notificationService, favoriteService) gerçek bir API çağrısı yapmıyor, `localStorage`'a okuyup yazıyor.
- Frontend'de backend'in adresini tutan bir `.env`/`VITE_API_URL` bile yok.
- Backend'de JWT + refresh token akışı hazır ama frontend bunu hiç kullanmıyor (kendi mock oturum sistemi var).

**Yapılması gereken** (tahmini 3-5 iş günü, tek kişi):
1. `.env` ile API base URL yapılandırması (`VITE_API_URL`), dev/prod ayrımı.
2. `authService.ts`: gerçek `POST /api/user/register`, `/login`, `/refresh`, `/logout` çağrıları; access token'ı memory'de/refresh token'ı güvenli şekilde sakla (bkz. aşağıdaki güvenlik notu).
3. Access token süresi dolunca (**60 dk**) otomatik `refresh` deneyen bir `fetch` wrapper/interceptor (aksi halde kullanıcı bir saatte bir "oturumun sona erdi" görür).
4. Diğer 6 servis dosyasının tamamının gerçek endpoint'lere bağlanması — DTO şekilleri backend ile **birebir eşleşecek şekilde tasarlandı**, bu yüzden bu kısım mekanik bir iş, mimari değişiklik gerekmiyor.
5. **Register akışı iki token üretiyor** (kayıt anında bir token, profil tamamlanınca ikinci/asıl token) — frontend'in `ProfileSetup` sayfası bu akışa göre güncellenmeli (muhtemelen zaten yakın, ama kontrol edilmeli).
6. Backend hata response şekli (`{ message, errors }`) frontend'in toast/hata gösterimiyle eşleştirilmeli.
7. Gerçek CORS testi: frontend'in deploy edileceği prod origin'i backend'in CORS listesine eklenmeli (şu an sadece `localhost:5173`/`4173` var).

> **Güvenlik notu:** Refresh token'ı nerede saklayacağımıza dikkat etmemiz lazım. `localStorage`'da tutmak XSS riskine karşı en zayıf seçenek. En doğrusu backend'in refresh token'ı **HttpOnly cookie** olarak set etmesi (şu an body'de dönüyor) — bu, entegrasyon sırasında backend'de küçük bir ek değişiklik gerektirir. Bunu entegrasyon işine başlamadan karar verelim.

---

## 🟠 Bloker #2 — Hiçbir yerde çalışmıyor (deployment/altyapı sıfır)

Şu an her şey senin yerel makinende: backend `dotnet run` ile, veritabanı yerel bir Docker konteynerinde (`backend-sqlserver-1`), frontend `npm run dev` ile. Canlıya almak için:

| # | Ne gerekiyor | Not |
|---|---|---|
| 1 | **Hosted veritabanı** | Yerel Docker SQL Server prod için uygun değil. Azure SQL / AWS RDS SQL Server / benzeri managed bir servis gerekiyor. |
| 2 | **Backend hosting** | Azure App Service, bir VPS + Docker, Railway/Render gibi bir PaaS — hangisi tercih edilecek karar verilmeli. |
| 3 | **Frontend hosting** | Statik SPA olduğu için Vercel/Netlify/Azure Static Web Apps gibi bir yere `npm run build` çıktısı (dist/) deploy edilmeli. |
| 4 | **Domain + HTTPS** | Şu an `localhost`. Gerçek bir domain adı ve SSL sertifikası (çoğu hosting bunu otomatik verir). |
| 5 | **Environment secrets** | `Jwt:Key`, `ConnectionStrings`, `Resend:ApiKey` şu an sadece senin makinendeki `dotnet user-secrets`'te — hosting platformunun environment variable/secret sistemine taşınmalı. |
| 6 | **CI/CD** | Hiç yok — her deploy elle yapılacak demektir. En azından "push → build → deploy" otomasyonu (GitHub Actions vb.) olması hataları azaltır. |
| 7 | **Dosya depolama** | Avatar/logo yükleme şu an backend'in **yerel diskine** yazıyor (`wwwroot/uploads`). Çoğu PaaS'ta dosya sistemi kalıcı değildir (deploy'da silinir) — bu, canlıya çıkmadan önce **Azure Blob Storage / S3**'e taşınmalı. Arayüz (`IFileStorageService`) zaten bu değişime hazır, sadece yeni bir implementasyon yazılacak. |

---

## 🟡 Backend production sertleştirmesi (özellik tamam, sağlamlaştırma eksik)

Ürün özellikleri (auth, ilan, teklif, mesaj, bildirim, favori, dosya yükleme) hepsi çalışıyor ve test edildi. Ama "gerçek kullanıcı trafiği" için eksik olanlar (`backend/BACKEND-TODO.md`'de detaylı):

- **Rate limiting yok** — biri login endpoint'ini brute-force deneyebilir, ya da API'yi spam'leyebilir.
- **Health check yok** (`/health`) — hosting platformunun "uygulama ayakta mı" kontrolü için standart bir gereksinim, çoğu PaaS bunu ister.
- **Structured logging yok** (Serilog vb.) — şu an bir hata olduğunda sadece konsola basılıyor, prod'da loglara erişimin/aranabilirliğin olması lazım (Application Insights, Sentry vb.).
- **Test yok** — hiç unit/integration test projesi yok. Gerçek kullanıcı üzerinde "bu değişikliği yaptım, bir şey kırıldı mı" diye anlamanın tek yolu şu an elle test etmek.
- **SQL Server `sa` hesabı** kullanılıyor — prod veritabanında bunun yerine düşük yetkili, dedicated bir kullanıcı olmalı.
- **API versioning yok** — ileride breaking change yapman gerektiğinde eski frontend sürümleri kırılabilir (mobil app olsaydı çok daha kritik olurdu, web'de biraz daha tolere edilebilir ama yine de iyi pratik).
- **Resend gönderimleri retry'sız** — API çağrısı başarısız olursa sadece loglanıyor, kullanıcı doğrulama emaili hiç almayabilir. Kritik değil ama kullanıcı deneyimini etkiler.

Bunların hiçbiri "olmadan launch edilemez" seviyesinde değil (rate limiting ve health check hariç — bunlar launch öncesi önerilir), ama ilk birkaç hafta içinde yapılmalı.

---

## 🟡 Moderasyon / Yönetim paneli (hiç yok)

Frontend'de müzisyen/organizatör/mekan profillerinde **"Doğrulanmış" rozeti** gösteriliyor (`VerificationStatus` alanı) ama:

- Backend'de bu durumu değiştirecek **hiçbir endpoint yok** — `VerificationStatus` her zaman `Pending` olarak kalıyor, kimse hiçbir zaman "Approved" olamıyor.
- **Admin paneli / admin rolü hiç yok.** Şüpheli bir hesabı askıya almak, bir profili doğrulamak, bir ilanı kaldırmak gibi hiçbir yönetimsel işlem yapılamıyor.

Gerçek kullanıcılar sisteme girmeye başladığında (özellikle kötüye kullanım, sahte profil, uygunsuz içerik ihtimali varsa) bu **ilk haftalarda ihtiyaç duyulacak** bir şey. Minimum: bir `Admin` rolü (`UserType`'a eklenir), birkaç endpoint (`PUT /api/profile/musician/{id}/verify`, kullanıcı askıya alma), basit bir admin ekranı (ayrı bir frontend sayfası ya da ilk etapta Scalar/Swagger üzerinden elle yönetim de iş görür).

---

## 🟢 Yasal / uyumluluk

Footer'da "Kullanım Koşulları", "Gizlilik Politikası", "KVKK" linkleri var ama hepsi `/help` sayfasına gidiyor — **gerçek bir hukuki metin yok**. Kayıt formunda kullanıcı bu metinleri "okuduğunu" onaylıyor (checkbox) ama ortada okunacak bir şey yok. Gerçek kullanıcılardan kişisel veri (email, telefon, konum) topladığımız için **KVKK aydınlatma metni ve gizlilik politikası olmadan canlıya çıkmak hukuki risk taşır.** Bu bir avukat/hukuk danışmanı işi — teknik ekip yazamaz, ama bir an önce başlatılması gereken paralel bir iş kolu.

---

## Öncelik sırasına göre yol haritası

```
FAZ 0 — Entegrasyon (canlıya çıkmadan ÖNCE, şart)
  1. Frontend ↔ Backend gerçek bağlantı (yukarıdaki Bloker #1)
  2. Refresh token saklama stratejisi kararı (HttpOnly cookie önerilir)
  3. Hosted veritabanı + backend + frontend hosting seçimi ve kurulumu
  4. Environment secrets'ın prod'a taşınması
  5. Dosya depolamanın Blob/S3'e taşınması
  6. Rate limiting + health check
  7. KVKK/Gizlilik/Kullanım Koşulları gerçek metinleri (hukuk ile paralel yürür)

FAZ 1 — İlk hafta (launch sonrası hemen)
  8. Basit admin/moderasyon mekanizması (en azından profil doğrulama)
  9. Structured logging + hata izleme (Sentry/Application Insights)
  10. CI/CD kurulumu

FAZ 2 — İlk ay
  11. Test projesi (en azından kritik akışlar: auth, teklif kabul/red)
  12. API versioning
  13. Telefon doğrulama
  14. Gerçek zamanlı mesajlaşma (SignalR) — REST + polling şu an yeterli ama UX'i iyileştirir
```

## Özet tablo

| Alan | Durum |
|---|---|
| Backend özellikleri (auth, ilan, teklif, mesaj, bildirim, favori) | ✅ Tamam, test edildi |
| Frontend sayfaları (25 sayfa, tüm akışlar) | ✅ Tamam (ama mock veriyle) |
| **Frontend ↔ Backend bağlantısı** | 🔴 **Hiç yok — en kritik eksik** |
| Hosting / deployment | 🔴 Hiç yok — her şey yerel |
| Dosya depolama (prod'a uygun) | 🔴 Yerel disk, prod'da veri kaybına açık |
| Rate limiting / health check | 🟠 Yok |
| Logging / hata izleme | 🟠 Yok |
| Admin / moderasyon | 🟠 Yok |
| Test projesi | 🟡 Yok (kritik değil ama önemli) |
| Yasal metinler (KVKK vb.) | 🔴 Yok — hukuki risk |

**Kısa cevap:** Ürün mantığı hazır, ama şu an "iki ayrı demo" halinde duruyor — biri gerçek ama kimsenin erişemeyeceği bir backend, diğeri güzel görünen ama sahte veriyle çalışan bir frontend. Gerçek kullanıcıların kullanmaya başlaması için önce bu ikisini birbirine bağlamamız, sonra da bir yere deploy etmemiz lazım. İkisi de teknik olarak büyük risk taşımıyor (mimari zaten buna göre kuruldu) ama ikisi de zaman alacak, gerçek işler.
