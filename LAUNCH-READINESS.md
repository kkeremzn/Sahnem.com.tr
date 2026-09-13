# Sahnem — Canlıya Alma Durum Raporu

> Güncellendi: 2026-09-13. Önceki sürüm (2026-08-11) frontend'in hâlâ mock/localStorage
> veriyle çalıştığı, hiçbir yerde deploy edilmediği bir döneme aitti — o zamandan beri
> durum kökten değişti, bu doküman güncel gerçek duruma göre yeniden yazıldı.

## Özet

Ürün canlıda: backend Render'da (.NET 9, PostgreSQL), frontend Vercel'de
(sahnem.com.tr), dosya depolama Cloudflare R2'de, e-posta gönderimi Zoho üzerinden.
Frontend gerçek API'ye bağlı, mock katman tamamen kaldırıldı.

## Tamamlanan alanlar

- **Auth**: kayıt, e-posta doğrulama (zorunlu, backend'de de uygulanıyor), giriş,
  HttpOnly cookie'de tutulan refresh token + memory'de access token, şifre
  sıfırlama/değiştirme (ikisi de tüm cihazlardaki oturumları iptal ediyor).
- **Profil**: Müzisyen/Organizatör/Mekan profilleri, çoklu branş/tür/şehir seçimi,
  ilçe listesi şehre göre otomatik doluyor, avatar yükleme (kırpma özellikli, R2'de
  saklanıyor, değiştirilince/hesap silinince eski dosya temizleniyor).
- **İlan/Teklif**: ilan aç/iptal et, teklif ver/kabul et/reddet, son başvuru tarihi
  ve ilan durumu backend'de zorunlu kılınıyor, kabul edilince diğer bekleyen
  teklifler otomatik reddediliyor, aynı ilana aynı müzisyen tekrar teklif veremiyor
  (DB seviyesinde unique index).
- **Mesajlaşma**: doğrudan mesajlaşma, okunmamış sayaç, kısa aralıklarla yoklama
  (polling) ile canlıya yakın güncelleme.
- **Bildirim/E-posta**: uygulama içi bildirimler + teklif/ilan olaylarında otomatik
  e-posta, hoş geldin bildirimi/e-postası, kullanıcı izin verirse şehrindeki yeni
  ilanlar için bildirim+e-posta.
- **Admin paneli**: ayrı kimlik doğrulama şeması (`/backstage`), kullanıcı/ilan/
  sohbet yönetimi, askıya alma (artık anlık — access token da geçersiz sayılıyor),
  toplu bildirim/e-posta gönderimi (gerçek teslim sayısı raporlanıyor).
- **Altyapı**: Render + Vercel + Cloudflare R2 + Zoho, environment secret'lar hosting
  platformunda, `/health` gerçek bir DB bağlantı kontrolü yapıyor, rate limiting var.

## Bilinen, henüz yapılmamış işler

- **Otomatik test projesi yok.** Kritik akışlar (auth, teklif kabul/red, ilan
  yaşam döngüsü) hâlâ elle test ediliyor.
- **Structured logging / hata izleme yok** (Sentry, Application Insights vb.) —
  hatalar sadece platform loglarında.
- **CI/CD yok** — her deploy `git push` ile tetiklenen Render/Vercel otomasyonuna
  dayanıyor, ayrı bir build/test pipeline'ı yok.
- **Ölçeklenebilirlik**: liste/filtreleme sorgularının çoğu tabloyu belleğe alıp
  orada filtreliyor (`GetAllAsync` + LINQ). Şu anki kullanıcı sayısında (birkaç
  düzine) sorun yaratmıyor ama veri arttıkça SQL tarafına taşınmalı.
- **Concurrency**: teklif kabul/red gibi durum geçişlerinde tam eşzamanlılık
  kilidi (concurrency token) yok — aynı ilana aynı anda iki kabul isteği gibi
  çok düşük ihtimalli bir yarış durumu teorik olarak mümkün, şu ölçekte pratik
  risk düşük görülüyor.
- **Yasal metinler**: Kullanım Koşulları/Gizlilik/KVKK linkleri hâlâ genel
  `/help` sayfasına gidiyor, gerçek hukuki metin yazılmadı.

## Kısa cevap

Ürün gerçek kullanıcılarla canlıda çalışıyor. Kalan işler "olmadan kullanılamaz"
değil, "ölçek büyüdükçe/ekip büyüdükçe ihtiyaç duyulacak" seviyesinde (test,
loglama, CI/CD) — bir istisna: yasal metinler, gerçek kişisel veri toplandığı
için bir an önce ele alınmalı, ama bu teknik değil hukuki bir iş.
