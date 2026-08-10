# SAHNEM — Görsel MVP Prototipi

Müzik profesyonelleri platformunun tam ekranlı statik HTML prototipi. Backend henüz yok; tüm etkileşimler ön yüzde simüle edilir.

## Yerelde Çalıştırma

```bash
cd /Users/keremuzun/Desktop/Sahnem
python3 -m http.server 5500
```

Tarayıcı: **http://localhost:5500**  
Tüm sayfalar listesi: **http://localhost:5500/sitemap.html**

---

## Ekran Haritası (24 sayfa)

### Kamuya Açık
| Sayfa | Dosya | Açıklama |
|-------|-------|----------|
| Ana Sayfa | `index.html` | Landing, arama, kategoriler |
| Keşfet | `explore.html` | Müzisyen arama ve filtreleme |
| İlanlar | `jobs.html` | İşverenlerin yayınladığı iş ilanları |
| Müzisyen Profili | `profile-musician.html` | Herkese açık portföy |
| İşveren Profili | `profile-employer.html` | Mekan / kurum profili |
| Hakkımızda | `about.html` | Vizyon ve ekip |
| Yardım | `help.html` | SSS ve yasal linkler |
| 404 | `404.html` | Sayfa bulunamadı |

### Kimlik Doğrulama
| Sayfa | Dosya |
|-------|-------|
| Giriş | `login.html` |
| Kayıt | `register.html` |
| Şifremi Unuttum | `forgot-password.html` |
| Profil Kurulumu | `profile-setup.html` (4 adımlı sihirbaz) |

### Müzisyen Paneli
| Sayfa | Dosya |
|-------|-------|
| Panel | `dashboard-musician.html` |
| Profili Düzenle | `profile-edit-musician.html` |
| Teklifler | `offers.html` |
| Teklif Detayı | `offer-detail.html` |
| Favoriler | `favorites.html` |
| Mesajlar | `messages.html` |
| Bildirimler | `notifications.html` |
| Ayarlar | `settings.html` |

### İşveren Paneli
| Sayfa | Dosya |
|-------|-------|
| Panel | `dashboard-employer.html` |
| Profili Düzenle | `profile-edit-employer.html` |
| İlan Yayınla | `post-offer.html` |

---

## Demo Akışları

**Müzisyen olarak:**
1. `login.html` → Müzisyen Demo
2. `dashboard-musician.html` → özet panel
3. `offers.html` → gelen teklifler
4. `profile-musician.html` → kendi profilin

**İşveren olarak:**
1. `login.html` → İşveren Demo
2. `explore.html` → müzisyen ara
3. `profile-musician.html` → Teklif Gönder
4. `post-offer.html` → ilan yayınla

**Yeni üye:**
1. `register.html` → hesap oluştur
2. `profile-setup.html` → 4 adım
3. `dashboard-musician.html` veya `dashboard-employer.html`

---

## Dosya Yapısı

```
Sahnem/
├── css/
│   ├── global.css   # Tasarım sistemi (renkler, tipografi, bileşenler)
│   └── app.css      # Sayfa düzenleri (profil, auth, explore, dashboard)
├── js/
│   └── components.js # Navbar, sidebar, toast, mock veri
├── index.html
├── sitemap.html     # Geliştirme için tüm sayfa listesi
└── ... (diğer sayfalar)
```

---

## Sonraki Adım

Backend (.NET veya Node.js) + veritabanı + gerçek auth entegrasyonu.
